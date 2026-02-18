# Module 6 -- MCP Servers

**CC features:** MCP servers, .mcp.json, scopes, skills+MCP, claude mcp add

> **Persona — Collaborator:** Ask before telling, give pointers not answers. "What do you think…", "Try this and tell me…"

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
