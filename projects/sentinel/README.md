# Sentinel -- Code Analyzer & Test Generator

A hands-on project for learning Claude Code by building a real tool. You will construct a code analysis engine that scans source files for issues, generates tests, tracks coverage, and produces quality reports. Along the way, you will use every major Claude Code feature -- from CLAUDE.md and plan mode through subagents, tasks, plugins, and evaluation.

**Level:** Intermediate-Advanced
**Time:** 3-5 sessions (8-15 hours)
**Prerequisites:** Comfortable with at least one programming language, familiar with git basics. Prior Claude Code experience (e.g., Projects 1-3 from this curriculum) is helpful but not required.

## What You Will Build

Sentinel is a **code quality meta-tool** -- a tool that improves other code. When finished, it will:

- Recursively scan source files in any project directory
- Apply configurable analysis rules (complexity, naming, missing docs, unused imports)
- Report issues with severity, file location, and actionable messages
- Generate test cases for source files that lack coverage
- Track coverage over time and store historical data in SQLite
- Output reports in text, JSON, and HTML formats
- Expose all functionality through a CLI: `sentinel scan`, `sentinel rules`, `sentinel report`, `sentinel coverage`

## What You Will Learn (Claude Code Features)

| Module | CC Features |
|--------|------------|
| 1. Setup & First Contact | CLAUDE.md, /init, /memory, interactive mode, keyboard shortcuts |
| 2. Blueprint & Build | Plan mode, git integration, basic prompting |
| 3. Rules, Memory & Context | .claude/rules/, CLAUDE.local.md, @imports, /context, /compact, /cost |
| 4. Skills & Commands | SKILL.md, frontmatter, custom slash commands, hot-reload, disable-model-invocation |
| 5. Hooks | SessionStart, PostToolUse, Stop hooks, matchers, settings.json |
| 6. MCP Servers | MCP servers, .mcp.json, scopes, skills+MCP, claude mcp add |
| 7. Guard Rails | PreToolUse, hook decision control, permissionDecision, additionalContext, updatedInput |
| 8. Subagents | .claude/agents/, subagent frontmatter, chaining, parallel, background |
| 9. Tasks & TDD | Tasks, dependencies, cross-session, TDD loops, SubagentStop |
| 10. Parallel Dev, Plugins & Eval | Worktrees, plugins, eval, PermissionRequest hooks, continuous learning |

---

## Set Up Your Dev Environment

Before starting Module 1, make sure your language toolchain is ready. Sentinel works in **any language** -- pick whichever you are most comfortable with.

| Language | Requirements | Quick check |
|----------|-------------|-------------|
| **Python** | Python 3.10+, pip/conda/uv | `python --version` |
| **TypeScript** | Node.js 18+, npm/pnpm/yarn | `node --version` |
| **Go** | Go 1.21+ | `go version` |
| **Rust** | Rust 1.70+ via rustup | `rustc --version` |
| **Docker** | Optional -- any project works in a container | `docker --version` |

