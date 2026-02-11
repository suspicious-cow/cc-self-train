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

**Prerequisites:** Completion of Projects 1 and 2 (or equivalent familiarity with CLAUDE.md, plan mode, git, skills, and rules).

---

## Set Up Your Dev Environment

Before starting, set up your language toolchain and SQLite. Pick any language you are comfortable with. The exercises describe **what** to build, not how -- you choose the implementation.

### Python

```
python --version          # 3.10+
mkdir nexus-gateway && cd nexus-gateway
python -m venv .venv
# Windows: .venv\Scripts\activate | macOS/Linux: source .venv/bin/activate
pip install pytest
```

### TypeScript / Node.js

```
node --version            # 18+
mkdir nexus-gateway && cd nexus-gateway
npm init -y
npm install --save-dev typescript @types/node ts-node jest @types/jest ts-jest
npx tsc --init
```

### Go

```
go version                # 1.21+
mkdir nexus-gateway && cd nexus-gateway
go mod init nexus-gateway
```

### Rust

```
rustc --version && cargo --version
cargo new nexus-gateway && cd nexus-gateway
```

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

### Step 1: Create Your Project

Open your terminal and create a fresh project directory. Each project in this curriculum gets its own repository.

```
mkdir nexus-gateway
cd nexus-gateway
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

- [ ] `nexus-gateway/` directory exists with `git init` completed
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

### Step 2: Design the Architecture

Paste this prompt into Claude while in Plan mode:

```
Design the architecture for a local API gateway called "nexus-gateway" with
these components:

1. HTTP server that listens on a configurable port (default 3000)
2. Route registry: define routes with path patterns, HTTP methods, upstream
   targets (host:port)
3. Request handler: receives incoming requests, matches against routes,
   forwards to the matched upstream
4. Response handler: receives upstream response, returns to the original client
5. Config file: YAML or JSON or TOML for route definitions
6. Health check endpoint at /health that returns {"status": "ok"}
7. CLI interface: nexus start, nexus routes list, nexus routes add, nexus health

Show me the directory structure, the key modules/files, and how they connect.
Do NOT write any code yet -- just the plan.
```

### Step 3: Review and Iterate

Read Claude's plan carefully. Ask follow-up questions while still in Plan mode:

```
How will route matching work for path parameters like /users/:id?
What happens when no route matches -- what status code and body?
Where does the config file live and what is its format?
```

Iterate until you are satisfied with the design.

### Step 4: Exit Plan Mode and Execute

Press `Shift+Tab` to switch back to Act mode. Now tell Claude to create the project structure:

```
Create the project structure from our plan. Set up the directory layout, create
empty placeholder files for each module, and write the config file with two
example routes: one for /api/users forwarding to localhost:4001, and one for
/api/products forwarding to localhost:4002.
```

### Step 5: Create a Feature Branch

```
! git add -A
! git commit -m "Initial project structure"
! git checkout -b feature/core
```

Or ask Claude:

```
Create a feature branch called "feature/core" and commit the current project
structure to it.
```

### Step 6: Implement the Core Gateway

Work with Claude to build the core components. Give focused prompts:

```
Implement the HTTP server module. It should:
- Read the port from the config file (default 3000)
- Listen for incoming HTTP requests
- Pass requests to the route matcher
- Return 404 with {"error": "no matching route"} if no route matches
```

Then:

```
Implement the route matching module. It should:
- Load routes from the config file
- Match requests by method and path pattern
- Support exact paths and simple prefix matching
- Return the matched route's upstream target
```

Then:

```
Implement the request forwarding module. It should:
- Take the matched upstream target
- Forward the original request (method, headers, body)
- Return the upstream response to the client
- Handle connection errors gracefully with 502 Bad Gateway
```

### Step 7: Write and Run Tests

```
Write tests for the route matching module. Test:
- Exact path match
- Prefix match
- Method filtering (GET vs POST)
- No match returns null/none
- Multiple routes, first match wins

Then run the tests.
```

After tests pass, commit:

```
Commit the passing tests and route matching implementation with a descriptive
message.
```

### Step 8: Implement the CLI

```
Implement the CLI interface with these subcommands:
- nexus start: start the gateway server
- nexus routes list: show all configured routes
- nexus routes add <path> <method> <upstream>: add a route to the config
- nexus health: check if the gateway is running by hitting /health
```

### Step 9: Manual Testing

Start a simple upstream service (or use Claude to create a tiny echo server), then test:

```
Help me test the gateway manually:
1. Create a simple echo server that runs on port 4001
2. Start the gateway
3. Show me the curl commands to test each route
4. Show me how to check /health
```

### Step 10: Merge to Main

```
Commit all changes, then merge feature/core into main.
```

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

### Step 1: Create Path-Scoped Rules

Create a `.claude/rules/` directory in your project:

```
Create the .claude/rules/ directory with the following rule files:

