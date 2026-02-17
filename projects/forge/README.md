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

> **Why this step:** Plan mode is one of Claude Code's most powerful features. It lets Claude analyze, reason, and design *without* touching any files. You always want to think before you build -- plan mode enforces that discipline.

Press `Shift+Tab` to switch to plan mode. You will see the mode indicator
change. In plan mode, Claude analyzes and plans without making changes. This
is where you design before you build.

Alternatively, type:

```
/plan
```

### 2.2 Design the Architecture

Now describe your dev toolkit to Claude. Tell it about the data types you want to manage -- notes, code snippets, bookmarks, templates -- and how you would want to interact with them from the CLI. Don't worry about getting the prompt perfect. Just describe your vision and let Claude ask clarifying questions.

Something like:

> "I want to build a CLI tool called forge that stores notes, code snippets, bookmarks, and templates. Help me design the architecture -- ask me questions about storage format, CLI commands, and data models. Don't write any code yet, just the plan."

Claude will probably ask about your storage preferences (JSON files vs SQLite), how you want IDs to work, and how search should behave. Answer naturally -- these are your design decisions. The back-and-forth is how you get a plan that actually fits your needs.

Once Claude produces a plan, read it carefully. Push back on anything you would do differently.

### 2.3 Review and Iterate

Still in plan mode, challenge the plan. Ask Claude about the trade-offs it made -- storage format, ID generation strategy, how search will work across types. If something feels over-engineered or too simple, say so. This is a design conversation, not a rubber stamp.

For example:

> "Why did you choose that storage format? What are the trade-offs vs the alternatives? And how will search work efficiently across all four types?"

Refine the plan until you are satisfied with the design.

> **STOP -- What you just did:** You used plan mode to design your entire storage layer, data models, and CLI interface before writing a single line of code. This is one of Claude Code's most valuable patterns: *think with Claude before you build with Claude.* Plan mode prevents the "just start coding" trap that leads to rewrites. You will use this design-first approach whenever you start a new feature.

### 2.4 Exit Plan Mode and Execute

Press `Shift+Tab` to return to normal mode. Now ask Claude to start building -- but keep the scope narrow. Tell it to create the data models and storage layer first, without the CLI interface. You want to build in layers, not all at once.

Something like:

> "Let's start building from the plan. Create the data models and the storage layer first -- no CLI yet. I want to review the core library before we add the interface on top."

Let Claude create the files. Review what it produces -- check that the models match what you agreed on in the plan.

> **Why this step:** Feature branches keep your experiments separate from working code. If something goes wrong, you can throw away the branch without affecting main.

### 2.5 Create a Feature Branch

```
! git checkout -b feature/core
```

### 2.6 Build the Storage Layer

If the storage layer is not fully implemented yet, describe what you still need. Tell Claude about the operations you want -- creating, reading, updating, deleting items -- plus tag filtering, search, timestamps, and validation. Let Claude figure out the implementation details.

> "The storage layer still needs full CRUD operations, tag-based filtering, search across all text fields, automatic timestamps, and validation before writes. Can you fill in what's missing?"

If Claude asks you questions about how search should work or what validation means for your data types, answer based on what makes sense for your toolkit.

> **STOP -- What you just did:** You went from an architecture plan to working code -- data models and a storage layer -- by giving Claude specific, scoped instructions. Notice you did not ask Claude to build everything at once. You built the core library *without* the CLI, keeping the first step focused. This incremental approach (plan, then build layer by layer) gives you chances to review and course-correct at each stage.

> **Quick check before continuing:**
> - [ ] Your data models exist for Note, Snippet, Bookmark, and Template
> - [ ] The storage layer handles create, read, update, and delete
> - [ ] You are on the `feature/core` branch (not main)

### 2.7 Write and Run Tests

Ask Claude to write tests for the storage layer. Describe what you want covered -- the happy paths (create, read, list, search, delete) and the edge cases (what happens with duplicate IDs, empty fields, missing files). Claude will likely ask about your test framework preferences if it is not obvious from your language choice.

> "Write tests for the storage layer. I want coverage for all CRUD operations, tag filtering, search, and edge cases like duplicate IDs and missing files."

Run the tests:

```
! <your-test-command>
```

For example: `python -m pytest`, `npm test`, `go test ./...`, `cargo test`

If tests fail, ask Claude to fix them. This is the build-test-fix cycle you
will use throughout the project.

> **Why this step:** The build-test-fix cycle is the heartbeat of working with Claude Code. You ask Claude to build something, run tests to verify it, and fix what is broken -- all without leaving the conversation. This tight loop is much faster than writing code in an editor and debugging manually.

### 2.8 Build the CLI Interface

Now ask Claude to build the CLI on top of your storage layer. Describe the commands you want -- adding items, listing them, searching, showing details, deleting, and browsing tags. Claude already knows your data models and storage API, so it can wire everything together.

> "Build the CLI interface for forge. I want commands for add, list, search, show, delete, and tags. Wire them up to the storage layer we already built."

If Claude suggests a CLI framework (like argparse, click, cobra, clap), discuss whether it fits your project's needs.

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

> **STOP -- What you just did:** You just tested your CLI by running real commands -- not unit tests, but the actual tool a user would run. Manual testing catches problems that unit tests miss: bad argument parsing, unclear output formatting, confusing error messages. Always do both: automated tests for correctness, manual tests for usability.

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

