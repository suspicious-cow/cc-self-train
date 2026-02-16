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

Present all three options equally — do NOT mark any as recommended. If the user explicitly says they can't decide, then suggest Forge as a good starting point since it's the most broadly useful.

## Step 2: Pick a Language

Ask them what programming language they want to use. Common choices: Python, TypeScript/JavaScript, Go, Rust. Any language works.

## Step 3: Environment (Optional)

Ask the user if they want to set up an isolated environment for their project. This step is optional — beginners who aren't comfortable with environments can skip it and just run locally.

Use AskUserQuestion with **language-aware options**:

**If the user chose Python**, show these 4 options:

1. **Local (no isolation)** — "Run directly with your system Python. Simplest option — just start coding. Fine for learning, but packages install globally."
2. **venv** — "Python's built-in virtual environment. Creates an isolated folder in your project that keeps dependencies separate from your system. Lightweight, no extra installs needed."
3. **conda** — "Cross-language environment manager. Creates a fully isolated environment with its own Python version and packages. Popular in data science. Requires Anaconda or Miniconda installed."
4. **Docker** — "Runs your project inside a container — a lightweight virtual machine. Complete isolation from your system. Requires Docker Desktop installed."

**If the user chose TypeScript/Node, Go, or Rust**, show these 2 options:

1. **Local (no isolation)** — "Run directly on your machine. [npm / Go modules / Cargo] already handles dependency isolation for you."
2. **Docker** — "Runs your project inside a container — a lightweight virtual machine. Complete isolation from your system. Requires Docker Desktop installed."

Tailor the Local option description to mention the specific dependency manager for their language (npm for TypeScript/Node, Go modules for Go, Cargo for Rust).

Remember their choice — it affects the verify and scaffold steps below.

## Step 4: Verify Their Environment

Based on their chosen language, check that their toolchain is ready. Run the appropriate version check commands:

- **Python:** `python --version` (need 3.10+), check for pip/conda/uv
- **TypeScript/Node:** `node --version` (need 18+), `npm --version`
- **Go:** `go version` (need 1.21+)
- **Rust:** `rustc --version`, `cargo --version`

