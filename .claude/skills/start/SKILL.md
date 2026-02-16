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

**Teaching approach for this entire step — follow these instructions carefully:**

- **Explain before doing.** Always tell the user WHY something exists and what problem it solves before creating or showing it.
- **Walk through, don't dump.** When creating a file, explain each section as you write it. When showing shortcuts, group them and pause for practice.
- **Use concrete examples.** Don't say "you can add rules" — say "for example, you could add 'always use pytest' or 'never auto-commit'."
- **Pause between concepts.** After teaching a concept and having the user practice, wait for them before moving to the next topic. Don't rush through everything in one wall of text.
- **Be conversational.** Talk like a knowledgeable colleague pair-programming, not a manual. Use "you" and "we".
- **Recap what they learned, not what they did.** At the end, summarize concepts mastered, not steps completed.

### 6.1 Teach: What is CLAUDE.md?

**Before creating any files**, explain the concept to the user conversationally:

- **What it is:** "CLAUDE.md is a briefing doc that Claude reads at the start of every session — think of it as your project's persistent memory."
- **The problem it solves:** "Without it, every session starts from scratch. Claude won't know your conventions, your tech stack, or what you've already decided. You'd have to re-explain everything each time."
- **What goes in it:** Project description, language/stack, build/test/lint commands, coding conventions, and pointers to important docs.

Use a conversational tone — explain it like you're telling a colleague about a tool you find useful, not reading from a manual. Make sure the user understands the "why" before you start creating the file.

### 6.2 Create CLAUDE.md Together

Now create the `CLAUDE.md` file in `workspace/<project>/`, but **walk through each section as you write it** — don't just silently create the file and show it after:

- "First, the **project description** — this tells Claude what we're building so it can give relevant suggestions instead of generic ones..."
- "Next, the **language and stack** — so Claude generates code in the right language and uses the right idioms..."
- "**Build, test, and lint commands** — Claude actually uses these to verify its own work. When it writes code, it can run your tests to check if things still pass..."
- "Finally, **pointers to the guide and reference docs** — so Claude can look up features when you ask about them. Think of these as Claude's bookmarks."

The file should include:
- A project description based on their chosen project (Forge/Nexus/Sentinel)
- The chosen programming language
- Placeholder build, test, and lint commands appropriate for their language
- A pointer to the project guide: `See ../../projects/<name>/README.md for the full module guide.`
- A pointer to reference docs: `See ../../context/ for detailed Claude Code feature documentation.`

After creating the file, pause and let the user see it. Ask if the sections make sense before moving on.

### 6.3 Teach: The Memory Hierarchy

Now that they've seen their first CLAUDE.md, teach the full picture. Explain that CLAUDE.md is just one level in a hierarchy that Claude reads — and understanding the levels helps them put the right information in the right place.

Walk through each level with a **concrete example** of what belongs there:

| Level | What It Is | Example of What Goes Here |
|---|---|---|
| Managed policy | Anthropic's built-in rules (you can't change these) | Safety guidelines, tool usage rules |
| Project `CLAUDE.md` | Shared project conventions — committed to git, everyone on the team sees it | "Use pytest for testing", "API routes go in src/routes/" |
| `.claude/rules/` | Separate rule files for organization — also committed to git | coding-style.md, testing.md, security.md |
| User `~/.claude/CLAUDE.md` | Your personal preferences across ALL your projects | "I prefer concise responses", "Always explain before coding" |
| `CLAUDE.local.md` | Personal notes for THIS project — gitignored, just for you | "Currently on Module 3", "Debugging the auth flow" |

Emphasize the key teaching point: **shared vs personal**. CLAUDE.md is for the team (or for anyone who clones this project). CLAUDE.local.md is just for you — your progress, your notes, your preferences for this specific project.

Say something like: "Here's a good rule of thumb — if a teammate would benefit from knowing it, put it in CLAUDE.md. If it's just about YOUR workflow or progress, put it in CLAUDE.local.md."

### 6.4 Create CLAUDE.local.md (with Teaching)

Before creating the file, explain WHY it's separate:

- "This file tracks YOUR progress through the modules. It's gitignored, so it won't be shared — it's personal to you."
- "It also tells Claude how to greet you when you come back, and where to pick up."

Now create a `CLAUDE.local.md` file in the **cc-self-train root directory** (NOT inside workspace/) with this content:

```
# Active Project
Project: <project> | Language: <language> | Directory: workspace/<project-dir> | Current Module: 1

When the user starts a session, greet them and offer to continue where they left off.
When the user says "next module" or asks for the next module, read projects/<name>/README.md and walk them through the next module.

@import workspace/<project-dir>/CLAUDE.md
```

Walk through each line as you create it:
- "The first line is your progress tracker — project, language, which module you're on."
- "The instructions tell Claude how to behave when you start a new session — it'll welcome you back and know where you left off."
- "The `@import` line is interesting — this pulls your project's CLAUDE.md into the root context. That way, when you open Claude Code from the cc-self-train root, it automatically sees your project's conventions too. It's like a shortcut so Claude always has both files loaded."

### 6.5 Teach: Git Integration + First Commit

Don't just make a commit — teach what's happening:

- "Claude Code has built-in git awareness — it can see your changes, stage files, and create commits. You don't need to leave the conversation to use git."
- "Each commit is a save point. If something breaks in a later module, you can always come back to a known good state. Think of commits as checkpoints in a game."
- "Here's a shortcut you'll love: `Esc Esc` rewinds Claude's last changes — it's like an undo button for your whole conversation. Between git commits and `Esc Esc`, you can always recover from mistakes."