> **Why this step:** Rules are how you teach Claude your project's conventions. Instead of repeating "use fixtures in tests" or "add docstrings" in every prompt, you write it once in a rule file and Claude follows it automatically in every session.

Create the rules directory in your project:

```
! mkdir -p .claude/rules
```

Rules are modular, topic-specific instructions that Claude loads automatically.
They use markdown files with optional YAML frontmatter for path scoping.

### 3.2 Create Path-Scoped Rules

> **Why this step:** Path-scoped rules only activate when Claude works on matching files. Your testing rules apply in test files, your source code rules apply in source files. This keeps context lean -- Claude does not load storage rules when editing a test, and vice versa.

Ask Claude to create three rule files for you: one for testing conventions, one for source code style, and one for storage operations. Describe the conventions you care about for each area, and tell Claude to scope them to the right file paths using YAML frontmatter.

> "Create three rule files in .claude/rules/. First, a testing.md scoped to test files -- I want rules about using fixtures, descriptive assertions, and testing both success and failure cases. Second, a source-code.md scoped to src/lib/pkg -- rules about single responsibility, docstrings, error handling, and function length. Third, a storage.md scoped to storage and data files -- rules about validation, graceful handling of missing files, and atomic writes. Use YAML frontmatter with path globs to scope each one."

Claude will ask you if it is unsure about your file structure or which glob patterns to use. Answer based on how your project is organized. Review the generated rules and adjust any conventions that do not match your preferences.

> **STOP -- What you just did:** You created three rule files with YAML frontmatter that scopes each one to specific file paths. From now on, whenever Claude touches a test file, it automatically follows your testing conventions. Whenever it edits source code, it follows your source code rules. You never have to remind it -- the rules are always active. This is how teams enforce consistency without relying on code review alone.

Say **"continue"** when you're ready for the next step.

### 3.3 Create CLAUDE.local.md

Create a personal, non-committed preferences file. Tell Claude about your individual workflow preferences -- things like how you like test output formatted, your commit message style, and your language of choice. These are *your* preferences, not team rules.

> "Create a CLAUDE.local.md with my personal preferences. I like [your test output style], [your commit style], and I'm working in [your language]. Make sure it's in .gitignore."

Claude should add it to `.gitignore` automatically. Verify:

```
! cat .gitignore
```

If `CLAUDE.local.md` is not listed, ask Claude to add it.

> **STOP -- What you just did:** You created a personal preferences file that is *not* committed to version control. This is the distinction between `CLAUDE.md` (shared team knowledge) and `CLAUDE.local.md` (your personal preferences). Your teammates see the project rules; your local preferences are yours alone. You will use this separation whenever you have personal workflow preferences that should not be imposed on the team.

Say **"next"** when you're ready to move on.

### 3.4 Understand the Memory Hierarchy

Ask Claude to explain the full memory hierarchy -- where each file lives, what takes precedence, and which ones are shared with your team vs. private to you.

> "Explain the Claude Code memory hierarchy. What are all the layers, what's the precedence order, and which ones are shared vs. personal?"

The hierarchy from highest to lowest precedence:

1. Managed policy (organization-wide, system directory)
2. Project memory (`./CLAUDE.md` or `./.claude/CLAUDE.md`)
3. Project rules (`.claude/rules/*.md`)
4. User memory (`~/.claude/CLAUDE.md`)
5. Project local (`./CLAUDE.local.md`)

> **Quick check before continuing:**
> - [ ] `.claude/rules/` contains three rule files with YAML frontmatter
> - [ ] `CLAUDE.local.md` exists and is listed in `.gitignore`
> - [ ] You can explain the difference between project memory, project rules, user memory, and project local

### 3.5 Modularize CLAUDE.md with @imports

As your project grows, CLAUDE.md can become a wall of text. Ask Claude to extract the architecture and API documentation into separate files and link them with `@imports`.

> "Create a docs/architecture.md that describes our project structure, data models, and storage layer. Then create docs/api.md with the storage layer's public API. Finally, add @imports to CLAUDE.md so Claude loads these when it needs that context."

The `@path` syntax tells Claude Code to load those files as additional context
when needed. Both relative and absolute paths work.

> **Why this step:** As your project grows, `CLAUDE.md` can become a wall of text. `@imports` let you keep CLAUDE.md concise while linking to detailed docs that Claude loads on demand. Think of it like a table of contents that points to full chapters.

> **STOP -- What you just did:** You modularized your project documentation. Instead of cramming everything into one file, you created focused reference docs and linked them with `@imports`. Claude loads these when it needs architectural context or API details, keeping your main CLAUDE.md clean and scannable.

When you're ready, say **"let's keep going"** to continue.

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

> **Why this step:** Every Claude Code session has a finite context window. As your conversation grows, you will eventually run out of room. `/compact` reclaims space by summarizing older parts of the conversation while preserving what matters most. The focus argument is your steering wheel -- it tells Claude what to keep in detail.

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

Now put everything together by building the template rendering feature. Create a feature branch and describe to Claude what you want: a command that takes a template name and variable assignments, renders the template with those values, and validates that all required variables are provided.

> "Create a feature branch 'feature/templates' and build template rendering. I want a forge render command that substitutes variables into templates, validates that all required variables are provided, and errors on unknown variables. Write tests too -- follow our testing rules."

