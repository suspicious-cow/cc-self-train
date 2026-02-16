#!/usr/bin/env node
// SessionStart hook — checks if a newer Claude Code version is available.
//
// Reads .claude/last-synced.json for the last known version, queries GitHub
// for newer releases, and if any exist, tells Claude to ask the user to update.
// Fails silently on network errors so offline users aren't blocked.
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
// Main — check for newer CC releases
// ---------------------------------------------------------------------------
async function main() {
  const releases = await ghApi(
    "/repos/anthropics/claude-code/releases?per_page=5"
  );

  // Find releases newer than our last known version
  const newerVersions = [];
  for (const rel of releases) {
    const tag = rel.tag_name || "";
    if (tag === lastVersion) break; // newest-first; stop at known version
    newerVersions.push(tag);
  }

  if (newerVersions.length === 0) process.exit(0);

  const latest = newerVersions[0];
  const message =
    `Update available: Claude Code ${latest} (you have ${lastVersion}). Run \`claude update\` to get it.`;

  process.stdout.write(JSON.stringify({ systemMessage: message }));
}

main().catch(() => process.exit(0));
