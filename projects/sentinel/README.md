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

> **Why this step:** Plan mode is Claude Code's "think before you build" feature. Instead of jumping straight into generating files, you get to explore architecture decisions with Claude while it is prevented from changing anything. This is where you catch design mistakes cheaply -- before they are baked into code.

Press `Shift+Tab` until you see the mode indicator switch to **Plan Mode**. In plan mode, Claude reasons about architecture and design without making any file changes. This is read-only exploration.

Alternatively, type:

```
/plan
```

### Step 2: Design the architecture

Now describe your code analyzer to Claude. You are in plan mode, so Claude will think through the design without creating any files. Tell it about the core pieces -- scanning files, applying rules, reporting issues -- and what CLI commands you want. Do not worry about getting the prompt perfect. Just describe your vision and let Claude ask clarifying questions.

Something like:

> "I want to build a code analyzer CLI called Sentinel. It should recursively scan source files, apply configurable rules (things like complexity thresholds, naming conventions, missing docs, unused imports), and report issues with severity levels. I also need a CLI with commands like `sentinel scan`, `sentinel rules`, and `sentinel report`. Help me design the architecture -- ask me questions about anything that's unclear."

Claude will probably ask about which languages to support, how rules should be structured, what output formats you want, and how the components should connect. Answer naturally -- these are your design decisions. Once Claude produces a plan, read through it carefully.

> **STOP -- What you just did:** You used plan mode to design your analyzer before writing a single line of code. This is one of Claude Code's most powerful patterns: you can think through complex decisions *with* Claude before committing to an approach. Plan mode prevents the "just start coding" trap that leads to rewrites. You will use this pattern whenever you face a non-trivial feature -- sketch the design first, then build.

Say **"continue"** when you're ready for the next step.

### Step 3: Iterate on the plan

Push back on the plan while you are still in plan mode. Ask Claude about the parts that feel unclear or where you have opinions. For example, you might want to know how users will add custom rules without touching the core engine, or whether the reporter should stream results or batch them for large codebases.

This is a conversation -- challenge the design, ask "why not X instead?", and let Claude refine the plan based on your feedback. The goal is a plan you actually agree with, not just whatever Claude suggests first.

### Step 4: Exit plan mode and execute

> **Why this step:** Switching from plan mode to normal mode is the moment you go from "thinking" to "doing." Claude will now create real files based on the architecture you just agreed on. Starting with stubs (empty functions with docstrings) lets you verify the structure is right before filling in logic.

Press `Shift+Tab` to switch back to normal mode. Now ask Claude to create the project skeleton based on the plan you just agreed on. Tell it you want the directory layout, the entry point, and stub modules with docstrings or comments explaining what each one does -- but not the full logic yet, just the structure.

Something like:

> "Let's build the skeleton we just designed. Set up the directory layout, create the entry point, and stub out each module with comments explaining its purpose. Don't implement the full logic yet -- just the structure."

Claude will create files. Review each one before accepting.

> **STOP -- What you just did:** You went through the full plan-then-build cycle. Claude designed the architecture in plan mode, you asked questions to refine it, then you switched to normal mode and Claude created the project skeleton. Notice how you reviewed each file before accepting -- that review step is critical. Claude is a collaborator, not an autopilot.

Say **"next"** when you're ready to move on.

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

> **Why this step:** Feature branches keep your experiments separate from working code. If something goes wrong while building the scanner or rule engine, you can throw away the branch without affecting main. Claude can handle all the git operations for you -- branching, committing, merging -- so you stay in the flow.

### Step 6: Implement the file scanner and basic rule engine

Ask Claude to implement the file scanner module. Describe what you need -- it should walk a directory tree, filter by file extension, skip things like `.git` and `node_modules`, and return file paths with metadata. Then ask for a couple of starter rules, like detecting functions that are too long or public functions missing documentation.

> "Implement the file scanner -- it should recursively walk directories, filter by extension, skip hidden dirs and things like node_modules, and return file paths with metadata. Then add two basic analysis rules: one that flags functions over N lines, and one that flags public functions without docstrings."

Claude may ask you about thresholds, which extensions to support by default, or how to define "public function" in your chosen language. These details are up to you.

> **Quick check before continuing:**
> - [ ] Your project has a clear directory structure with separate modules
> - [ ] The file scanner and at least two rules are implemented
> - [ ] You are on the feature/core branch (not main)

### Step 7: Write and run tests

Ask Claude to write tests for what you just built. Tell it you want tests for the file scanner and both rules, using your language's standard test framework. Mention the kinds of cases you care about -- fixture directories with known files, making sure hidden directories get skipped, verifying extension filtering works, and checking that each rule catches real violations while passing clean code.

> "Write tests for the file scanner and both rules. Include tests with fixture files, make sure hidden dirs are skipped, test the extension filtering, and verify each rule catches violations and passes clean code. Then run them."

Watch Claude write tests, execute them with `!`, fix failures, and re-run. This is the build-test-fix-commit cycle.

> **STOP -- What you just did:** You just experienced the build-test-fix loop that will be your primary workflow for the rest of this project. Claude wrote tests, ran them, saw failures, fixed the code, and re-ran until everything passed. This tight feedback loop is why Claude Code is so effective -- Claude gets concrete error messages and fixes them immediately, rather than guessing.

When you're ready, say **"let's keep going"** to continue.

### Step 8: Implement the CLI

Ask Claude to wire up a CLI so you can run Sentinel from the command line. Describe the commands you want -- at minimum `sentinel scan <path>` to run analysis and `sentinel rules list` to show available rules. Let Claude pick the standard CLI framework for your language.

> "Add a CLI with `sentinel scan <path>` to run analysis and print results, and `sentinel rules list` to show available rules. Wire it up to the scanner and rule engine we already have."

### Step 9: Manual test

```
! sentinel scan .
```

Or the equivalent command for your language. Scan the sentinel project itself and see what the analyzer finds.

> **STOP -- What you just did:** You wired together the scanner, rule engine, and CLI into a working tool, then tested it on its own source code. Sentinel can now analyze real code. Running your analyzer on itself ("dog-fooding") is a great way to find gaps -- if Sentinel misses obvious issues in its own code, it needs better rules.