Notice how Claude follows the testing rules you created in `.claude/rules/testing.md` without you having to remind it. After building, run `/context` again to see how context changed. Then commit.

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

> **Why this step:** Skills are reusable, parameterized workflows you trigger with slash commands. Instead of retyping a complex prompt every time you want to add an item or search your knowledge base, you write it once as a skill and invoke it with `/add-item` or `/search`. Think of skills as saved prompts with superpowers -- they accept arguments, restrict tool access, and can reference supporting files.

```
! mkdir -p .claude/skills/add-item
! mkdir -p .claude/skills/search
! mkdir -p .claude/skills/daily-summary
```

### 4.2 Create the "add-item" Skill

Describe to Claude what your add-item skill should do. You want a slash command that takes an item type and details, validates the input, runs the forge add command, and shows the result. Tell Claude about your validation rules -- what makes a valid note vs. a valid snippet vs. a valid bookmark.

> "Create an add-item skill in .claude/skills/add-item/SKILL.md. It should accept the item type as the first argument and details as additional arguments. It needs to validate inputs -- non-empty titles, valid URLs for bookmarks, lowercase tags, uppercase template variables -- before running forge add. Also create a validation-rules.md companion file that spells out what's valid for each data type. Restrict it to Read, Write, Bash, and Edit tools."

Claude may ask about edge cases in your validation rules. Answer based on what makes sense for your workflow -- these are your conventions.

### 4.3 Create the "search" Skill

Now create a search skill. Describe how you want search to work -- query parsing with special prefixes like `tag:` and `type:`, full-text search as the default, results displayed as a clean table, and helpful suggestions when nothing matches.

> "Create a search skill in .claude/skills/search/SKILL.md. It should take the search query from $ARGUMENTS, support prefixes like tag:, type:, and since: for filtering, fall back to full-text search, display results as a table with ID, type, title, tags, and date, and suggest alternatives if nothing matches. Restrict tools to Read, Bash, Grep, and Glob."

> **STOP -- What you just did:** You created two skills with different specialties: one for data entry with validation, one for intelligent search with query parsing. Each skill has its own SKILL.md with frontmatter that controls its name, description, and which tools it can use. The `allowed-tools` field is important -- it restricts what Claude can do when running the skill, which prevents unexpected side effects. You will use this pattern whenever you want a repeatable, constrained workflow.

Ready? Say **"continue"** and we'll move on to manual-only skills.

### 4.4 Create the "daily-summary" Skill

Create a daily summary skill that shows what you added to forge today. This one should be manual-only -- you do not want Claude invoking it automatically during other tasks.

> "Create a daily-summary skill that lists everything I added or modified today, grouped by type, with title, tags, and a brief summary for each item. Set disable-model-invocation to true so it only runs when I type /daily-summary. Restrict tools to Read and Bash."

Notice `disable-model-invocation: true` -- this skill can only be triggered
by you typing `/daily-summary`. Claude will not invoke it automatically.

> **STOP -- What you just did:** You created a skill with `disable-model-invocation: true`. This is a critical distinction: most skills can be triggered both by you (typing `/daily-summary`) and by Claude (when it decides the skill is relevant). Setting `disable-model-invocation: true` means *only you* can trigger it. Use this for skills that should never run automatically -- summaries, reports, destructive operations, anything where you want explicit human intent.

> **Quick check before continuing:**
> - [ ] Three skill directories exist under `.claude/skills/`
> - [ ] Each has a `SKILL.md` with frontmatter (name, description, allowed-tools)
> - [ ] The daily-summary skill has `disable-model-invocation: true`

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

> **Why this step:** Skills hot-reload means you can iterate on a skill's behavior without restarting Claude Code. Edit the SKILL.md file, save it, and the next invocation uses the updated version. This makes skill development fast and interactive.

With Claude Code still running, open `.claude/skills/search/SKILL.md` in a
separate editor and add a line to the steps:

```
7. After displaying results, show the total search time
```

Save the file. Now invoke `/search` again in Claude Code. The updated skill
content takes effect immediately -- no restart needed.

### 4.8 Create a Manual-Only Skill

Create one more manual-only skill -- a bug report template generator. Tell Claude what fields you want in the template (type, steps to reproduce, expected vs. actual behavior, version) and that the issue title should come from the first argument.

> "Create an issue-template skill with disable-model-invocation: true. It should take an issue title as $0 and output a bug report template with fields for Type, Steps to reproduce, Expected behavior, Actual behavior, and Forge version."

Test it: `/issue-template "Search returns wrong results"`

> **STOP -- What you just did:** You now have a library of custom slash commands tailored to your forge toolkit. Skills are one of the most practical Claude Code features -- they turn multi-step workflows into one-line commands. The combination of argument substitution (`$0`, `$ARGUMENTS`), tool restrictions (`allowed-tools`), and invocation control (`disable-model-invocation`) gives you fine-grained control over what each skill does and when it runs.

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

> **Why this step:** Hooks let you automate actions at key moments in Claude Code's lifecycle -- when a session starts, after a file is written, before Claude stops responding. They are the foundation of quality automation: auto-formatting, auto-testing, injecting context, and blocking dangerous operations. Understanding the hook lifecycle is essential before you start writing hooks.

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

This hook will inject project stats into context when Claude starts. Describe to Claude what you want: a script that counts your stored items and prints a summary, wired up as a SessionStart hook.