1. .claude/rules/routing.md — with this frontmatter:
   ---
   paths:
     - "**/routes*"
     - "**/handler*"
     - "**/router*"
   ---
   Content: "Always validate the HTTP method. Return proper status codes: 200
   for success, 400 for bad requests, 404 for no route match, 502 for upstream
   failure, 503 for rate limited. Log every routed request with method, path,
   upstream, and response time."

2. .claude/rules/config.md — with this frontmatter:
   ---
   paths:
     - "*.yml"
     - "*.yaml"
     - "*.toml"
     - "*.json"
     - "**/config*"
   ---
   Content: "Validate all configuration on load. Fail fast with clear error
   messages if a required field is missing. Never silently ignore malformed
   config entries."

3. .claude/rules/testing.md — with this frontmatter:
   ---
   paths:
     - "**/test*"
     - "**/*test*"
     - "**/*spec*"
   ---
   Content: "Test both success and error paths. Always test with malformed
   requests, missing fields, and unexpected HTTP methods. Use descriptive test
   names that explain the scenario."
```

After creating them, edit a route handler file and notice Claude follows the routing rules automatically.

### Step 2: Create CLAUDE.local.md

```
Create a CLAUDE.local.md file with my personal preferences:
- I prefer verbose logging during development
- My test upstream runs on port 4001
- Skip integration tests when I say "quick test"

Make sure CLAUDE.local.md is in .gitignore.
```

CLAUDE.local.md is for personal, per-project preferences that should not be committed to version control.

### Step 3: Understand the Memory Hierarchy

Ask Claude: `Show me the complete memory hierarchy for this project, what files are loaded, in what order, and which takes precedence.`

The hierarchy (highest to lowest): Managed policy > Project CLAUDE.md > .claude/rules/*.md > User ~/.claude/CLAUDE.md > CLAUDE.local.md.

### Step 4: Modularize CLAUDE.md with @imports

Create documentation files and reference them from CLAUDE.md:

```
Create two documentation files:
1. docs/routing.md — document the route matching algorithm, supported patterns,
   and the config file format
2. docs/config-format.md — document the configuration file schema with examples

Then update CLAUDE.md to import them:
  See @docs/routing.md for route matching details.
  See @docs/config-format.md for configuration schema.
```

The `@path` syntax in CLAUDE.md imports the referenced file into Claude's context. This keeps CLAUDE.md concise while giving Claude access to detailed documentation.

### Step 5: Explore Context Tools

Try each command:
- `/context` -- visualizes context usage as a colored grid
- `/compact Focus on the rate limiting feature we are about to build` -- compacts conversation, keeping focus on what you specify
- `/cost` -- shows token usage statistics for the current session

### Step 6: Build Rate Limiting

Now build the rate limiting feature while actively using the context tools:

```
Implement a rate limiting module for the gateway:
- Per-route rate limits configured in the route config
- Token bucket algorithm (or sliding window)
- Return 429 Too Many Requests when limit exceeded
- Include Retry-After header in the response
- Rate limit state stored in memory (not persisted yet)

Write tests for the rate limiter, run them, and commit.
```

After building, run `/compact` to free context, then run `/cost` to see how many tokens you used.

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

### Step 1: Create the "add-route" Skill

Skills live in `.claude/skills/<skill-name>/SKILL.md`. Create your first skill:

```
Create a skill at .claude/skills/add-route/SKILL.md with this content:

---
name: add-route
description: Guided route creation with validation. Use when adding new API
  routes to the gateway configuration.
disable-model-invocation: true
---

Add a new route to the gateway configuration:

1. Read the current config file to see existing routes
2. Ask the user for: path pattern, HTTP method, upstream target (host:port)
3. Validate that the path does not conflict with existing routes
4. Validate that the upstream target is a valid host:port
5. Add the route to the config file
6. Show the updated route list
7. Remind the user to restart the gateway if it is running
```

Test it by typing:

```
/add-route
```

Claude will walk through the guided route creation process.

### Step 2: Create the "test-endpoint" Skill

```
Create a skill at .claude/skills/test-endpoint/SKILL.md:

