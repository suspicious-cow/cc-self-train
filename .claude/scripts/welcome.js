// SessionStart hook — outputs JSON so the welcome message is shown to the user
// and injected into Claude's context. No dependencies beyond Node (which CC requires).

const message = `
========================================
  Learn Claude Code by Doing
========================================

  4 projects, pick your language,
  master every CC feature hands-on.

  Type /start to get going.

========================================`;

process.stdout.write(JSON.stringify({ systemMessage: message }));
