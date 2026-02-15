#!/usr/bin/env bash
# SessionStart hook — outputs JSON so the welcome message is shown directly to the user
# and also injected into Claude's context

cat << 'EOF'
{
  "systemMessage": "\n========================================\n  Learn Claude Code by Doing\n========================================\n\n  3 projects, pick your language,\n  master every CC feature hands-on.\n\n  Type /start to get going.\n\n  Or jump straight to a project:\n    /start 1  -- Forge (Personal Dev Toolkit)\n    /start 2  -- Nexus (Local API Gateway)\n    /start 3  -- Sentinel (Code Analyzer)\n\n  ----------------------------------------\n  NOTE: This repo uses two SessionStart\n  hooks (welcome banner + update checker).\n  If prompted to trust them, review with\n  /hooks and approve — they are safe.\n  The update checker pings GitHub to see\n  if new CC releases or reference material\n  have been published since this repo was\n  last updated, so your session is always\n  working with the latest info.\n  ----------------------------------------\n\n========================================"
}
EOF
