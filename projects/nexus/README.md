# Nexus -- Local API Gateway

An intermediate Claude Code project where you build an HTTP gateway with routing, rate limiting, SQLite caching, and health checks -- growing it into a full-featured local service mesh.

**Who this is for:** Backend developers and service builders who want hands-on practice with every major Claude Code feature.

**What you will build:** A local API gateway that accepts HTTP requests, matches them against a route registry, forwards them to upstream services, applies rate limiting, caches responses in SQLite, and exposes health check endpoints. By the end, you will have a CLI tool (`nexus start`, `nexus routes list`, `nexus health`) and a deeply customized Claude Code environment with hooks, skills, subagents, tasks, and plugins.

**What you will learn:** All 10 modules cover the complete Claude Code feature set:

| Module | CC Features | Project Feature |
|--------|------------|-----------------|
| 1 | CLAUDE.md, /init, /memory, keyboard shortcuts | Project setup |
| 2 | Plan mode, git integration, prompting | Core gateway + CLI |
| 3 | .claude/rules/, @imports, /context, /compact, /cost | Rate limiting |
| 4 | Skills, SKILL.md, frontmatter, custom commands | Route management skills |
| 5 | Hooks, SessionStart, PostToolUse, Stop | Gateway automation |
| 6 | MCP servers, .mcp.json, scopes | SQLite caching layer |
| 7 | PreToolUse, decision control, prompt-based hooks | Guard rails |
| 8 | Subagents, .claude/agents/, chaining | Specialized agents |
| 9 | Tasks, dependencies, TDD, SubagentStop | Middleware system |
| 10 | Worktrees, plugins, evaluation | Parallel dev + packaging |

**Prerequisites:** None — all 3 projects are independent. Pick based on what sounds fun to build.

---

## Set Up Your Dev Environment

Before starting, set up your language toolchain and SQLite. Pick any language you are comfortable with. The exercises describe **what** to build, not how -- you choose the implementation.

### Python

```
python --version          # 3.10+
mkdir -p workspace/nexus-gateway && cd workspace/nexus-gateway
python -m venv .venv
# Windows: .venv\Scripts\activate | macOS/Linux: source .venv/bin/activate
pip install pytest
```

### TypeScript / Node.js

```
node --version            # 18+
mkdir -p workspace/nexus-gateway && cd workspace/nexus-gateway
npm init -y
npm install --save-dev typescript @types/node ts-node jest @types/jest ts-jest
npx tsc --init
```

### Go

```
go version                # 1.21+
mkdir -p workspace/nexus-gateway && cd workspace/nexus-gateway
go mod init nexus-gateway
```

### Rust

```
rustc --version && cargo --version
cargo new workspace/nexus-gateway && cd workspace/nexus-gateway
```

### Environment Isolation

**Environment isolation:** If you chose an environment during `/start` (venv, conda, or Docker), it's already set up in your project directory. If you skipped it and want to add one later, ask Claude: "Help me set up [venv/conda/Docker] for this project."

### SQLite Setup

This project uses SQLite for caching from Module 6 onward. Install it now.

```
sqlite3 --version
# Windows: download from https://sqlite.org/download.html
# macOS: ships with the OS
# Linux (Debian/Ubuntu): sudo apt-get install sqlite3 libsqlite3-dev
# Verify: sqlite3 :memory: "SELECT 'SQLite is working';"
```

Your language will also need an SQLite library:

| Language | Library |
|----------|---------|
| Python | `sqlite3` (built-in) |
| TypeScript | `better-sqlite3` or `sql.js` |
| Go | `github.com/mattn/go-sqlite3` or `modernc.org/sqlite` |
| Rust | `rusqlite` |

### Verify Your Environment

Run `<language> --version`, `git --version`, `sqlite3 --version`, and `claude --version`. If any command fails, fix it before continuing. Claude Code can help -- launch `claude` and ask it to troubleshoot.

---

## Module 1 -- Setup & First Contact

**CC features:** CLAUDE.md, /init, /memory, interactive mode, keyboard shortcuts