Install links: [Python](https://python.org) | [Node.js](https://nodejs.org) | [Go](https://go.dev/dl/) | [Rust](https://rustup.rs)

### Environment Isolation

**Environment isolation:** If you chose an environment during `/start` (venv, conda, or Docker), it's already set up in your project directory. If you skipped it and want to add one later, ask Claude: "Help me set up [venv/conda/Docker] for this project."

### Git

```
git --version
```

If missing: [git-scm.com/downloads](https://git-scm.com/downloads)

### Coverage tools (needed in Module 9)

| Language | Coverage Tool |
|----------|--------------|
| Python | `coverage` or `pytest-cov` |
| TypeScript | `c8`, `istanbul`, or built-in via `vitest --coverage` |
| Go | Built-in: `go test -cover` |
| Rust | `cargo-tarpaulin` or `cargo-llvm-cov` |

### Claude Code

```
npm install -g @anthropic-ai/claude-code
claude --version
```

You need an [Anthropic API key](https://console.anthropic.com/) or a Max subscription.

---

## Module 1 -- Setup & First Contact

**CC features:** CLAUDE.md, /init, /memory, interactive mode, keyboard shortcuts

> **Used `/start`?** Module 1 was completed during onboarding. Jump to [Module 2 -- Blueprint & Build](#module-2--blueprint--build).

In this module you create the sentinel project, initialize it with Claude Code, and learn the fundamentals of interactive mode.

### Step 1: Create your project directory

Create the project directory inside cc-self-train under `workspace/`:

```
mkdir -p workspace/sentinel
cd workspace/sentinel
git init
```

### Step 2: Launch Claude Code

```
claude
```

Claude starts in interactive mode. You are now inside the Claude Code REPL.

### Step 3: Run /init

Type this inside Claude Code:

```
/init
```

Claude will scan your (empty) project and generate a `CLAUDE.md` file. Since the project is new, the file will be minimal. That is fine -- you will build it up.

### Step 4: Tour of CLAUDE.md

Open the generated CLAUDE.md and read it. This file is Claude's persistent memory for your project. Everything you put here, Claude reads at the start of every session.

Ask Claude to explain what CLAUDE.md does:

```
What is CLAUDE.md and how does Claude Code use it? Explain the memory hierarchy.
```

Claude should explain the four memory levels: managed policy, project memory (CLAUDE.md), project rules (.claude/rules/), user memory (~/.claude/CLAUDE.md), and local project memory (CLAUDE.local.md).

### Step 5: Keyboard shortcuts

Try each of these shortcuts now. Do not skip this -- muscle memory matters.

| Shortcut | What it does | Try it now |
|----------|-------------|------------|
| `Tab` | Accept Claude's suggestion or autocomplete | Type a partial word and press Tab |
| `Shift+Tab` | Toggle between normal mode, plan mode, and auto-accept mode | Press it twice to cycle through modes |
| `Ctrl+C` | Cancel current generation or input | Press while Claude is responding |
| `Ctrl+L` | Clear terminal screen (keeps conversation) | Press it -- notice history is preserved |
| `@` | File path mention / autocomplete | Type `@` and start typing a filename |
| `!` | Bash mode -- run a shell command directly | Type `! git status` |
| `Shift+Enter` or `\` + `Enter` | Multiline input | Start a multi-line prompt |
| `Esc Esc` | Rewind conversation/code to a previous point | Double-tap Escape |
| `Ctrl+O` | Toggle verbose output | Shows detailed tool usage |
| `Ctrl+R` | Reverse search through command history | Search your previous prompts |

### Step 6: Explore /memory

Type this in Claude Code:

```
/memory
```

This opens your CLAUDE.md in your system editor. Add these lines:

```
# Sentinel Project

## About
Code analyzer and test generator CLI tool.

## Commands
- Build: (fill in when you have a build command)
- Test: (fill in when you have a test command)
- Lint: (fill in when you have a lint command)
```

Save and close the editor. Claude now has this context for every future session.

### Step 7: First conversation

Ask Claude something about your project plan:

```
I am building a code analyzer called Sentinel. It will scan source files for
quality issues, generate tests, and track coverage. What would be a good
high-level architecture for this kind of tool?
```

Read the response. You do not need to act on it yet -- Module 2 is where you plan and build.

### Checkpoint

- [ ] `workspace/sentinel/` directory exists with `git init` completed
- [ ] CLAUDE.md exists (generated by /init, then edited via /memory)
- [ ] You tried all keyboard shortcuts from the table above
- [ ] You successfully ran `/memory` and edited CLAUDE.md
- [ ] You had at least one conversation with Claude about the project

---

## Module 2 -- Blueprint & Build

**CC features:** Plan mode, git integration, basic prompting

In this module you design Sentinel's architecture in plan mode, then switch to execution mode to build the core.

### Step 1: Enter plan mode

Press `Shift+Tab` until you see the mode indicator switch to **Plan Mode**. In plan mode, Claude reasons about architecture and design without making any file changes. This is read-only exploration.

Alternatively, type:

```
/plan
```

### Step 2: Design the architecture

Give Claude this prompt in plan mode:

```
Design the architecture for Sentinel, a code analyzer CLI. It needs these
components:

1. File scanner: recursively find source files, filter by extension
2. Parser: parse source files into analyzable structures (can be regex-based
   or AST-based depending on language)
3. Rule engine: configurable rules with categories -- complexity threshold,
   naming conventions, missing documentation, unused imports
4. Issue reporter: collect issues with severity (error/warning/info),
   file location (file, line, column), and message
5. Report generator: output as plain text, JSON, or HTML
6. CLI interface with these commands:
   - sentinel scan <path> [--rules <ruleset>] [--format text|json|html]
   - sentinel rules list
   - sentinel rules add <name>
   - sentinel report [--format text|json|html]
   - sentinel config [--show | --set key=value]

Show me a directory structure and explain how the components connect.
```

Claude will produce a detailed plan. Read through it carefully.

### Step 3: Iterate on the plan

Ask follow-up questions while still in plan mode:

```
How should rules be defined? I want users to be able to add custom rules
without modifying the core engine. What format should rule definitions use?
```

And:

```
How should the issue reporter handle large codebases with thousands of
findings? Should it stream results or batch them?
```

### Step 4: Exit plan mode and execute

Press `Shift+Tab` to switch back to normal mode. Now tell Claude to build:

```
Create the project structure based on the plan we just discussed. Set up
the directory layout, the entry point, and stub out the main modules with
docstrings/comments explaining what each one does. Do not implement the
full logic yet -- just the skeleton.
```

Claude will create files. Review each one before accepting.

### Step 5: Create a feature branch

```
! git add -A
! git commit -m "Initial project skeleton"
! git checkout -b feature/core
```

Or ask Claude to do it:

```
Create a feature branch called feature/core and commit the project skeleton.
```

### Step 6: Implement the file scanner and basic rule engine

```
Implement the file scanner module. It should:
- Accept a root path
- Recursively walk the directory tree
- Filter files by configurable extensions (e.g., .py, .ts, .go, .rs)
- Skip hidden directories and common ignore patterns (node_modules, .git,
  __pycache__, target, dist)
- Return a list of file paths with metadata (size, extension, relative path)

Then implement a basic rule engine with at least two rules:
- A "function too long" rule that flags functions exceeding N lines
- A "missing docstring" rule that flags public functions without documentation
```

### Step 7: Write and run tests

```
Write tests for the file scanner and the two rules. Use the standard test
framework for this language. Include:
- Test with a fixture directory containing known files
- Test that hidden directories are skipped
- Test that extension filtering works
- Test that each rule correctly identifies violations
- Test that each rule passes clean code

Then run the tests.
```

Watch Claude write tests, execute them with `!`, fix failures, and re-run. This is the build-test-fix-commit cycle.

### Step 8: Implement the CLI

```
Implement the CLI interface with at least these commands:
- sentinel scan <path> -- runs analysis and prints results
- sentinel rules list -- shows available rules

Use the standard CLI framework for this language. Wire it up to the scanner
and rule engine we just built.
```

### Step 9: Manual test

```
! sentinel scan .
```

Or the equivalent command for your language. Scan the sentinel project itself and see what the analyzer finds.

### Step 10: Commit and merge

```
Commit all changes on feature/core, then merge back to main.
```

### Checkpoint

- [ ] You used plan mode to design the architecture before writing code
- [ ] The project has a clear directory structure with separate modules
- [ ] File scanner works and filters by extension
- [ ] At least two analysis rules are implemented and tested
- [ ] CLI runs `sentinel scan <path>` and prints results
- [ ] All tests pass
- [ ] Changes are committed and merged to main

---

## Module 3 -- Rules, Memory & Context

**CC features:** .claude/rules/, CLAUDE.local.md, @imports, /context, /compact, /cost

In this module you learn how to give Claude structured, persistent instructions that apply to specific parts of your codebase.

### Step 1: Create path-scoped rules

Create the `.claude/rules/` directory in your sentinel project:

```
Create a .claude/rules/ directory with these rule files:

1. analyzers.md -- scoped to analyzer/rule modules with this frontmatter:
   ---
   paths:
     - "**/analyzers/**"
     - "**/rules/**"
   ---
   Content: "Each analyzer must implement a common interface. All analyzers
   return structured Issue objects with severity, location, and message fields.
   Analyzers must be stateless -- they receive a file and return issues."

2. reporters.md -- scoped to reporter/formatter modules:
   ---
   paths:
     - "**/reporters/**"
     - "**/formatters/**"
   ---
   Content: "Reporters must support streaming output for large codebases.
   Each reporter implements a common interface with start(), report_issue(),
   and finish() methods (or equivalent)."

3. tests.md -- scoped to test files:
   ---
   paths:
     - "**/test*/**"
     - "**/*test*"
   ---
   Content: "Test each rule independently using fixture files with known
   issues. Never test against live/changing source files. Each test file
   should test exactly one module."
```

### Step 2: Create CLAUDE.local.md

Create a `CLAUDE.local.md` file in the project root. This file is for your personal preferences and is automatically added to .gitignore:

```
Create a CLAUDE.local.md file with my personal preferences:
- I prefer verbose test output
- My local test fixtures are in tests/fixtures/
- When generating reports, default to JSON format for my local testing
```

### Step 3: Understand the memory hierarchy

Ask Claude:

```
Show me the full memory hierarchy for this project. What files are loaded,
in what order, and which ones take precedence?
```

Claude should describe: managed policy (if any) -> user memory (~/.claude/CLAUDE.md) -> project memory (CLAUDE.md) -> project rules (.claude/rules/*.md) -> local project memory (CLAUDE.local.md).

### Step 4: Use @imports

Create documentation files that CLAUDE.md will import:

```
Create docs/rule-format.md describing the format for custom rules (how to
define a new rule, what fields are required, an example).

Then create docs/architecture.md with a brief architecture overview.

Then update CLAUDE.md to import both files using @-syntax:
  See @docs/rule-format.md for the rule definition format.
  See @docs/architecture.md for the system architecture.
```

### Step 5: Check context usage with /context

Type in Claude Code:

```
/context
```

This shows a colored grid representing how much of Claude's context window is used. Notice how memory files, rules, and conversation history all consume context.

### Step 6: Manage context with /compact

```
/compact Focus on the rule engine and analyzer modules
```

This compacts the conversation, keeping the parts most relevant to your focus instruction. Useful when your context window fills up during long sessions.

### Step 7: Check costs with /cost

```
/cost
```

This shows your token usage statistics for the current session. Get in the habit of checking this periodically.

### Step 8: Build a new rule using these tools

Now put it all together. Build a new analysis rule while Claude has all this context loaded:

```
Add a new analyzer rule: "function too complex" that estimates cyclomatic
complexity. It should:
- Count decision points (if, else, for, while, case, catch, &&, ||)
- Flag functions exceeding a configurable threshold (default: 10)
- Follow the interface defined in @docs/rule-format.md
- Follow the conventions in .claude/rules/analyzers.md
- Include tests per .claude/rules/tests.md
```

### Checkpoint

- [ ] `.claude/rules/` directory exists with at least 3 path-scoped rule files
- [ ] `CLAUDE.local.md` exists and is in .gitignore
- [ ] `CLAUDE.md` uses `@imports` to reference docs/rule-format.md and docs/architecture.md
- [ ] You ran `/context` and understood the context grid
- [ ] You ran `/compact` with a focus instruction
- [ ] You ran `/cost` to check token usage
- [ ] A new analyzer rule was built following the path-scoped conventions

---

## Module 4 -- Skills & Commands

**CC features:** SKILL.md, frontmatter, custom slash commands, hot-reload, argument substitution, disable-model-invocation

In this module you create reusable skills that extend what Claude can do in your project.

### Step 1: Create the "analyze" skill

```
Create a skill at .claude/skills/analyze/SKILL.md with this content:

---
name: analyze
description: Run Sentinel analysis on a given path with configurable rules. Use when the user wants to analyze code quality.
argument-hint: <path> [--rules <ruleset>]
---

Run Sentinel code analysis on $ARGUMENTS.

1. Execute the scan command on the specified path
2. If specific rules are mentioned, filter to those rules only
3. Summarize the findings: total issues by severity, top 3 most common issues
4. If there are errors (not just warnings), list them first
5. Suggest fixes for the top issues found
```

Test it:

```
/analyze src/
```

### Step 2: Create the "generate-tests" skill

```
Create a skill at .claude/skills/generate-tests/SKILL.md with this content:

---
name: generate-tests
description: Generate test cases for a given source file. Analyzes the file, identifies untested paths, and creates comprehensive tests.
argument-hint: <source-file>
context: fork
---

Generate comprehensive tests for the file: $ARGUMENTS

1. Read the source file and identify all public functions/methods
2. For each function, identify:
   - Happy path cases
   - Edge cases (empty input, null, boundary values)
   - Error cases
3. Generate test code following the project test conventions
4. Include setup and teardown if needed
5. Run the tests to verify they pass
```

Notice `context: fork` -- this skill runs in a subagent so it does not clutter your main conversation. Test it:

```
/generate-tests src/rules/complexity.py
```

(Replace with the actual path to one of your rule modules.)

### Step 3: Create the "quality-report" skill

```
Create a skill at .claude/skills/quality-report/SKILL.md:

---
name: quality-report
description: Generate a comprehensive quality report for the project
disable-model-invocation: true
argument-hint: [--format text|json|html]
---

Generate a comprehensive quality report for the Sentinel project:

1. Run a full scan of the source directory
2. Collect all findings by category and severity
3. Calculate summary statistics: total files, total issues, issues per file
4. Generate the report in the requested format (default: text)
5. Save the report to reports/ directory with a timestamp in the filename
6. Print a summary to the console
```

Notice `disable-model-invocation: true` -- this skill only runs when you explicitly type `/quality-report`. Claude will not trigger it automatically.

### Step 4: Use custom slash commands with arguments

Test argument substitution:

```
/analyze src/rules/
```

```
/generate-tests src/scanner.py
```

```
/quality-report --format json
```

The `$ARGUMENTS` placeholder captures everything after the skill name. You can also use positional arguments like `$0`, `$1` for more structured inputs.

### Step 5: Hot-reload skills

Edit one of your SKILL.md files (add a new step or change the description). You do not need to restart Claude Code -- skills are reloaded when invoked. Test by modifying the analyze skill and running `/analyze src/` again.

### Step 6: Create a no-AI skill

Create a skill that runs without invoking the AI model:

```
Create a skill at .claude/skills/list-rules/SKILL.md:

---
name: list-rules
description: List all available analysis rules
disable-model-invocation: true
---

!sentinel rules list
```

This skill just executes a shell command. No AI processing needed. Test it:

```
/list-rules
```

### Checkpoint

- [ ] `/analyze` skill exists and works with path arguments
- [ ] `/generate-tests` skill exists, runs in a forked context, and produces tests
- [ ] `/quality-report` skill exists with disable-model-invocation: true
- [ ] You tested argument substitution ($ARGUMENTS) in at least one skill
- [ ] You edited a skill and saw hot-reload work without restarting
- [ ] `/list-rules` works as a no-AI skill

---

## Module 5 -- Hooks

**CC features:** SessionStart, PostToolUse, Stop hooks, matchers, hook scripting, settings.json

In this module you add automation that fires at key moments during your Claude Code session.

### Step 1: Understand the hook lifecycle

Ask Claude:

```
Explain the Claude Code hook lifecycle. What hooks are available, when does
each one fire, and how do they communicate back to Claude Code?
```

The key hooks are: SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse, Stop, SubagentStop, and SessionEnd. Each receives JSON via stdin and communicates via exit codes and stdout/stderr.

### Step 2: Create a SessionStart hook

This hook injects a project quality summary every time you start a session.

First, create the hook script. Ask Claude:

```
Create a script at .claude/scripts/session-summary.sh (or .py, or whatever
language you prefer) that:
1. Runs the sentinel scan command on the src/ directory
2. Counts total issues by severity
3. Prints a short summary like:
   "Sentinel Status: 3 errors, 12 warnings, 5 info across 24 files"
4. If tests have been run recently, include pass/fail count
Make it executable.
```

Then configure it in `.claude/settings.json`:

```
Create or update .claude/settings.json with a SessionStart hook that runs
our session-summary script. The stdout of SessionStart hooks is automatically
added to Claude's context.
```

The configuration should look like:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/scripts/session-summary.sh"
          }
        ]
      }
    ]
  }
}
```

Restart Claude Code and verify you see the summary injected at session start.

### Step 3: Create a PostToolUse hook

This hook auto-validates rule configuration files after Claude writes them:

```
Create a script at .claude/scripts/validate-rules.sh that:
1. Reads the JSON hook input from stdin
2. Checks if the written file is in the rules/ directory
3. If so, validates the file has the required structure (whatever your
   rule format requires)
4. Exits 0 if valid, exits 2 with an error message if invalid

Then add a PostToolUse hook to .claude/settings.json that triggers on
"Write|Edit" and runs this validation script.
```

The settings.json entry:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/scripts/validate-rules.sh"
          }
        ]
      }
    ]
  }
}
```

### Step 4: Create a Stop hook

This hook checks whether tests were updated when code changes were made:

```
Add a prompt-based Stop hook to .claude/settings.json. The prompt should
check if the task involved writing or modifying code, and if so, verify
that tests were updated. If tests were not updated, respond with ok: false
and a reason. Otherwise ok: true.
```

The hook uses `"type": "prompt"` instead of `"type": "command"`. Claude Code sends the prompt to a fast LLM (Haiku) which returns a JSON decision.

### Step 5: Test your hooks

Restart Claude Code (to load the hooks). Then:

1. Verify SessionStart hook prints the quality summary
2. Ask Claude to create a new analysis rule -- verify the PostToolUse hook validates it
3. Ask Claude to modify some code -- verify the Stop hook checks for tests

### Step 6: Inspect hooks with /hooks

Type in Claude Code:

```
/hooks
```

This shows all registered hooks and lets you review or approve changes.

### Checkpoint

- [ ] `.claude/settings.json` exists with hook configuration
- [ ] SessionStart hook injects a quality summary at session start
- [ ] PostToolUse hook validates rule files after writes
- [ ] Stop hook verifies tests are updated when code changes
- [ ] You restarted Claude Code and saw hooks in action
- [ ] You ran `/hooks` to inspect the registered hooks

---

## Module 6 -- MCP Servers

**CC features:** MCP servers, .mcp.json, scopes, skills+MCP, claude mcp add

In this module you connect Claude to external tools through the Model Context Protocol.

### Step 1: What is MCP

Ask Claude:

```
What is the Model Context Protocol? How do MCP servers extend Claude Code's
capabilities?
```

MCP servers give Claude access to external tools, databases, and APIs through a standardized protocol. Claude can call MCP tools just like its built-in tools (Read, Write, Bash, etc.).

### Step 2: Add a SQLite MCP server

You will use SQLite to store analysis results, coverage history, and trend data. Add the SQLite MCP server:

```
claude mcp add --transport stdio sentinel-db -- npx -y @anthropic-ai/mcp-server-sqlite --db-path ./sentinel.db
```

On Windows, you may need:

```
claude mcp add --transport stdio sentinel-db -- cmd /c npx -y @anthropic-ai/mcp-server-sqlite --db-path ./sentinel.db
```

### Step 3: Add a filesystem MCP server

```
claude mcp add --transport stdio sentinel-fs -- npx -y @anthropic-ai/mcp-server-filesystem ./
```

On Windows:

```
claude mcp add --transport stdio sentinel-fs -- cmd /c npx -y @anthropic-ai/mcp-server-filesystem ./
```

### Step 4: Verify with /mcp

Inside Claude Code:

```
/mcp
```

You should see both `sentinel-db` and `sentinel-fs` listed as connected servers.

### Step 5: Use the SQLite MCP server

Ask Claude to set up the database schema:

```
Using the sentinel-db MCP server, create tables for:
1. scan_results: id, timestamp, target_path, total_files, total_issues,
   errors, warnings, info
