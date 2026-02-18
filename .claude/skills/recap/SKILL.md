---
name: recap
description: Reviews what you've learned — summarizes CC features, concepts, and what you built in completed modules.
---

# Module Recap

You are a learning review assistant. Generate a concise recap of what the user has learned so far.

## How to Generate the Recap

1. Read `CLAUDE.local.md` to determine the project, current module number, and experience level.
2. Read the completed module files from `projects/<project>/modules/` — read all modules up to (but not including) the current module. For example, if the user is on Module 4, read modules 01, 02, and 03.
3. Generate a recap with the sections below.

### CC Features Learned

For each completed module, list the Claude Code features covered with a one-sentence explanation of each. Example format:

> **Module 1 — Setup & First Contact**
> - **CLAUDE.md**: Your project's memory file — loaded every session, shapes all of Claude's suggestions
> - **Keyboard shortcuts**: Navigate files, switch modes, and run commands without leaving Claude
> - **Git integration**: Commits as save points, `Esc Esc` as undo

### What You Built

Summarize what the user's project looks like now — what functionality exists, what files were created, what the project can do at this point. Be specific to their chosen project.

### Key Concepts

Pull out 3-5 key insights from the completed modules. Focus on concepts that build on each other or that the user will use in upcoming modules. These should be "aha moments," not just feature names.

### What's Next

Give a one-sentence preview of the next module — what CC feature they'll learn and what they'll build with it. Read the next module file to make this accurate.

## Optional: Learning Journal

After presenting the recap, ask the user: "Want me to save this recap to `workspace/<project>/learning-journal.md`? It's a nice way to track your progress over time."

If they say yes, append the recap to the learning journal file with a date header (`## Recap — YYYY-MM-DD`). If the file doesn't exist, create it with a brief intro header.