> "Create a SessionStart hook that counts the number of notes, snippets, bookmarks, and templates in storage and prints a one-line summary. Create the script in .claude/hooks/ and add the hook entry to .claude/settings.json. Use whichever scripting language makes sense for my setup."

Claude may ask about your OS or scripting preference (bash vs. Python). For SessionStart hooks, stdout is added to Claude's context automatically.

Restart Claude Code (exit and re-launch `claude`) to test it. You should see
the stats injected on startup.

> **STOP -- What you just did:** You created your first hook -- a script that runs automatically when Claude starts a session. The key insight is that SessionStart hooks inject their stdout into Claude's context. This means Claude *starts every session knowing* how many notes, snippets, and bookmarks you have. You did not have to tell it -- the hook did it for you. This pattern is powerful for any project state you want Claude to be aware of from the start.

Say **"next"** when you're ready to build more hooks.

### 5.3 Create a PostToolUse Hook

This hook auto-formats files after Claude writes or edits them. Tell Claude which formatter you use and ask it to wire it up as a PostToolUse hook that triggers on Write and Edit operations.

> "Add a PostToolUse hook to settings.json that runs my formatter whenever Claude writes or edits a file. I use [your formatter -- e.g., black, prettier, gofmt, rustfmt]. Use a Write|Edit matcher and make it fail gracefully if the formatter isn't installed."

> **Quick check before continuing:**
> - [ ] `.claude/settings.json` has a SessionStart hook entry
> - [ ] `.claude/settings.json` has a PostToolUse hook entry with a `Write|Edit` matcher
> - [ ] The SessionStart hook prints stats when you restart Claude

### 5.4 Create a Stop Hook

> **Why this step:** A Stop hook runs after Claude finishes responding but before it hands control back to you. By running the test suite at this point, you catch breakage *immediately* -- Claude broke something and you know before you even type your next prompt. If the tests fail, the hook can block and feed the failures back to Claude for automatic fixing.

This hook runs the test suite after Claude finishes to verify nothing is broken. Describe what you want to Claude -- it needs to handle the infinite loop case (the hook itself triggers Claude, which triggers the hook again).

> "Create a Stop hook that runs my test suite after Claude finishes responding. If tests fail, it should block and feed the failures back so Claude can fix them. Make sure it handles the infinite loop problem -- if it's already running inside a Stop hook, it should exit cleanly. Add it to settings.json."

Claude will ask about your test command if it is not obvious. It will also need to figure out the right way to detect re-entrancy for your setup.

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

> **STOP -- What you just did:** You learned about matchers and timeouts -- the configuration layer that controls *when* and *how long* hooks run. Matchers prevent hooks from firing on every tool call (which would slow everything down). Timeouts prevent runaway scripts from freezing your session. These two settings are what make hooks practical for real workflows rather than just demos.

Say **"continue"** and we'll verify all three hooks are working.

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

> **Why this step:** MCP servers give Claude new capabilities beyond reading and writing files. By connecting a SQLite server, Claude can run SQL queries, create tables, and manage structured data directly -- without you writing database code. This transforms your forge toolkit from flat JSON files to a real queryable database.

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

Now ask Claude to set up the database using the MCP server. Describe what tables you need and ask it to migrate your existing data.

> "Using the forge-db MCP server, create tables for my four data types matching our existing data models. Then migrate any existing JSON data into the SQLite database."

Claude may ask about column types, indexes, or how to handle the migration. Answer based on your existing data models.

> **STOP -- What you just did:** You connected an external tool to Claude Code using MCP. Claude can now create tables, insert data, and run queries on a SQLite database -- all through natural language. You also migrated your existing JSON data into SQLite, which means your forge toolkit now has a proper database backend. The `/mcp` command is your dashboard for checking which servers are connected and healthy.

When you're ready, say **"let's keep going"** to add another MCP server.

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

> **Quick check before continuing:**
> - [ ] `/mcp` shows both `forge-db` and `forge-fs` as connected
> - [ ] You can ask Claude to query the SQLite database and get results
> - [ ] Your existing data has been migrated from JSON to SQLite

### 6.5 Create .mcp.json for Team Sharing

> **Why this step:** MCP servers you add with `claude mcp add` are stored locally by default -- only you can see them. By using the `--scope project` flag, the configuration goes into `.mcp.json` at your project root, which you can commit to version control. This means any teammate who clones your repo gets the same MCP setup automatically.

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

> **STOP -- What you just did:** You learned the three MCP scopes and how they control visibility. Local scope is for personal experimentation, project scope is for team sharing, and user scope is for tools you want everywhere. Understanding scopes prevents the common mistake of adding MCP servers that only work on your machine while your teammates get errors.

Say **"next"** and we'll combine skills with MCP servers.

### 6.7 Create a Skill That Orchestrates MCP Tools

Now combine skills and MCP by creating a backup skill. Describe the workflow to Claude -- exporting data from the database, writing it to a dated backup directory, and logging the backup.

> "Create a backup skill that exports all tables from the SQLite database to JSON files in a backups/YYYY-MM-DD/ directory, logs the backup in a backup_log table, and shows a summary with counts and file sizes. Make it manual-only and give it access to both MCP servers plus Bash, Read, and Write."

Claude will wire up the `mcp__forge-db__*` and `mcp__forge-fs__*` tool patterns in the `allowed-tools` frontmatter. This is the skills+MCP pattern in action.

