# Forge -- Personal Dev Toolkit

A hands-on, project-based guide to mastering Claude Code. You will build a CLI
for notes, snippets, bookmarks, and templates that grows into a searchable,
pluggable personal knowledge base with an API layer.

**Who this is for:** Tool builders who want something they will actually use
every day. If you enjoy building your own productivity tools, this is your
project.

**What you will learn:** All 10 modules cover the full Claude Code feature set,
from CLAUDE.md and plan mode through skills, hooks, MCP servers, subagents,
tasks, plugins, and parallel development.

**Time estimate:** 3-5 focused sessions (roughly 10-15 hours total).

**Prerequisites:** Familiarity with the terminal, git basics, and one
programming language of your choice.

---

## Set Up Your Dev Environment

Before you begin, make sure your development tools are ready. You can use
**any language** for this project. Below are setup instructions for common
choices.

### Install Claude Code

```
npm install -g @anthropic-ai/claude-code
claude --version
```

You need an [Anthropic API key](https://console.anthropic.com/) or a Max
subscription.

### Install Git

```
git --version
```

If you do not have it: [git-scm.com/downloads](https://git-scm.com/downloads)

### Language Toolchains

Pick your language and verify the toolchain:

| Language | Requirements | Verify |
|----------|-------------|--------|
| **Python** | Python 3.10+, a package manager (venv, uv, conda, pip) | `python --version` |
| **TypeScript/Node** | Node.js 18+, npm/pnpm/yarn | `node --version && npm --version` |
| **Go** | Go 1.21+ | `go version` |
| **Rust** | Rust via rustup, cargo | `rustc --version && cargo --version` |
| **Other** | Whatever your language needs -- Claude can help you set it up | -- |

### Initialize Your Language Project

Create the project directory and set up your language toolchain. Examples:

| Language | Init Commands |
|----------|--------------|
| **Python** | `mkdir -p workspace/forge-toolkit && cd workspace/forge-toolkit && python -m venv .venv` then activate the venv |
| **TypeScript** | `mkdir -p workspace/forge-toolkit && cd workspace/forge-toolkit && npm init -y && npm i typescript @types/node -D` |
| **Go** | `mkdir -p workspace/forge-toolkit && cd workspace/forge-toolkit && go mod init forge-toolkit` |
| **Rust** | `cargo new workspace/forge-toolkit && cd workspace/forge-toolkit` |
| **Docker** | Any project can be done in a container -- ask Claude to generate a Dockerfile |

### Environment Isolation

**Environment isolation:** If you chose an environment during `/start` (venv, conda, or Docker), it's already set up in your project directory. If you skipped it and want to add one later, ask Claude: "Help me set up [venv/conda/Docker] for this project."

### Verify Everything

Run these checks before continuing:

- [ ] `claude --version` prints a version number
- [ ] `git --version` prints a version number
- [ ] Your language toolchain runs (compiler/interpreter version check passes)
- [ ] You can create and enter the `workspace/forge-toolkit` directory

---

## Module 1 -- Setup and First Contact

**CC features:** CLAUDE.md, `/init`, `/memory`, interactive mode, keyboard
shortcuts

> **Used `/start`?** Module 1 was completed during onboarding. Jump to [Module 2 -- Blueprint and Build](#module-2--blueprint-and-build).

### 1.1 Create Your Project

Open a terminal in the cc-self-train directory and create the project:

```
mkdir -p workspace/forge-toolkit
cd workspace/forge-toolkit
git init
```

### 1.2 Launch Claude Code

```
claude
```

Claude Code starts in interactive mode. You are now inside a session.

### 1.3 Run /init

Type this into Claude Code:

```
/init
```

Claude scans your project and generates a `CLAUDE.md` file. This is the single
most important file for working with Claude Code -- it is loaded into context
at the start of every session and tells Claude about your project.

Read through the generated `CLAUDE.md`. It should contain:

- A project description
- Build and test commands
- Code style conventions

If it is sparse, that is fine. You will build it up throughout this project.

### 1.4 Tour of CLAUDE.md

Ask Claude:

```
Explain what CLAUDE.md is, how Claude Code uses it, and why it matters.
Mention the memory hierarchy: user, project, project-local, and managed.
```

Key points to understand:

- **Project memory** (`./CLAUDE.md` or `./.claude/CLAUDE.md`): shared with
  your team via version control
- **Project local** (`./CLAUDE.local.md`): your personal preferences for this
  project, auto-added to `.gitignore`
- **User memory** (`~/.claude/CLAUDE.md`): your personal preferences across
  all projects
- **Managed policy**: organization-wide, deployed by IT

### 1.5 Keyboard Shortcuts

Try each shortcut below and note what happens:

| Shortcut | What It Does |
|----------|-------------|
| `Tab` | Accept suggestion or autocomplete |
| `Shift+Tab` | Toggle between normal mode, plan mode, and auto-accept mode |
| `Ctrl+C` | Cancel current input or generation |
| `Ctrl+L` | Clear terminal screen (keeps conversation history) |
| `@` | File path mention -- trigger file autocomplete |
| `!` | Bash mode -- run a shell command directly |
| `Shift+Enter` | Multiline input (or `\` + `Enter` in any terminal) |
| `Esc Esc` | Rewind conversation/code to a previous point |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+R` | Reverse search command history |
| `/` | Start a command or skill |

Try these now:

1. Type `@` and browse files in your project
2. Type `! git status` to run a shell command
3. Press `Shift+Tab` twice to cycle through modes -- notice the mode indicator
4. Type a long prompt using `Shift+Enter` for multiple lines
5. Press `Ctrl+L` to clear the screen

### 1.6 Explore /memory

Type:

```
/memory
```

This opens your memory files in your system editor. You can directly edit
`CLAUDE.md` here. Add a line:

```
This project is a personal dev toolkit CLI called "forge" for managing notes,
snippets, bookmarks, and templates.
```

Save and close the editor.

### 1.7 Exercise

Ask Claude:

```
Read the CLAUDE.md file in this project and explain what it contains.
Then suggest three improvements I could make to it for a CLI tool project.
```

Review Claude's suggestions. Apply at least one of them by editing `CLAUDE.md`.

### 1.8 First Commit

```
! git add -A
! git commit -m "Initial project setup with CLAUDE.md"
```

### Checkpoint

- [ ] `workspace/forge-toolkit/` directory exists with `git init` completed
- [ ] `CLAUDE.md` exists and describes the project
- [ ] You ran `/init` and `/memory` successfully
- [ ] You tried all keyboard shortcuts from the table above
- [ ] You made your first commit

---

## Module 2 -- Blueprint and Build

**CC features:** Plan mode, git integration, basic prompting

### 2.1 Enter Plan Mode

Press `Shift+Tab` to switch to plan mode. You will see the mode indicator
change. In plan mode, Claude analyzes and plans without making changes. This
is where you design before you build.

Alternatively, type:

```
/plan
```

### 2.2 Design the Architecture

Give Claude this prompt in plan mode:

```
Design a CLI tool called "forge" with these data types:
- Notes (title, body, tags, created_at, updated_at)
- Snippets (language, code, description, tags)
- Bookmarks (url, title, description, tags)
- Templates (name, content, variables)

Storage: file-based JSON, one file per type, index file for search.

CLI: forge add <type>, forge list [type] [--tag TAG], forge search QUERY,
forge show ID, forge delete ID, forge tags.

Give me the full project structure, data models, and module breakdown.
Do not write any code yet -- just the plan.
```

Claude will produce a detailed architecture plan. Read it carefully.

### 2.3 Review and Iterate

Still in plan mode, ask questions:

```
What are the trade-offs of file-based JSON storage vs SQLite for this use case?
How should IDs be generated -- UUID, incrementing integer, or slug?
How will search across all types work efficiently?
```

Refine the plan until you are satisfied.

### 2.4 Exit Plan Mode and Execute

Press `Shift+Tab` to return to normal mode. Now tell Claude to build:

```
Create the project structure from the plan. Start with:
1. Data models / type definitions for Note, Snippet, Bookmark, Template
2. The storage layer (read/write JSON files, index management)
3. Do NOT build the CLI interface yet -- just the core library.
```

Let Claude create the files. Review what it produces.

### 2.5 Create a Feature Branch

```
! git checkout -b feature/core
```

### 2.6 Build the Storage Layer

If Claude has not yet created the full storage layer, prompt it:

```
Implement the storage layer:
- CRUD operations for each data type (create, read, update, delete)
- Tag-based filtering
- Full-text search across title, body, description fields
- Automatic timestamping (created_at on create, updated_at on modify)
- Data validation before writing
```

### 2.7 Write and Run Tests

```
Write tests for the storage layer. Cover:
- Creating each data type
- Reading by ID
- Listing with tag filter
- Search across types
- Deleting an item
- Edge cases: duplicate IDs, empty fields, missing files
```

Run the tests:

```
! <your-test-command>
```

For example: `python -m pytest`, `npm test`, `go test ./...`, `cargo test`

If tests fail, ask Claude to fix them. This is the build-test-fix cycle you
will use throughout the project.

### 2.8 Build the CLI Interface

```
Build the CLI interface for forge with all commands: forge add (each type
with appropriate flags), forge list, forge search, forge show, forge delete,
forge tags. Make sure the CLI parses arguments and calls the storage layer.
```

### 2.9 Manual Testing

Test your CLI by actually using it:

```
! forge add note --title "First Note" --body "Testing the forge CLI" --tags "test,meta"
! forge list notes
! forge search "First"
! forge show <ID-from-list>
! forge tags
! forge delete <ID>
```

Verify each command works. Fix anything broken.

### 2.10 Commit and Merge

```
! git add -A
! git commit -m "feat: core data models, storage layer, and CLI interface"
! git checkout main
! git merge feature/core
```

### Checkpoint

- [ ] You used plan mode to design the architecture before writing code
- [ ] Data models exist for Note, Snippet, Bookmark, Template
- [ ] Storage layer handles CRUD, search, and tag filtering
- [ ] CLI commands work: `forge add`, `forge list`, `forge search`, `forge show`, `forge delete`, `forge tags`
- [ ] Tests pass
- [ ] Changes are committed and merged to main

---

## Module 3 -- Rules, Memory, and Context

**CC features:** `.claude/rules/`, `CLAUDE.local.md`, `@imports`, `/context`,
`/compact`, memory hierarchy, `/cost`

### 3.1 Create Project Rules

Create the rules directory in your project:

```
! mkdir -p .claude/rules
```

Rules are modular, topic-specific instructions that Claude loads automatically.
They use markdown files with optional YAML frontmatter for path scoping.

### 3.2 Create Path-Scoped Rules

Create three rule files. Tell Claude:

```
Create .claude/rules/testing.md with this frontmatter and content:

---
paths:
  - "tests/**"
  - "test_*"
  - "*_test.*"
  - "*.test.*"
---

# Testing Rules

- Always use fixtures for test data, never hardcode values inline
- Every assertion must have a descriptive message explaining what it verifies
- Group tests by feature, not by function name
- Test both success and failure cases for every operation
- Use setup/teardown to manage test state, never leave test artifacts behind
```

```
Create .claude/rules/source-code.md with this frontmatter and content:

---
paths:
  - "src/**"
  - "lib/**"
  - "pkg/**"
---

# Source Code Rules

- Follow single-responsibility principle: one function does one thing
- All public functions must have docstrings/comments explaining purpose, params, and return values
- Handle errors explicitly -- never swallow exceptions silently
- Use meaningful variable names: no single-letter names except loop counters
- Keep functions under 40 lines; extract helpers when they grow
```

```
Create .claude/rules/storage.md with this frontmatter and content:

---
paths:
  - "**/storage*"
  - "**/store*"
  - "**/data*"
  - "**/*.json"
---

# Storage Rules

- Always validate data schema before writing to storage
- Handle file-not-found gracefully: return empty collection, not an error
- Use atomic writes: write to temp file, then rename
- Never modify storage files by hand during tests -- use the storage API
- Back up the index file before rebuilding it
```

### 3.3 Create CLAUDE.local.md

Create a personal, non-committed preferences file:

```
Create CLAUDE.local.md in the project root with your personal preferences.
For example:
- I prefer verbose test output with individual test names shown
- I prefer descriptive commit messages with a type prefix (feat:, fix:, test:)
- When showing examples, use my preferred language: [your language]
```

Verify it was added to `.gitignore`:

```
! cat .gitignore
```

If `CLAUDE.local.md` is not listed, add it.

### 3.4 Understand the Memory Hierarchy

Ask Claude:

```
Explain the full Claude Code memory hierarchy in order of precedence.
Where is each file located? Which ones are shared with the team?
```

The hierarchy from highest to lowest precedence:

1. Managed policy (organization-wide, system directory)
2. Project memory (`./CLAUDE.md` or `./.claude/CLAUDE.md`)
3. Project rules (`.claude/rules/*.md`)
4. User memory (`~/.claude/CLAUDE.md`)
5. Project local (`./CLAUDE.local.md`)

### 3.5 Modularize CLAUDE.md with @imports

Create supporting documentation files and reference them from `CLAUDE.md`:

```
Create docs/architecture.md describing the forge project architecture:
data models, storage layer, CLI interface, and file structure.

Create docs/api.md describing the public API of the storage layer:
function signatures, parameters, return types, error handling.

Then add @imports to CLAUDE.md:
  See @docs/architecture.md for the system architecture.
  See @docs/api.md for the storage API reference.
```

The `@path` syntax tells Claude Code to load those files as additional context
when needed. Both relative and absolute paths work.

### 3.6 /context Deep Dive

Run:

```
/context
```

This shows a visual grid of your current context usage. Observe:

- How much context is used by CLAUDE.md and rules
- How much is used by conversation history
- How much remains available

Understanding context is critical. As your session grows, context fills up.

### 3.7 /compact with Focus Argument

When context gets large, use `/compact` to summarize the conversation:

```
/compact Preserve all details about the storage layer API and data models.
```

The argument tells Claude what to prioritize when compacting. Without it,
Claude uses its own judgment.

### 3.8 /cost Tracking

Run:

```
/cost
```

This shows your token usage for the current session. Check it periodically to
understand how much context different operations consume.

### 3.9 Build a Feature Using These Tools

Now build the template system while using your new rules and context tools:

```
Create a feature branch "feature/templates" and implement:
- Template rendering: replace $VARIABLE placeholders with provided values
- forge render TEMPLATE_NAME --var KEY=VALUE --var KEY2=VALUE2
- Validate that all required variables are provided
- Error if unknown variables are passed
- Write tests following our testing rules
```

After building, run `/context` again to see how context changed. Then commit.

### Checkpoint

- [ ] `.claude/rules/` directory contains `testing.md`, `source-code.md`, `storage.md`
- [ ] Each rule file has correct path-scoped frontmatter
- [ ] `CLAUDE.local.md` exists with personal preferences
- [ ] `docs/architecture.md` and `docs/api.md` exist
- [ ] `CLAUDE.md` contains `@imports` referencing the docs
- [ ] You ran `/context` and understand the context grid
- [ ] You ran `/compact` with a focus argument
- [ ] You ran `/cost` and checked token usage
- [ ] Template rendering feature works with tests passing
- [ ] Changes committed on a feature branch and merged

---

## Module 4 -- Skills and Commands

**CC features:** SKILL.md, frontmatter, custom slash commands, hot-reload,
argument substitution, `disable-model-invocation`

### 4.1 Create the Skills Directory

```
! mkdir -p .claude/skills/add-item
! mkdir -p .claude/skills/search
! mkdir -p .claude/skills/daily-summary
```

### 4.2 Create the "add-item" Skill

Tell Claude:

```
Create .claude/skills/add-item/SKILL.md that:
- Has frontmatter: name "add-item", description about adding items with
  validation, allowed-tools: Read, Write, Bash, Edit
- Uses $0 for item type (note, snippet, bookmark, template) and $ARGUMENTS
  for details
- Steps: determine type, collect required fields per type, validate
  (non-empty titles, valid URLs, lowercase tags, uppercase template vars),
  run forge add, show created item
- References a supporting file: validation-rules.md

Also create .claude/skills/add-item/validation-rules.md with detailed
validation rules for each field of each data type, with examples of valid
and invalid inputs.
```

### 4.3 Create the "search" Skill

```
Create .claude/skills/search/SKILL.md that:
- Has frontmatter: name "search", description about searching all item types,
  allowed-tools: Read, Bash, Grep, Glob
- Uses $ARGUMENTS for the search query
- Steps: parse query, detect prefixes (tag:, type:, since: for filtering,
  otherwise full text search), run forge search, display results as a table
  (ID | Type | Title | Tags | Date), suggest alternatives if no results
```

### 4.4 Create the "daily-summary" Skill

```
Create .claude/skills/daily-summary/SKILL.md that:
- Has frontmatter: name "daily-summary", description about summarizing
  today's forge activity, disable-model-invocation: true,
  allowed-tools: Read, Bash
- Steps: get today's date, list items per type filtered by date, group by
  type, show title/tags/summary per item, show totals
```

Notice `disable-model-invocation: true` -- this skill can only be triggered
by you typing `/daily-summary`. Claude will not invoke it automatically.

### 4.5 Test Your Skills

Test each skill:

```
/add-item note
/search testing
/daily-summary
```

Try with arguments:

```
/add-item snippet python
/search tag:reference
```

### 4.6 Argument Substitution

Skills support these substitution variables:

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed after the skill name |
| `$ARGUMENTS[0]` or `$0` | First argument |
| `$ARGUMENTS[1]` or `$1` | Second argument |
| `$ARGUMENTS[N]` or `$N` | Nth argument (zero-indexed) |
| `${CLAUDE_SESSION_ID}` | Current session ID |

### 4.7 Hot-Reload

With Claude Code still running, open `.claude/skills/search/SKILL.md` in a
separate editor and add a line to the steps:

```
7. After displaying results, show the total search time
```

Save the file. Now invoke `/search` again in Claude Code. The updated skill
content takes effect immediately -- no restart needed.

### 4.8 Create a Manual-Only Skill

Create a skill that outputs a bug report template:

```
Create .claude/skills/issue-template/SKILL.md with disable-model-invocation: true
that outputs a bug report template. Use $0 for the issue title. Include fields
for Type, Steps to reproduce, Expected behavior, Actual behavior, Forge version.
```

Test it: `/issue-template "Search returns wrong results"`

### Checkpoint

- [ ] `.claude/skills/add-item/SKILL.md` exists with frontmatter and supporting files
- [ ] `.claude/skills/search/SKILL.md` exists with argument parsing
- [ ] `.claude/skills/daily-summary/SKILL.md` exists with `disable-model-invocation: true`
- [ ] All three skills invoke correctly with `/skill-name`
- [ ] Argument substitution works (`$0`, `$ARGUMENTS`)
- [ ] Hot-reload works: edit SKILL.md while Claude runs, changes take effect
- [ ] Issue template skill outputs raw text without Claude processing

---

## Module 5 -- Hooks

**CC features:** SessionStart, PostToolUse, Stop hooks, matchers, hook
scripting, settings.json

### 5.1 Hook Lifecycle Overview

Hooks fire at specific points during a Claude Code session:

| Hook Event | When It Fires |
|-----------|--------------|
| `SessionStart` | Session begins or resumes |
| `UserPromptSubmit` | User submits a prompt |
| `PreToolUse` | Before a tool executes |
| `PermissionRequest` | When a permission dialog appears |
| `PostToolUse` | After a tool succeeds |
| `Stop` | Claude finishes responding |
| `SubagentStop` | When a subagent finishes |
| `PreCompact` | Before context compaction |
| `SessionEnd` | Session terminates |

Hooks are configured in settings files:
- `.claude/settings.json` -- project hooks (shared with team)
- `.claude/settings.local.json` -- local hooks (personal, not committed)
- `~/.claude/settings.json` -- user hooks (all projects)

### 5.2 Create a SessionStart Hook

This hook will inject project stats into context when Claude starts.

Tell Claude:

```
Create .claude/hooks/session-stats.sh (or .py) that counts the number of
notes, snippets, bookmarks, and templates in storage, shows last-modified
timestamps, and prints a one-line summary to stdout. Make it executable.

Then create or update .claude/settings.json with a SessionStart hook:
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/session-stats.sh"
          }
        ]
      }
    ]
  }
}
```

For SessionStart hooks, stdout is added to Claude's context automatically.

Restart Claude Code (exit and re-launch `claude`) to test it. You should see
the stats injected on startup.

### 5.3 Create a PostToolUse Hook

This hook auto-formats files after Claude writes or edits them.

```
Add a PostToolUse hook to .claude/settings.json with matcher "Write|Edit"
that runs your language's formatter. Examples:
  Python:     "python -m black . --quiet 2>/dev/null || true"
  TypeScript: "npx prettier --write . 2>/dev/null || true"
Use || true so the hook does not fail if the formatter is missing.
```

### 5.4 Create a Stop Hook

This hook runs the test suite before Claude stops to verify nothing is broken.

```
Create .claude/hooks/run-tests.sh that reads JSON from stdin, checks if
stop_hook_active is true (to prevent infinite loops -- if true, exit 0),
otherwise runs the test suite. If tests fail, output JSON:
{"decision": "block", "reason": "Tests failed: <output>"}
If tests pass, exit 0. Add a Stop hook to .claude/settings.json to run it.
```

### 5.5 Matchers, Timeouts, and Scripting

Matchers filter which tools trigger a hook. Key patterns:

| Pattern | Matches |
|---------|---------|
| `"Write"` | Exactly the Write tool |
| `"Write\|Edit"` | Write or Edit tools |
| `"Bash(npm test*)"` | Bash commands starting with `npm test` |
| `"*"` | All tools |
| `"mcp__.*"` | All MCP tools |

Add `"timeout": 30` to any hook command to override the default 60-second
timeout. Every hook script receives JSON on stdin, uses exit codes to
communicate (0 = success, 2 = blocking error), and can access
`$CLAUDE_PROJECT_DIR` for the project root.

### 5.7 Exercise: Trigger Each Hook

1. **SessionStart:** Exit and restart `claude`. Check that stats appear.
2. **PostToolUse:** Ask Claude to create a new file. Verify the formatter ran.
3. **Stop:** Ask Claude a question and let it finish. Verify tests ran.

Use `Ctrl+O` (verbose mode) to see hook execution details.

### Checkpoint

- [ ] `.claude/settings.json` exists with hook configuration
- [ ] SessionStart hook injects project stats on session start
- [ ] PostToolUse hook auto-formats files after writes/edits
- [ ] Stop hook runs tests before Claude stops
- [ ] Matchers filter correctly (Write|Edit, not all tools)
- [ ] You verified each hook fires by triggering it and checking output

---

## Module 6 -- MCP Servers

**CC features:** MCP servers, `.mcp.json`, scopes, skills+MCP, `claude mcp add`

### 6.1 What Is MCP

MCP (Model Context Protocol) is an open standard for connecting AI tools to
external data sources and APIs. MCP servers give Claude Code access to
databases, file systems, APIs, and more.

### 6.2 Add a SQLite MCP Server

SQLite gives your forge toolkit persistent, queryable storage. This is an
upgrade from file-based JSON.

On Windows, use the `cmd /c` wrapper for npx-based servers:

```
claude mcp add --transport stdio forge-db -- cmd /c npx -y @anthropic-ai/mcp-sqlite --db-path forge.db
```

On macOS/Linux:

```
claude mcp add --transport stdio forge-db -- npx -y @anthropic-ai/mcp-sqlite --db-path forge.db
```

After adding, check the status:

```
/mcp
```

You should see `forge-db` listed and connected.

Now ask Claude:

```
Using the forge-db MCP server, create tables for notes, snippets, bookmarks,
and templates matching our existing data models. Then migrate any existing
JSON data into the SQLite database.
```

### 6.3 Add a Filesystem MCP Server

For enhanced file operations:

On Windows:

```
claude mcp add --transport stdio forge-fs -- cmd /c npx -y @anthropic-ai/mcp-filesystem --root .
```

On macOS/Linux:

```
claude mcp add --transport stdio forge-fs -- npx -y @anthropic-ai/mcp-filesystem --root .
```

### 6.4 Check MCP Status

```
/mcp
```

This shows all connected servers, their status, and available tools. You
should see both `forge-db` and `forge-fs`.

### 6.5 Create .mcp.json for Team Sharing

To share MCP configuration with your team, use the project scope:

```
claude mcp add --transport stdio forge-db --scope project -- npx -y @anthropic-ai/mcp-sqlite --db-path forge.db
```

This creates a `.mcp.json` file at your project root:

```json
{
  "mcpServers": {
    "forge-db": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-sqlite", "--db-path", "forge.db"],
      "env": {}
    }
  }
}
```

Commit this file so teammates get the same MCP setup.

### 6.6 Understand MCP Scopes

| Scope | Where Stored | Who Sees It |
|-------|-------------|------------|
| **local** (default) | `~/.claude.json` under project path | Only you, this project |
| **project** | `.mcp.json` in project root | Everyone (via version control) |
| **user** | `~/.claude.json` | Only you, all projects |

### 6.7 Create a Skill That Orchestrates MCP Tools

Create a "backup" skill that uses MCP tools:

```
Create .claude/skills/backup/SKILL.md with:
- Frontmatter: name "backup", disable-model-invocation: true,
  allowed-tools: Bash, Read, Write, mcp__forge-db__*, mcp__forge-fs__*
- Steps: export all tables to JSON via forge-db MCP, create backup directory
  (backups/YYYY-MM-DD/), write each table's data, log backup in a backup_log
  table, show summary with counts and total size
```

Test it: `/backup`

### Checkpoint

- [ ] SQLite MCP server is connected (`/mcp` shows it active)
- [ ] Filesystem MCP server is connected
- [ ] You can query the SQLite database through Claude
- [ ] `.mcp.json` exists for team sharing
- [ ] You understand the three MCP scopes (local, project, user)
- [ ] Backup skill orchestrates MCP tools to export and archive data
- [ ] Data has been migrated from JSON files to SQLite

---

## Module 7 -- Guard Rails

**CC features:** PreToolUse, hook decision control, prompt-based hooks,
`permissionDecision`, `additionalContext`, `updatedInput`

### 7.1 PreToolUse Hooks with Decision Control

PreToolUse hooks intercept tool calls before they execute. They can:
- **Allow:** bypass the permission system entirely
- **Deny:** block the tool call and tell Claude why
- **Ask:** show the user a confirmation prompt
- **Modify:** change the tool's input parameters

### 7.2 Guard: Validate Before Storage Writes

Create a hook that prevents writes to storage files unless validation passes:

```
Create .claude/hooks/validate-storage.sh (or .py) that:
1. Reads JSON from stdin
2. Checks if the file being written matches storage paths (*.json data files)
3. If it is a storage file, validate JSON structure. If invalid, output:
   {"hookSpecificOutput": {"hookEventName": "PreToolUse",
     "permissionDecision": "deny",
     "permissionDecisionReason": "Storage validation failed: <details>"}}
4. If not a storage file, exit 0 (allow)

Then add a PreToolUse hook to .claude/settings.json with matcher "Write" that
runs $CLAUDE_PROJECT_DIR/.claude/hooks/validate-storage.sh
```

### 7.3 Guard: Inject Context on File Reads

Create a hook that adds context when Claude reads source files:

```
Create .claude/hooks/read-context.sh that reads JSON from stdin, checks if
the file_path is in src/, lib/, or pkg/, and if so outputs JSON with
additionalContext: "Reminder: This is a source file. Follow single-
responsibility principle. All public functions need docstrings."
Add a PreToolUse hook with matcher "Read" to run it.
```

The key is `hookSpecificOutput.additionalContext` -- it injects a string into
Claude's context before the tool executes.

### 7.4 Guard: Auto-Add Timestamps

Create a hook that modifies tool input to inject timestamps:

```
Create .claude/hooks/add-timestamp.sh that reads JSON from stdin, checks if
the Write target is a storage file, and if so parses the content, injects or
updates "updated_at" with the current ISO timestamp, and outputs JSON with
updatedInput containing the modified content and permissionDecision: "allow".
Add a PreToolUse hook with matcher "Write" to run it.
```

The key is `hookSpecificOutput.updatedInput` -- it replaces the tool's input
parameters before execution.

### 7.5 Prompt-Based Quality Gate

Add a Stop hook with `"type": "prompt"` instead of `"type": "command"`. The
prompt should instruct the LLM to check if Claude was asked to commit code,
and if so verify: all tests pass, no unresolved TODOs, no leftover debug
statements. Respond `{"ok": true}` or `{"ok": false, "reason": "..."}`.

```
Add a prompt-based Stop hook to .claude/settings.json with type: "prompt"
and timeout: 30. The prompt should review the conversation for commit-quality
checks: tests passing, no TODO comments, no debug logging left in code.
```

Prompt-based hooks use a fast LLM (Haiku) to evaluate context and return a
structured decision. They are powerful for nuanced, context-aware checks.

### 7.6 Test Each Guard

1. **Storage validation:** Ask Claude to write invalid data to a storage file.
   Verify the hook blocks it.
2. **Read context:** Ask Claude to read a source file. Use `Ctrl+O` to verify
   the additional context was injected.
3. **Timestamp injection:** Ask Claude to update a storage file. Verify
   `updated_at` was added.
4. **Quality gate:** Ask Claude to write code with a `console.log` and commit.
   Verify the stop hook catches it.

### Checkpoint

- [ ] PreToolUse hook denies invalid storage writes with a clear message
- [ ] PreToolUse hook injects `additionalContext` when reading source files
- [ ] PreToolUse hook uses `updatedInput` to inject timestamps on writes
- [ ] Prompt-based Stop hook reviews code quality before commit
- [ ] Each guard was tested and verified working
- [ ] You understand the difference between `permissionDecision`, `additionalContext`, and `updatedInput`

---

## Module 8 -- Subagents

**CC features:** `.claude/agents/`, subagent frontmatter, chaining, parallel,
background (`Ctrl+B`), resuming

### 8.1 What Are Subagents

Subagents are specialized AI assistants with their own context windows, system
prompts, tool access, and permissions. When Claude encounters a task matching
a subagent's description, it delegates to that subagent. The subagent works
independently and returns results.

Benefits:
- **Preserve context:** heavy work stays out of your main conversation
- **Enforce constraints:** limit which tools a subagent can use
- **Specialize behavior:** focused system prompts for specific domains
- **Control costs:** route tasks to faster, cheaper models

### 8.2 Create the Agents Directory

```
! mkdir -p .claude/agents
```

### 8.3 Create: search-agent

Tell Claude:

```
Create .claude/agents/search-agent.md with:
- Frontmatter: name search-agent, description about finding and ranking items,
  tools: Read, Grep, Glob, Bash, model: haiku
- System prompt: search specialist that parses queries, searches all data types,
  ranks results by relevance (exact title > tag > body > partial), formats as
  ranked list, suggests related searches if no results
```

### 8.4 Create: format-agent

```
Create .claude/agents/format-agent.md with:
- Frontmatter: name format-agent, description about converting between formats,
  tools: Read, Write, Bash, model: haiku
- System prompt: format converter that reads items and exports to Markdown,
  JSON, HTML, or CSV with proper formatting, handles edge cases, reports summary
```

### 8.5 Create: review-agent

```
Create .claude/agents/review-agent.md with:
- Frontmatter: name review-agent, description about reviewing items for quality,
  tools: Read, Grep, Glob, model: sonnet, permissionMode: plan
- System prompt: quality reviewer that checks completeness, clarity, tag
  consistency, and duplicates, scores items (Good/Needs Improvement/Poor),
  provides specific suggestions
```

Note `permissionMode: plan` -- this agent is read-only.

### 8.6 Subagent Frontmatter Reference

| Field | Required | Description |
|-------|---------|-------------|
| `name` | Yes | Unique identifier (lowercase, hyphens) |
| `description` | Yes | When Claude should use this agent |
| `tools` | No | Tools the agent can use (inherits all if omitted) |
| `disallowedTools` | No | Tools to explicitly deny |
| `model` | No | `sonnet`, `opus`, `haiku`, or `inherit` (default: `inherit`) |
| `permissionMode` | No | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `skills` | No | Skills to preload into the agent's context |
| `hooks` | No | Lifecycle hooks scoped to this agent |

### 8.7 Invoke Subagents

Manually invoke a subagent:

```
Use the search-agent to find all items tagged with "reference"
```

Or explicitly:

```
Use the format-agent to export all notes as Markdown to exports/notes.md
```

Claude also delegates automatically based on the task. Ask:

```
Find items related to "API design" in my knowledge base
```

Claude may route this to the search-agent on its own.

### 8.8 Patterns: Chain, Parallel, Resume

**Chaining:** Connect agents in sequence:

```
Use the search-agent to find all poorly-tagged items, then use the
review-agent to suggest better tags for each one.
```

**Parallel (background):** Press `Ctrl+B` to background a running agent,
then start another task:

```
Use the review-agent to review all my notes
```

While it runs, press `Ctrl+B`, then:

```
Use the format-agent to export all bookmarks as HTML
```

Both agents work simultaneously.

**Resuming:** After an agent completes, continue its work:

```
Continue that review and now also check snippets for quality
```

Claude resumes the previous agent with its full context preserved.

### Checkpoint

- [ ] `.claude/agents/` contains `search-agent.md`, `format-agent.md`, `review-agent.md`
- [ ] Each agent has correct frontmatter (name, description, tools, model)
- [ ] You invoked each agent manually and it produced results
- [ ] You chained two agents (search then format, or search then review)
- [ ] You backgrounded an agent with `Ctrl+B` and started another task
- [ ] You resumed a completed agent to continue its work

---

## Module 9 -- Tasks and TDD

**CC features:** Tasks system, `TaskCreate`, dependencies/blockedBy,
cross-session persistence, TDD loops, SubagentStop

### 9.1 Tasks System Overview

Tasks replace the old TODO system. They provide:
- Dependency graphs (task A blocks task B)
- Cross-session persistence (stored on disk at `~/.claude/tasks/`)
- Multi-agent collaboration (shared task lists)
- Progress tracking visible in the terminal

Press `Ctrl+T` to toggle the task list view at any time.

### 9.2 Cross-Session Persistence

To share a task list across sessions, set the environment variable:

```
CLAUDE_CODE_TASK_LIST_ID=forge-import claude
```

Any session started with this ID shares the same task list. This enables
multiple Claude instances to coordinate work.

### 9.3 Build a Multi-Step Pipeline

Create a task chain for importing notes from markdown files:

```
Create a task list for importing markdown files as notes with these tasks
and dependencies:
1. "Scan directory" - Find .md files in imports/ (no dependencies)
2. "Parse markdown" - Extract title, body, tags from each file (blocked by 1)
3. "Validate data" - Validate against schema (blocked by 2)
4. "Import to storage" - Write to forge database (blocked by 3)
5. "Update index" - Rebuild search index (blocked by 4)
6. "Generate report" - Summary of imports and errors (blocked by 5)
Use TaskCreate with blockedBy dependencies.
```

Press `Ctrl+T` to see tasks in the status area. Before executing, create
test data:

```
Create an imports/ directory with 5 sample markdown files that have YAML
frontmatter (title, tags) and varied body content.
```

Then: `Execute the import pipeline. Work through each task in order.`

### 9.4 TDD Workflow: Build with Tests First

Use strict test-driven development to build a new feature -- fuzzy search:

```
We are going to build "smart search" with fuzzy matching using strict TDD.
The rules:
1. Write a FAILING test first
2. Run the test -- confirm it fails
3. Write the MINIMUM code to make it pass
4. Run the test -- confirm it passes
5. Refactor if needed
6. Repeat

Start with these test cases for fuzzy search:
- "ntes" should match "notes" (typo tolerance)
- "py snippet" should match snippets with language "python"
- "fav bookmarks" should match bookmarks tagged "favorite"
- "readme tmpl" should match templates named "readme-template"
- Empty query returns all items
- Query with no matches returns empty list with suggestions
- Search is case-insensitive

Write the first failing test now. Do NOT write any implementation yet.
```

Let Claude work through the TDD cycle. For each test:
1. Claude writes the test
2. You or Claude runs it (it should fail)
3. Claude writes just enough code to pass
4. Run tests again (should pass)
5. Refactor

This enforces disciplined development and gives you a solid test suite.

### 9.5 Stop and SubagentStop Hooks for Verification

Add a SubagentStop hook that verifies subagent output:

```
Add a SubagentStop hook to .claude/settings.json with type: "prompt" that
evaluates whether the subagent completed its task: Did it produce output?
Were there errors? Is it complete? Respond ok: true or ok: false with reason.
```

This ensures subagents finish their work properly before returning results.

### Checkpoint

- [ ] You created a multi-step task pipeline with dependencies
- [ ] Tasks appeared in the terminal status area (`Ctrl+T`)
- [ ] Tasks executed in dependency order (blocked tasks waited)
- [ ] You built fuzzy search using strict TDD (test first, then implement)
- [ ] All fuzzy search tests pass
- [ ] You understand cross-session persistence with `CLAUDE_CODE_TASK_LIST_ID`
- [ ] SubagentStop hook verifies subagent completion

---

## Module 10 -- Parallel Dev, Plugins, and Evaluation

**CC features:** Git worktrees, plugins, evaluation, PermissionRequest hooks,
continuous learning

### 10.1 Git Worktrees for Parallel Development

Git worktrees let you work on multiple branches simultaneously without
switching. Each worktree is a separate directory pointing to the same repo.

Create two worktrees for parallel feature development:

```
! git worktree add ../forge-api feature/api
! git worktree add ../forge-export feature/export
```

Now you have three directories:
- `forge-toolkit/` -- main branch
- `../forge-api/` -- feature/api branch
- `../forge-export/` -- feature/export branch

### 10.2 Run Parallel Claude Instances

Open separate terminals. Share a task list across both:

```
# Terminal 1:
cd ../forge-api && CLAUDE_CODE_TASK_LIST_ID=forge-parallel claude

# Terminal 2:
cd ../forge-export && CLAUDE_CODE_TASK_LIST_ID=forge-parallel claude
```

In Terminal 1, create tasks for the API feature (design routes, implement
server, write tests -- with dependencies). In Terminal 2, create tasks for
the export feature (design formats, implement exporters, write tests).

Both sessions see all tasks. When one completes a task, the other is notified.

### 10.3 Plugin Creation

Package everything you have built into a reusable plugin.

Create the plugin structure:

```
Create a plugin called "knowledge-base-plugin" with:
- .claude-plugin/plugin.json manifest (name: "knowledge-base", version: 1.0.0)
- skills/ directory: copy add-item, search, daily-summary, backup from .claude/skills/
- agents/ directory: copy search-agent, format-agent, review-agent from .claude/agents/
- hooks/hooks.json: extract hooks from .claude/settings.json into plugin format
```

The directory layout must be:

```
knowledge-base-plugin/
  .claude-plugin/plugin.json    <-- manifest (required)
  skills/                       <-- at root, NOT inside .claude-plugin/
  agents/
  hooks/hooks.json
```

### 10.4 Test the Plugin

Test your plugin locally:

```
claude --plugin-dir ./knowledge-base-plugin
```

Verify everything works:
- Skills invoke correctly: `/knowledge-base:add-item`, `/knowledge-base:search`
- Agents appear in `/agents`
- Hooks fire as expected

Note the namespacing: plugin skills are prefixed with the plugin name to
prevent conflicts.

### 10.5 Evaluation

Write test specs to evaluate your skills and agents:

```
Create an evaluation suite for the forge toolkit. For each skill and agent,
define test cases with input, expected output, and scoring criteria:
- add-item skill: valid note (expect ID), empty title (expect error),
  missing fields (expect prompt)
- search agent: exact title (expect match), tag search (expect filtered),
  no results (expect suggestions)
- review agent: incomplete item (expect flag), duplicates (expect merge suggestion)
Write a script that runs each test and reports pass/fail.
```

### 10.6 PermissionRequest Hooks for Eval Automation

During evaluation, auto-approve safe operations to avoid prompt fatigue:

```
Add a PermissionRequest hook to .claude/settings.local.json with matcher
"Read|Grep|Glob|Bash(forge *)" that outputs JSON with
hookSpecificOutput.decision.behavior: "allow" to auto-approve.
```

Keep this in `settings.local.json` (not committed) and use only during eval.

### 10.7 Continuous Learning

Reflect on the full project and update your configuration:

```
Review CLAUDE.md, rules, skills, agents, and hooks. Update each based on
lessons learned: patterns that worked, patterns to avoid, refined descriptions,
missing edge cases, hook interaction notes.
```

This is the continuous learning cycle: build, reflect, refine, repeat.

### Checkpoint

- [ ] Created git worktrees for parallel feature development
- [ ] Ran two Claude instances with a shared task list
- [ ] Both instances could see and update the same tasks
- [ ] Plugin created with manifest, skills, agents, and hooks
- [ ] Plugin tested with `--plugin-dir` and skills work with namespace prefix
- [ ] Evaluation suite exists with test specs for skills and agents
- [ ] PermissionRequest hook auto-approves safe operations during eval
- [ ] CLAUDE.md and rules updated with lessons learned from the project

---

## Final Verification Checklist

Confirm you have touched every major Claude Code feature across all 10 modules:

- [ ] `/init`, `/memory`, `CLAUDE.md` -- project memory and configuration
- [ ] Keyboard shortcuts -- Tab, Shift+Tab, Ctrl+C, Ctrl+L, @, !, Esc Esc, Ctrl+O, Ctrl+B
- [ ] Plan mode -- designed architecture before building
- [ ] Git integration -- branches, commits, merges through Claude
- [ ] `.claude/rules/` -- path-scoped rules with YAML frontmatter
- [ ] `CLAUDE.local.md` -- personal, non-committed preferences
- [ ] `@imports` -- modular CLAUDE.md referencing external docs
- [ ] `/context`, `/compact`, `/cost` -- context management tools
- [ ] Custom skills -- `SKILL.md` with frontmatter, `$ARGUMENTS`, hot-reload
- [ ] `disable-model-invocation` -- manual-only skills
- [ ] Hooks -- SessionStart, PostToolUse, PreToolUse, Stop in `.claude/settings.json`
- [ ] Hook decision control -- `permissionDecision`, `additionalContext`, `updatedInput`
- [ ] Prompt-based hooks -- `type: "prompt"` for LLM-powered quality gates
- [ ] MCP servers -- `claude mcp add`, `/mcp`, `.mcp.json`, scopes
- [ ] Skills + MCP -- skill orchestrating MCP tools
- [ ] Subagents -- `.claude/agents/` with frontmatter, chaining, parallel, resume
- [ ] Tasks -- TaskCreate, dependencies, `CLAUDE_CODE_TASK_LIST_ID`
- [ ] TDD -- test-first development cycle
- [ ] SubagentStop hooks -- verification of subagent output
- [ ] Git worktrees -- parallel development with multiple Claude instances
- [ ] Plugins -- manifest, skills, agents, hooks, `--plugin-dir`
- [ ] Evaluation -- test specs for skills and agents
- [ ] PermissionRequest hooks -- auto-approval for eval automation
- [ ] Continuous learning -- updated CLAUDE.md with project insights

---

## Tips

**Start small, then expand.** Do not try to build everything at once. Each
module builds on the last. If you get stuck, go back and make sure the
previous module's checkpoint is complete.

**Use plan mode liberally.** Before any significant change, switch to plan
mode and think it through. This is cheaper than fixing mistakes.

**Read the context files.** The `cc-self-train/context/` directory has detailed
reference docs for every CC feature: `claudemd.txt`, `skillsmd.txt`,
`hooks.txt`, `configure-hooks.txt`, `mcp.txt`, `skills-plus-mcp.txt`,
`subagents.txt`, `tasks.txt`, `plugins.txt`, `interactive-mode.txt`,
`boris-workflow.txt`.

**Commit often.** Small, focused commits make it easy to revert mistakes and
track progress.

**Use `/cost` regularly.** Context management is a skill. Watch how different
operations consume tokens and use `/compact` strategically.

**Keep CLAUDE.md up to date.** Every time you discover a pattern, convention,
or lesson, add it to your project memory. Future sessions benefit immediately.

**Test your hooks locally first.** Before adding a hook to settings.json, run
the script manually with sample JSON input to make sure it works. A broken
hook can block your workflow.

**Use `Ctrl+O` for debugging.** Verbose mode shows hook execution, tool calls,
and other details that are hidden by default. Toggle it when troubleshooting.

**Background tasks are powerful.** Use `Ctrl+B` to background long-running
operations (tests, builds, agents) and keep working on something else.

---

## What Is Next

You have built a complete personal dev toolkit and mastered every major Claude
Code feature. Here are paths forward:

- **Extend your toolkit:** Add features you actually want -- full-text search
  with stemming, a web UI, import from Notion/Obsidian. The forge is yours.
- **Try another project:** The other projects in `cc-self-train/` explore
  different domains while reinforcing the same CC features.
- **Share your plugin:** Distribute the knowledge-base plugin to your team or
  the community.
- **Build from scratch:** Take a project idea you have been putting off and
  build it with Claude Code. You now have the full toolkit.

The best way to solidify what you learned is to use it on real problems.