Ready? Say **"continue"** and we'll move on to committing and merging.

### Step 10: Commit and merge

Ask Claude to commit everything on `feature/core` and merge it back to main.

> "Commit all changes on feature/core with a good commit message, then merge back to main."

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

> **Why this step:** Path-scoped rules let you give Claude different instructions for different parts of your codebase. Instead of one giant instruction file, you can say "when working on analyzers, follow these conventions" and "when working on tests, follow these conventions." Claude automatically loads only the rules relevant to the files it is touching.

Create the `.claude/rules/` directory in your sentinel project. Ask Claude to set up path-scoped rule files -- one for analyzer modules, one for reporters, and one for tests. Describe the conventions you want each rule file to enforce.

For example, you might want analyzer rules to say that every analyzer must be stateless and return structured Issue objects. Reporter rules might require streaming support for large codebases. Test rules might require fixture files with known issues rather than testing against live code.

> "Create a `.claude/rules/` directory with three path-scoped rule files: one for analyzers (scoped to analyzer/rule paths), one for reporters (scoped to reporter/formatter paths), and one for tests (scoped to test paths). Each should describe the conventions for that area of the codebase -- I'll tell you what they should say."

Claude will ask you about the conventions, or propose some based on your project. Discuss them until you are happy with what each rule file says. Make sure each file has `paths:` frontmatter so it only loads when Claude is working on relevant files.

> **STOP -- What you just did:** You created targeted instructions that Claude loads based on file paths. Now when Claude edits an analyzer file, it knows analyzers must be stateless and return structured Issue objects. When it writes tests, it knows to use fixture files. This is far more effective than dumping all conventions into a single file -- Claude gets precisely the context it needs, when it needs it.

Say **"next"** when you're ready to move on.

### Step 2: Create CLAUDE.local.md

> **Why this step:** CLAUDE.local.md is your *personal* memory file -- it stores preferences that should not be shared with the team (like your preferred output format or local file paths). It is automatically gitignored, so it never gets committed.

Create a `CLAUDE.local.md` file in the project root. This file is for your personal preferences and is automatically added to .gitignore. Ask Claude to create it, and tell it about your personal preferences -- things like your preferred output format, where your test fixtures live, or how you like test output displayed.

> "Create a CLAUDE.local.md with my personal preferences -- I like verbose test output, my fixtures are in tests/fixtures/, and I prefer JSON format for local testing."

Your preferences will be different from the example above. Put whatever is actually useful for your workflow.

### Step 3: Understand the memory hierarchy

Ask Claude to walk you through the full memory hierarchy for this project. You want to understand what files are loaded, in what order, and which ones take precedence.

> "Show me the full memory hierarchy for this project -- what files get loaded, in what order, and which ones override which?"