Test it: `/backup`

> **STOP -- What you just did:** You combined two Claude Code features -- skills and MCP -- into something more powerful than either one alone. The backup skill uses `allowed-tools` to access MCP tools (`mcp__forge-db__*`) alongside regular tools. This is the skills+MCP pattern: a skill defines the workflow, MCP servers provide the data access. You will use this pattern whenever you need a repeatable workflow that touches external data sources.

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

> **Why this step:** In Module 5 you built hooks that *observe* (SessionStart, PostToolUse, Stop). Now you are building hooks that *control* -- they intercept tool calls and decide whether to allow, deny, or modify them. This is the guard rail pattern: automated safety checks that prevent mistakes before they happen, without slowing you down.

PreToolUse hooks intercept tool calls before they execute. They can:
- **Allow:** bypass the permission system entirely
- **Deny:** block the tool call and tell Claude why
- **Ask:** show the user a confirmation prompt
- **Modify:** change the tool's input parameters

### 7.2 Guard: Validate Before Storage Writes

Create a hook that prevents writes to storage files unless validation passes. Describe the guard to Claude -- it should intercept Write operations, check if the target is a storage file, validate the JSON structure, and deny the write with a clear message if validation fails.

> "Create a PreToolUse hook that validates storage writes. It should read the tool input from stdin, check if the file is a storage JSON file, and if so, validate the structure. If validation fails, deny the write with a permissionDecision of deny and a reason explaining what's wrong. If it's not a storage file, allow it through. Add it to settings.json with a Write matcher."

Claude will create the hook script and wire it into your settings. Discuss the validation rules -- what counts as valid JSON structure for your data types.

> **STOP -- What you just did:** You created a guard that prevents Claude from writing invalid data to your storage files. The key mechanism is `permissionDecision: "deny"` -- it blocks the tool call entirely and sends a reason back to Claude. Claude sees the denial message and can try again with valid data. This is a safety net: even if your code has a bug that produces bad JSON, the hook catches it before it corrupts your storage.

Ready? Say **"continue"** and we'll build a different kind of guard.

### 7.3 Guard: Inject Context on File Reads

Create a hook that adds context when Claude reads source files. This one does not block anything -- it injects a reminder about your coding conventions.

> "Create a PreToolUse hook with a Read matcher that checks if the file being read is a source file (in src/, lib/, or pkg/). If it is, inject additionalContext reminding Claude to follow single-responsibility principle and add docstrings to public functions. If it's not a source file, do nothing."

The key is `hookSpecificOutput.additionalContext` -- it injects a string into
Claude's context before the tool executes.

> **STOP -- What you just did:** You created a hook that injects `additionalContext` when Claude reads source files. Unlike `deny` which blocks an action, `additionalContext` *adds information* to Claude's context right before the tool executes. Claude does not even know the hook ran -- it just "remembers" to follow single-responsibility principle because the context was injected. This is a subtle but powerful pattern for enforcing conventions without blocking anything.

> **Quick check before continuing:**
> - [ ] Your storage validation hook denies writes with invalid JSON
> - [ ] Your read-context hook injects reminders when Claude reads source files
> - [ ] You understand the difference between `deny` (blocks) and `additionalContext` (informs)

### 7.4 Guard: Auto-Add Timestamps

Create a hook that silently modifies tool input to inject timestamps. This is the third PreToolUse mechanism -- instead of blocking or informing, it *rewrites* what Claude is about to write.

> "Create a PreToolUse hook with a Write matcher that auto-adds timestamps to storage files. When Claude writes to a storage file, the hook should parse the content, inject or update an 'updated_at' field with the current ISO timestamp, and pass the modified content through using updatedInput with permissionDecision allow."

The key is `hookSpecificOutput.updatedInput` -- it replaces the tool's input
parameters before execution.

> **STOP -- What you just did:** You created a hook that uses `updatedInput` to *modify* the tool's input before it executes. This is the third and most powerful PreToolUse mechanism: the hook silently rewrites what Claude is about to write, injecting timestamps into storage files. Claude thinks it wrote the original content, but the hook quietly added `updated_at`. This pattern is ideal for cross-cutting concerns like timestamps, audit trails, or data enrichment that should happen on every write without Claude having to remember.

Say **"continue"** when you're ready for the next step.

### 7.5 Prompt-Based Quality Gate

Now try a different kind of hook -- one powered by an LLM instead of a script. Ask Claude to create a prompt-based Stop hook that reviews the conversation for commit-quality issues.

> "Add a prompt-based Stop hook (type: prompt, not command) with a 30-second timeout. The prompt should check whether Claude was asked to commit code, and if so, verify that tests pass, there are no unresolved TODOs, and no leftover debug statements. It should respond with ok: true or ok: false with a reason."

Prompt-based hooks use a fast LLM (Haiku) to evaluate context and return a
structured decision. They are powerful for nuanced, context-aware checks that would be impractical to write as regex or shell scripts.

> **Why this step:** Some quality checks cannot be expressed as simple scripts. "Are there leftover debug statements?" requires understanding code context. Prompt-based hooks delegate this judgment to a fast LLM (Haiku), combining the automation of hooks with the reasoning ability of an AI. This is one of the most advanced hook patterns -- use it for nuanced checks that would be impractical to write as regex or shell scripts.

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

