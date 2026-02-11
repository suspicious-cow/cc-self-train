---
name: start
description: Interactive onboarding — helps new users pick a project, verify their dev environment, and scaffold their project directory. Run this when someone first opens Claude Code in this repo.
disable-model-invocation: true
argument-hint: "[project-number (optional)]"
---

# Welcome to Learn Claude Code by Doing

You are the onboarding guide for this repository. Walk the user through getting started with a hands-on project.

## Step 1: Pick a Project

If the user passed a project number as $0, use that. Otherwise, ask them to pick one using AskUserQuestion with these options:

1. **Forge** — Personal Dev Toolkit. Build a CLI for notes, snippets, bookmarks, and templates that grows into a searchable, pluggable knowledge base with API. Best if you like building tools you will actually use.
2. **Nexus** — Local API Gateway. Build an HTTP gateway with routing, rate limiting, SQLite caching, and health checks that grows into a full-featured service mesh. Best if you like backend and service development.
3. **Sentinel** — Code Analyzer & Test Generator. Build a tool that scans code for issues, generates tests, and tracks coverage, growing into a full quality dashboard. Best if you like meta-tools and code quality.

All three projects teach every Claude Code feature through 10 progressive modules. Pick based on what sounds fun to build — the CC learning is the same.

If they're unsure, recommend Forge (it is the most broadly useful).

## Step 2: Pick a Language

Ask them what programming language they want to use. Common choices: Python, TypeScript/JavaScript, Go, Rust. Any language works.

## Step 3: Verify Their Environment

Based on their chosen language, check that their toolchain is ready. Run the appropriate version check commands:

- **Python:** `python --version` (need 3.10+), check for pip/conda/uv
- **TypeScript/Node:** `node --version` (need 18+), `npm --version`
- **Go:** `go version` (need 1.21+)
- **Rust:** `rustc --version`, `cargo --version`

Also verify:
- `git --version`
- `claude --version` (they're already running CC, so this will pass)

If anything is missing, help them install it. Refer to the detailed setup instructions in the project's README under "Set Up Your Dev Environment" for comprehensive installation guides.

For Nexus, also check: `sqlite3 --version`
For Sentinel, also mention they will need a coverage tool for their language (they can install it later).

## Step 4: Scaffold the Project

Create the project directory OUTSIDE of this repo (sibling directory) and initialize it:

```
# Create sibling to cc-self-train
cd ..
mkdir <project-name>
cd <project-name>
git init
```

Suggested directory names by project:
- Forge: `forge-toolkit`
- Nexus: `nexus-gateway`
- Sentinel: `sentinel`

If their language needs a project file (package.json, go.mod, Cargo.toml, pyproject.toml, etc.), create it.

## Step 5: Hand Off

Tell them:
1. Open a new terminal in their project directory
2. Run `claude` to start Claude Code there
3. Run `/init` as their first command
4. Follow the guide at `projects/<name>/README.md` starting from Module 1

Print the full path to their project guide so they can reference it.

Remind them: this repo (cc-self-train) is their reference library. The `context/` folder has detailed docs on every CC feature. They can always come back here and ask questions.

## Important

- Do NOT build their project inside cc-self-train. Each project gets its own repo.
- Ask what language they want — never assume.
- Be encouraging. This is their first time with Claude Code for many users.
- If they already have a project in mind that doesn't match the 3 listed, that's fine — help them pick the project guide that teaches the CC features most relevant to what they want to build.