2. issues: id, scan_id, file_path, line, column, rule_name, severity,
   message
3. coverage: id, timestamp, target_path, total_lines, covered_lines,
   coverage_pct

Then insert a sample scan result from the last time we ran sentinel scan.
```

Claude will use the MCP SQLite tools (like `mcp__sentinel-db__query`) to create tables and insert data.

### Step 6: Create a project-scoped .mcp.json

Ask Claude to create a `.mcp.json` file so team members get the same MCP setup:

```
Create a .mcp.json file in the project root with the sentinel-db and
sentinel-fs server configurations. Use project scope so the file can be
committed to version control.
```

### Step 7: Understand MCP scopes

Ask Claude:

```
Explain MCP server scopes: local, project, and user. When should I use each
one? Where is each configuration stored?
```

- **Local** (default): private to you, stored in ~/.claude.json under your project path
- **Project**: shared via `.mcp.json` in the project root, committed to version control
- **User**: available across all your projects, stored in ~/.claude.json

### Step 8: Create a skill that uses MCP

Create a skill that queries SQLite for historical data:

```
Create a skill at .claude/skills/coverage-trend/SKILL.md:

---
name: coverage-trend
description: Show coverage trends over time using historical data from the SQLite database. Use when the user asks about coverage history or trends.
argument-hint: [--last N]
---

