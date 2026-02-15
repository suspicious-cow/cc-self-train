// SessionStart hook — outputs JSON so the welcome message is shown to the user
// and injected into Claude's context. No dependencies beyond Node (which CC requires).

const message = `
========================================
  Learn Claude Code by Doing
========================================

  3 projects, pick your language,
  master every CC feature hands-on.

  Type /start to get going.

  Or jump straight to a project:
    /start 1  -- Forge (Personal Dev Toolkit)
    /start 2  -- Nexus (Local API Gateway)
    /start 3  -- Sentinel (Code Analyzer)

  ----------------------------------------
  NOTE: This repo uses two SessionStart
  hooks (welcome banner + update checker).
  If prompted to trust them, approve them
  — they are safe. You can review anytime
  with /hooks if you want to.
  The update checker pings GitHub to see
  if new CC releases or reference material
  have been published since this repo was
  last updated, so your session is always
  working with the latest info.
  ----------------------------------------

========================================`;

process.stdout.write(JSON.stringify({ systemMessage: message }));