Also verify:
- `git --version`
- `claude --version` (they're already running CC, so this will pass)

If they chose an environment in Step 3, also verify:
- **venv:** `python -m venv --help` works
- **conda:** `conda --version`
- **Docker:** `docker --version`

If anything is missing, help them install it. Refer to the detailed setup instructions in the project's README under "Set Up Your Dev Environment" for comprehensive installation guides.

For Nexus, also check: `sqlite3 --version`
For Sentinel, also mention they will need a coverage tool for their language (they can install it later).

## Step 5: Scaffold the Project

Create the project directory inside this repository under `workspace/` and initialize it:

```
mkdir -p workspace/<project-name>
cd workspace/<project-name>
git init
```

Suggested directory names by project:
- Forge: `workspace/forge-toolkit`
- Nexus: `workspace/nexus-gateway`
- Sentinel: `workspace/sentinel`

If their language needs a project file (package.json, go.mod, Cargo.toml, pyproject.toml, etc.), create it.

Create a `.gitignore` in the project directory appropriate for the chosen language (e.g., `__pycache__/`, `node_modules/`, `target/`, `.venv/`, etc.).

Based on the environment choice from Step 3, also scaffold environment files:

**If they chose venv:**
- Run `python -m venv .venv` in the project directory
- Tell them how to activate: `source .venv/bin/activate` (macOS/Linux) or `.venv\Scripts\activate` (Windows)
- Create an empty `requirements.txt` with a comment: `# Add your project dependencies here`

**If they chose conda:**
- Create an `environment.yml` with the project name and python version:
  ```yaml
  name: <project-name>
  dependencies:
    - python=3.12
  ```
- Run `conda env create -f environment.yml` or tell the user to run it
- Tell them how to activate: `conda activate <project-name>`

**If they chose Docker:**
- Generate a `Dockerfile` appropriate for their chosen language:
  - Python: python:3.12-slim base, WORKDIR /app, COPY requirements.txt, pip install, COPY ., CMD
  - TypeScript/Node: node:20-slim base, WORKDIR /app, COPY package*.json, npm install, COPY ., CMD
  - Go: golang:1.22 base, WORKDIR /app, COPY go.*, go mod download, COPY ., go build, CMD
  - Rust: rust:1.77 base, WORKDIR /app, COPY Cargo.*, cargo build --release (multi-stage), CMD
- Generate a `.dockerignore` with common excludes: `.git`, `node_modules`, `.venv`, `__pycache__`, `target`, `dist`, `.env`
- Tell them: `docker build -t <project-name> .` and `docker run -it <project-name>`
- Note: they'll still develop locally and can use Docker for running/testing

**If they chose Local:** No extra files needed.

## Step 6: Module 1 — Setup & First Contact

Now deliver Module 1 inline. Do NOT tell the user to open a new terminal or switch sessions. Everything happens right here in the current session.

### 6.1 Create CLAUDE.md in the Project Directory

Create a `CLAUDE.md` file in `workspace/<project>/` with:

- A project description based on their chosen project (Forge/Nexus/Sentinel)
- The chosen programming language
- Placeholder build, test, and lint commands
- A pointer to the project guide: `See ../../projects/<name>/README.md for the full module guide.`
- A pointer to reference docs: `See ../../context/ for detailed Claude Code feature documentation.`

### 6.2 Create CLAUDE.local.md in the cc-self-train Root

Create a `CLAUDE.local.md` file in the cc-self-train root directory (NOT inside workspace/) with this content:

```
# Active Project
Project: <project> | Language: <language> | Directory: workspace/<project-dir> | Current Module: 1

When the user starts a session, greet them and offer to continue where they left off.
When the user says "next module" or asks for the next module, read projects/<name>/README.md and walk them through the next module.

@import workspace/<project-dir>/CLAUDE.md
```

### 6.3 Initial Git Commit

Make an initial git commit inside the project directory (`workspace/<project>/`):

```
cd workspace/<project>
git add -A
git commit -m "Initial project setup with CLAUDE.md"
```

### 6.4 Explain CLAUDE.md

Explain to the user:

- What CLAUDE.md is and why it matters — it's Claude's persistent memory for your project, loaded at the start of every session
- The memory hierarchy: managed policy > project CLAUDE.md > .claude/rules/ > user ~/.claude/CLAUDE.md > CLAUDE.local.md
- How it's loaded automatically — anything you put there, Claude reads every session
- The difference between project memory (shared via git) and local memory (personal, not committed)

### 6.5 Show Keyboard Shortcuts

Present the full keyboard shortcuts table:

| Shortcut | What It Does |
|----------|-------------|
| `Tab` | Accept suggestion or autocomplete |
| `Shift+Tab` | Toggle between normal mode, plan mode, and auto-accept mode |
| `Ctrl+C` | Cancel current input or generation |
| `Ctrl+L` | Clear terminal screen (keeps conversation history) |
| `@` | File path mention — trigger file autocomplete |
| `!` | Bash mode — run a shell command directly |
| `Shift+Enter` | Multiline input (or `\` + `Enter` in any terminal) |
| `Esc Esc` | Rewind conversation/code to a previous point |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+R` | Reverse search command history |
| `/` | Start a command or skill |

Encourage them to try a few right now: `@` to browse files, `! git status`, and `Shift+Tab` to see mode switching.

### 6.6 Interactive Exercise

Ask the user to review the CLAUDE.md you just created and suggest improvements. Suggest three improvements yourself and let them pick one (or they can suggest their own). Apply the chosen improvement, then commit:

```
cd workspace/<project>
git add CLAUDE.md
git commit -m "Improve CLAUDE.md based on review"
```

### 6.7 Transition

Tell the user:

> **Module 1 complete!** You've set up your project, created CLAUDE.md, learned the keyboard shortcuts, and made your first commits.
>
> When you're ready, say **"next module"** or **"let's do Module 2"** and I'll walk you through it right here — no terminal switching needed.

## Important

- Build the project in `workspace/<name>/` inside this repo. The `workspace/` directory is gitignored by cc-self-train.
- Ask what language they want — never assume.
- Be encouraging. This is their first time with Claude Code for many users.
- If they already have a project in mind that doesn't match the 3 listed, that's fine — help them pick the project guide that teaches the CC features most relevant to what they want to build.
