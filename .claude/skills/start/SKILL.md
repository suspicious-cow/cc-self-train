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

## Step 6: Hand Off

Tell them:
1. If they set up an environment (venv/conda/Docker), remind them to activate it before launching Claude Code
2. Open a new terminal in their project directory
3. Run `claude` to start Claude Code there
4. Run `/init` as their first command
5. Follow the guide at `projects/<name>/README.md` starting from Module 1

Print the full path to their project guide so they can reference it.

Remind them: this repo (cc-self-train) is their reference library. The `context/` folder has detailed docs on every CC feature. They can always come back here and ask questions.

## Important

- Do NOT build their project inside cc-self-train. Each project gets its own repo.
- Ask what language they want — never assume.
- Be encouraging. This is their first time with Claude Code for many users.
- If they already have a project in mind that doesn't match the 3 listed, that's fine — help them pick the project guide that teaches the CC features most relevant to what they want to build.
