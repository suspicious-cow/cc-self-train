#!/usr/bin/env node
// SessionStart hook — checks for new CC releases and inspiration repo updates.
//
// Reads .claude/last-synced.json for the cutoff date, queries GitHub, and
// outputs a systemMessage if anything new is found. Fails silently on network
// errors so offline users aren't blocked.
//
// No dependencies beyond Node.js (which Claude Code requires).

const https = require("https");
const fs = require("fs");
const path = require("path");

const TIMEOUT_MS = 8000;

// ---------------------------------------------------------------------------
// Resolve paths
// ---------------------------------------------------------------------------
const projectDir =
  process.env.CLAUDE_PROJECT_DIR ||
  path.resolve(__dirname, "..", "..");

const syncFile = path.join(projectDir, ".claude", "last-synced.json");

// Bail silently if no sync file
if (!fs.existsSync(syncFile)) process.exit(0);

let sync;
try {
  sync = JSON.parse(fs.readFileSync(syncFile, "utf-8"));
} catch {
  process.exit(0); // corrupt or unreadable — skip
}

const lastVersion = (sync.changelog && sync.changelog.last_version) || "";
if (!lastVersion) process.exit(0);

const inspirationInfo = sync.inspiration_repo || {};
const inspirationSince = inspirationInfo.last_checked || "";

// ---------------------------------------------------------------------------
// Minimal GitHub API helper (uses built-in https module)
// ---------------------------------------------------------------------------
function ghApi(apiPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: apiPath,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "cc-self-train-update-checker",
      },
      timeout: TIMEOUT_MS,
    };

    // Use a GH token if available (avoids rate limits)
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (token) options.headers.Authorization = `Bearer ${token}`;

    const req = https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("JSON parse error"));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

// ---------------------------------------------------------------------------
// Check for new Claude Code releases
// ---------------------------------------------------------------------------
async function checkChangelog() {
  const releases = await ghApi(
    "/repos/anthropics/claude-code/releases?per_page=10"
  );

  const newReleases = [];
  for (const rel of releases) {
    const tag = rel.tag_name || "";
    if (tag === lastVersion) break; // newest-first; stop at known version
    const published = (rel.published_at || "").slice(0, 10);
    let body = (rel.body || "").trim();
    if (body.length > 800) body = body.slice(0, 800) + "...";
    newReleases.push(`### ${tag} (${published})\n${body}`);
  }

  return newReleases;
}

// ---------------------------------------------------------------------------
// Check for new commits on inspiration repo
// ---------------------------------------------------------------------------
async function checkInspiration() {
  if (!inspirationSince) return [];

  const owner = inspirationInfo.owner || "affaan-m";
  const repo = inspirationInfo.repo || "everything-claude-code";
  // Ensure ISO format for the API
  const since = inspirationSince.includes("T")
    ? inspirationSince
    : `${inspirationSince}T23:59:59Z`;

  const commits = await ghApi(
    `/repos/${owner}/${repo}/commits?since=${encodeURIComponent(since)}&per_page=20`
  );

  if (!Array.isArray(commits) || commits.length === 0) return [];

  return commits.map((c) => {
    const sha = (c.sha || "").slice(0, 7);
    const date = ((c.commit && c.commit.committer && c.commit.committer.date) || "").slice(0, 10);
    const msg = ((c.commit && c.commit.message) || "").split("\n")[0];
    return `- \`${sha}\` (${date}) ${msg}`;
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const sections = [];

  try {
    const newReleases = await checkChangelog();
    if (newReleases.length > 0) {
      sections.push(
        `## New Claude Code Releases (since ${lastVersion})\n\n` +
          "The following releases came out AFTER the content in context/changelog-cc.txt was last updated. " +
          "Review these changes and factor them into any guidance you give the user — especially if new CC " +
          "features were added that should be incorporated into the project modules.\n\n" +
          newReleases.join("\n\n")
      );
    }
  } catch {
    // offline or rate-limited — skip
  }

  try {
    const newCommits = await checkInspiration();
    if (newCommits.length > 0) {
      sections.push(
        `## New Commits in affaan-m/everything-claude-code (since ${inspirationSince})\n\n` +
          "The inspiration repo has new activity. Review for patterns, techniques, or examples " +
          "that could improve our project guides.\n\n" +
          newCommits.join("\n")
      );
    }
  } catch {
    // offline or rate-limited — skip
  }

  if (sections.length === 0) process.exit(0);

  const message =
    "\n========================================\n" +
    "  Upstream Updates Detected\n" +
    "========================================\n\n" +
    sections.join("\n\n") +
    "\n\n" +
    "NOTE TO CLAUDE: If any new CC features above are relevant to the module the user is working on, " +
    "mention them. If a new release introduces breaking changes or deprecations, warn the user. " +
    "Do NOT overwhelm the user with raw changelogs — summarize what matters for their current task.";

  process.stdout.write(JSON.stringify({ systemMessage: message }));
}

main().catch(() => process.exit(0));