Query the sentinel-db MCP server for coverage trends:

1. Query the coverage table for the most recent entries (default: last 10,
   or use $ARGUMENTS to specify)
2. Show a text-based trend chart (ASCII sparkline or table)
3. Highlight any coverage regressions (drops of more than 2%)
4. Summarize: current coverage, trend direction, best/worst modules

Use the mcp__sentinel-db__query tool to run SQL queries.
```

Test it:

```
/coverage-trend --last 5
```

### Checkpoint

- [ ] SQLite MCP server is connected (verify with `/mcp`)
- [ ] Filesystem MCP server is connected
- [ ] Database tables exist for scan_results, issues, and coverage
- [ ] `.mcp.json` exists in the project root with server configurations
- [ ] `/coverage-trend` skill works and queries the SQLite database
- [ ] You understand the three MCP scopes (local, project, user)

---

## Module 7 -- Guard Rails

**CC features:** PreToolUse, hook decision control, prompt-based hooks, permissionDecision, additionalContext, updatedInput

In this module you build hooks that act as guardrails -- preventing bad actions, injecting context, and modifying inputs before tools execute.

### Step 1: Understand PreToolUse decision control

Ask Claude:

```
Explain PreToolUse hook decision control. What are the permissionDecision
options (allow, deny, ask) and how do additionalContext and updatedInput
work?
```

PreToolUse hooks can return JSON with:
- `permissionDecision: "allow"` -- auto-approve the tool call
- `permissionDecision: "deny"` -- block the tool call, with a reason shown to Claude
- `permissionDecision: "ask"` -- prompt the user to confirm
- `additionalContext` -- inject extra information into Claude's context
- `updatedInput` -- modify the tool's input parameters before execution

### Step 2: Guard against invalid rule schemas

Create a hook that prevents saving analysis rules that do not follow the required schema:

```
Create a script at .claude/scripts/validate-rule-schema.sh that:
1. Reads the PreToolUse JSON input from stdin
2. Checks if the file being written is in the rules/ or analyzers/ directory
3. If so, validates the content has the required fields for a rule definition
4. If invalid, output JSON with permissionDecision: "deny" and a reason
5. If valid, exit 0 (allow normal permission flow)

