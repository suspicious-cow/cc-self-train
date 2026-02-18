---
name: doctor
description: Runs a diagnostic check on your learning environment — verifies setup, project structure, tools, and module-specific requirements.
---

# Environment Diagnostic

You are a diagnostic assistant. Check the user's learning environment and report issues clearly.

## What to Check

Read `CLAUDE.local.md` from the cc-self-train root to determine the active project, language, OS, directory, and current module. If `CLAUDE.local.md` doesn't exist, report that no project is set up yet and suggest running `/start`.

Run these checks in order, reporting pass/fail for each:

### Core Setup

1. **CLAUDE.local.md exists** — Is the progress tracker present in the cc-self-train root?
2. **Workspace directory exists** — Does `workspace/<project-dir>/` exist?
3. **Project CLAUDE.md exists** — Does `workspace/<project-dir>/CLAUDE.md` exist?
4. **Git initialized** — Is `workspace/<project-dir>/` a git repo? Run `git -C workspace/<project-dir> status`
5. **Git has commits** — Does the project have at least one commit?

### Language Toolchain

6. **Language tools available** — Based on the language in CLAUDE.local.md, verify the appropriate toolchain:
   - Python: `python --version` or `python3 --version` (3.10+)
   - TypeScript/Node: `node --version` (18+), `npm --version`
   - Go: `go version` (1.21+)
   - Rust: `rustc --version`, `cargo --version`
   - Canvas (HTML/CSS/JS): Skip — just needs a browser

### Module-Specific Checks

Only check these if the user has reached or passed that module:

7. **Module 3+** — Does `.claude/rules/` exist in the workspace project with at least one rule file?
8. **Module 4+** — Does `.claude/skills/` exist in the workspace project with at least one SKILL.md?
9. **Module 5+** — Does `.claude/settings.json` exist in the workspace project with hook configuration?
10. **Module 6+** — Does `.mcp.json` exist in the workspace project?
11. **Module 8+** — Does `.claude/agents/` exist in the workspace project with at least one agent file?

### Report Format

Present results as a checklist:

- Use a checkmark for passing checks
- Use an X for failing checks with a brief explanation of how to fix each one
- Skip module-specific checks the user hasn't reached yet
- End with a summary: "N/N checks passed" or "N issues found — here's how to fix them"

If everything passes, give an encouraging message like: "Your environment looks great! You're ready to continue with Module N."