---
name: test-endpoint
description: Fire a test request at a gateway endpoint and report the result.
  Use when testing routes after configuration changes.
disable-model-invocation: true
argument-hint: [path] [method]
---

Test the endpoint $ARGUMENTS against the running gateway:

1. Parse the arguments: first argument is the path, second is the HTTP method
   (default GET)
2. Construct the request URL using localhost and the configured gateway port
3. Send the request
4. Report: status code, response time, response headers, response body
   (truncated to 500 chars)
5. If the request fails, diagnose: is the gateway running? Is the route
   configured? Is the upstream reachable?
```

Test it:

```
/test-endpoint /api/users GET
```

### Step 3: Create the "status-report" Skill

```
Create a skill at .claude/skills/status-report/SKILL.md:

---
name: status-report
description: Show the full status of the gateway including all routes, their
  health, and rate limit counters.
---

Generate a gateway status report:

1. Check if the gateway process is running (check the configured port)
2. Read the route configuration file
3. For each route:
   - Show path, method, upstream target
   - Ping the upstream target and report if it is reachable
   - Show the rate limit configuration (if any)
4. Hit /health and report the response
5. Format as a clean table
```

This skill does not have `disable-model-invocation: true`, which means Claude can also invoke it automatically when it thinks a status check is relevant.

### Step 4: Argument Substitution

Skills support positional arguments. In the test-endpoint skill above, `$ARGUMENTS` captures everything after the skill name. You can also use:

- `$0` -- first argument
- `$1` -- second argument
- `$ARGUMENTS[0]` -- same as `$0`

Create a quick skill that uses positional arguments:

```
Create a skill at .claude/skills/route-info/SKILL.md:

---
name: route-info
description: Show detailed info about a specific route
disable-model-invocation: true
argument-hint: [path-pattern]
---

Look up the route matching "$0" in the configuration and show:
- Full route definition
- Rate limit settings
- Whether the upstream is currently reachable
- How many times it would match against common request patterns
```

Test: `/route-info /api/users`

### Step 5: Hot-Reload Demonstration

With Claude Code running, open `.claude/skills/status-report/SKILL.md` in a separate editor and change the description text. Go back to Claude Code and type `/status-report`. Claude picks up the updated skill content without restarting.

Skills are re-read each time they are invoked, so edits take effect immediately.

### Step 6: Create a disable-model-invocation Skill

The `disable-model-invocation: true` frontmatter prevents Claude from using a skill automatically. It will only run when you explicitly type the slash command.

Review your skills and confirm:
- `add-route`: has `disable-model-invocation: true` (you control when routes are added)
- `test-endpoint`: has `disable-model-invocation: true` (you control when tests fire)
- `status-report`: does NOT have it (Claude can run status checks proactively)
- `route-info`: has `disable-model-invocation: true` (lookup on demand)

Ask Claude:

```
Which of my skills can you invoke automatically, and which ones require me to
type the slash command? Explain the difference.
```

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

### Step 2: SessionStart Hook -- Inject Gateway Status

Create a script that checks whether the gateway is running and reports its state:

```
Create .claude/hooks/gateway-status.sh (make it executable):

#!/bin/bash
PORT=3000
if curl -s --max-time 2 http://localhost:$PORT/health > /dev/null 2>&1; then
  echo "Gateway is RUNNING on port $PORT"
  ROUTE_COUNT=$(cat config.yaml 2>/dev/null | grep -c "path:" || echo "unknown")
  echo "Routes configured: $ROUTE_COUNT"
else
  echo "Gateway is NOT RUNNING"
fi
```

Adjust to match your config format. The key: stdout from a SessionStart hook gets injected into Claude's context automatically.

Now configure the hook in `.claude/settings.json`:

```
Create .claude/settings.json with:

{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/gateway-status.sh"
          }
        ]
      }
    ]
  }
}
```

Test it: exit Claude Code and relaunch. The gateway status appears in context automatically.

### Step 3: PostToolUse Hook -- Auto-Lint Config Files

After Claude writes or edits a config file, automatically validate it:

```
Create .claude/hooks/validate-config.sh:

#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
case "$FILE_PATH" in
  *.yaml|*.yml|*.toml|*.json)
    if [[ "$FILE_PATH" == *.json ]]; then
      python -c "import json; json.load(open('$FILE_PATH'))" 2>&1
      if [ $? -ne 0 ]; then
        echo "Config validation FAILED for $FILE_PATH" >&2
        exit 2
      fi
    fi
    echo "Config validated: $FILE_PATH"
    ;;