Add it as a PreToolUse hook on "Write" in .claude/settings.json.
```

A denial returns JSON like: `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Rule file missing required 'severity' field."}}`

### Step 3: Inject context about related analyzers

Create a hook that adds context when Claude reads a rule file:

```
Create a script at .claude/scripts/inject-rule-context.sh that:
1. Reads the PreToolUse JSON input from stdin
2. Checks if the tool is "Read" and the file is in the rules/ directory
3. If so, find all related analyzer files and output JSON with
   additionalContext listing them
4. This helps Claude understand the full picture when working on rules

Add it as a PreToolUse hook on "Read" in .claude/settings.json.
```

The output uses `additionalContext` to inject text like: "Related analyzers: complexity_rule, naming_rule, docstring_rule. See docs/rule-format.md for the rule interface."

### Step 4: Auto-add metadata to generated test files

Create a hook that modifies the input when Claude writes test files:

```
Create a script at .claude/scripts/add-test-metadata.sh that:
1. Reads the PreToolUse JSON input from stdin
2. Checks if the file being written is a test file (matches test patterns)
3. If so, prepend a metadata comment to the file content using updatedInput
4. The metadata should include: generation timestamp, source file being tested

Add it as a PreToolUse hook on "Write" in .claude/settings.json.
```

The output uses `updatedInput` to modify the file content before it is written, prepending a metadata header with the timestamp and source file path.

