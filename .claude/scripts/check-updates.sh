#!/usr/bin/env bash
# SessionStart hook — checks for new CC releases and inspiration repo updates.
#
# Reads .claude/last-synced.json, queries GitHub via curl, and outputs a
# systemMessage if anything new is found. Fails silently when offline.
# No dependencies beyond bash + curl (curl ships with Git).

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." 2>/dev/null && pwd)}"
SYNC_FILE="$PROJECT_DIR/.claude/last-synced.json"
TIMEOUT=8

# Bail silently if no sync file or curl isn't available
[[ -f "$SYNC_FILE" ]] || exit 0
command -v curl >/dev/null 2>&1 || exit 0

# ---------------------------------------------------------------------------
# Read last-synced.json (tiny, predictable structure — no jq needed)
# ---------------------------------------------------------------------------
LAST_VERSION=$(grep '"last_version"' "$SYNC_FILE" | grep -o '"v[^"]*"' | tr -d '"')
INSPIRATION_SINCE=$(grep -A1 '"inspiration_repo"' "$SYNC_FILE" | grep -v inspiration_repo || true)
INSPIRATION_SINCE=$(grep '"last_checked"' "$SYNC_FILE" | tail -1 | grep -o '"[0-9TZ:.+-]*"' | tr -d '"')

[[ -z "$LAST_VERSION" ]] && exit 0

# Build auth header if a GitHub token is available (avoids rate limits)
AUTH_HEADER=""
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    AUTH_HEADER="-H \"Authorization: Bearer $GITHUB_TOKEN\""
elif [[ -n "${GH_TOKEN:-}" ]]; then
    AUTH_HEADER="-H \"Authorization: Bearer $GH_TOKEN\""
fi

# ---------------------------------------------------------------------------
# Check for new Claude Code releases
# ---------------------------------------------------------------------------
NEW_TAGS=""
RELEASE_DETAILS=""

RELEASES_JSON=$(curl -sf --max-time "$TIMEOUT" \
    -H "Accept: application/vnd.github+json" \
    -H "User-Agent: cc-self-train" \
    ${AUTH_HEADER} \
    "https://api.github.com/repos/anthropics/claude-code/releases?per_page=10" 2>/dev/null) || true

if [[ -n "$RELEASES_JSON" ]]; then
    # Extract tag names in order (API returns newest first)
    TAGS=$(echo "$RELEASES_JSON" | grep -o '"tag_name"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -o '"v[^"]*"' | tr -d '"')

    for tag in $TAGS; do
        [[ "$tag" == "$LAST_VERSION" ]] && break
        NEW_TAGS="${NEW_TAGS}${tag} "
    done

    # For each new tag, extract the release body (bullet points)
    if [[ -n "$NEW_TAGS" ]]; then
        for tag in $NEW_TAGS; do
            # Fetch individual release for cleaner body extraction
            REL_JSON=$(curl -sf --max-time "$TIMEOUT" \
                -H "Accept: application/vnd.github+json" \
                -H "User-Agent: cc-self-train" \
                ${AUTH_HEADER} \
                "https://api.github.com/repos/anthropics/claude-code/releases/tags/${tag}" 2>/dev/null) || true

            if [[ -n "$REL_JSON" ]]; then
                # Extract published date
                PUB_DATE=$(echo "$REL_JSON" | grep -o '"published_at"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"20[^"]*"' | tr -d '"' | cut -c1-10)
                # Extract body lines that start with - (the changelog bullets)
                # The body is JSON-escaped, so \r\n or \n separate lines
                BULLETS=$(echo "$REL_JSON" | grep -o '"body"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | \
                    sed 's/.*"body"[[:space:]]*:[[:space:]]*"//; s/"$//' | \
                    sed 's/\\r\\n/\n/g; s/\\n/\n/g' | \
                    grep '^\- ' | head -20)
                RELEASE_DETAILS="${RELEASE_DETAILS}### ${tag} (${PUB_DATE:-unknown})\n${BULLETS}\n\n"
            else
                RELEASE_DETAILS="${RELEASE_DETAILS}### ${tag}\nRelease notes: https://github.com/anthropics/claude-code/releases/tag/${tag}\n\n"
            fi
        done
    fi