> **STOP -- What you just did in this module:** You built a complete guard rail system with four distinct mechanisms: `deny` blocks bad actions, `additionalContext` injects reminders, `updatedInput` silently modifies tool inputs, and prompt-based hooks use AI judgment for nuanced checks. Together, these form a safety layer that runs automatically on every tool call. In real projects, guard rails like these prevent data corruption, enforce conventions, and catch quality issues -- all without you having to remember to check.

---

## Module 8 -- Subagents

**CC features:** `.claude/agents/`, subagent frontmatter, chaining, parallel,
background (`Ctrl+B`), resuming

### 8.1 What Are Subagents

> **Why this step:** Up to now, your main Claude session does everything -- planning, coding, testing, searching. Subagents let you delegate specialized tasks to focused assistants that have their own context windows and tool restrictions. This keeps your main conversation clean and lets you route tasks to cheaper, faster models (like Haiku for search) while reserving the more capable model for complex work.

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

Describe your search agent to Claude. It should be a specialist that parses queries, searches across all data types, ranks results by relevance, and suggests alternatives when nothing matches. Since search is a focused task, use a fast, cheap model.

> "Create a search-agent in .claude/agents/search-agent.md. It should be a search specialist that parses queries, searches all data types, ranks results by relevance (exact title matches first, then tags, then body text), and suggests related searches if no results. Use model: haiku and restrict tools to Read, Grep, Glob, and Bash."

### 8.4 Create: format-agent

Create a format conversion agent. Describe the formats you want it to handle and what "good output" looks like for each one.

> "Create a format-agent in .claude/agents/format-agent.md. It should convert forge items to Markdown, JSON, HTML, or CSV with proper formatting for each output type. It should handle edge cases like special characters and report a summary of what it exported. Use model: haiku and restrict tools to Read, Write, and Bash."

> **STOP -- What you just did:** You created two subagents with different models and tool sets. The search-agent uses Haiku (fast, cheap) because search is a focused task that does not require complex reasoning. The format-agent also uses Haiku because format conversion is mechanical. By choosing the right model for each agent, you control both cost and speed. You will use this pattern whenever a task is well-defined enough that a smaller model can handle it.

When you're ready, say **"let's keep going"** to create a review agent.

### 8.5 Create: review-agent

Create a review agent for quality-checking your knowledge base. This one needs better reasoning than search or format conversion, so use a more capable model. And since a reviewer should never modify anything, make it read-only.

> "Create a review-agent in .claude/agents/review-agent.md. It should check items for completeness, clarity, tag consistency, and duplicates, then score them (Good/Needs Improvement/Poor) with specific suggestions. Use model: sonnet, permissionMode: plan (read-only), and restrict tools to Read, Grep, and Glob."

Note `permissionMode: plan` -- this agent can only read and analyze, never modify files.

> **STOP -- What you just did:** You created a review agent with `permissionMode: plan`, which means it can only *read* and *analyze* -- it cannot write files or run commands that modify anything. This is the principle of least privilege applied to AI agents: give each agent only the permissions it needs. A reviewer should never accidentally edit the code it is reviewing.

> **Quick check before continuing:**
> - [ ] Three agent files exist in `.claude/agents/`
> - [ ] search-agent and format-agent use `model: haiku`
> - [ ] review-agent uses `model: sonnet` and `permissionMode: plan`
> - [ ] Each agent has a focused description and restricted tool list

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

Try invoking your subagents. You can be explicit about which agent to use, or just describe a task and let Claude decide whether to delegate.

Explicit invocation:

> "Use the search-agent to find all items tagged with 'reference'"

> "Use the format-agent to export all notes as Markdown to exports/notes.md"

Automatic delegation -- just describe what you want and see if Claude routes it:

> "Find items related to API design in my knowledge base"

Claude may route this to the search-agent on its own, based on the agent's description.

> **Why this step:** Subagents can be invoked explicitly ("Use the search-agent to...") or automatically by Claude when the task matches the agent's description. Automatic delegation is powerful but requires good descriptions in your agent frontmatter -- Claude uses the description to decide when to delegate.

Say **"next"** when you're ready to learn agent composition patterns.

### 8.8 Patterns: Chain, Parallel, Resume

**Chaining:** Connect agents in sequence -- the output of one feeds into the next:

> "Use the search-agent to find all poorly-tagged items, then use the review-agent to suggest better tags for each one."

**Parallel (background):** Press `Ctrl+B` to background a running agent, then start another task:

> "Use the review-agent to review all my notes"

While it runs, press `Ctrl+B`, then:

> "Use the format-agent to export all bookmarks as HTML"

Both agents work simultaneously.

**Resuming:** After an agent completes, continue its work:

> "Continue that review and now also check snippets for quality"

Claude resumes the previous agent with its full context preserved.