### Step 5: Prompt-based quality gate for generated tests

Add a second prompt-based Stop hook that specifically reviews test quality:

```
Add a Stop hook (type: prompt, timeout: 30) that checks if tests were
generated, and if so evaluates: 1) edge case coverage, 2) meaningful
assertions (not just "assert true"), 3) test independence. Returns ok: false
with a reason if quality issues are found.
```

This demonstrates stacking multiple Stop hooks -- the Module 5 hook checks that tests exist, this one checks that they are good.

### Step 6: Test the guard rails

1. Try to create a rule file with missing fields -- the deny hook should block it
2. Read a rule file -- check that additional context is injected
3. Generate a test file -- check that metadata is added
4. Complete a task involving tests -- the Stop hook should review quality

### Checkpoint

- [ ] PreToolUse hook denies writes of invalid rule schemas
- [ ] PreToolUse hook injects additionalContext when reading rule files
- [ ] PreToolUse hook uses updatedInput to add metadata to test files
- [ ] Prompt-based Stop hook reviews test quality
- [ ] All hooks are configured in `.claude/settings.json`
- [ ] You tested each guard rail and saw it work

---

## Module 8 -- Subagents

**CC features:** .claude/agents/, subagent frontmatter, chaining, parallel, background, resuming

In this module you create specialized AI agents that handle specific tasks within Sentinel.

### Step 1: What are subagents

Ask Claude:

```
What are Claude Code subagents? How do they differ from the main
conversation? When should I use a subagent vs the main conversation?
```

Key points: subagents run in their own context window with a custom system prompt and specific tool access. They keep verbose output out of your main conversation. They cannot spawn other subagents.

### Step 2: Create the analyzer agent

```
Create .claude/agents/analyzer-agent.md with frontmatter:
  name: analyzer-agent
  description: Deep code analysis specialist. Use for thorough code analysis.
  tools: Read, Grep, Glob, Bash
  model: sonnet

System prompt: analyze target files, run Sentinel scanner, perform deeper
analysis on each issue (true/false positive, severity assessment, specific
fix suggestions), group by category and severity. Focus on precision over
volume.
```

### Step 3: Create the test writer agent

```
Create .claude/agents/test-writer-agent.md with frontmatter:
  name: test-writer-agent
  description: Test generation specialist. Use for comprehensive test suites.
  tools: Read, Write, Edit, Bash, Grep, Glob
  model: sonnet

System prompt: read target source files, identify all public functions,
generate tests covering happy paths, edge cases, and error conditions.
Follow .claude/rules/tests.md conventions. Run tests and fix failures.
Report test count, pass/fail status, and estimated coverage gain.
```

### Step 4: Create the reporter agent

```
Create .claude/agents/reporter-agent.md with frontmatter:
  name: reporter-agent
  description: Report formatting specialist. Use for quality reports.
  tools: Read, Write, Bash, Glob
  model: haiku

System prompt: gather analysis data, format as text/JSON/HTML. HTML reports
include summary metrics, issue distribution tables, severity color coding.
Save to reports/ directory.
```

Note that the reporter agent uses `model: haiku` since formatting tasks do not need the most powerful model.

### Step 5: Understand frontmatter options

Ask Claude:

```
What frontmatter fields are available for subagents? Explain: name,
description, tools, disallowedTools, model, permissionMode, skills, hooks.
```

### Step 6: Chain agents

Ask Claude to chain the analyzer and test writer:

```
Use the analyzer-agent to analyze the src/rules/ directory. Then use the
test-writer-agent to generate tests for any files that the analyzer
identified as having issues.
```

Claude will run the analyzer agent first, receive its findings, then pass relevant context to the test writer agent. This is **chaining**: the output of one agent feeds into the next.

### Step 7: Run agents in parallel and background

```
In parallel, use separate subagents to:
1. Analyze src/scanner/ for code quality
2. Analyze src/rules/ for code quality
3. Analyze src/reporters/ for code quality

Run them in the background so I can continue working.
```

Press `Ctrl+B` if Claude starts a foreground agent and you want to move it to the background. Use `/tasks` to see running background tasks.

### Step 8: Resume a subagent

After a subagent completes, you can resume it to continue its work:

```
Continue the analyzer-agent from the previous analysis and now also check
for security issues in the same files.
```

Claude resumes the agent with its full conversation history intact.

### Checkpoint

- [ ] `.claude/agents/` directory has analyzer-agent.md, test-writer-agent.md, reporter-agent.md
- [ ] Each agent has appropriate frontmatter (name, description, tools, model)
- [ ] You chained analyzer -> test-writer successfully
- [ ] You ran agents in parallel or background
- [ ] You resumed a completed agent to continue its work
- [ ] You understand when to use subagents vs the main conversation

---

## Module 9 -- Tasks & TDD

**CC features:** Tasks, dependencies, cross-session, TDD loops, SubagentStop

In this module you use the Tasks system for multi-step work and practice strict TDD.

### Step 1: Tasks system overview

Ask Claude:

```
Explain the Claude Code Tasks system. How do tasks differ from the old
TodoWrite? What are task dependencies, and how do tasks persist across
sessions?
```

Key points: Tasks support dependency graphs (task B depends on task A). They are stored in `~/.claude/tasks/` on the filesystem. Multiple sessions or subagents can share a task list using `CLAUDE_CODE_TASK_LIST_ID`.

### Step 2: Cross-session task persistence

Ask Claude to create a task list for adding coverage tracking:

```
Create a task list for adding coverage tracking to Sentinel. Break it into
5 dependent tasks:
1. Design coverage data model (no dependencies)
2. Implement coverage parser (depends on 1)
3. Integrate coverage parser with analyzer engine (depends on 2)
4. Add coverage data to reports (depends on 3)
5. Historical coverage trends with SQLite (depends on 3, 4)

Show the dependency graph.
```

