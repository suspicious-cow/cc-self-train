#!/usr/bin/env node
// SessionStart hook — checks if a newer Claude Code version is available.
//
// Runs `claude --version` to get the installed version, queries GitHub for
// the latest release, and shows a banner if an update is available.
// Fails silently on network errors so offline users aren't blocked.
//
// No dependencies beyond Node.js (which Claude Code requires).

const https = require("https");
const { execSync } = require("child_process");

const TIMEOUT_MS = 8000;

// ---------------------------------------------------------------------------
// Get the currently installed version
// ---------------------------------------------------------------------------
let installedVersion;
try {
  const output = execSync("claude --version", { encoding: "utf-8", timeout: 5000 }).trim();
  // Output is like "2.1.44" or "Claude Code v2.1.44" — extract the version
  const match = output.match(/(\d+\.\d+\.\d+)/);
  if (!match) process.exit(0);
  installedVersion = match[1]; // e.g. "2.1.44"
} catch {
  process.exit(0); // can't determine version — skip
}

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
// Compare semver strings (returns true if a > b)
// ---------------------------------------------------------------------------
function isNewer(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return true;
    if ((pa[i] || 0) < (pb[i] || 0)) return false;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main — check for newer CC releases
// ---------------------------------------------------------------------------
async function main() {
  const releases = await ghApi(
    "/repos/anthropics/claude-code/releases?per_page=1"
  );

  if (!Array.isArray(releases) || releases.length === 0) process.exit(0);

  const latestTag = (releases[0].tag_name || "").replace(/^v/, "");
  if (!latestTag || !isNewer(latestTag, installedVersion)) process.exit(0);

  const message =
    `\n========================================\n` +
    `  Update Available\n` +
    `========================================\n\n` +
    `  Claude Code v${latestTag} is out\n` +
    `  (you have v${installedVersion}).\n\n` +
    `  Run: claude update\n\n` +
    `========================================`;

  process.stdout.write(JSON.stringify({ systemMessage: message }));
}

main().catch(() => process.exit(0));