Claude should describe: managed policy (if any) -> user memory (~/.claude/CLAUDE.md) -> project memory (CLAUDE.md) -> project rules (.claude/rules/*.md) -> local project memory (CLAUDE.local.md).

> **STOP -- What you just did:** You explored the full memory hierarchy -- from global user settings down to local project preferences. Understanding this hierarchy matters because it determines what Claude knows and when. Managed policy overrides everything, then user memory, then project memory, then rules, then local memory. When Claude does something unexpected, checking which memory files are loaded is the first debugging step.

When you're ready, say **"continue"** to move on to @imports.

### Step 4: Use @imports

> **Why this step:** @imports let CLAUDE.md reference other files without copying their contents inline. This keeps CLAUDE.md concise while giving Claude access to detailed documentation. When the imported file changes, Claude automatically picks up the latest version.

Ask Claude to create documentation files that CLAUDE.md will import. You want a rule format guide (how to define new rules, required fields, an example) and a brief architecture overview. Then update CLAUDE.md to reference both using `@`-syntax imports.

> "Create docs/rule-format.md describing how to define custom rules, and docs/architecture.md with an architecture overview. Then update CLAUDE.md to import both using @-syntax, like `See @docs/rule-format.md for the rule definition format.`"

After Claude creates the files, open CLAUDE.md and verify the `@imports` are there. These references let Claude load the full docs on demand without cluttering CLAUDE.md itself.

> **Quick check before continuing:**
> - [ ] `.claude/rules/` has at least 3 path-scoped rule files with frontmatter
> - [ ] `CLAUDE.local.md` exists in the project root
> - [ ] `CLAUDE.md` uses @imports to reference your docs files

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

> **STOP -- What you just did:** You learned the three context management commands: `/context` shows how full your context window is, `/compact` compresses conversation history to free up space, and `/cost` shows your token usage. These are essential for long sessions -- if Claude starts forgetting things or giving vague answers, your context window is probably full. Use `/compact` with a focus instruction to keep the most relevant context and discard the rest.

Say **"let's keep going"** when you're ready to put it all together.

### Step 8: Build a new rule using these tools

Now put it all together. Ask Claude to build a new analysis rule while it has all this context loaded. Describe a complexity rule -- something that estimates cyclomatic complexity by counting decision points (if/else, loops, logical operators) and flags functions that exceed a threshold.

> "Add a new analyzer rule that estimates cyclomatic complexity. It should count decision points and flag functions over a configurable threshold. Follow the conventions in our rules files and the format in @docs/rule-format.md, and include tests."

Notice how you can reference `@docs/rule-format.md` in your prompt -- Claude will load the imported file. Watch how Claude follows the path-scoped rules automatically when it creates the analyzer and test files.

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

> **Why this step:** Skills turn multi-step workflows into single slash commands. Instead of typing a long prompt every time you want to analyze code, you type `/analyze src/` and Claude follows the same steps every time. Skills are reusable, shareable, and version-controlled -- they become part of your project's toolbox.

Ask Claude to create an `/analyze` skill. Describe what you want it to do: run Sentinel's scan on a given path, summarize findings by severity, highlight errors first, and suggest fixes for the top issues. Tell Claude it should accept a path argument so you can run `/analyze src/` or `/analyze src/rules/`.

> "Create a skill at .claude/skills/analyze/SKILL.md. It should run Sentinel analysis on whatever path I give it, summarize findings by severity, show errors first, and suggest fixes. It should accept a path argument using $ARGUMENTS."

Claude will create the SKILL.md file with frontmatter (name, description, argument-hint) and the skill body. Review it and tweak the steps if you want a different workflow.

Test it:

```
/analyze src/
```

> **STOP -- What you just did:** You created your first custom skill and tested it with a path argument. The `$ARGUMENTS` placeholder captured everything after `/analyze`, so `/analyze src/` passed `src/` to the skill. This is the foundation -- you will build several more skills that become your daily shortcuts for working with Sentinel.

Say **"continue"** when you're ready for the next skill.

### Step 2: Create the "generate-tests" skill

Ask Claude to create a `/generate-tests` skill. This one should analyze a source file, identify all public functions, and generate comprehensive tests covering happy paths, edge cases, and error cases. Tell Claude you want this skill to use `context: fork` so it runs in a separate subagent and keeps your main conversation clean.

> "Create a skill at .claude/skills/generate-tests/SKILL.md. It should take a source file path, find all public functions, generate tests for happy paths, edge cases, and error cases, then run them. Use `context: fork` in the frontmatter so it runs in a subagent."

> **Why this step:** Notice `context: fork` in the frontmatter -- this skill runs in a separate subagent so test generation output does not clutter your main conversation. Forked context is ideal for verbose operations where you want the result but not the noise.

Test it by pointing it at one of your rule modules:

```
/generate-tests src/rules/complexity.py
```

(Replace with the actual path to one of your rule modules.)

### Step 3: Create the "quality-report" skill

Ask Claude to create a `/quality-report` skill. This one should run a full scan, collect findings by category and severity, calculate summary stats, and save a report to the `reports/` directory. Tell Claude to include `disable-model-invocation: true` in the frontmatter so this skill only runs when you explicitly type the command.

> "Create a skill at .claude/skills/quality-report/SKILL.md. It should run a full scan, summarize findings by category and severity, save a timestamped report to reports/, and support a format argument for text, JSON, or HTML. Set `disable-model-invocation: true` so it only runs when I call it explicitly."

Notice `disable-model-invocation: true` -- this skill only runs when you explicitly type `/quality-report`. Claude will not trigger it automatically.

> **STOP -- What you just did:** You created three skills with different behaviors: `/analyze` runs in your main conversation, `/generate-tests` forks into a subagent, and `/quality-report` uses `disable-model-invocation: true` so it only runs when you explicitly call it. These three patterns cover most skill use cases you will encounter.

> **Quick check before continuing:**
> - [ ] `/analyze src/` runs and produces output
> - [ ] `/generate-tests` runs in a forked context (you should see subagent output)
> - [ ] `/quality-report` exists with disable-model-invocation: true

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

> **Why this step:** Hot-reload means you can iterate on skills without restarting Claude Code. This makes skill development fast -- edit, test, edit, test -- just like editing code with a live-reloading server.

Edit one of your SKILL.md files (add a new step or change the description). You do not need to restart Claude Code -- skills are reloaded when invoked. Test by modifying the analyze skill and running `/analyze src/` again.

### Step 6: Create a no-AI skill

Ask Claude to create a no-AI skill that just runs a shell command. This one should list all available analysis rules by executing `sentinel rules list` -- no AI processing needed.

> "Create a skill at .claude/skills/list-rules/SKILL.md that just runs `!sentinel rules list`. Set `disable-model-invocation: true` since it doesn't need AI."

This skill just executes a shell command. No AI processing needed. Test it:

```
/list-rules
```

> **STOP -- What you just did:** You built a no-AI skill -- a slash command that runs a shell command directly without invoking the model. This is useful for quick reference commands where you do not need Claude to interpret the output. Between `/analyze`, `/generate-tests`, `/quality-report`, and `/list-rules`, you now have a custom command palette tailored to Sentinel. In real projects, you will accumulate skills like these over time until your most common workflows are all one-command operations.

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

> **Why this step:** Hooks are the automation layer of Claude Code. They let you run scripts at specific moments -- when a session starts, after a file is written, when Claude finishes a task. Understanding the lifecycle is essential because each hook event fires at a different moment and has different capabilities (some can block actions, others can only observe).

Ask Claude to walk you through the hook lifecycle. You want to understand what hooks are available, when each one fires, and how they communicate back to Claude Code.

> "Explain the Claude Code hook lifecycle -- what hooks exist, when does each one fire, and how do they communicate back?"

The key hooks are: SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse, Stop, SubagentStop, and SessionEnd. Each receives JSON via stdin and communicates via exit codes and stdout/stderr.

### Step 2: Create a SessionStart hook

This hook injects a project quality summary every time you start a session.

First, create the hook script. Ask Claude to write a script that runs Sentinel's scan on `src/`, counts issues by severity, and prints a short summary. Tell it to pick whatever scripting language makes sense for your project.

> "Create a script at .claude/scripts/session-summary.sh (or .py) that runs sentinel scan on src/, counts issues by severity, and prints a one-line summary like 'Sentinel Status: 3 errors, 12 warnings, 5 info across 24 files'. If tests have been run recently, include the pass/fail count too."

Then ask Claude to wire it up as a SessionStart hook:

> "Add a SessionStart hook to .claude/settings.json that runs the session-summary script. The stdout gets automatically added to your context, right?"

Claude will confirm and create the configuration.

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

> **STOP -- What you just did:** You created your first hook -- a SessionStart script that gives you a project health snapshot every time you open Claude Code. The key insight is that SessionStart hook stdout is automatically injected into Claude's context. This means Claude *starts every session knowing* the current state of your codebase. You will use this pattern whenever you want Claude to have up-to-date project awareness from the first prompt.

Say **"next"** when you're ready to move on.

### Step 3: Create a PostToolUse hook

This hook auto-validates rule configuration files after Claude writes them. Ask Claude to create a validation script and wire it up as a PostToolUse hook.

> "Create a script at .claude/scripts/validate-rules.sh that checks if a written file is in the rules/ directory, and if so, validates it has the required structure. It should exit 0 if valid and exit 2 with an error if invalid. Then add a PostToolUse hook in .claude/settings.json that triggers on 'Write|Edit' and runs this script."

Claude may ask about what "required structure" means for your rule files. Point it to your `docs/rule-format.md` or describe the fields you expect.

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

> **STOP -- What you just did:** You created a PostToolUse hook with a matcher. The matcher `"Write|Edit"` means this hook only fires when Claude uses the Write or Edit tool -- it ignores Bash, Read, and other tools. The hook validates rule files automatically, so if Claude writes a malformed rule definition, the validation catches it immediately and Claude sees the error. This is quality automation -- you never have to manually check rule file structure again.

> **Quick check before continuing:**
> - [ ] SessionStart hook script exists and is executable
> - [ ] `.claude/settings.json` has both SessionStart and PostToolUse hooks configured
> - [ ] You restarted Claude Code and saw the session summary appear

### Step 4: Create a Stop hook

> **Why this step:** Stop hooks fire when Claude finishes responding. They act as a final quality gate -- you can check whether Claude did what it should have (like updating tests when it changed code) before the task is considered "done." If the hook returns failure, Claude gets the feedback and can continue working.

This hook checks whether tests were updated when code changes were made. Ask Claude to add a prompt-based Stop hook that reviews whether tests were updated alongside any code changes.

> "Add a prompt-based Stop hook to .claude/settings.json. It should check if the task involved writing or modifying code, and if so, verify that tests were updated. If tests weren't updated, it should respond with ok: false and a reason."

The hook uses `"type": "prompt"` instead of `"type": "command"`. Claude Code sends the prompt to a fast LLM (Haiku) which returns a JSON decision.

### Step 5: Test your hooks

Restart Claude Code (to load the hooks). Then:

1. Verify SessionStart hook prints the quality summary
2. Ask Claude to create a new analysis rule -- verify the PostToolUse hook validates it
3. Ask Claude to modify some code -- verify the Stop hook checks for tests

> **STOP -- What you just did:** You tested the three hook types that cover the most common automation needs: SessionStart (inject context at startup), PostToolUse (validate after actions), and Stop (quality gate at the end). Together, these hooks form an invisible safety net -- they work in the background, catching issues and injecting context without you having to think about them.

When you're ready, say **"continue"** to wrap up this module.

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

Ask Claude what MCP is and how it extends Claude Code's capabilities.

> "What is the Model Context Protocol? How do MCP servers give you new abilities?"

MCP servers give Claude access to external tools, databases, and APIs through a standardized protocol. Claude can call MCP tools just like its built-in tools (Read, Write, Bash, etc.).

### Step 2: Add a SQLite MCP server

> **Why this step:** MCP servers give Claude new capabilities it does not have built in. By adding a SQLite server, Claude can directly query and modify a database -- no need to write scripts that Claude then runs via Bash. This is a cleaner, more reliable way to work with structured data.

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

> **STOP -- What you just did:** You added two MCP servers using `claude mcp add`. Each server runs as a separate process that Claude communicates with through the Model Context Protocol. The SQLite server gives Claude direct database access, and the filesystem server gives it structured file operations. Notice that `claude mcp add` registered these servers locally -- they are stored in your user config, not in the project yet. You will fix that in Step 6.

Say **"let's keep going"** when you're ready to verify the setup.

### Step 4: Verify with /mcp

Inside Claude Code:

```
/mcp
```

You should see both `sentinel-db` and `sentinel-fs` listed as connected servers.

### Step 5: Use the SQLite MCP server

Ask Claude to set up the database schema using the MCP server. Describe the tables you need -- scan results, individual issues, and coverage data. Tell Claude to also insert a sample record so you can verify everything works.

> "Using the sentinel-db MCP server, create tables for scan results, issues, and coverage tracking. I need things like timestamps, file paths, severity levels, and coverage percentages. Then insert a sample scan result from our last sentinel scan."

Claude will use the MCP SQLite tools (like `mcp__sentinel-db__query`) to create tables and insert data. Watch how it interacts with the database through natural language -- no SQL scripts needed.

> **STOP -- What you just did:** You watched Claude use MCP tools to create database tables and insert data -- all through natural language. Instead of writing SQL scripts and running them manually, you asked Claude what you wanted and it used the `mcp__sentinel-db__query` tool directly. This is the power of MCP: Claude treats external tools just like its built-in tools. You will use this pattern whenever Sentinel needs to store or retrieve structured data.

> **Quick check before continuing:**
> - [ ] Both MCP servers show as connected when you run `/mcp`
> - [ ] The sentinel.db database exists with scan_results, issues, and coverage tables
> - [ ] You can see Claude using `mcp__sentinel-db__` tools in its output

### Step 6: Create a project-scoped .mcp.json

Ask Claude to create a `.mcp.json` file so team members get the same MCP setup.

> "Create a .mcp.json file in the project root with both the sentinel-db and sentinel-fs server configurations. I want this committed to version control so anyone who clones the repo gets the same MCP setup."

### Step 7: Understand MCP scopes

> **Why this step:** MCP scopes determine who can use a server and where the config is stored. Getting this wrong means teammates cannot use your MCP setup, or you accidentally expose a local-only server in version control. Understanding scopes now saves confusion later.

Ask Claude about the different MCP scopes and when to use each one.

> "Explain MCP server scopes -- local, project, and user. When should I use each one, and where does each config live?"

- **Local** (default): private to you, stored in ~/.claude.json under your project path
- **Project**: shared via `.mcp.json` in the project root, committed to version control
- **User**: available across all your projects, stored in ~/.claude.json

### Step 8: Create a skill that uses MCP

> **Why this step:** This is where skills and MCP come together. You are about to create a skill that queries your SQLite database through MCP. This pattern -- a skill that orchestrates MCP tool calls -- is one of the most powerful combinations in Claude Code. The skill provides the workflow logic, and MCP provides the data access.

Ask Claude to create a skill that queries the SQLite database for coverage trends. Describe what you want it to show -- recent coverage entries, a trend visualization, regressions, and a summary.

> "Create a skill at .claude/skills/coverage-trend/SKILL.md that queries the sentinel-db MCP server for coverage history. It should show the last N entries (default 10, configurable via arguments), display a trend chart, highlight regressions over 2%, and summarize current coverage. It should use the mcp__sentinel-db__query tool."

This is where skills and MCP come together -- the skill provides the workflow logic, and MCP provides the data access.

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

> **Why this step:** PreToolUse is the most powerful hook event because it fires *before* a tool runs, giving you three options: allow it silently, block it with a reason, or ask the user to confirm. On top of that, you can inject extra context or even modify the tool's input. This is Claude Code's programmable permission system -- you are about to build custom guardrails for Sentinel.

Ask Claude to explain how PreToolUse decision control works.

> "Explain PreToolUse hooks -- what are the permissionDecision options (allow, deny, ask), and how do additionalContext and updatedInput work?"

PreToolUse hooks can return JSON with:
- `permissionDecision: "allow"` -- auto-approve the tool call
- `permissionDecision: "deny"` -- block the tool call, with a reason shown to Claude
- `permissionDecision: "ask"` -- prompt the user to confirm
- `additionalContext` -- inject extra information into Claude's context
- `updatedInput` -- modify the tool's input parameters before execution

### Step 2: Guard against invalid rule schemas

Ask Claude to create a hook that prevents saving analysis rules with missing required fields. Describe the behavior you want -- it should check files being written to the rules or analyzers directory, validate they have the right structure, and deny the write with a helpful reason if something is missing.

> "Create a PreToolUse hook that validates rule schemas. If I'm writing a file to rules/ or analyzers/, the hook should check that it has the required fields. If invalid, deny the write with a reason. If valid, let it through. Put the script in .claude/scripts/ and add it to settings.json on the 'Write' tool."

Claude may ask what "required fields" means for your rules. Point it to your rule format documentation.

A denial returns JSON like: `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Rule file missing required 'severity' field."}}`

> **STOP -- What you just did:** You built a schema validation guardrail. When Claude tries to write a rule file with missing required fields, the hook blocks the write and tells Claude exactly what is wrong. Claude then sees the denial reason and can fix the file before trying again. This is "fail fast" automation -- bad data never reaches disk. You will use this pattern whenever you have strict format requirements for generated files.

Say **"continue"** when you're ready for the next step.

### Step 3: Inject context about related analyzers

Now create a hook that enriches Claude's context when it reads rule files. Ask Claude to build a script that detects when a rule file is being read and injects information about related analyzer files using `additionalContext`.

> "Create a PreToolUse hook on 'Read' that checks if the file being read is in rules/. If so, find all related analyzer files and inject them as additionalContext so you know the full picture when working on rules. Put the script in .claude/scripts/ and add it to settings.json."

The output uses `additionalContext` to inject text like: "Related analyzers: complexity_rule, naming_rule, docstring_rule. See docs/rule-format.md for the rule interface."

> **STOP -- What you just did:** You built a context injection hook. Unlike the deny hook which blocks actions, this one enriches Claude's understanding by adding information when it reads certain files. When Claude opens a rule file, the hook automatically tells it about related analyzers. This is like giving Claude a "see also" sidebar -- it makes connections between files that Claude might not discover on its own.

> **Quick check before continuing:**
> - [ ] Your deny hook blocks writes of invalid rule schemas
> - [ ] Your context injection hook adds related analyzer info when reading rule files
> - [ ] Both hooks are configured in `.claude/settings.json` as PreToolUse entries

### Step 4: Auto-add metadata to generated test files

Now create a hook that silently adds metadata to generated test files. Ask Claude to build a script that detects when a test file is being written and uses `updatedInput` to prepend a metadata comment with the generation timestamp and the source file being tested.

> "Create a PreToolUse hook on 'Write' that checks if the file being written is a test file. If so, use updatedInput to prepend a metadata comment with the timestamp and the source file being tested. Put the script in .claude/scripts/ and add it to settings.json."

The output uses `updatedInput` to modify the file content before it is written, prepending a metadata header with the timestamp and source file path.

> **Why this step:** `updatedInput` is the third and most subtle PreToolUse capability. While `deny` blocks an action and `additionalContext` injects information, `updatedInput` silently transforms what Claude writes. The test file reaches disk with metadata already included -- Claude does not even need to remember to add it. Use this for any boilerplate that should always be present in generated files.

### Step 5: Prompt-based quality gate for generated tests

Add a second prompt-based Stop hook that specifically reviews test quality. Ask Claude to create one that checks whether generated tests have good edge case coverage, meaningful assertions (not just "assert true"), and proper test independence.

> "Add a prompt-based Stop hook (type: prompt, timeout: 30) that evaluates test quality when tests were generated. It should check for edge case coverage, meaningful assertions, and test independence. Return ok: false with a reason if it finds quality issues."

This demonstrates stacking multiple Stop hooks -- the Module 5 hook checks that tests exist, this one checks that they are good.

> **STOP -- What you just did:** You now have four PreToolUse/Stop hooks working together: schema validation (deny), context injection (additionalContext), metadata insertion (updatedInput), and quality review (prompt-based Stop). These hooks form a layered defense -- each catches a different category of problem. Notice how they stack: you can have multiple hooks on the same event, and they all run. This composability is what makes hooks powerful for real projects.

### Step 6: Test the guard rails

> **Quick check before continuing:**
> - [ ] All four hooks are configured in `.claude/settings.json`
> - [ ] You understand the difference between deny, additionalContext, and updatedInput
> - [ ] The prompt-based Stop hook is set up to review test quality

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

> **Why this step:** Up to now, everything has happened in a single Claude conversation. Subagents let you spin up specialized Claude instances -- each with their own system prompt, tool access, and context window. Think of it as delegation: instead of doing everything yourself, you assign specific jobs to specialists. This keeps your main conversation clean and lets you parallelize work.

Ask Claude what subagents are and when you should use them instead of the main conversation.

> "What are Claude Code subagents? How are they different from this main conversation, and when should I use one?"

Key points: subagents run in their own context window with a custom system prompt and specific tool access. They keep verbose output out of your main conversation. They cannot spawn other subagents.

### Step 2: Create the analyzer agent

Ask Claude to create a specialized analyzer agent. Describe its role -- deep code analysis, running the scanner, evaluating whether issues are true or false positives, and suggesting fixes. Tell Claude to give it read-only tools (no Write or Edit) since it should find issues, not fix them. Suggest using the `sonnet` model to save tokens.

> "Create an analyzer agent at .claude/agents/analyzer-agent.md. It should be a deep analysis specialist -- runs the scanner, evaluates each issue for true/false positive, assesses severity, and suggests fixes. Give it only Read, Grep, Glob, and Bash tools (no Write). Use model: sonnet."

> **STOP -- What you just did:** You created a specialized analyzer agent with limited tool access (Read, Grep, Glob, Bash -- no Write or Edit). This is intentional: the analyzer agent should *find* issues, not *fix* them. Restricting tools prevents subagents from doing things outside their role. The `model: sonnet` setting means this agent uses a cheaper model -- since analysis does not require the most powerful model, this saves tokens.

Say **"next"** when you're ready to create the test writer agent.

### Step 3: Create the test writer agent

Now create a test writer agent. This one needs Write and Edit tools since it creates test files. Describe its job -- read source files, identify public functions, generate comprehensive tests, run them, and fix failures.

> "Create a test writer agent at .claude/agents/test-writer-agent.md. It should read source files, identify all public functions, generate tests covering happy paths, edge cases, and error cases, then run them and fix any failures. Give it Read, Write, Edit, Bash, Grep, and Glob tools. Use model: sonnet. It should follow our .claude/rules/tests.md conventions."

### Step 4: Create the reporter agent

Finally, create a reporter agent. Since formatting is a simpler task, this one can use `model: haiku` to save tokens. Describe its job -- gather analysis data and format it as text, JSON, or HTML.

> "Create a reporter agent at .claude/agents/reporter-agent.md. It should gather analysis data and format it as text, JSON, or HTML reports. HTML reports should include summary metrics, issue distribution tables, and severity color coding. Save to reports/. Use model: haiku since formatting doesn't need the most powerful model. Give it Read, Write, Bash, and Glob tools."

> **STOP -- What you just did:** You created three agents with deliberately different configurations. The analyzer has read-only tools and uses sonnet. The test writer has write tools (it needs to create test files) and uses sonnet. The reporter uses haiku because formatting is a simpler task. This is the key design principle for subagents: match the model and tools to the job. Expensive models for hard reasoning, cheap models for mechanical work.

> **Quick check before continuing:**
> - [ ] `.claude/agents/` has three agent files: analyzer, test-writer, reporter
> - [ ] Each agent has different tool access appropriate to its role
> - [ ] You understand why different agents use different models

### Step 5: Understand frontmatter options

Ask Claude to walk you through all the available frontmatter fields for subagents.

> "What frontmatter fields can I use in subagent files? Walk me through name, description, tools, disallowedTools, model, permissionMode, skills, and hooks."

### Step 6: Chain agents

> **Why this step:** Chaining is when the output of one agent feeds into the input of the next. This is a pipeline pattern -- the analyzer finds problems, then the test writer generates tests for exactly those problems. Neither agent needs to know about the other; Claude orchestrates the handoff in your main conversation.

Ask Claude to chain the two agents -- have the analyzer find issues first, then pass those findings to the test writer to generate targeted tests.

> "Use the analyzer-agent to analyze src/rules/. Then use the test-writer-agent to generate tests for any files the analyzer flagged."

Claude will run the analyzer agent first, receive its findings, then pass relevant context to the test writer agent. This is **chaining**: the output of one agent feeds into the next.

> **STOP -- What you just did:** You chained two subagents -- the analyzer found issues, and the test writer generated tests targeting those specific issues. This pipeline pattern is how you build complex workflows from simple, focused agents. In real projects, you might chain: analyzer -> fixer -> reviewer, or scanner -> reporter -> notifier.

When you're ready, say **"let's keep going"** to try parallel agents.

### Step 7: Run agents in parallel and background

Ask Claude to fan out analysis across multiple directories using parallel subagents. Tell it to run them in the background so you can keep working.

> "In parallel, use separate subagents to analyze src/scanner/, src/rules/, and src/reporters/ for code quality. Run them in the background so I can keep working."

Press `Ctrl+B` if Claude starts a foreground agent and you want to move it to the background. Use `/tasks` to see running background tasks.

> **STOP -- What you just did:** You ran three subagents in parallel, each analyzing a different directory simultaneously. This is the key advantage of subagents for large codebases -- instead of analyzing directories one by one, you fan out the work. Background mode (`Ctrl+B`) lets you continue working in your main conversation while agents crunch away. You will use this pattern whenever you have independent tasks that can run concurrently.

Say **"continue"** when you're ready for the next step.

### Step 8: Resume a subagent

After a subagent completes, you can resume it to continue its work. Try extending the analyzer agent's previous run:

> "Continue the analyzer-agent from the previous analysis and now also check for security issues in the same files."

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

> **Why this step:** The Tasks system solves a problem you have probably already hit: multi-step features that are too big for a single conversation. Tasks let you break work into pieces with explicit dependencies (Task B cannot start until Task A is done), persist across sessions, and share between multiple Claude instances. This is project management built into Claude Code.

Ask Claude to explain the Tasks system and how it differs from a simple to-do list.

> "Explain the Claude Code Tasks system. How do tasks differ from TodoWrite? How do dependencies work, and how do tasks persist across sessions?"

Key points: Tasks support dependency graphs (task B depends on task A). They are stored in `~/.claude/tasks/` on the filesystem. Multiple sessions or subagents can share a task list using `CLAUDE_CODE_TASK_LIST_ID`.

### Step 2: Cross-session task persistence

Ask Claude to create a task list for adding coverage tracking to Sentinel. Describe the feature at a high level and ask Claude to break it into dependent tasks. You might suggest roughly how many tasks and what the dependencies should be, or let Claude propose a breakdown and then discuss it.

> "I want to add coverage tracking to Sentinel. Break this into about 5 tasks with dependencies -- start with designing the data model, then building the parser, integrating with the engine, adding to reports, and historical trends with SQLite. Show me the dependency graph."

Claude will use the Tasks system to create these. Press `Ctrl+T` to toggle the task list view in your terminal.

> **STOP -- What you just did:** You created a dependency graph, not a flat to-do list. Task 2 (implement parser) cannot start until Task 1 (design data model) is done, because the parser needs to know what structures to produce. Task 5 depends on both Tasks 3 and 4. Claude enforces these dependencies -- it will not start a blocked task. This prevents the common mistake of building on top of unfinished foundations.

Say **"next"** when you're ready to start building.

### Step 3: Start the first task

Tell Claude to start working on the first task.

> "Start on Task 1 -- design the coverage data model."

Claude will update the task status and begin working. When it finishes, the task will be marked complete and Task 2 will become unblocked.

### Step 4: Practice strict TDD -- build the coverage parser

> **Why this step:** Test-driven development (TDD) is the most disciplined way to build reliable code with Claude. By writing the test first, you give Claude a concrete, unambiguous specification. Claude does not have to guess what "correct" means -- the test defines it. The red-green-refactor cycle (fail, pass, clean up) produces code that is tested by definition.

For Task 2, tell Claude to use strict test-driven development. Describe the TDD cycle you want it to follow -- write one failing test, write minimum code to pass it, refactor, repeat. Give it a simple starting behavior to test first.

> "Implement the coverage parser using strict TDD. Write ONE failing test for the simplest behavior first -- like 'the parser can read a coverage report file and return the total line count.' Run it, confirm it fails, then write the minimum code to pass. Refactor if needed, then move to the next test. Don't skip ahead."

Watch Claude go through multiple red-green-refactor cycles. This is where the build-test-fix loop becomes second nature.

> **STOP -- What you just did:** You watched Claude do strict TDD: write a failing test, write the minimum code to pass it, then move on. Notice how each cycle was small and focused. Claude did not try to implement the entire parser at once -- it built one behavior at a time, with tests proving each step works. This incremental approach catches bugs immediately instead of at the end when they are hard to trace.

> **Quick check before continuing:**
> - [ ] The coverage parser has at least one passing test
> - [ ] You saw Claude go through the red-green-refactor cycle (test fails, then passes)
> - [ ] Task 1 is marked complete and Task 2 is in progress

Continue through progressively harder tests. Guide Claude to the next behavior you want to test:

> "Next test: the parser should extract per-file coverage data."

Then after that passes:

> "Next: handle missing or malformed coverage files gracefully."

Then edge cases:

> "Now test coverage percentage calculation -- include edge cases like zero lines, 100% coverage, and empty files."

### Step 5: Complete the remaining tasks

> **Why this step:** Now you let the task system guide your workflow. Instead of deciding what to build next, you ask Claude for the next unblocked task. The dependency graph ensures you build things in the right order. As each task completes, downstream tasks become available automatically.

Work through Tasks 3-5, letting Claude update task status as each completes. Just tell it to move on:

> "What's the next unblocked task? Let's work on it."

Check the task list periodically with `Ctrl+T` or ask Claude for a status update:

> "Show me the current status of all tasks."

> **STOP -- What you just did:** You completed a multi-task feature using the dependency graph to guide your work order. Notice how you never had to think about "what should I build next?" -- the task system told you. In a real project, you would create task lists at the start of each feature and let the dependency graph keep you on track across sessions.

Ready? Say **"continue"** and we'll add quality gates for subagents.

### Step 6: SubagentStop hooks for verification

> **Why this step:** SubagentStop hooks are quality gates for subagent work. Just like Stop hooks check your main conversation, SubagentStop hooks check what subagents produce before they finish. This is especially important because subagents run with less oversight -- you might not see their intermediate steps.

Ask Claude to add a SubagentStop hook that acts as a quality gate for subagent work.

> "Add a prompt-based SubagentStop hook to settings.json that checks whether a subagent that wrote code also ran the test suite. If tests weren't run, respond with ok: false and tell the subagent to run tests before finishing."

### Step 7: Cross-session collaboration

> **Why this step:** Cross-session task sharing is how you scale to multiple Claude instances working on the same feature. This is the foundation for the parallel development workflow you will use in Module 10.

Start a second Claude Code session that shares the same task list:

```
CLAUDE_CODE_TASK_LIST_ID=sentinel-coverage claude
```

In the second session, you can see the same tasks and their current statuses. If one session completes a task, the other session sees the update.

> **STOP -- What you just did:** You shared a task list between two separate Claude Code sessions using `CLAUDE_CODE_TASK_LIST_ID`. Both sessions see the same tasks and their statuses update in real time. This is how you coordinate parallel work -- one session works on Task A while another works on the independent Task B, and neither duplicates effort. You will use this pattern heavily in Module 10 with git worktrees.

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

> **Why this step:** Git worktrees let you have multiple working copies of the same repo *without cloning it again*. Each worktree shares the same git history but has its own working directory and branch. Combined with Claude Code, this means you can have two or three Claude instances building different features in parallel on the same project -- true concurrent development.

Git worktrees let you have multiple working copies of the same repo. Each worktree can have its own Claude Code session working on a different feature simultaneously.

```
! git worktree add ../sentinel-coverage-html feature/coverage-html
! git worktree add ../sentinel-rule-import feature/rule-import
```

Now you have three working copies:
- `sentinel/` -- main development
- `sentinel-coverage-html/` -- HTML coverage reports
- `sentinel-rule-import/` -- importing rules from external files

> **STOP -- What you just did:** You created two git worktrees -- separate working directories that share the same repository. Each one is on its own feature branch. This is the infrastructure for parallel development: you now have three separate directories where Claude Code sessions can work independently without merge conflicts until you are ready to combine the work.

Say **"continue"** when you're ready to spin up parallel sessions.

### Step 2: Multiple Claude Code instances with shared tasks

> **Why this step:** This is where everything comes together -- worktrees for isolation, shared task lists for coordination, and multiple Claude instances for speed. Each instance picks up a different task and works on it independently. This is how you multiply your throughput on large features.

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

Create tasks in one session. Describe two independent features that can be built in parallel:

> "Create two independent tasks: 1) Add HTML coverage report with charts and drill-down, 2) Add rule import from YAML/JSON files. No dependencies between them."

Each session picks up a different task. They work in parallel on separate branches, sharing task status.

> **STOP -- What you just did:** You ran two Claude Code instances simultaneously, each in its own worktree with its own branch, sharing a single task list. Session 1 works on HTML coverage reports while Session 2 works on rule import -- neither blocks the other. When both are done, you merge their branches. This is the most advanced Claude Code workflow: parallel, coordinated, independent development.

> **Quick check before continuing:**
> - [ ] You have two (or more) worktrees created from the sentinel repo
> - [ ] Each worktree has its own Claude Code session running
> - [ ] Both sessions share the same task list via CLAUDE_CODE_TASK_LIST_ID

### Step 3: Build a plugin

Ask Claude to bundle everything you have built into a distributable plugin. Describe what you want packaged -- skills, agents, hooks, and MCP config -- and the directory structure.

> "Create a plugin called 'quality-tools' that packages all our skills, agents, hooks, and the SQLite MCP config into a single distributable directory. It needs a manifest at .claude-plugin/plugin.json with name, description, and version."

Claude will create the plugin structure:

```
quality-tools/
  .claude-plugin/plugin.json    # manifest (name, description, version)
  skills/                       # all SKILL.md dirs
  agents/                       # all agent .md files
  hooks/hooks.json              # guard rail hooks
  .mcp.json                     # SQLite MCP server
```

> **Why this step:** Plugins are how you distribute Claude Code customizations. Everything you built in Modules 4-8 -- skills, agents, hooks, MCP configs -- gets bundled into a single directory that anyone can load with `--plugin-dir`. This is how you share your work with teammates or the community.

### Step 4: Test the plugin

```
claude --plugin-dir ./quality-tools
```

Verify that skills are available under the `quality-tools:` namespace:

```
/quality-tools:analyze src/
```

> **STOP -- What you just did:** You bundled all of Sentinel's Claude Code customizations into a portable plugin and loaded it in a fresh Claude instance. Notice the namespace prefix (`quality-tools:analyze` instead of just `analyze`) -- this prevents naming conflicts when multiple plugins are loaded. Your skills, agents, hooks, and MCP configs all travel together as a single distributable unit.

Say **"next"** when you're ready to move on.

### Step 5: Build an evaluation framework

> **Why this step:** Evaluation measures how well Sentinel actually works. Without it, you are guessing whether your analyzer catches real issues or produces false positives. By creating fixtures with planted bugs and comparing Sentinel's output to expected results, you get concrete accuracy metrics. This is the same approach used to evaluate AI models -- ground truth comparison.

Ask Claude to build an evaluation framework for Sentinel. Describe what you need -- fixture files with planted bugs, expected outputs, a runner that scores accuracy, and a summary report.

> "Build an evaluation framework for Sentinel. I need fixture source files with planted bugs in eval/fixtures/, expected analysis output in eval/expected/, and a runner script that compares Sentinel's output to the expected results and scores true positive rate, false positive rate, false negative rate, and severity accuracy. Run the eval and show me the results."

Claude might ask about how many fixtures you want or what kinds of bugs to plant. Tell it to start with a few representative examples and you will add more over time.

> **STOP -- What you just did:** You built a scoring framework that measures Sentinel's accuracy with real metrics: true positive rate (how many real issues it catches), false positive rate (how often it flags clean code), false negative rate (how many real issues it misses), and severity accuracy. These numbers tell you exactly where Sentinel needs improvement. Every time you add a new rule or change the analyzer, re-running the eval tells you whether you made things better or worse.

When you're ready, say **"let's keep going"** to continue.

### Step 6: PermissionRequest hooks

Ask Claude to create a PermissionRequest hook that auto-approves safe operations but still prompts for risky ones.

> "Add a PermissionRequest hook that auto-approves running tests and sentinel scan, but still prompts me for writes to config files, git push, and destructive commands. Create the script at .claude/scripts/auto-approve.sh."

The hook matches on "Bash" and runs your approval script. The script outputs JSON with `{"hookSpecificOutput": {"hookEventName": "PermissionRequest", "decision": {"behavior": "allow"}}}` for safe commands.

> **STOP -- What you just did:** You built a programmable permission system. Instead of clicking "approve" every time Claude wants to run tests or scan code, the PermissionRequest hook auto-approves safe operations while still prompting for risky ones like git push or config changes. This dramatically speeds up your workflow -- Claude can run tests dozens of times without you clicking "yes" each time, but it still asks before doing anything destructive.

> **Quick check before continuing:**
> - [ ] Your evaluation framework has fixture files with planted bugs
> - [ ] Running the eval produces accuracy metrics (TP rate, FP rate, etc.)
> - [ ] The PermissionRequest hook auto-approves test runs and sentinel scans
> - [ ] The PermissionRequest hook still prompts for writes to config files and git push

### Step 7: Continuous learning

> **Why this step:** This is the capstone pattern -- a feedback loop where Sentinel improves itself over time. Misclassifications from the eval are logged, loaded into Claude's context at session start, and used to guide future fixes. After each fix, the eval runs again to confirm the fix worked and check for regressions. This is how production ML systems improve, and you are applying the same principle to your code analyzer.

Ask Claude to build a feedback loop where eval results drive improvements. Describe the cycle you want -- log misclassifications, load them at session start, fix them, re-run eval, and record lessons learned.

> "Create a continuous learning loop: log false positives and negatives from the eval to eval/learning/misclassifications.jsonl. Add a SessionStart hook that loads recent misclassifications into context. After fixing one, re-run the eval to confirm and check for regressions. Then update CLAUDE.md with the lesson learned."

> **STOP -- What you just did:** You closed the loop: eval finds problems, you fix them, eval confirms the fix, and CLAUDE.md records the lesson. This means every future session starts with the accumulated knowledge of past mistakes. Over time, Sentinel gets more accurate and Claude gets better at working with it. This continuous learning pattern is the most sophisticated workflow in the entire curriculum -- it combines hooks (SessionStart), memory (CLAUDE.md), evaluation (scoring framework), and iterative improvement into a single self-reinforcing system.

Say **"continue"** when you're ready to wrap up.

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