> **Used `/start`?** Module 1 was completed during onboarding. Jump to [Module 2 -- Blueprint & Build](#module-2--blueprint--build).

### Step 1: Create Your Project

Open a terminal in the cc-self-train directory and create the project under `workspace/`:

```
mkdir -p workspace/nexus-gateway
cd workspace/nexus-gateway
git init
```

### Step 2: Launch Claude Code

```
claude
```

You are now in an interactive Claude Code session. This is your primary interface for the entire project.

### Step 3: Run /init

Type the following into Claude Code:

```
/init
```

Claude will scan your directory and generate a `CLAUDE.md` file. Since the directory is mostly empty, the file will be minimal. That is fine -- you will build it up throughout the project.

### Step 4: Tour of CLAUDE.md

Ask Claude: `Read CLAUDE.md and explain what each section does and why it matters`

CLAUDE.md is Claude's persistent memory for your project. It loads automatically every session and can contain build commands, architecture notes, coding conventions, and workflow preferences.

### Step 5: Keyboard Shortcuts

Practice each shortcut in the table below. Do not skip this -- muscle memory with these shortcuts saves significant time across the remaining 9 modules.

| Shortcut | What It Does | Try It Now |
|----------|-------------|------------|
| `Tab` | Accept a suggestion or autocomplete | Type a partial file path and press Tab |
| `Shift+Tab` | Toggle between Plan mode and Act mode | Press it twice to cycle back |
| `Ctrl+C` | Cancel current generation or clear input | Start a long prompt, then cancel |
| `Ctrl+L` | Clear terminal screen (keeps history) | Clear the screen, then scroll up |
| `@` | File path autocomplete | Type `@CLAUDE` and see the suggestion |
| `!` | Bash mode -- run a shell command directly | Type `! git status` |
| `Shift+Enter` or `\` + `Enter` | Multiline input | Type a two-line message |
| `Esc Esc` | Rewind conversation/code to a previous state | Press Escape twice |
| `Ctrl+O` | Toggle verbose output | See detailed tool usage |
| `Ctrl+R` | Reverse search command history | Search through previous inputs |

### Step 6: Explore /memory

Type `/memory` to open CLAUDE.md in your system editor. Add a project overview, placeholder commands (start server, run tests, check health), and an architecture section to be filled in Module 2. Save and close -- Claude now has this context in every future session.

### Step 7: Exercise

Ask Claude: `Explain what CLAUDE.md is, where it lives in the hierarchy, and how it differs from .claude/rules/ files. Show the memory hierarchy from most to least specific.`

Verify Claude explains: CLAUDE.md (project) > CLAUDE.local.md (local/personal) > ~/.claude/CLAUDE.md (user-global), plus .claude/rules/ for modular, path-scoped rules.

### Checkpoint

- [ ] `workspace/nexus-gateway/` directory exists with `git init` completed
- [ ] CLAUDE.md exists with project overview content
- [ ] You ran `/init` successfully
- [ ] You can use `Shift+Tab` to toggle plan mode
- [ ] You tried all 10 keyboard shortcuts from the table
- [ ] You opened `/memory` and edited CLAUDE.md
- [ ] You can explain the memory hierarchy

---

## Module 2 -- Blueprint & Build

**CC features:** Plan mode, git integration, basic prompting

### Step 1: Enter Plan Mode

Press `Shift+Tab` to switch to Plan mode. The indicator in your prompt area changes to show you are in planning mode. In plan mode, Claude analyzes and designs without making changes to files.

> **Why this step:** Plan mode lets you think through architecture *with* Claude before any code exists. This prevents the "just start coding" trap where you build the wrong thing and have to rewrite it later.

### Step 2: Design the Architecture

Now describe your gateway to Claude. Tell it about the core pieces you want -- an HTTP server, a route registry, request forwarding, a config file, a health endpoint, and a CLI. Don't worry about getting the prompt perfect; just describe your vision and let Claude ask clarifying questions.

Something like:

> "I want to build a local API gateway called nexus-gateway. It should listen for HTTP requests, match them against configured routes, and forward them to upstream services. I also want a CLI, a health check endpoint, and a config file for route definitions. Help me design the architecture -- ask me questions about anything that's unclear."

Claude will probably ask about your config format preference (YAML, JSON, TOML), how you want to handle path parameters, and what the CLI commands should look like. Answer naturally -- these are your design decisions.

Once Claude produces a plan with a directory structure and module breakdown, read it carefully. Push back on anything you would do differently. Remember, you are still in Plan mode, so nothing is being written to disk yet.

### Step 3: Review and Iterate

Read Claude's plan carefully. While still in Plan mode, push on the details. Ask about edge cases:

> "What happens when no route matches? How will path parameters like /users/:id work? Where does the config file live?"

If something in the design feels off, say so. Claude will revise. Iterate until you are satisfied -- this is a conversation, not a one-shot prompt.

> **STOP -- What you just did:** You used plan mode to design your gateway's architecture before writing any code. This is one of Claude Code's most powerful patterns: think through complex decisions *with* Claude before committing to an approach. Plan mode prevents the "just start coding" trap that leads to rewrites. You will use this plan-first pattern at the start of every major feature.

### Step 4: Exit Plan Mode and Execute

Press `Shift+Tab` to switch back to Act mode. Now ask Claude to create the project structure you just designed together. Tell it to set up the directory layout, create placeholder files for each module, and write a config file with a couple of example routes.

> "Let's build out the project structure from our plan. Create the directories, placeholder files, and a config file with two example routes -- one for /api/users and one for /api/products."

> **Why this step:** Feature branches keep your experiments separate from working code. If something goes wrong, you can throw away the branch without affecting main. This is standard practice in professional development and Claude Code's git integration makes it seamless.

### Step 5: Create a Feature Branch

```
! git add -A
! git commit -m "Initial project structure"
! git checkout -b feature/core
```

Or ask Claude to handle the git workflow for you:

> "Create a feature branch called feature/core and commit the current project structure."

> **STOP -- What you just did:** You went from an empty directory to a planned, structured project on its own feature branch -- all without leaving Claude Code. The `!` prefix for shell commands and Claude's ability to run git operations mean your entire workflow lives in one place. Notice how each prompt was focused on one concern (structure, then commit, then branch) rather than asking for everything at once.

Ready to start building the core gateway?

### Step 6: Implement the Core Gateway

> **Why this step:** Breaking implementation into separate, focused prompts (server, routing, forwarding) gives Claude better results than one giant "build everything" prompt. Each prompt is specific enough that Claude can implement it completely before moving on.

Work with Claude to build the core components one at a time. Start by asking for the HTTP server -- tell Claude it should read the port from config, listen for requests, pass them to the route matcher, and return 404 when nothing matches.

> "Let's start with the HTTP server module. It needs to read the port from config, listen for requests, hand them off to the route matcher, and return a 404 JSON response when no route matches."

Once that is working, move to route matching. Describe what you need -- loading routes from config, matching by method and path pattern, supporting exact and prefix matches.

> "Now let's build the route matching module. It should load routes from our config file and match incoming requests by method and path. I want exact path matches and simple prefix matching."

Then ask for request forwarding -- taking the matched upstream target, forwarding the original request, and handling connection errors with 502.

> "Next, the request forwarding module. It takes the matched upstream target, forwards the original request with its method, headers, and body, and returns the upstream response. If the upstream is unreachable, return 502 Bad Gateway."

Notice the pattern: each prompt focuses on one component. Claude will ask you clarifying questions along the way -- answer them based on your design from Step 2.

### Step 7: Write and Run Tests

Ask Claude to write tests for the route matching module. Describe the scenarios you care about -- exact matches, prefix matches, method filtering, no-match behavior, and priority when multiple routes could match. Let Claude decide on the test structure.

> "Write tests for the route matcher. I want to cover exact path matching, prefix matching, method filtering, what happens when nothing matches, and which route wins when multiple routes could match. Then run them."

After tests pass, ask Claude to commit the work with a descriptive message.

> "Commit the route matching implementation and its tests."

> **STOP -- What you just did:** You built the core gateway and validated it with tests -- the build-test-commit cycle that you will repeat for every feature going forward. Notice the pattern: implement a focused piece, write tests to prove it works, commit when tests pass. This tight loop catches bugs early and gives you safe rollback points.

> **Quick check before continuing:**
> - [ ] The gateway starts and listens on a port
> - [ ] Route matching works for at least 2 routes
> - [ ] Tests pass for the route matching module
> - [ ] You are on the feature/core branch (not main)

### Step 8: Implement the CLI

Tell Claude about the CLI you want. Describe the subcommands -- starting the server, listing routes, adding a route, and checking health. Let Claude suggest the argument structure and help text.

> "I want a CLI for the gateway. I need commands to start the server, list all configured routes, add a new route with a path, method, and upstream, and check if the gateway is healthy. What's the best way to structure this?"

Claude will implement the CLI and may ask about argument parsing libraries for your language. Pick what you are comfortable with.

### Step 9: Manual Testing

Start a simple upstream service (or ask Claude to create a tiny echo server), then test the gateway end-to-end. Ask Claude to help you set up the test and walk you through the curl commands.

> "Help me test the gateway manually. I need a simple echo server on port 4001 as an upstream, then show me how to test each route and the /health endpoint with curl."

Claude will create the echo server, start the gateway, and give you the curl commands. Run them and verify the responses look right.

### Step 10: Merge to Main

Ask Claude to commit any remaining changes and merge the feature branch back to main.

> "Commit everything and merge feature/core into main."

> **STOP -- What you just did:** You completed a full feature development cycle: plan in plan mode, branch, implement incrementally, test, and merge. This plan-branch-build-test-merge workflow is how professional teams ship software, and you just did it entirely through Claude Code. Every future module builds on this same cycle.

### Checkpoint

- [ ] You used Plan mode to design before building
- [ ] The gateway starts and listens on the configured port
- [ ] Route matching works for at least 2 routes
- [ ] /health returns `{"status": "ok"}`
- [ ] Tests pass for the route matching module
- [ ] CLI commands work: start, routes list, health
- [ ] Feature branch merged to main
- [ ] At least 3 meaningful git commits

---

## Module 3 -- Rules, Memory & Context

**CC features:** .claude/rules/, CLAUDE.local.md, @imports, /context, /compact, /cost

> **Why this step:** Rules files let you give Claude permanent, file-specific instructions. Instead of repeating "always validate HTTP methods" in every prompt, you write it once in a rules file and Claude follows it automatically whenever it touches matching files.

### Step 1: Create Path-Scoped Rules

Ask Claude to create a `.claude/rules/` directory with three rule files. Describe what each rule should enforce and which files it should apply to. Let Claude figure out the exact frontmatter syntax.

> "Create a .claude/rules/ directory with three rule files. First, a routing rule that applies to route and handler files -- it should enforce HTTP method validation, proper status codes (200, 400, 404, 502, 503), and request logging. Second, a config rule that applies to YAML, JSON, and TOML files -- it should enforce validation on load with clear error messages. Third, a testing rule for test and spec files -- it should require both success and error path coverage with descriptive test names."

Claude will create the files with the correct `paths:` frontmatter to scope each rule. After creating them, edit a route handler file and notice Claude follows the routing rules automatically.

> **STOP -- What you just did:** You created path-scoped rules that automatically activate when Claude works on matching files. The `paths:` frontmatter is the key -- it means Claude only sees routing rules when editing route files, not when editing tests or configs. This keeps Claude's context focused and its behavior consistent without you having to remind it every time.

Want to set up CLAUDE.local.md for your personal preferences?

### Step 2: Create CLAUDE.local.md

Ask Claude to create a CLAUDE.local.md with your personal development preferences. Think about what matters to you locally -- maybe you like verbose logging, your test upstream runs on a specific port, or you want a shorthand for running quick tests.

> "Create a CLAUDE.local.md with my personal preferences: I like verbose logging during development, my test upstream runs on port 4001, and when I say 'quick test' I mean skip integration tests. Make sure it's gitignored."

CLAUDE.local.md is for personal, per-project preferences that should not be committed to version control.

### Step 3: Understand the Memory Hierarchy

Ask Claude: `Show me the complete memory hierarchy for this project, what files are loaded, in what order, and which takes precedence.`

The hierarchy (highest to lowest): Managed policy > Project CLAUDE.md > .claude/rules/*.md > User ~/.claude/CLAUDE.md > CLAUDE.local.md.

> **STOP -- What you just did:** You now understand the full memory hierarchy -- from managed policy (highest) down to CLAUDE.local.md (lowest). This hierarchy means you can have project-wide rules that everyone shares (CLAUDE.md, .claude/rules/) and personal preferences that only affect you (CLAUDE.local.md). Knowing this hierarchy matters because when rules conflict, the higher-priority source wins.

> **Quick check before continuing:**
> - [ ] `.claude/rules/` has at least 3 rule files with `paths:` frontmatter
> - [ ] CLAUDE.local.md exists and is in .gitignore
> - [ ] You can list the memory hierarchy from highest to lowest priority

### Step 4: Modularize CLAUDE.md with @imports

> **Why this step:** As your project grows, CLAUDE.md gets bloated with documentation. The `@import` syntax lets you keep CLAUDE.md concise (a table of contents) while giving Claude access to detailed docs on demand. This is how you scale Claude's knowledge without wasting context window on every session.

Ask Claude to create documentation files for the route matching algorithm and the configuration format, then reference them from CLAUDE.md using `@imports`.

> "Create a docs/routing.md that documents how route matching works and a docs/config-format.md that documents the config file schema with examples. Then update CLAUDE.md to import both using the @path syntax."

The `@path` syntax in CLAUDE.md imports the referenced file into Claude's context. This keeps CLAUDE.md concise while giving Claude access to detailed documentation.

### Step 5: Explore Context Tools

Try each command:
- `/context` -- visualizes context usage as a colored grid
- `/compact Focus on the rate limiting feature we are about to build` -- compacts conversation, keeping focus on what you specify
- `/cost` -- shows token usage statistics for the current session

> **STOP -- What you just did:** You learned the three context management tools: `/context` shows what Claude is "thinking about" (and how full its context window is), `/compact` frees up space while preserving key information, and `/cost` tracks your token usage. These tools become essential in longer sessions -- you will use `/compact` regularly to keep Claude focused and responsive.

Ready to build the rate limiting feature?

### Step 6: Build Rate Limiting

Now build the rate limiting feature while actively using the context tools. Describe the behavior you want to Claude -- per-route limits from config, what to return when a client is rate-limited, and how to track state. Let Claude suggest the algorithm (token bucket, sliding window, etc.) and discuss the tradeoffs.

> "I want to add rate limiting to the gateway. Each route should have a configurable rate limit in the config file. When a client exceeds the limit, return 429 with a Retry-After header. Store the state in memory for now. What algorithm do you recommend?"

Claude will implement the rate limiter and may ask about edge cases like what happens on server restart (state resets). After building, ask Claude to write tests, run them, and commit. Then run `/compact` to free context and `/cost` to see how many tokens you used.

### Checkpoint

- [ ] `.claude/rules/` has at least 3 rule files with path-scoped frontmatter
- [ ] CLAUDE.local.md exists and is in .gitignore
- [ ] CLAUDE.md uses `@imports` to reference docs/routing.md and docs/config-format.md
- [ ] You ran `/context` and can read the context grid
- [ ] You ran `/compact` at least once
- [ ] You ran `/cost` to check token usage
- [ ] Rate limiting is implemented with tests passing
- [ ] Changes committed to git

---

## Module 4 -- Skills & Commands

**CC features:** SKILL.md, frontmatter, custom commands, hot-reload, argument substitution, disable-model-invocation

> **Why this step:** Skills turn multi-step workflows into one-command shortcuts. Instead of explaining "read the config, validate the route, add it, show the result" every time, you encode that workflow once and invoke it with `/add-route`. Skills are how you teach Claude repeatable processes.

### Step 1: Create the "add-route" Skill

Skills live in `.claude/skills/<skill-name>/SKILL.md`. Describe the workflow you want to Claude and ask it to create the skill file with the right frontmatter.

> "Create a skill called add-route that walks me through adding a new route to the gateway config. It should read the existing config, ask me for the path, method, and upstream target, validate there are no conflicts, add the route, show the updated list, and remind me to restart if the gateway is running. Make it user-triggered only -- I don't want Claude running this automatically."

Claude will create `.claude/skills/add-route/SKILL.md` with `disable-model-invocation: true` in the frontmatter. Test it by typing:

```
/add-route
```

Claude will walk through the guided route creation process.

### Step 2: Create the "test-endpoint" Skill

Now ask Claude to create a skill for testing endpoints. Describe what it should do -- fire a test request, report the result, and diagnose failures. Tell Claude it should accept arguments for the path and method.

> "Create a test-endpoint skill that fires a request at the running gateway and reports the result. It should take a path and an optional HTTP method as arguments, show me the status code, response time, headers, and body, and if it fails, diagnose whether the gateway is running, the route exists, and the upstream is reachable. User-triggered only."

Claude will create the skill with `$ARGUMENTS` for argument capture and `argument-hint` in the frontmatter. Test it:

```
/test-endpoint /api/users GET
```

> **STOP -- What you just did:** You created two skills with `disable-model-invocation: true`, which means they only run when you explicitly type the slash command. This is important for skills that take action (adding routes, firing test requests) -- you want to control when they execute. The `argument-hint` frontmatter in test-endpoint tells users what arguments the skill expects, and `$ARGUMENTS` captures everything they type after the command name.

How about we create a status-report skill next?

### Step 3: Create the "status-report" Skill

Ask Claude to create a status report skill that gives you a full overview of the gateway -- whether it is running, all routes with their upstreams and health, rate limit configs, and the /health endpoint response.

> "Create a status-report skill that checks if the gateway is running, reads the route config, pings each upstream to see if it's reachable, shows rate limit settings, hits /health, and formats everything as a clean table. This one does NOT need disable-model-invocation -- I want Claude to be able to run status checks proactively."

Notice the difference: this skill omits `disable-model-invocation: true`, so Claude can invoke it automatically when it thinks a status check is relevant.

> **Quick check before continuing:**
> - [ ] `/add-route` walks you through adding a route to the config
> - [ ] `/test-endpoint /health GET` fires a request and reports the result
> - [ ] `/status-report` generates a gateway overview
> - [ ] You understand that `disable-model-invocation: true` means "user-triggered only"

### Step 4: Argument Substitution

> **Why this step:** Positional arguments (`$0`, `$1`, `$ARGUMENTS`) make skills flexible. Instead of creating separate skills for each route, one skill with `$0` can look up any route you specify. This is the difference between a rigid script and a reusable tool.

Skills support positional arguments. In the test-endpoint skill above, `$ARGUMENTS` captures everything after the skill name. You can also use:

- `$0` -- first argument
- `$1` -- second argument
- `$ARGUMENTS[0]` -- same as `$0`

Ask Claude to create a route-info skill that uses positional arguments to look up a specific route. Describe what details you want to see about the route.

> "Create a route-info skill that takes a path pattern as its first argument and looks it up in the config. Show me the full route definition, rate limit settings, whether the upstream is reachable, and how common request patterns would match against it. User-triggered only."

Claude will use `$0` (the first positional argument) in the skill body. Test it: `/route-info /api/users`

### Step 5: Hot-Reload Demonstration

With Claude Code running, open `.claude/skills/status-report/SKILL.md` in a separate editor and change the description text. Go back to Claude Code and type `/status-report`. Claude picks up the updated skill content without restarting.

Skills are re-read each time they are invoked, so edits take effect immediately.

> **STOP -- What you just did:** You saw that skills are re-read every time they are invoked -- no restart needed. This hot-reload behavior means you can iterate on skill prompts in real time: edit the SKILL.md, invoke the command, see the result, refine. This tight feedback loop is how you dial in the exact workflow you want.

Shall we review how disable-model-invocation controls your skills?

### Step 6: Create a disable-model-invocation Skill

The `disable-model-invocation: true` frontmatter prevents Claude from using a skill automatically. It will only run when you explicitly type the slash command.

Review your skills and confirm:
- `add-route`: has `disable-model-invocation: true` (you control when routes are added)
- `test-endpoint`: has `disable-model-invocation: true` (you control when tests fire)
- `status-report`: does NOT have it (Claude can run status checks proactively)
- `route-info`: has `disable-model-invocation: true` (lookup on demand)

Ask Claude to explain which of your skills it can invoke automatically and which require you to type the slash command.

> "Which of my skills can you invoke on your own, and which ones do I have to trigger manually? What's the difference?"

### Checkpoint

- [ ] `.claude/skills/add-route/SKILL.md` exists and `/add-route` works
- [ ] `.claude/skills/test-endpoint/SKILL.md` exists and `/test-endpoint /health GET` works
- [ ] `.claude/skills/status-report/SKILL.md` exists and `/status-report` works
- [ ] `.claude/skills/route-info/SKILL.md` exists with `$0` substitution
- [ ] You modified a skill file and saw the change take effect without restart
- [ ] You understand the difference between `disable-model-invocation: true` and default
- [ ] All skills committed to git

---

## Module 5 -- Hooks

**CC features:** SessionStart, PostToolUse, Stop hooks, matchers, hook scripting, settings.json

### Step 1: Hook Lifecycle Overview

Hooks are custom shell commands that fire at specific points during a Claude Code session. They are configured in `.claude/settings.json` (project) or `~/.claude/settings.json` (user).

Key hook events you will use in this module:

| Event | When It Fires | Use Case |
|-------|--------------|----------|
| SessionStart | Session begins or resumes | Inject gateway status into context |
| PostToolUse | After a tool succeeds | Auto-lint config after writes |
| Stop | Claude finishes responding | Run tests before stopping |

> **Why this step:** A SessionStart hook runs every time you launch Claude Code, automatically injecting information into context. Instead of manually telling Claude "the gateway is running on port 3000 with 5 routes," the hook does it for you. This is how you eliminate repetitive setup at the start of every session.

### Step 2: SessionStart Hook -- Inject Gateway Status

Ask Claude to create a SessionStart hook script that checks whether the gateway is running and reports its state. Describe what you want the script to do -- check the health endpoint, count configured routes, and print a summary.

> "Create a SessionStart hook that checks if the gateway is running by hitting the /health endpoint, counts how many routes are configured, and prints a status summary. Put the script in .claude/hooks/gateway-status.sh and wire it up in .claude/settings.json."

Claude will create the script and configure the hook. The key: stdout from a SessionStart hook gets injected into Claude's context automatically. Adjust the script if your config format is different from what Claude assumes -- tell it your actual format.

Test it: exit Claude Code and relaunch. The gateway status appears in context automatically.

> **STOP -- What you just did:** You created your first hook and wired it into `.claude/settings.json`. The key insight: anything a SessionStart hook prints to stdout becomes part of Claude's context automatically. Claude now knows the gateway's status without you saying a word. You will use this pattern whenever there is information Claude should have at the start of every session.

Want to build a PostToolUse hook for config validation?

### Step 3: PostToolUse Hook -- Auto-Lint Config Files

> **Why this step:** PostToolUse hooks fire after Claude successfully uses a tool. By validating config files right after Claude writes them, you catch errors immediately -- before they cause a confusing runtime failure minutes later. This is "shift left" validation: catch problems at write time, not at run time.

Ask Claude to create a PostToolUse hook that validates config files after they are written or edited. Describe the behavior -- it should check if the file is a config file (YAML, JSON, TOML), validate it, and report errors.

> "Create a PostToolUse hook that validates config files after Claude writes or edits them. If the file is JSON, YAML, or TOML, parse it and fail with exit code 2 if it's invalid. Put the script in .claude/hooks/validate-config.sh and add it to settings.json with a matcher for Write and Edit tools."

Claude will create the validation script and add a PostToolUse entry to `.claude/settings.json` with a **matcher** of `"Write|Edit"`, which means it fires only when Claude uses those specific tools. Matchers are case-sensitive and support regex.

> **Quick check before continuing:**
> - [ ] SessionStart hook injects gateway status when you launch Claude Code
> - [ ] PostToolUse hook validates config files after Claude writes them
> - [ ] Both hooks are registered in `.claude/settings.json`
> - [ ] You understand that matchers (`"Write|Edit"`) control which tool calls trigger the hook

### Step 4: Stop Hook -- Run Tests Before Stopping

> **Why this step:** A Stop hook acts as a quality gate -- it runs when Claude finishes a response and can *block* Claude from stopping if something is wrong (exit code 2). This prevents Claude from declaring "done" while tests are failing.

A Stop hook fires when Claude finishes a response. Exit code 2 blocks Claude from stopping. Ask Claude to create one that runs your tests before allowing completion.

> "Create a Stop hook that runs my test suite when you finish responding. If tests fail, block with exit code 2 and show the failure output. Make sure to avoid infinite loops -- if the hook itself triggers a stop, it should exit cleanly. Add it to settings.json with a 30-second timeout."

Claude will ask what your test command is (pytest, npm test, cargo test, etc.) and create the script accordingly. It will also add the Stop hook entry to `.claude/settings.json`.

> **STOP -- What you just did:** You now have three hooks covering three different lifecycle events: SessionStart (inject context on launch), PostToolUse (validate after writes), and Stop (block completion until tests pass). Together, these form an automated safety net around your development workflow. The exit code convention (0 = success, 2 = blocking error) is the mechanism that gives hooks real power -- they are not just notifications, they can enforce rules.

Want to dig into hook configuration details?

### Step 5: Understand Hook Configuration Details

Key points about hooks:
- **$CLAUDE_PROJECT_DIR**: environment variable pointing to the project root
- **timeout**: maximum seconds a hook can run (default 60)
- **exit codes**: 0 = success, 2 = blocking error, other = non-blocking error
- **stdin**: hooks receive JSON with session info and event-specific data
- **stdout**: for SessionStart and UserPromptSubmit, stdout is added to context
- **stderr**: for exit code 2, stderr is shown to Claude as the error message
- **matchers**: only apply to PreToolUse, PostToolUse, and PermissionRequest

Verify your hooks are registered:

```
/hooks
```

### Step 6: Shell Scripting with Hook Input

Hooks receive JSON via stdin with fields like `session_id`, `hook_event_name`, `tool_name`, `tool_input`, and `tool_response`. Extract values with jq:

```
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')
```

Ask Claude to show you the full input schema for each hook type you configured.

### Checkpoint

- [ ] `.claude/settings.json` exists with hook configuration
- [ ] SessionStart hook injects gateway status on session launch
- [ ] PostToolUse hook validates config files after writes
- [ ] Stop hook runs tests before allowing Claude to stop
- [ ] You can explain matchers and when they apply
- [ ] You understand exit code behavior (0, 2, other)
- [ ] `/hooks` shows your registered hooks
- [ ] All hook scripts committed to git

---

## Module 6 -- MCP Servers

**CC features:** MCP servers, .mcp.json, scopes, skills+MCP, claude mcp add

### Step 1: What is MCP

MCP (Model Context Protocol) connects Claude Code to external tools, databases, and APIs. Skills teach Claude **what to do**; MCP gives Claude **access to things**.

> **Why this step:** Without MCP, Claude can only interact with your database through your application code. With an MCP server connected, Claude can directly query, inspect, and manage the database -- like giving it a database client. This is the difference between "Claude can read your code" and "Claude can read your data."

### Step 2: Add the SQLite MCP Server

Connect an MCP server so Claude can directly inspect and manage the cache database:

```
# macOS / Linux
claude mcp add --transport stdio sqlite -- npx -y @anthropic-ai/mcp-sqlite --db-path ./cache.db

# Windows (requires cmd /c wrapper)
claude mcp add --transport stdio sqlite -- cmd /c npx -y @anthropic-ai/mcp-sqlite --db-path ./cache.db
```

If a SQLite MCP server is not available, ask Claude: `Help me set up an MCP server for a SQLite database at ./cache.db for my platform.`

### Step 3: Add the Filesystem MCP Server

```
# macOS / Linux
claude mcp add --transport stdio filesystem -- npx -y @anthropic-ai/mcp-filesystem --root .

# Windows
claude mcp add --transport stdio filesystem -- cmd /c npx -y @anthropic-ai/mcp-filesystem --root .
```

> **STOP -- What you just did:** You connected two MCP servers that give Claude new capabilities: direct SQLite database access and filesystem operations. The `claude mcp add` command registered them, and now Claude can use their tools alongside its built-in tools. Think of MCP servers as "plugins for Claude's toolbox" -- each one adds new abilities.

Ready to verify your MCP connections?

### Step 4: Verify MCP Connections

Inside Claude Code, run `/mcp` to see both servers with their status. Also verify with `claude mcp list`.

> **Why this step:** The `claude mcp add` command you just used stored the server config locally (just for you). A `.mcp.json` file at the project root makes the config shareable -- anyone who clones the repo gets the same MCP servers automatically. This is the difference between "works on my machine" and "works for the team."

### Step 5: Create .mcp.json for the Project

For team sharing, create a project-scoped `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-sqlite", "--db-path", "./cache.db"],
      "env": {}
    }
  }
}
```

Or use: `claude mcp add --scope project sqlite-cache -- npx -y @anthropic-ai/mcp-sqlite --db-path ./cache.db`

### Step 6: Understand MCP Scopes

| Scope | Storage Location | Shared With | Use Case |
|-------|-----------------|-------------|----------|
| local | ~/.claude.json (per-project path) | Just you | Personal servers, experiments |
| project | .mcp.json in project root | Team (via git) | Shared project servers |
| user | ~/.claude.json (global) | Just you (all projects) | Personal utilities |

> **Quick check before continuing:**
> - [ ] `/mcp` shows both SQLite and filesystem servers with green status
> - [ ] `.mcp.json` exists at the project root
> - [ ] You can explain the difference between local, project, and user scopes

### Step 7: Build the Caching Layer with MCP

Now use the SQLite MCP server to build the caching layer. Describe the caching behavior you want and let Claude design the schema and implementation. Tell Claude to use MCP to inspect the database as it builds.

> "I want to add response caching to the gateway using SQLite. Cache GET request responses with a configurable TTL per route. If a cached response exists and hasn't expired, return it without hitting the upstream. I also want CLI commands for cache stats and cache clear. Use the SQLite MCP tools to inspect the database as you build this."

Claude will design the cache table schema, implement the caching logic, and add the CLI commands. It may ask you about cache key strategy, what happens on TTL expiry, and whether you want cache size limits. Answer based on your preferences.

After building, ask Claude to query the live database:

> "Use the SQLite MCP server to show me what's in the cache. How many hits and misses have there been?"

> **STOP -- What you just did:** You built a real caching layer and then used MCP to inspect it from inside Claude Code. This is a major shift: instead of writing one-off SQL queries or print statements to debug your cache, you asked Claude to query the live database directly. MCP turns Claude from a code assistant into a system operator that can see your running application's state.

Want to see how skills and MCP work together?

### Step 8: Create a Skill That Uses MCP

> **Why this step:** This step combines two features you have already learned -- skills (Module 4) and MCP (this module). The skill provides the *workflow* ("check stats, find expired entries, format a table"), while MCP provides the *capability* ("query SQLite"). This skills+MCP pattern is how you build sophisticated developer tools inside Claude Code.

Ask Claude to create a skill that orchestrates MCP tools for cache inspection. Describe the kind of report you want -- totals, hit rates, top keys, expired entries.

> "Create a cache-inspect skill that uses the SQLite MCP tools to query cache.db and generate a report. I want to see total entries, size, oldest and newest entries, hit/miss ratio, top 5 most-accessed keys, and any expired entries that haven't been cleaned up. If I pass a path argument, filter to matching entries. This one can be auto-invoked by Claude."

This demonstrates the skills+MCP pattern: the skill provides the workflow logic ("what to do"), while MCP provides the tool access ("ability to query SQLite").

### Checkpoint

- [ ] SQLite MCP server is connected (`/mcp` shows it)
- [ ] Filesystem MCP server is connected
- [ ] `.mcp.json` exists at the project root
- [ ] You can explain the three MCP scopes (local, project, user)
- [ ] The caching layer works: GET requests are cached in SQLite
- [ ] `nexus cache stats` and `nexus cache clear` work
- [ ] The `/cache-inspect` skill queries the SQLite MCP server
- [ ] Claude can directly query cache.db through MCP tools
- [ ] Changes committed to git

---

## Module 7 -- Guard Rails

**CC features:** PreToolUse, hook decision control, prompt-based hooks, permissionDecision, additionalContext, updatedInput

> **Why this step:** In Module 5 you built hooks that react *after* things happen (PostToolUse, Stop). PreToolUse hooks are different -- they fire *before* a tool runs, giving you the power to block, modify, or annotate tool calls before they execute. This is how you build guardrails that prevent mistakes rather than just catching them.

### Step 1: PreToolUse with Decision Control

PreToolUse hooks fire before a tool executes. They can return JSON to control the outcome:

| Decision | Effect |
|----------|--------|
| `"permissionDecision": "allow"` | Auto-approve the tool call |
| `"permissionDecision": "deny"` | Block the tool call, show reason to Claude |
| `"permissionDecision": "ask"` | Show the permission dialog to the user |
| `additionalContext` | Inject context for Claude before the tool runs |
| `updatedInput` | Modify the tool's input parameters |

### Step 2: Guard -- Prevent Unvalidated Config Edits

Ask Claude to create a PreToolUse hook that blocks writes to route config files when they are missing required fields. Describe the guardrail behavior you want.

> "Create a PreToolUse hook that guards config file edits. If Claude tries to write a route config file that's missing a 'path' field, deny the write with a clear reason. Put the script in .claude/hooks/guard-config-edit.sh and add it to settings.json with a Write|Edit matcher."

Claude will create the hook script that reads the tool input from stdin, checks config file writes, and returns a `permissionDecision: deny` JSON response when validation fails. Test it: ask Claude to write a config file missing the `path` field. The hook should block it.

> **STOP -- What you just did:** You created your first guardrail that actively *prevents* a mistake. When Claude tries to write an invalid config, the hook blocks it with a clear reason. Claude sees the denial reason and corrects its approach automatically. This is fundamentally different from the PostToolUse validation in Module 5 -- that caught errors after the write; this prevents the write from happening at all.

Want to try softer guardrails with context injection?

### Step 3: Guard -- Add Context to Route Handler Reads

> **Why this step:** Not all guardrails block actions. `additionalContext` is a softer approach: it injects helpful information into Claude's context before a tool runs, nudging Claude toward better behavior without forcing it. Think of it as whispering a reminder rather than slamming a door.

Ask Claude to create a PreToolUse hook that injects helpful context whenever Claude reads a route handler file. The context should remind Claude about method validation, proper status codes, and rate limit checks.

> "Create a PreToolUse hook that detects when you're reading a route handler file and injects a reminder about validating HTTP methods, returning proper status codes, and checking rate limits. Use additionalContext, not deny -- I want to nudge your behavior, not block the read."

The `additionalContext` field injects text into Claude's context before the tool runs, without changing the tool's behavior.

### Step 4: Guard -- Auto-Add Logging to New Route Handlers

Ask Claude to create another PreToolUse hook that checks whether a route handler being written includes logging. If not, it should inject a reminder via `additionalContext`.

> "Create a PreToolUse hook that checks when you're writing a route handler file. If the content doesn't include any logging, inject an additionalContext reminder to add request logging with method, path, status code, and response time. Don't block the write -- just remind."

Using `additionalContext` to remind Claude is more reliable than forcibly rewriting content with `updatedInput`.

> **STOP -- What you just did:** You now have three guard rail strategies: `deny` (block the action), `additionalContext` (inject a reminder), and `ask` (show the user a permission dialog). You also saw the logging injection hook, which demonstrates a pattern you will use often: instead of trying to rewrite Claude's output with `updatedInput`, use `additionalContext` to add instructions that Claude follows naturally.

> **Quick check before continuing:**
> - [ ] The config validation hook blocks writes to config files that are missing required fields
> - [ ] The route context hook injects reminders when Claude reads route handler files
> - [ ] The logging injection hook reminds Claude to add logging to new route handlers
> - [ ] You can explain the difference between `deny`, `additionalContext`, and `updatedInput`

### Step 5: Prompt-Based Hook -- Security Gate

> **Why this step:** Shell script hooks are great for pattern matching (does this file contain "path"?), but some decisions require judgment. Prompt-based hooks send the context to a fast LLM (Haiku) that can evaluate nuanced questions like "is this route config a security risk?" This is how you build guardrails for things that cannot be checked with a regex.

Prompt-based hooks use an LLM (Haiku) to evaluate decisions. Create a Stop hook that checks whether route configs are secure:

Add to `.claude/settings.json`:

```json
"Stop": [
  {
    "hooks": [
      {
        "type": "prompt",
        "prompt": "Review the conversation and check if any route configuration changes were made. If they were, evaluate: 1) Are any routes exposing internal-only paths like /admin or /internal to public access? 2) Are there routes without rate limiting that should have it? 3) Are there routes forwarding to external hosts that could be a security risk? If any security issues exist, respond with {\"ok\": false, \"reason\": \"Security issue found: <description>. Fix before stopping.\"}. If everything looks safe, respond with {\"ok\": true}.",
        "timeout": 30
      }
    ]
  }
]
```

Prompt-based hooks send the context to a fast LLM which returns a JSON decision. This is more flexible than shell scripts for nuanced evaluations.

> **STOP -- What you just did:** You built a complete guard rail system for your gateway: shell-script hooks for deterministic checks (config validation, logging reminders) and a prompt-based hook for judgment calls (security review). The prompt-based hook is especially powerful -- it evaluates route configs for security issues using an LLM, catching things that no regex could. You now have hooks at every stage of the lifecycle: SessionStart (context), PreToolUse (guard), PostToolUse (validate), and Stop (quality gate + security check).

### Checkpoint

- [ ] PreToolUse hook blocks config writes that fail validation
- [ ] PreToolUse hook injects context when reading route handlers
- [ ] PreToolUse hook reminds Claude to add logging to route handlers
- [ ] Prompt-based Stop hook checks for security issues in route configs
- [ ] You understand the three decision types: allow, deny, ask
- [ ] You understand additionalContext vs updatedInput vs permissionDecision
- [ ] All hooks configured in `.claude/settings.json`
- [ ] Changes committed to git

---

## Module 8 -- Subagents

**CC features:** .claude/agents/, subagent frontmatter, chaining, parallel, background, resuming

### Step 1: What Are Subagents

Subagents are specialized AI assistants running in their own context window with custom system prompts, specific tool access, and independent permissions. Benefits: preserve main conversation context, enforce tool constraints, specialize behavior, control costs by routing to faster models.

> **Why this step:** Your main Claude session handles everything -- routing, caching, security, testing. Subagents let you split that into specialists. A routing expert agent does not need write access or knowledge of caching. A security agent does not need to edit files. By restricting each agent's tools and focus, you get better results and preserve your main conversation's context window.

### Step 2: Create the "router-agent"

Ask Claude to create a subagent that specializes in route analysis. Describe its focus area and what tools it should have access to.

> "Create a router-agent subagent that specializes in route matching, conflict detection, and optimization. It should be able to read files and search the codebase but use the Sonnet model to save costs. When invoked, it should analyze the route config for conflicts, unreachable routes, and ordering issues, and present findings as a table."

Claude will create `.claude/agents/router-agent.md` with the appropriate frontmatter, including `tools:` to restrict what the agent can do and `model: sonnet` for cost efficiency.

### Step 3: Create the "cache-agent"

Now create a caching specialist. Describe what it should analyze and what tools it needs.

> "Create a cache-agent subagent that manages the SQLite cache layer. It should be able to query cache.db, analyze hit/miss rates and entry ages, suggest TTL adjustments and eviction strategies, and debug stale or oversized entries. Sonnet model, with Read, Bash, Grep, and Glob tools."

> **STOP -- What you just did:** You created two specialist agents with different tool sets. The router-agent has `Read, Grep, Glob, Bash` because it needs to analyze code and configs. The cache-agent also has `Bash` so it can query the database. Notice the `model: sonnet` field -- this routes these agents to a faster, cheaper model since they are doing analysis, not complex reasoning. You will use Opus for design decisions and Sonnet for routine analysis.

Ready to create a read-only security auditor agent?

### Step 4: Create the "security-agent"

Create a security auditor agent. This one should have read-only access -- no Bash, no Write -- because a security auditor should not be able to modify code.

> "Create a security-agent subagent that audits the gateway for security issues. It should check route configs for exposed admin endpoints and missing rate limits, review code for missing input validation and header injection risks, and check for missing auth and security headers. Give it only Read, Grep, and Glob tools -- no Bash or Write. Sonnet model. Output should be an audit report with severity levels."

Notice that the security-agent only has `Read, Grep, Glob` -- no `Bash`, no `Write`. This is intentional: a security auditor should analyze, not modify.

> **Quick check before continuing:**
> - [ ] `.claude/agents/` has three agent files: router-agent, cache-agent, security-agent
> - [ ] Each agent has a `tools:` field limiting what it can do
> - [ ] Each agent has `model: sonnet` (or another appropriate model)
> - [ ] You can explain why the security-agent only has `Read, Grep, Glob` (no Bash, no Write)

### Step 5: Subagent Frontmatter Details

Review the key frontmatter fields:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (lowercase, hyphens) |
| `description` | Yes | When to delegate to this agent |
| `tools` | No | Allowed tools (inherits all if omitted) |
| `disallowedTools` | No | Tools to deny |
| `model` | No | `sonnet`, `opus`, `haiku`, or `inherit` |
| `permissionMode` | No | `default`, `plan`, `acceptEdits`, `dontAsk`, `bypassPermissions` |
| `skills` | No | Skills to preload into context |
| `hooks` | No | Hooks scoped to this agent's lifecycle |

### Step 6: Invoke, Chain, Parallel, and Background

**Direct invocation:** Ask Claude to delegate to a specific agent.

> "Use the security-agent to audit the current gateway configuration."

**Chaining** (sequential delegation): Ask Claude to run agents in sequence, where each feeds into the next.

> "First use the router-agent to check for route conflicts, then pass any issues to the security-agent for a security audit, then have the cache-agent verify caching is correct for the affected routes."

**Parallel** (simultaneous delegation): Ask for two agents to work at the same time.

> "In parallel, have the router-agent analyze route performance and the cache-agent analyze cache hit rates. Combine the findings into one optimization report."

> **STOP -- What you just did:** You chained subagents -- one agent's output feeds into the next. This is powerful for multi-stage analysis: first check for route conflicts, then audit the conflicts for security issues, then verify caching is correct for the affected routes. Each agent brings its specialized perspective, and the chain builds a complete picture that no single agent would produce alone.

**Background** (non-blocking):

> **Why this step:** Long-running analyses (like a full security audit) can block your workflow. Background execution with `Ctrl+B` lets you keep working while the agent runs. You will use this pattern whenever an agent's work is not blocking your next step.

While Claude is running a subagent, press `Ctrl+B` to send it to the background. You can continue working and Claude will notify you when it finishes.

> "Run the security-agent in the background to audit the full codebase. I'll keep working on the rate limiter."

**Resuming:** When the background agent finishes, you can resume and extend its work.

> "Resume the security-agent and have it also check the new middleware code."

### Checkpoint

- [ ] `.claude/agents/router-agent.md` exists and responds when invoked
- [ ] `.claude/agents/cache-agent.md` exists and can query the cache database
- [ ] `.claude/agents/security-agent.md` exists and produces an audit report
- [ ] You successfully chained two subagents in sequence
- [ ] You ran a subagent in parallel or in the background
- [ ] You understand the frontmatter fields: name, description, tools, model
- [ ] Subagent files committed to git

---

## Module 9 -- Tasks & TDD

**CC features:** Tasks, dependencies, cross-session, TDD loops, SubagentStop

### Step 1: Tasks System Overview

Tasks replace the old "Todos" system. Key differences: dependency graphs (DAG structure where tasks can block other tasks), filesystem persistence (`~/.claude/tasks`), cross-session sharing (multiple Claude instances on one task list), and broadcast updates.

> **Why this step:** Up to now, each conversation with Claude has been self-contained. Tasks persist across sessions and even across multiple Claude instances. This means you can start building a feature, close your laptop, come back tomorrow, and Claude picks up exactly where you left off -- with the same task list, the same dependency graph, the same progress.

### Step 2: Cross-Session Persistence

To share a task list across sessions: `CLAUDE_CODE_TASK_LIST_ID=nexus-middleware claude`. Any tasks created are stored under that ID. Another terminal with the same command sees the same tasks.

### Step 3: Multi-Step Pipeline -- Add Middleware System

Describe the middleware system you want to build and ask Claude to break it into a task list with dependencies. Explain the high-level pieces -- a middleware interface, a couple of concrete middleware implementations, wiring them into the pipeline, and integration tests.

> "I want to add a middleware system to the gateway. Break this into a task list with dependencies. I need: defining the middleware interface (how functions are called, ordering), implementing a logging middleware, implementing an auth middleware that checks for API keys, wiring the middleware chain into the request pipeline, and integration tests for the whole thing. Figure out the dependency order -- what blocks what."

Claude will create the dependency graph automatically. It will recognize that the logging and auth middleware both depend on the interface definition, and that wiring and tests come after the implementations.

> **STOP -- What you just did:** You created a dependency graph (DAG) where tasks explicitly declare what they depend on. Task 4 (wire middleware into the pipeline) cannot start until both Tasks 2 and 3 (logging and auth middleware) are complete. Task 5 (integration tests) waits for Task 4. Claude enforces this ordering automatically -- it will not skip ahead or start a blocked task. This is how you decompose complex features into safe, ordered steps.

Claude creates tasks with explicit dependencies. Task 4 cannot start until both Tasks 2 and 3 are complete. Task 5 cannot start until Task 4 is done.

Press `Ctrl+T` to toggle the task list view in your terminal. You will see tasks with their status indicators.

Now work through the tasks. Ask Claude to start with the first one and show you the plan before implementing.

> "Start on the first task -- define the middleware interface. Show me the plan before you implement."

After completing each task, Claude automatically marks it done and moves to the next unblocked task.

> **Quick check before continuing:**
> - [ ] `Ctrl+T` shows the task list with status indicators
> - [ ] You have completed at least Tasks 1-3 of the middleware system
> - [ ] You can see that Task 4 became unblocked after Tasks 2 and 3 completed
> - [ ] Each completed task has a corresponding commit

### Step 4: TDD -- Build Request Validation Middleware

> **Why this step:** TDD (Test-Driven Development) flips the normal workflow: you write the test first, watch it fail, then write the minimum code to make it pass. This might feel backwards, but it guarantees every feature has a test and prevents over-engineering. Claude is particularly good at this cycle because it can write a precise failing test, then implement exactly what is needed.

Use strict Test-Driven Development to build one more middleware. Tell Claude you want to follow the red-green-refactor cycle and describe the middleware you are building.

> "Let's build a request validation middleware using strict TDD. I want to follow the red-green-refactor cycle: write a failing test first, then the minimum code to pass it, then refactor. The middleware should validate Content-Type for POST/PUT requests, check Content-Length is reasonable, and reject directory traversal in paths. Start with the first failing test."

Claude will write a failing test, then ask you to confirm before implementing. Each red-green-refactor cycle should be a separate commit. Work through at least 4 cycles. Notice how each cycle adds exactly one behavior -- this incremental approach keeps the code clean and every feature tested.

> **STOP -- What you just did:** You experienced the red-green-refactor TDD cycle with Claude. Each cycle produced a focused commit: failing test, passing implementation, cleanup. Look at your git log -- you should see a clean, incremental history where each commit adds one specific behavior. This is the gold standard for maintainable code, and Claude's tight build-test-commit loop makes it practical rather than tedious.

Ready to add quality gate hooks to the task system?

### Step 5: Stop and SubagentStop Hooks for Quality

> **Why this step:** Tasks and TDD work best when there is a quality gate preventing premature completion. The Stop hook checks whether Claude's current task is truly done (tests pass, requirements met). The SubagentStop hook does the same for subagent output. Together, they prevent Claude from marking work as "done" when it is merely "started."

Add hooks that enforce quality during task execution.

**Stop hook** (prompt-based) -- ensure tasks are truly complete:

Add to `.claude/settings.json`:

```json
"Stop": [
  {
    "hooks": [
      {
        "type": "prompt",
        "prompt": "Check if Claude is working on a task list. If yes, evaluate: 1) Is the current task actually complete? 2) Do the tests pass? 3) Is there a next task to start? If the current task is not complete or tests are failing, respond with {\"ok\": false, \"reason\": \"Task not complete: <explanation>\"}. Otherwise respond with {\"ok\": true}.",
        "timeout": 30
      }
    ]
  }
]
```

**SubagentStop hook** -- validate subagent output quality:

```json
"SubagentStop": [
  {
    "hooks": [
      {
        "type": "prompt",
        "prompt": "Evaluate whether this subagent completed its assigned task successfully. Check: 1) Did it produce the expected output? 2) Are there any errors or incomplete work? 3) Does the output meet quality standards? Respond with {\"ok\": true} if satisfactory, or {\"ok\": false, \"reason\": \"explanation\"} if the subagent should continue.",
        "timeout": 30
      }
    ]
  }
]
```

> **STOP -- What you just did:** You added quality gates at two levels: the Stop hook ensures Claude itself does not prematurely finish a task, and the SubagentStop hook ensures subagents produce complete, quality output before returning control. These hooks close the loop on the task system -- tasks define *what* to do, dependencies define *when* to do it, and quality hooks ensure it is *actually done*. This is the complete automated development pipeline: plan, decompose, implement, verify.

### Checkpoint

- [ ] You created a task list with dependencies (Tasks 1-5)
- [ ] Tasks display correctly with `Ctrl+T`
- [ ] You completed the middleware system by working through tasks in order
- [ ] You used strict TDD (red-green-refactor) for the validation middleware
- [ ] At least 4 TDD cycles committed separately
- [ ] Stop hook checks task completion
- [ ] SubagentStop hook validates subagent output
- [ ] Middleware system works end-to-end with tests passing
- [ ] Changes committed to git

---

## Module 10 -- Parallel Dev, Plugins & Evaluation

**CC features:** Worktrees, plugins, eval, PermissionRequest hooks, continuous learning

> **Why this step:** Until now, you have worked on one feature at a time. Git worktrees create separate working directories that share the same repository, so you can have two Claude Code instances building two features simultaneously. This is how teams work on multiple features in parallel without merge conflicts blocking progress.

### Step 1: Git Worktrees for Parallel Development

Git worktrees give you multiple working directories for the same repo, enabling two Claude Code instances on different features simultaneously. Create two worktrees:

```
! git worktree add ../nexus-gateway-metrics feature/metrics
! git worktree add ../nexus-gateway-websocket feature/websocket
```

### Step 2: Multiple CC Instances with Shared Tasks

Open two terminals with shared tasks:
- **Terminal 1:** `cd ../nexus-gateway-metrics && CLAUDE_CODE_TASK_LIST_ID=nexus-parallel claude`
- **Terminal 2:** `cd ../nexus-gateway-websocket && CLAUDE_CODE_TASK_LIST_ID=nexus-parallel claude`

In Terminal 1, describe the metrics feature and ask Claude to create tasks for it:

> "I want to add a metrics system to the gateway. Create tasks for: a request counter per route, a response time histogram, a /metrics endpoint, and tests for metrics collection. Start on the first task."

In Terminal 2, describe the websocket feature:

> "I want to add websocket support to the gateway. Create tasks for: websocket upgrade handling in the router, proxying websocket connections to upstreams, websocket health checks, and tests. Start on the first task."

Both instances share the task list. When one completes a task, the other sees the update. This is the parallel development workflow.

> **STOP -- What you just did:** You ran two Claude Code instances simultaneously, each building a different feature in its own worktree, while sharing a task list. This is the most advanced development pattern in Claude Code: parallel autonomous development with coordination. In a real team setting, each worktree could be a different developer's Claude instance, all contributing to the same backlog.

> **Quick check before continuing:**
> - [ ] Two worktrees exist (nexus-gateway-metrics and nexus-gateway-websocket)
> - [ ] Two Claude Code instances are running with `CLAUDE_CODE_TASK_LIST_ID=nexus-parallel`
> - [ ] Tasks created in one terminal appear in the other
> - [ ] Both instances are making progress on their respective features

### Step 3: Create a Plugin -- "gateway-plugin"

> **Why this step:** Everything you have built -- skills, agents, hooks -- lives inside your project's `.claude/` directory. A plugin packages all of that into a portable bundle that can be shared, versioned, and reused across projects. If you build another gateway next month, you bring the plugin instead of recreating everything from scratch.

Ask Claude to bundle your skills, agents, and hooks into a distributable plugin. Describe what you want packaged.

> "Package all my skills, agents, and hooks into a plugin called gateway-plugin. Create the plugin directory structure with a plugin.json, copy the skills and agents from .claude/, and include the hook configuration. Version 1.0.0."

Claude will create the plugin structure with `.claude-plugin/plugin.json`, a `skills/` directory, an `agents/` directory, and a `hooks/hooks.json` file.

Test: `claude --plugin-dir ./gateway-plugin`, then try `/gateway-plugin:add-route` and `/gateway-plugin:status-report`. Skills appear with the namespace prefix.

> **STOP -- What you just did:** You packaged your skills, agents, and hooks into a distributable plugin. Notice the namespace prefix (`/gateway-plugin:add-route`) -- this prevents naming collisions when multiple plugins are loaded. The plugin is a self-contained directory that anyone can use with `--plugin-dir`. You have gone from "tools that help me" to "tools I can share."

Ready to build an evaluation and scoring system?

### Step 4: Evaluation -- Test Specs and Scoring

> **Why this step:** Evaluation is how you measure Claude's work against objective criteria. Instead of manually checking "does the gateway work?", you define test specs with pass/fail criteria and a scoring system. This pattern is essential for CI/CD pipelines where Claude runs headlessly via `claude -p` and you need automated quality assessment.

Describe the evaluation criteria you want for your gateway and ask Claude to build a scoring script. Think about what matters -- health checks, route matching, rate limiting, caching, middleware, and error handling.

> "Create an evaluation script that scores the gateway out of 10. I want to check: health endpoint responds within 2 seconds, route matching works for at least 5 scenarios, rate limiting returns 429 when exceeded, caching works for GET requests, middleware chain executes in order, and error handling returns proper status codes for upstream failures and bad requests. Run the evaluation and show me the score."

Claude will build the evaluation script and run it. This is a basic evaluation framework. In production, you would use this pattern to score Claude's work against specifications.

> **STOP -- What you just did:** You created a scoring rubric for your gateway and ran it as an automated evaluation. This is the foundation for continuous evaluation: every time you make changes, you can re-run the eval to check for regressions. In production workflows, this pattern runs in CI to score Claude's output against specifications before merging.

> **Quick check before continuing:**
> - [ ] The evaluation script runs and reports a score out of 10
> - [ ] The plugin works with `--plugin-dir` and skills have the namespace prefix
> - [ ] Both worktree features are progressing (or completed)

### Step 5: PermissionRequest Hooks

> **Why this step:** PermissionRequest hooks control the permission dialogs Claude shows you. Instead of clicking "allow" every time Claude wants to run tests, you auto-approve known-safe commands. And instead of trusting yourself to remember "do not edit the database directly," you auto-deny dangerous patterns. This is the final layer of automation: even the permission system is programmable.

PermissionRequest hooks fire when Claude would show a permission dialog. Add to `.claude/settings.json`:

- **Auto-approve tests**: matcher `"Bash(npm test*)"` (adjust for your test runner), decision `"behavior": "allow"`
- **Block direct DB edits**: matcher `"Bash(sqlite3 cache.db*)"`, decision `"behavior": "deny"` with message `"Use the cache-agent or cache-inspect skill instead."`

The JSON output format for PermissionRequest hooks uses `hookSpecificOutput.decision.behavior` set to `"allow"` or `"deny"`. Ask Claude to generate the full settings.json entries for your language's test command.

> **STOP -- What you just did:** You automated the permission system itself. PermissionRequest hooks are the final piece of the hook lifecycle: SessionStart (context at launch), PreToolUse (guard before actions), PostToolUse (validate after actions), Stop (quality gate at completion), SubagentStop (quality gate for agents), and now PermissionRequest (control the permission dialogs). Every interaction point between you and Claude is now programmable.

Shall we capture what you learned in your project knowledge layer?

### Step 6: Continuous Learning

> **Why this step:** This is not just a cleanup step -- it is the most important habit you will take from this course. Every project improves Claude's effectiveness by capturing what you learned: architecture decisions in CLAUDE.md, coding patterns in rules files, workflows in skills, specialized analysis in agents. The project you just built is not just a gateway -- it is a knowledge base that makes your next project faster.

Update CLAUDE.md with architecture decisions, common commands, known issues, coding conventions, and performance characteristics. Also update `.claude/rules/` with new rules from your work.

The key insight: CLAUDE.md + rules + skills + agents + hooks form a complete "knowledge layer" that makes Claude more effective over time.

### Checkpoint

- [ ] Two git worktrees created for parallel feature development
- [ ] Two Claude Code instances sharing a task list
- [ ] gateway-plugin created with skills, agents, and hooks
- [ ] Plugin tested with `--plugin-dir` flag
- [ ] Evaluation script runs and produces a score
- [ ] PermissionRequest hooks auto-approve tests and block direct DB modification
- [ ] CLAUDE.md updated with comprehensive project knowledge
- [ ] All worktree branches merged back to main
- [ ] Final commit on main with all features integrated

---

## Final Verification Checklist

Go through this list to confirm you have covered every major CC feature:

**Foundation (Modules 1-2)**
- [ ] CLAUDE.md exists with comprehensive project documentation
- [ ] You have used Plan mode to design before building
- [ ] At least 10 meaningful git commits across the project
- [ ] The gateway starts, routes requests, and serves /health

**Context Management (Module 3)**
- [ ] .claude/rules/ has path-scoped rules for routing, config, and testing
- [ ] CLAUDE.local.md exists for personal preferences
- [ ] CLAUDE.md uses @imports for documentation files
- [ ] You have used /context, /compact, and /cost

**Skills (Module 4)**
- [ ] At least 4 skills in .claude/skills/
- [ ] At least one skill uses $ARGUMENTS or $0 substitution
- [ ] At least one skill has disable-model-invocation: true
- [ ] Skills are invokable via /skill-name

**Hooks (Modules 5 + 7)**
- [ ] SessionStart hook injects gateway status
- [ ] PostToolUse hook validates config after writes
- [ ] Stop hook runs tests before allowing completion
- [ ] PreToolUse hook with permissionDecision (deny)
- [ ] PreToolUse hook with additionalContext
- [ ] Prompt-based hook for security checking
- [ ] All hooks configured in .claude/settings.json

**MCP (Module 6)**
- [ ] SQLite MCP server connected
- [ ] .mcp.json exists at project root
- [ ] Cache layer uses SQLite through MCP
- [ ] A skill orchestrates MCP tools (cache-inspect)

**Subagents (Module 8)**
- [ ] At least 3 subagents in .claude/agents/
- [ ] Subagents have been invoked, chained, and run in background
- [ ] Subagent frontmatter includes tools and model restrictions

**Tasks & TDD (Module 9)**
- [ ] Task list with dependencies created and completed
- [ ] TDD cycles committed separately (red-green-refactor)
- [ ] SubagentStop hook validates subagent output

**Advanced (Module 10)**
- [ ] Git worktrees used for parallel development
- [ ] Plugin created and tested
- [ ] Evaluation script produces a score
- [ ] PermissionRequest hooks configured

---

## Tips

**Context management is the most important skill.** Use `/compact` aggressively, use subagents to isolate verbose work, and keep CLAUDE.md concise with @imports for details.

**Commit often.** Small, focused commits with `Esc Esc` (rewind) give easy rollback points.

**Use Plan mode before Act mode.** Design in Plan mode first. Thinking up front prevents costly rework.

**Skills encode workflow; subagents encode expertise.** Repeated processes become skills. Specialized perspectives (security, performance) become subagents.

**Hooks eliminate friction.** Any manual step you repeat is a candidate. Start with SessionStart and PostToolUse, then add more as friction points emerge.

**Test through the gateway.** Always test through HTTP, not by calling functions directly. This validates routing, middleware, caching, and rate limiting end-to-end.

**Read the context/ directory.** The cc-self-train repository has detailed CC feature reference docs in `context/`.

---

## What's Next?

You have built a full-featured local API gateway and mastered every major Claude Code feature. Here are paths forward:

**Extend the gateway:** WebSocket proxying, gRPC support, circuit breaker patterns, distributed rate limiting, request/response transformation middleware, OpenAPI spec generation from route configs.

**Go deeper with Claude Code:** Explore the `context/` directory in cc-self-train for advanced patterns. Build your own MCP server. Create and distribute plugins. Set up CI/CD pipelines using `claude -p` (headless mode).

**Try another project:** [Forge](../forge/) if you want to build a personal dev toolkit, or [Sentinel](../sentinel/) if you want to build a code analyzer and test generator. Both cover the same CC features through different domains.