Claude will use the Tasks system to create these. Press `Ctrl+T` to toggle the task list view in your terminal.

### Step 3: Start the first task

```
Start working on Task 1: Design the coverage data model.
```

Claude will update the task status and begin working. When it finishes, the task will be marked complete and Task 2 will become unblocked.

### Step 4: Practice strict TDD -- build the coverage parser

For Task 2, use strict test-driven development:

```
Implement the coverage parser using strict TDD. Follow this cycle exactly:

1. Write ONE failing test for the simplest behavior
2. Run the test -- confirm it fails
3. Write the MINIMUM code to make it pass
4. Run the test -- confirm it passes
5. Refactor if needed
6. Repeat

Start with: "the parser can read a coverage report file and return the
total line count."
```

Watch Claude go through multiple red-green-refactor cycles. This is where the build-test-fix loop becomes second nature.

Continue through progressively harder tests:

```
Next test: the parser extracts per-file coverage data.
```

```
Next test: the parser handles missing or malformed coverage files gracefully.
```

```
Next test: the parser calculates coverage percentage correctly including
edge cases (zero lines, 100% coverage, empty files).
```

### Step 5: Complete the remaining tasks

Work through Tasks 3-5, letting Claude update task status as each completes:

```
Move on to the next unblocked task and implement it.
```

Check the task list periodically with `Ctrl+T` or:

```
Show me the current status of all tasks.
```

### Step 6: SubagentStop hooks for verification

Add a SubagentStop hook that verifies subagent output quality:

```
Add a prompt-based SubagentStop hook to .claude/settings.json that checks
whether any subagent that wrote code also ran the test suite. If tests were
not run, the hook should respond with ok: false and a reason directing the
subagent to run tests before completing.
```

### Step 7: Cross-session collaboration

Start a second Claude Code session that shares the same task list:

```
CLAUDE_CODE_TASK_LIST_ID=sentinel-coverage claude
```

In the second session, you can see the same tasks and their current statuses. If one session completes a task, the other session sees the update.

### Checkpoint

- [ ] Tasks were created with dependencies (task graph, not flat list)
- [ ] You built the coverage parser using strict TDD (red-green-refactor)
- [ ] All 5 tasks are complete with coverage tracking integrated
- [ ] SubagentStop hook verifies subagents run tests
- [ ] You understand cross-session task sharing via CLAUDE_CODE_TASK_LIST_ID
- [ ] `Ctrl+T` shows the task list in the terminal

---

## Module 10 -- Parallel Dev, Plugins & Evaluation

**CC features:** Worktrees, plugins, eval, PermissionRequest hooks, continuous learning

In this final module you learn advanced patterns for scaling your workflow.

### Step 1: Git worktrees

Git worktrees let you have multiple working copies of the same repo. Each worktree can have its own Claude Code session working on a different feature simultaneously.

```
! git worktree add ../sentinel-coverage-html feature/coverage-html
! git worktree add ../sentinel-rule-import feature/rule-import
```

Now you have three working copies:
- `sentinel/` -- main development
- `sentinel-coverage-html/` -- HTML coverage reports
- `sentinel-rule-import/` -- importing rules from external files

### Step 2: Multiple Claude Code instances with shared tasks

Open separate terminal windows and start Claude Code in each worktree:

Terminal 1:
```
cd sentinel-coverage-html
CLAUDE_CODE_TASK_LIST_ID=sentinel-parallel claude
```

Terminal 2:
```
cd sentinel-rule-import
CLAUDE_CODE_TASK_LIST_ID=sentinel-parallel claude
```

Create tasks in one session:

```
Create two independent tasks:
1. Add HTML coverage report with charts and drill-down (no dependencies)
2. Add rule import from YAML/JSON files (no dependencies)
```

Each session picks up a different task. They work in parallel on separate branches, sharing task status.

### Step 3: Build a plugin

Bundle your Sentinel skills, agents, and hooks into a distributable plugin:

```
Create a plugin called "quality-tools" that packages all skills from
.claude/skills/, all agents from .claude/agents/, hooks from
.claude/settings.json, and the SQLite MCP config. Use this structure:

quality-tools/
  .claude-plugin/plugin.json    # manifest (name, description, version)
  skills/                       # all SKILL.md dirs
  agents/                       # all agent .md files
  hooks/hooks.json              # guard rail hooks
  .mcp.json                     # SQLite MCP server
```

The manifest at `quality-tools/.claude-plugin/plugin.json` should include the name "quality-tools", a description, and version "1.0.0".

### Step 4: Test the plugin

```
claude --plugin-dir ./quality-tools
```

Verify that skills are available under the `quality-tools:` namespace:

```
/quality-tools:analyze src/
```

### Step 5: Build an evaluation framework

```
Create an evaluation framework for Sentinel:

1. eval/fixtures/ -- source files with known issues (planted bugs)
2. eval/expected/ -- expected analysis output for each fixture
3. eval/runner.sh (or .py) -- runs Sentinel on each fixture, compares to
   expected, and scores: true positive rate, false positive rate, false
   negative rate, severity accuracy
4. A summary report showing overall accuracy metrics

Run the evaluation and show results.
```

### Step 6: PermissionRequest hooks

```
Add a PermissionRequest hook to .claude/settings.json that auto-approves
running the test suite and sentinel scan, but still prompts for writes to
config files, git push, and destructive commands. Create a script at
.claude/scripts/auto-approve.sh that reads the hook input, checks the
command, and returns the appropriate allow/deny decision.
```

The hook matches on "Bash" and runs your approval script. The script outputs JSON with `{"hookSpecificOutput": {"hookEventName": "PermissionRequest", "decision": {"behavior": "allow"}}}` for safe commands.

### Step 7: Continuous learning