esac
exit 0
```

Add a PostToolUse entry to `.claude/settings.json`:

```json
"PostToolUse": [
  {
    "matcher": "Write|Edit",
    "hooks": [
      {
        "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-config.sh"
      }
    ]
  }
]
```

The **matcher** `"Write|Edit"` means this fires only when Claude uses those tools. Matchers are case-sensitive and support regex.

### Step 4: Stop Hook -- Run Tests Before Stopping

A Stop hook fires when Claude finishes a response. Exit code 2 blocks Claude from stopping.

```
Create .claude/hooks/check-before-stop.sh:

#!/bin/bash
INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
# Avoid infinite loops
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then exit 0; fi

cd "$CLAUDE_PROJECT_DIR"
TEST_OUTPUT=$(<your-test-command> 2>&1)  # replace with your test runner
if [ $? -ne 0 ]; then
  echo "Tests are failing. Fix them before stopping." >&2
  exit 2
fi
exit 0
```

Add the Stop hook to settings.json:

```json
"Stop": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-before-stop.sh",
        "timeout": 30
      }
    ]
  }
]
```

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

### Step 4: Verify MCP Connections

Inside Claude Code, run `/mcp` to see both servers with their status. Also verify with `claude mcp list`.

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

### Step 7: Build the Caching Layer with MCP

Now use the SQLite MCP server to build the caching layer:

```
Implement a caching layer for the gateway:

1. Create a SQLite database (cache.db) with a table:
   - cache_entries: key (TEXT PRIMARY KEY), value (TEXT), headers (TEXT),
     created_at (INTEGER), ttl_seconds (INTEGER)
2. When a request matches a cacheable route (GET requests only), check the
   cache first
3. If a cache hit exists and is not expired, return the cached response
4. If no cache hit or expired, forward to upstream and cache the response
5. Add a route config option: cache_ttl (seconds, 0 = no cache)
6. Add a CLI command: nexus cache stats (show hit/miss counts)
7. Add a CLI command: nexus cache clear

Use the SQLite MCP tools to inspect the cache database directly. Show me the
cache entries after a few test requests.
```

After building, ask Claude to query the cache database using MCP tools:

```
Use the SQLite MCP server to show me all entries in the cache_entries table.
How many cache hits and misses have there been?
```

### Step 8: Create a Skill That Uses MCP

Create a skill that orchestrates MCP tools for cache inspection:

```
Create .claude/skills/cache-inspect/SKILL.md:

---
name: cache-inspect
description: Query the SQLite cache for stats, inspect entries, and manage
  cache state. Use when debugging caching issues or checking cache performance.
---

Inspect the gateway's SQLite cache:

1. Use the SQLite MCP tools to query cache.db
2. Show total cache entries, total size, oldest entry, newest entry
3. Show hit/miss ratio if tracking data is available
4. Show the top 5 most-accessed cache keys
5. Flag any expired entries that have not been cleaned up
6. Format results as a clean summary table

If the user provides a path argument, filter results to cache entries matching
that path pattern.
```

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

Create a hook that denies edits to route config files unless they pass validation:

```
Create .claude/hooks/guard-config-edit.sh:

#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
case "$FILE_PATH" in
  *config*.yaml|*config*.yml|*config*.json|*routes*.yaml|*routes*.json)
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
    if ! echo "$CONTENT" | grep -q "path"; then
      echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Route config must contain a path field"}}'
      exit 0
    fi ;;
esac
exit 0
```

Add a PreToolUse entry to `.claude/settings.json` with matcher `"Write|Edit"` pointing to this script. Test it: ask Claude to write a config file missing the `path` field. The hook should block it.

### Step 3: Guard -- Add Context to Route Handler Reads

When Claude reads a route handler file, inject helpful context:

```
Create .claude/hooks/route-context.sh:

#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
case "$FILE_PATH" in
  *route*|*handler*)
    CONTEXT="This is a route handler. Always validate HTTP method and return proper status codes. Check rate limit config before forwarding."
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"$CONTEXT\"}}" ;;
esac
exit 0
```

The `additionalContext` field injects text into Claude's context before the tool runs, without changing the tool's behavior.

### Step 4: Guard -- Auto-Add Logging to New Route Handlers

Create `.claude/hooks/inject-logging.sh` that checks if a route handler being written includes logging. If not, use `additionalContext` to remind Claude:

```
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
if [ "$TOOL_NAME" = "Write" ]; then
  case "$FILE_PATH" in
    *route*|*handler*)
      CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
      if ! echo "$CONTENT" | grep -q "logger\|logging\|log"; then
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"IMPORTANT: This route handler is missing logging. Add request logging with method, path, status code, and response time.\"}}"
      fi ;;
  esac