Now make the initial git commit inside the project directory (`workspace/<project>/`):

```
cd workspace/<project>
git add -A
git commit -m "Initial project setup with CLAUDE.md"
```

Explain what just happened: "We staged all the new files and committed them. This is your baseline — everything from here on builds on this foundation."

### 6.6 Teach: Keyboard Shortcuts (Grouped, with Practice)

**Do NOT dump all shortcuts in a single table.** Instead, teach them in 3 thematic groups, pausing after each group for the user to practice.

Introduce this section by saying something like: "Claude Code is a terminal tool, and like any good terminal tool, it has keyboard shortcuts that make you faster. Let me walk you through them in groups — we'll practice each group before moving on."

**Group 1 — "Talking to Claude"**

These are the basics for communicating:

| Shortcut | What It Does |
|---|---|
| `Shift+Enter` | Multiline input — for longer instructions that need multiple lines |
| `Ctrl+C` | Cancel — stops Claude mid-response if it's going off track |
| `/` | Commands and skills — opens the menu of available slash commands |
| `Tab` | Accept a suggestion or autocomplete a file path |

> **Try it now:** Type `/` and browse the available commands. You'll see `/help`, `/start` (which you just used), and others. Press `Ctrl+C` to cancel out when you're done looking.

**Wait for the user to try before continuing.** Ask them what they see or if they have questions.

**Group 2 — "Navigating Your Project"**

These help you work with files and run commands:

| Shortcut | What It Does |
|---|---|
| `@` | Mention a file — Claude reads it into context so you can discuss or edit it |
| `!` | Bash mode — run a shell command without leaving Claude |

> **Try it now:** Type `@` and browse your project files — you should see the CLAUDE.md you just created. Then type `! git log --oneline` to see your first commit.

**Wait for the user to try.** If the `@` file browser or `!` command works, they'll see their project structure and commit history — a nice confirmation that everything is set up correctly.

**Group 3 — "Power Features" (you'll use these constantly)**

These are the shortcuts that make Claude Code feel like a superpower:

| Shortcut | What It Does |
|---|---|
| `Shift+Tab` | Toggle modes — cycles between normal, plan mode, and auto-accept mode |
| `Esc Esc` | Rewind — undo Claude's last changes (the "undo button" we mentioned) |
| `Ctrl+L` | Clear screen — tidies up the terminal but keeps your conversation |
| `Ctrl+R` | Search history — find and re-run previous commands |

> **Try it now:** Press `Shift+Tab` twice — watch the mode indicator change at the bottom of the screen. You'll cycle through normal → plan → auto-accept. Press it again to go back to normal mode. (We'll dive deep into plan mode in Module 2!)

**Wait for the user to try.** Briefly explain the three modes if they ask: normal mode asks before each change, plan mode designs before building, and auto-accept mode lets Claude work without pausing for approval. Tell them not to worry about the details yet — Module 2 covers plan mode in depth.

### 6.7 Interactive Exercise: Making CLAUDE.md Your Own

Start by teaching WHY this exercise matters:

"A generic CLAUDE.md works, but a **customized** one makes Claude dramatically more effective. The best CLAUDE.md files evolve over time as you learn what makes Claude work best for you. Let's practice the **edit → verify → commit** cycle that you'll use throughout this entire course."

Suggest 3 improvements, each with an explanation of **what it does and why it helps**:

1. **Add a coding style preference** — "This tells Claude HOW to write code for you. For example: 'prefer small functions under 30 lines' or 'always add type annotations'. Every piece of code Claude generates will follow this guidance. It's like setting a tone for a conversation."

2. **Add a 'do not' rule** — "These are guardrails against things you don't want. For example: 'never auto-commit without asking' or 'do not add comments to obvious code'. Think of these as boundaries — Claude is eager to help, and sometimes you need to say 'not like that'."

3. **Add a project goal or roadmap** — "This gives Claude the big picture. For example: 'Building toward a CLI that handles notes and snippets by Module 4'. When Claude knows where you're headed, it makes suggestions that align with your direction instead of going off on tangents."

Use AskUserQuestion to let the user pick one (or suggest their own). Apply the chosen improvement, then commit:

```
cd workspace/<project>
git add CLAUDE.md
git commit -m "Customize CLAUDE.md with personal preferences"
```

After committing, call out the cycle: "This is the **edit → verify → commit** loop you'll use in every module: make a change, check that it looks right, commit it as a save point. It becomes second nature."

### 6.8 Transition: What You Learned

Don't just say "Module 1 done." Recap the **concepts** they now understand:

> **Module 1 complete!** Here's what you now know:
>
> - **CLAUDE.md** is Claude's project memory — it's loaded at the start of every session and shapes everything Claude does in your project
> - **The memory hierarchy** — shared memory (CLAUDE.md) vs personal memory (CLAUDE.local.md), project-level vs global preferences, and how they layer together
> - **Keyboard shortcuts** — you can talk to Claude, navigate files, and switch modes without ever leaving the terminal
> - **Git integration** — Claude works with git natively; commits are save points you'll use throughout the course, and `Esc Esc` is your undo button
>
> When you're ready, say **"next module"** or **"let's do Module 2"**. Next up: **Plan Mode** — you'll design your first real feature and learn how Claude helps you think before you code.

## Important

- Build the project in `workspace/<name>/` inside this repo. The `workspace/` directory is gitignored by cc-self-train.
- Ask what language they want — never assume.
- Be encouraging. This is their first time with Claude Code for many users.
- If they already have a project in mind that doesn't match the 3 listed, that's fine — help them pick the project guide that teaches the CC features most relevant to what they want to build.