```
Create a continuous learning loop:
1. Log false positives/negatives from eval to eval/learning/misclassifications.jsonl
2. Add a SessionStart hook that loads recent misclassifications into context
3. After fixing a misclassification, re-run eval to confirm and check for regressions
4. Update CLAUDE.md with lessons learned
```

### Step 8: Clean up worktrees

After finishing parallel work:

```
! git worktree remove ../sentinel-coverage-html
! git worktree remove ../sentinel-rule-import
```

Merge the feature branches back to main.

### Checkpoint

- [ ] You created and used git worktrees for parallel development
- [ ] You ran multiple Claude Code instances sharing a task list
- [ ] `quality-tools` plugin is built with skills, agents, hooks, and MCP config
- [ ] Plugin works when loaded with `--plugin-dir`
- [ ] Evaluation framework exists with fixtures, expected output, and scoring
- [ ] PermissionRequest hook auto-approves safe operations
- [ ] Continuous learning loop logs misclassifications and feeds them back

---

## Final Verification Checklist

Review this checklist to confirm you have experienced every major Claude Code feature:

**Foundations (Modules 1-2)**
- [ ] Created CLAUDE.md with /init
- [ ] Used /memory to edit project memory
- [ ] Used plan mode to design before building
- [ ] Used git integration (branch, commit, merge) through Claude
- [ ] Tried all keyboard shortcuts from the Module 1 table

**Context Management (Module 3)**
- [ ] Created path-scoped rules in .claude/rules/
- [ ] Used CLAUDE.local.md for personal preferences
- [ ] Used @imports in CLAUDE.md
- [ ] Ran /context, /compact, and /cost

**Skills & Commands (Module 4)**
- [ ] Created at least 3 custom skills with SKILL.md
- [ ] Used argument substitution ($ARGUMENTS, $0, $1)
- [ ] Used disable-model-invocation for manual-only skills
- [ ] Used context: fork to run a skill in a subagent
- [ ] Verified hot-reload by editing a skill and re-running it

**Hooks (Modules 5, 7)**
- [ ] Configured SessionStart hook
- [ ] Configured PostToolUse hook with matcher
- [ ] Configured Stop hook (prompt-based)
- [ ] Used PreToolUse with permissionDecision (deny)
- [ ] Used PreToolUse with additionalContext
- [ ] Used PreToolUse with updatedInput
- [ ] Configured SubagentStop hook
- [ ] Configured PermissionRequest hook

**MCP (Module 6)**
- [ ] Added at least one MCP server with claude mcp add
- [ ] Used /mcp to check server status
- [ ] Created .mcp.json for project-scoped MCP config
- [ ] Created a skill that calls MCP tools

**Subagents (Module 8)**
- [ ] Created at least 3 custom subagents in .claude/agents/
- [ ] Chained subagents (output of one feeds into another)
- [ ] Ran subagents in parallel or background
- [ ] Resumed a completed subagent

**Tasks & TDD (Module 9)**
- [ ] Created tasks with dependencies
- [ ] Practiced strict TDD (red-green-refactor)
- [ ] Used cross-session task sharing with CLAUDE_CODE_TASK_LIST_ID
- [ ] Toggled task list with Ctrl+T

**Advanced (Module 10)**
- [ ] Used git worktrees with multiple Claude Code instances
- [ ] Built a plugin with .claude-plugin/plugin.json
- [ ] Created an evaluation framework with scoring
- [ ] Set up a continuous learning feedback loop

---

## Tips

- **Context is your most valuable resource.** Use `/compact` aggressively, use subagents for verbose operations, and keep CLAUDE.md focused.
- **Start with plan mode.** Press Shift+Tab before implementing non-trivial features. Think before you build.
- **Test early, test often.** The build-test-fix-commit cycle gives Claude concrete feedback. Always run tests before committing.
- **Use subagents for exploration.** Delegate searches and analysis to subagents to keep your main conversation clean.
- **Name your sessions.** Use `/rename sentinel-coverage-work` for easy `/resume` later.
- **Hooks time out at 60 seconds** by default. Set a custom `timeout` in hook config if you need more.
- **MCP tool names** follow the pattern `mcp__<server>__<tool>`. Use this in hook matchers.
- **Worktrees share git history.** Changes committed in one worktree are visible in all others.

**Reference docs** in `cc-self-train/context/` for deep dives:

| Topic | File |
|-------|------|
| CLAUDE.md / memory | `context/claudemd.txt` |
| Skills | `context/skillsmd.txt` |
| Hooks | `context/hooks.txt` |
| Hook configuration | `context/configure-hooks.txt` |
| Subagents | `context/subagents.txt` |
| Tasks | `context/tasks.txt` |
| MCP servers | `context/mcp.txt` |
| Skills + MCP | `context/skills-plus-mcp.txt` |
| Plugins | `context/plugins.txt` |
| Interactive mode | `context/interactive-mode.txt` |
| Workflow patterns | `context/boris-workflow.txt` |

---

## What's Next?

You have now used every major Claude Code feature. Here are paths forward:

**Extend Sentinel.** Add support for more languages, more rules, a web dashboard, CI integration, or GitHub PR comments via MCP.

**Try another project:** [Forge](../forge/) if you want to build a personal dev toolkit, or [Nexus](../nexus/) if you want to build a local API gateway. Both cover the same CC features through different domains.

**Build your own tools.** Take the patterns you learned -- skills, subagents, hooks, MCP, tasks -- and apply them to your real projects. Start with a CLAUDE.md and a few rules, then add skills and hooks as your workflow matures.

**Share your plugin.** If your quality-tools plugin is useful, publish it for others. Create a marketplace or share the directory. See `context/plugins.txt` for distribution details.

**Contribute back.** If you found bugs, had ideas for improvements, or wrote useful patterns during this project, contribute them to the cc-self-train repository. Open an issue or PR.