fi
exit 0
```

Using `additionalContext` to remind Claude is more reliable than forcibly rewriting content with `updatedInput`.

### Step 5: Prompt-Based Hook -- Security Gate

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

### Step 2: Create the "router-agent"

```
Create .claude/agents/router-agent.md:

---
name: router-agent
description: Specialized for route matching, optimization, and conflict detection.
  Use proactively when working with route configurations or debugging routing.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a routing specialist for nexus-gateway. When invoked:
1. Read the current route configuration
2. Analyze for conflicting routes, unreachable routes, ordering issues
3. If adding a route, validate against existing routes first
4. If optimizing, suggest route reordering for performance
Show analysis as: Path | Method | Upstream | Status | Issues
```

### Step 3: Create the "cache-agent"

```
Create .claude/agents/cache-agent.md:

---
name: cache-agent
description: Manages the SQLite cache layer. Use for cache optimization,
  eviction analysis, debugging, and performance tuning.
tools: Read, Bash, Grep, Glob
model: sonnet
---

You are a caching specialist. The cache is SQLite at cache.db. When invoked:
1. Query the cache database for current state
2. Analyze: hit/miss rate, entry ages, total size, near-expiration entries
3. If optimizing: suggest TTL adjustments, eviction strategies, prewarming
4. If debugging: check for stale entries, oversized entries, key collisions
```

### Step 4: Create the "security-agent"

```
Create .claude/agents/security-agent.md:

---
name: security-agent
description: Audits the gateway for security issues. Use after config changes
  or before deployments.
tools: Read, Grep, Glob
model: sonnet
---

You are a security auditor for nexus-gateway. When invoked:
1. Route config: exposed admin endpoints, missing rate limits, external
   hosts, overly permissive patterns
2. Code: missing input validation, header injection, request smuggling,
   missing timeouts
3. Access: missing auth, missing CORS, missing security headers
Severity: CRITICAL, HIGH, MEDIUM, LOW. Format as audit report.
```

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

**Direct invocation:**

```
Use the security-agent to audit the current gateway configuration
```

**Chaining** (sequential delegation):

```
First use the router-agent to check for route conflicts, then use the
security-agent to audit any issues found, then use the cache-agent to verify
cache entries are valid for the affected routes.
```

**Parallel** (simultaneous delegation):

```
In parallel, have the router-agent analyze route performance and the
cache-agent analyze cache hit rates. Combine the findings into a single
optimization report.
```

**Background** (non-blocking):

While Claude is running a subagent, press `Ctrl+B` to send it to the background. You can continue working and Claude will notify you when it finishes.

```
Run the security-agent in the background to audit the full codebase. I will
continue working on the rate limiter.
```

**Resuming:**

```
Resume the security-agent and have it also check the new middleware code.
```

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

### Step 2: Cross-Session Persistence

To share a task list across sessions: `CLAUDE_CODE_TASK_LIST_ID=nexus-middleware claude`. Any tasks created are stored under that ID. Another terminal with the same command sees the same tasks.

### Step 3: Multi-Step Pipeline -- Add Middleware System

Ask Claude to create a task chain for adding a middleware system to the gateway:

```
Create a task list for adding a middleware system to the gateway. Break it into
these dependent tasks:

Task 1: Define the middleware interface
  - Define how middleware functions are called (request in, response out)
  - Define ordering (middleware chain)
  - No dependencies

Task 2: Implement logging middleware
  - Log method, path, status code, response time for every request
  - Depends on: Task 1

Task 3: Implement auth middleware
  - Check for API key in header
  - Return 401 if missing or invalid
  - Configurable per route
  - Depends on: Task 1

Task 4: Wire middleware into request pipeline
  - Integrate middleware chain into the main request handler
  - Execute middleware in order before forwarding to upstream
  - Depends on: Task 2, Task 3

Task 5: Integration tests
  - Test middleware chain end-to-end
  - Test auth + logging together
  - Test middleware ordering
  - Depends on: Task 4