> **STOP -- What you just did:** You practiced three subagent patterns: chaining (output of one feeds into the next), parallel (multiple agents working simultaneously via `Ctrl+B`), and resuming (continuing a completed agent's work). These patterns compose -- you can chain two agents, background both, and resume whichever finishes first. In real projects, you will use chaining for pipelines (search then format), parallel for independent tasks (review notes while exporting bookmarks), and resuming for iterative refinement.

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

> **Why this step:** Up to now, you have been giving Claude one instruction at a time. Tasks let you define a *plan of work* with dependencies -- "do A, then B (which needs A), then C (which needs B)." Claude tracks progress, respects the dependency order, and persists the task list across sessions. This is how you manage multi-step work that spans hours or days.

Tasks replace the old TODO system. They provide:
- Dependency graphs (task A blocks task B)
- Cross-session persistence (stored on disk at `~/.claude/tasks/`)
- Multi-agent collaboration (shared task lists)
- Progress tracking visible in the terminal

Press `Ctrl+T` to toggle the task list view at any time.

### 9.2 Cross-Session Persistence

> **Why this step:** By default, tasks live only in the current session. But real projects span multiple sessions -- you might define tasks today and work through them tomorrow. Cross-session persistence solves this. It also enables a powerful pattern: multiple Claude instances sharing the same task list, coordinating work across parallel sessions.

To share a task list across sessions, set the environment variable:

```
CLAUDE_CODE_TASK_LIST_ID=forge-import claude
```

Any session started with this ID shares the same task list. This enables
multiple Claude instances to coordinate work.

### 9.3 Build a Multi-Step Pipeline

Describe a multi-step import pipeline to Claude. Walk through the steps you envision -- scanning a directory for markdown files, parsing them, validating the data, importing into storage, rebuilding the index, and generating a report. Tell Claude about the dependencies between steps.

> "Create a task list for importing markdown files as notes. I need these steps in order: scan the imports/ directory for .md files, parse title/body/tags from each one, validate the data, import into the forge database, rebuild the search index, and generate a summary report. Each step depends on the one before it. Use TaskCreate with blockedBy dependencies."

Press `Ctrl+T` to see tasks in the status area. Before executing, you need test data:

> "Create an imports/ directory with 5 sample markdown files that have YAML frontmatter (title, tags) and varied body content for testing."

Then tell Claude to execute the pipeline:

> "Execute the import pipeline. Work through each task in order."

> **STOP -- What you just did:** You created a dependency graph of tasks and watched Claude execute them in order. Task 2 waited for Task 1 to complete, Task 3 waited for Task 2, and so on. The `blockedBy` field is what makes this work -- it tells the tasks system which tasks must finish before others can start. Press `Ctrl+T` to see the visual progress tracker. This is how you break down complex features into manageable, ordered steps.

> **Quick check before continuing:**
> - [ ] All six import pipeline tasks completed in dependency order
> - [ ] `Ctrl+T` shows the task list with completion status
> - [ ] The sample markdown files were successfully imported into forge

### 9.4 TDD Workflow: Build with Tests First

> **Why this step:** Test-driven development (TDD) flips the usual order: you write the test *first*, watch it fail, then write just enough code to make it pass. With Claude Code, TDD is especially effective because Claude can see the failing test, understand what is expected, and write precisely the code needed. This prevents over-engineering and gives you a comprehensive test suite as a side effect.

Use strict test-driven development to build a new feature -- fuzzy search. Explain the TDD workflow to Claude and describe the search behavior you want. Be clear about the discipline: test first, then code, never the other way around.

> "Let's build smart search with fuzzy matching using strict TDD. The rules: write a failing test first, run it to confirm it fails, write the minimum code to make it pass, run it to confirm it passes, refactor if needed, then repeat. I want fuzzy search to handle typos like 'ntes' matching 'notes', abbreviations like 'py snippet' matching Python snippets, and be case-insensitive. Start with the first failing test -- do NOT write any implementation yet."

Let Claude work through the TDD cycle. For each test case:
1. Claude writes the test
2. You or Claude runs it (it should fail)
3. Claude writes just enough code to pass
4. Run tests again (should pass)
5. Refactor

This enforces disciplined development and gives you a solid test suite.

> **STOP -- What you just did:** You experienced the TDD cycle with Claude Code: write a failing test, run it (red), write minimal code to pass (green), refactor if needed. Each cycle produces both working code and a test that proves it works. After several cycles, you have a fuzzy search feature with comprehensive test coverage. This discipline is worth practicing -- it is one of the most reliable ways to build correct software, and Claude Code makes the cycle fast because Claude can see the test failure and write targeted fixes.

Ready? Say **"continue"** and we'll add verification hooks for subagent output.

### 9.5 Stop and SubagentStop Hooks for Verification

Add a quality gate for subagent output. Ask Claude to create a SubagentStop hook that verifies subagents actually completed their tasks before returning results.

> "Add a SubagentStop hook to settings.json with type: prompt that evaluates whether the subagent completed its task. It should check: Did it produce output? Were there errors? Is the work complete? It should respond ok: true or ok: false with a reason."

This ensures subagents finish their work properly before returning results.

> **STOP -- What you just did:** You added a quality gate that runs every time a subagent finishes. The SubagentStop hook uses a prompt (not a script) to evaluate whether the subagent actually completed its task. This catches a common problem: subagents that return partial results or silently fail. In production workflows with multiple agents, this verification step ensures you can trust the output before passing it downstream.

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

> **Why this step:** Until now, you have worked on one feature at a time: create a branch, build, merge, repeat. Git worktrees let you work on multiple features *simultaneously* in separate directories, each with its own Claude Code session. This is parallel development -- two features being built at the same time by two Claude instances, coordinating through a shared task list.

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

> **STOP -- What you just did:** You set up parallel development with two Claude instances sharing a task list via `CLAUDE_CODE_TASK_LIST_ID`. Each instance works in its own worktree on its own feature branch, but they can see each other's task progress. This is the most advanced workflow pattern in Claude Code -- it lets you multiply your throughput by running independent features in parallel. When one session completes a task that unblocks work in the other session, both see the update.

> **Quick check before continuing:**
> - [ ] Two worktree directories exist (`forge-api/` and `forge-export/`)
> - [ ] Each has its own Claude Code session running
> - [ ] Both sessions see the same shared task list
> - [ ] Tasks created in one session appear in the other

### 10.3 Plugin Creation

> **Why this step:** Everything you have built -- skills, agents, hooks -- lives inside your project. A plugin packages these components into a portable, reusable bundle that can be shared with other projects or other people. Think of it as turning your project-specific customizations into a distributable tool.

Package everything you have built into a reusable plugin. Describe to Claude what you want to include and let it figure out the plugin structure.

> "Package my forge toolkit into a reusable plugin called knowledge-base-plugin. Include the add-item, search, daily-summary, and backup skills, the search, format, and review agents, and extract the relevant hooks into plugin format. Create a plugin.json manifest with name and version."

Claude may ask about which hooks to include or how to handle project-specific paths. The directory layout must be:

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

> **STOP -- What you just did:** You packaged your forge toolkit's skills, agents, and hooks into a standalone plugin with a manifest file. The plugin can be loaded into any project with `--plugin-dir`, and all skills are automatically namespaced (e.g., `/knowledge-base:add-item`) to prevent conflicts with the host project's own skills. This is how you share Claude Code customizations across projects and teams.

Say **"continue"** when you're ready to move on to evaluation.

### 10.5 Evaluation

> **Why this step:** How do you know your skills and agents actually work well? Evaluation gives you a systematic way to test them with defined inputs, expected outputs, and scoring criteria. This is not the same as unit testing your code -- it is testing your *Claude Code configuration*: do skills produce the right output? Do agents make good decisions?

Describe to Claude the test cases you want for each skill and agent. Think about what "correct behavior" looks like for each one -- both the happy path and the failure cases.

> "Create an evaluation suite for the forge toolkit. I want test cases for each skill and agent with defined inputs, expected outputs, and scoring criteria. For add-item: test with a valid note, an empty title, and missing fields. For the search agent: test exact title match, tag search, and no-results behavior. For the review agent: test with an incomplete item and duplicates. Write a script that runs each test and reports pass/fail."

Claude may ask about how strict the scoring should be or what counts as "close enough." These are your standards -- discuss them.

> **STOP -- What you just did:** You created an evaluation suite that tests your Claude Code configuration the same way you would test code. Each test case specifies what to input, what output to expect, and how to score the result. This closes the feedback loop: you built skills and agents in earlier modules, and now you have a way to measure whether they work correctly. In real projects, run evaluations after any change to skills, agents, or hooks to catch regressions.

Say **"next"** and we'll set up auto-approval to streamline eval runs.

### 10.6 PermissionRequest Hooks for Eval Automation

> **Why this step:** Running evaluations means invoking many tool calls in rapid succession. Without auto-approval, you would have to manually confirm every Read, Grep, and Bash command -- dozens of permission prompts that slow everything down. PermissionRequest hooks let you auto-approve safe operations during eval while keeping the safety prompts during normal development.

During evaluation, auto-approve safe operations to avoid prompt fatigue. Ask Claude to set up the auto-approval hook in your local settings (not the shared project settings).

> "Add a PermissionRequest hook to .claude/settings.local.json that auto-approves Read, Grep, Glob, and forge commands during evaluation. Use a matcher for those specific tools and output a decision with behavior: allow. Keep it in settings.local.json since this is a personal workflow choice."

> **STOP -- What you just did:** You used a PermissionRequest hook to auto-approve safe operations (Read, Grep, Glob, and forge commands) during evaluation. Notice this hook lives in `settings.local.json` -- not committed to version control -- because auto-approval is a personal workflow choice, not a team policy. This is a good example of the local vs. project settings distinction: safety-reducing configurations stay local.

> **Quick check before continuing:**
> - [ ] Your plugin loads with `--plugin-dir` and skills work with namespace prefix
> - [ ] Evaluation suite exists with test cases for skills and agents
> - [ ] PermissionRequest hook auto-approves safe operations during eval
> - [ ] The auto-approval hook is in `settings.local.json`, not `settings.json`

### 10.7 Continuous Learning

> **Why this step:** This is the most important habit you can build. Claude Code's effectiveness comes from its configuration -- CLAUDE.md, rules, skills, agents, hooks. Every time you discover a pattern that works or a mistake to avoid, capturing it in your configuration makes every future session better. This is compound learning: each session builds on everything that came before.

Reflect on the full project and have a conversation with Claude about what you have learned. Ask it to review your configuration and suggest improvements based on how things actually worked.

> "Review our CLAUDE.md, rules, skills, agents, and hooks. What patterns worked well? What should we refine? Are there edge cases we missed or descriptions that could be clearer? Help me update everything based on what we've learned building this project."

This is the continuous learning cycle: build, reflect, refine, repeat.

> **STOP -- What you just did:** You completed the full learning loop. Over 10 modules, you built a personal dev toolkit while systematically learning every major Claude Code feature. This final step -- reviewing and refining your configuration -- is what separates people who use Claude Code from people who master it. Your CLAUDE.md, rules, skills, agents, and hooks are a living system that gets better with every session. Keep updating them.

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
