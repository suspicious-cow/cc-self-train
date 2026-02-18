# Module 6 -- MCP Servers

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

Want to verify the MCP servers are connected?

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