```

Claude creates tasks with explicit dependencies. Task 4 cannot start until both Tasks 2 and 3 are complete. Task 5 cannot start until Task 4 is done.

Press `Ctrl+T` to toggle the task list view in your terminal. You will see tasks with their status indicators.

Now work through the tasks:

```
Start working on Task 1: Define the middleware interface. Show me the plan
first, then implement it.
```

After completing each task, Claude automatically marks it done and moves to the next unblocked task.

### Step 4: TDD -- Build Request Validation Middleware

Use strict Test-Driven Development to build one more middleware:

```
We are going to build a request validation middleware using strict TDD. The
rules:

1. Write a FAILING test first (red)
2. Write the MINIMUM code to make it pass (green)
3. Refactor if needed (refactor)
4. Repeat

The middleware should:
- Validate Content-Type header for POST/PUT requests (must be application/json)
- Validate Content-Length is present and reasonable (< 1MB)
- Validate the request path does not contain directory traversal (../)
- Return 400 Bad Request with a descriptive error for validation failures

Start with the first test: a POST request without Content-Type should return
400.
```

Work through the red-green-refactor cycle at least 4 times. Each cycle should be a separate commit.

### Step 5: Stop and SubagentStop Hooks for Quality

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

In Terminal 1:

```
Create tasks for the metrics feature:
- Task: Add request counter (total requests per route)
- Task: Add response time histogram
- Task: Add /metrics endpoint exposing all metrics
- Task: Tests for metrics collection

Start working on the first task.
```

In Terminal 2:

```
Create tasks for the websocket feature:
- Task: Add websocket upgrade handling in the router
- Task: Implement websocket proxy to upstream
- Task: Add websocket health checks
- Task: Tests for websocket routing

Start working on the first task.
```

Both instances share the task list. When one completes a task, the other sees the update. This is the parallel development workflow.

### Step 3: Create a Plugin -- "gateway-plugin"

Bundle your skills, agents, and hooks into a distributable plugin:

```
Create a plugin called "gateway-plugin" with this structure:

gateway-plugin/
  .claude-plugin/plugin.json    # name, description, version, author
  skills/                       # copy from .claude/skills/
    add-route/SKILL.md
    test-endpoint/SKILL.md
    cache-inspect/SKILL.md
    status-report/SKILL.md
  agents/                       # copy from .claude/agents/
    router-agent.md
    security-agent.md
    cache-agent.md
  hooks/hooks.json              # copy hooks from .claude/settings.json

Set plugin.json name to "gateway-plugin" and version "1.0.0".
```

Test: `claude --plugin-dir ./gateway-plugin`, then try `/gateway-plugin:add-route` and `/gateway-plugin:status-report`. Skills appear with the namespace prefix.

### Step 4: Evaluation -- Test Specs and Scoring

Create evaluation criteria for your gateway:

```
Create an evaluation script that tests the gateway against these criteria:

1. Server starts and responds to /health within 2 seconds (pass/fail)
2. Route matching: at least 5 test cases covering exact, prefix, method
   filtering, no match, and priority ordering (score 0-5)
3. Rate limiting: requests beyond the limit return 429 (pass/fail)
4. Caching: repeated GET requests return cached response with correct headers
   (pass/fail)
5. Middleware chain: logging + auth middleware execute in order (pass/fail)
6. Error handling: upstream failure returns 502, bad request returns 400
   (pass/fail)

Run the evaluation and report a total score out of 10.
```

This is a basic evaluation framework. In production, you would use this pattern to score Claude's work against specifications.

### Step 5: PermissionRequest Hooks

PermissionRequest hooks fire when Claude would show a permission dialog. Add to `.claude/settings.json`:

- **Auto-approve tests**: matcher `"Bash(npm test*)"` (adjust for your test runner), decision `"behavior": "allow"`
- **Block direct DB edits**: matcher `"Bash(sqlite3 cache.db*)"`, decision `"behavior": "deny"` with message `"Use the cache-agent or cache-inspect skill instead."`

The JSON output format for PermissionRequest hooks uses `hookSpecificOutput.decision.behavior` set to `"allow"` or `"deny"`. Ask Claude to generate the full settings.json entries for your language's test command.

### Step 6: Continuous Learning

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

**Next project:** Project 4 (Sentinel) goes deeper into subagents, tasks, TDD, parallel agents, and context engineering. Project 5 (Architect) covers full advanced workflows: worktrees, multi-agent orchestration, plugins, evaluation, and continuous learning.