fi

# ---------------------------------------------------------------------------
# Check for new commits on inspiration repo
# ---------------------------------------------------------------------------
NEW_COMMIT_COUNT=0
COMMIT_SUMMARIES=""

if [[ -n "$INSPIRATION_SINCE" ]]; then
    # Ensure ISO format for the API
    SINCE="$INSPIRATION_SINCE"
    [[ "$SINCE" != *T* ]] && SINCE="${SINCE}T23:59:59Z"

    COMMITS_JSON=$(curl -sf --max-time "$TIMEOUT" \
        -H "Accept: application/vnd.github+json" \
        -H "User-Agent: cc-self-train" \
        ${AUTH_HEADER} \
        "https://api.github.com/repos/affaan-m/everything-claude-code/commits?since=${SINCE}&per_page=20" 2>/dev/null) || true

    if [[ -n "$COMMITS_JSON" ]]; then
        NEW_COMMIT_COUNT=$(echo "$COMMITS_JSON" | grep -c '"sha"' || true)

        if [[ "$NEW_COMMIT_COUNT" -gt 0 ]]; then
            # Extract short sha + first line of commit message
            SHAS=$(echo "$COMMITS_JSON" | grep -o '"sha"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -o '"[0-9a-f]\{40\}"' | tr -d '"')
            MESSAGES=$(echo "$COMMITS_JSON" | grep -o '"message"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"message"[[:space:]]*:[[:space:]]*"//; s/"$//' | sed 's/\\n.*//')

            # Combine into bullet list (paste the two streams)
            COMMIT_SUMMARIES=$(paste -d' ' \
                <(echo "$SHAS" | cut -c1-7 | sed 's/^/- `/; s/$/`/') \
                <(echo "$MESSAGES"))
        fi
    fi
fi

# ---------------------------------------------------------------------------
# Build output
# ---------------------------------------------------------------------------
[[ -z "$NEW_TAGS" && "$NEW_COMMIT_COUNT" -eq 0 ]] && exit 0

MSG=""

if [[ -n "$NEW_TAGS" ]]; then
    TAG_COUNT=$(echo "$NEW_TAGS" | wc -w | tr -d ' ')
    MSG="${MSG}## ${TAG_COUNT} New Claude Code Release(s) since ${LAST_VERSION}\n\n"
    MSG="${MSG}The following releases came out AFTER context/changelog-cc.txt was last updated. "
    MSG="${MSG}Review these changes and factor them into guidance — especially new CC features "
    MSG="${MSG}that should be incorporated into the project modules.\n\n"
    MSG="${MSG}${RELEASE_DETAILS}"
fi

if [[ "$NEW_COMMIT_COUNT" -gt 0 ]]; then
    MSG="${MSG}## ${NEW_COMMIT_COUNT} New Commit(s) in affaan-m/everything-claude-code since ${INSPIRATION_SINCE}\n\n"
    MSG="${MSG}The inspiration repo has new activity. Review for patterns or examples "
    MSG="${MSG}that could improve our project guides.\n\n"
    MSG="${MSG}${COMMIT_SUMMARIES}\n"
fi

MSG="${MSG}\n"
MSG="${MSG}NOTE TO CLAUDE: If any new CC features above are relevant to the module the user is "
MSG="${MSG}working on, mention them. If a new release introduces breaking changes or deprecations, "
MSG="${MSG}warn the user. Do NOT overwhelm the user with raw changelogs — summarize what matters."

# Output valid JSON — use printf to handle the escaping
# We need to escape quotes and backslashes in MSG for JSON
ESCAPED=$(printf '%s' "$MSG" | sed 's/\\/\\\\/g; s/"/\\"/g')

printf '{"systemMessage": "%s"}' "$ESCAPED"
exit 0
