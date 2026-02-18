# Module 6 -- MCP Servers

**CC features:** MCP servers, `.mcp.json`, scopes, skills+MCP, `claude mcp add`

> **Persona — Collaborator:** Ask before telling, give pointers not answers. "What do you think…", "Try this and tell me…"

## 6.1 What Is MCP

MCP (Model Context Protocol) is an open standard for connecting AI tools to
external data sources and APIs. MCP servers give Claude Code access to
databases, file systems, APIs, and more.

## 6.2 Add a SQLite MCP Server

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

Shall we add a filesystem MCP server too?

## 6.3 Add a Filesystem MCP Server

For enhanced file operations:

On Windows:

```
claude mcp add --transport stdio forge-fs -- cmd /c npx -y @anthropic-ai/mcp-filesystem --root .
```

On macOS/Linux:

```
claude mcp add --transport stdio forge-fs -- npx -y @anthropic-ai/mcp-filesystem --root .
```

## 6.4 Check MCP Status

```
/mcp
```

This shows all connected servers, their status, and available tools. You
should see both `forge-db` and `forge-fs`.

> **Quick check before continuing:**
> - [ ] `/mcp` shows both `forge-db` and `forge-fs` as connected
> - [ ] You can ask Claude to query the SQLite database and get results
> - [ ] Your existing data has been migrated from JSON to SQLite

## 6.5 Create .mcp.json for Team Sharing

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

## 6.6 Understand MCP Scopes

| Scope | Where Stored | Who Sees It |
|-------|-------------|------------|
| **local** (default) | `~/.claude.json` under project path | Only you, this project |
| **project** | `.mcp.json` in project root | Everyone (via version control) |
| **user** | `~/.claude.json` | Only you, all projects |

> **STOP -- What you just did:** You learned the three MCP scopes and how they control visibility. Local scope is for personal experimentation, project scope is for team sharing, and user scope is for tools you want everywhere. Understanding scopes prevents the common mistake of adding MCP servers that only work on your machine while your teammates get errors.

How about we combine skills with MCP servers?

## 6.7 Create a Skill That Orchestrates MCP Tools

Now combine skills and MCP by creating a backup skill. Describe the workflow to Claude -- exporting data from the database, writing it to a dated backup directory, and logging the backup.

> "Create a backup skill that exports all tables from the SQLite database to JSON files in a backups/YYYY-MM-DD/ directory, logs the backup in a backup_log table, and shows a summary with counts and file sizes. Make it manual-only and give it access to both MCP servers plus Bash, Read, and Write."

Claude will wire up the `mcp__forge-db__*` and `mcp__forge-fs__*` tool patterns in the `allowed-tools` frontmatter. This is the skills+MCP pattern in action.

Test it: `/backup`

> **STOP -- What you just did:** You combined two Claude Code features -- skills and MCP -- into something more powerful than either one alone. The backup skill uses `allowed-tools` to access MCP tools (`mcp__forge-db__*`) alongside regular tools. This is the skills+MCP pattern: a skill defines the workflow, MCP servers provide the data access. You will use this pattern whenever you need a repeatable workflow that touches external data sources.

## Checkpoint

- [ ] SQLite MCP server is connected (`/mcp` shows it active)
- [ ] Filesystem MCP server is connected
- [ ] You can query the SQLite database through Claude
- [ ] `.mcp.json` exists for team sharing
- [ ] You understand the three MCP scopes (local, project, user)
- [ ] Backup skill orchestrates MCP tools to export and archive data
- [ ] Data has been migrated from JSON files to SQLite
