#!/usr/bin/env python3
"""SessionStart hook — checks for new CC releases and inspiration repo updates.

Reads .claude/last-synced.json for the cutoff date, queries GitHub, and injects
a systemMessage into Claude's context if anything new is found. Fails silently
on network errors so offline users aren't blocked.
"""

import json
import os
import sys
import urllib.error
import urllib.request

TIMEOUT_SECONDS = 8  # keep startup fast; bail if GitHub is slow

# ---------------------------------------------------------------------------
# Resolve paths relative to the project root
# ---------------------------------------------------------------------------
project_dir = os.environ.get("CLAUDE_PROJECT_DIR", "")
if not project_dir:
    # fallback: script lives at .claude/scripts/check-updates.py
    project_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

sync_file = os.path.join(project_dir, ".claude", "last-synced.json")


def load_sync_data() -> dict:
    with open(sync_file, "r", encoding="utf-8") as f:
        return json.load(f)


def gh_api(path: str) -> list | dict:
    """Minimal GitHub API call using urllib (no dependencies)."""
    url = f"https://api.github.com{path}"
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": "cc-self-train-update-checker",
    })
    # Use a GH token if available (avoids rate limits), but work without one
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
        return json.loads(resp.read().decode("utf-8"))


# ---------------------------------------------------------------------------
# Check for new Claude Code releases
# ---------------------------------------------------------------------------
def check_changelog(sync: dict) -> list[str]:
    """Return list of human-readable summaries for releases newer than last_version."""
    last_tag = sync["changelog"]["last_version"]  # e.g. "v2.1.42"

    releases = gh_api("/repos/anthropics/claude-code/releases?per_page=10")
    new_releases = []
    for rel in releases:
        tag = rel.get("tag_name", "")
        if tag == last_tag:
            break  # releases are newest-first; stop when we hit the known one
        published = rel.get("published_at", "")
        body = (rel.get("body") or "").strip()
        if len(body) > 800:
            body = body[:800] + "..."
        new_releases.append(f"### {tag} ({published[:10]})\n{body}")

    return new_releases


# ---------------------------------------------------------------------------
# Check for new commits on inspiration repo
# ---------------------------------------------------------------------------
def check_inspiration(sync: dict) -> list[str]:
    """Return list of commit summaries after last_checked date."""
    info = sync["inspiration_repo"]
    owner, repo = info["owner"], info["repo"]
    cutoff = info["last_checked"]
    # GitHub commits API accepts ISO 8601 'since' param
    # Handle both date-only ("2026-02-13") and full timestamp formats
    since = cutoff if "T" in cutoff else f"{cutoff}T23:59:59Z"

    commits = gh_api(f"/repos/{owner}/{repo}/commits?since={since}&per_page=20")
    if not commits:
        return []

    summaries = []
    for c in commits:
        msg = c.get("commit", {}).get("message", "").split("\n")[0]
        date = c.get("commit", {}).get("committer", {}).get("date", "")[:10]
        sha = c.get("sha", "")[:7]
        summaries.append(f"- `{sha}` ({date}) {msg}")

    return summaries


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    try:
        sync = load_sync_data()
    except (FileNotFoundError, json.JSONDecodeError):
        # No sync file or corrupt — skip silently
        sys.exit(0)

    sections = []

    # --- Claude Code releases ---
    try:
        new_releases = check_changelog(sync)
        if new_releases:
            sections.append(
                "## New Claude Code Releases (since {})\n\n"
                "The following releases came out AFTER the content in context/changelog-cc.txt was last updated. "
                "Review these changes and factor them into any guidance you give the user — especially if new CC "
                "features were added that should be incorporated into the project modules.\n\n{}".format(
                    sync["changelog"]["last_version"],
                    "\n\n".join(new_releases),
                )
            )
    except (urllib.error.URLError, TimeoutError, OSError, KeyError):
        pass  # offline or rate-limited — skip

    # --- Inspiration repo ---
    try:
        new_commits = check_inspiration(sync)
        if new_commits:
            sections.append(
                "## New Commits in affaan-m/everything-claude-code (since {})\n\n"
                "The inspiration repo has new activity. Review for patterns, techniques, or examples "
                "that could improve our project guides.\n\n{}".format(
                    sync["inspiration_repo"]["last_checked"],
                    "\n".join(new_commits),
                )
            )
    except (urllib.error.URLError, TimeoutError, OSError, KeyError):
        pass  # offline or rate-limited — skip

    if not sections:
        # Nothing new — exit clean, no output needed
        sys.exit(0)

    # Build the system message
    message = (
        "\n========================================\n"
        "  Upstream Updates Detected\n"
        "========================================\n\n"
        + "\n\n".join(sections)
        + "\n\n"
        "NOTE TO CLAUDE: If any new CC features above are relevant to the module the user is working on, "
        "mention them. If a new release introduces breaking changes or deprecations, warn the user. "
        "Do NOT overwhelm the user with raw changelogs — summarize what matters for their current task."
    )

    json.dump({"systemMessage": message}, sys.stdout)
    sys.exit(0)


if __name__ == "__main__":
    main()
