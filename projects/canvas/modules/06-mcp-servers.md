# Module 6 -- MCP Servers

**CC features:** MCP servers, `.mcp.json`, scopes, skills+MCP, `claude mcp add`

### 6.1 What Is MCP

> **Why this step:** Until now, Claude Code has only worked with local files and shell commands. MCP (Model Context Protocol) servers extend Claude's reach to external systems -- file servers, web APIs, databases, and more. This is what turns Claude Code from a code assistant into an integration platform.

MCP (Model Context Protocol) is an open standard for connecting AI tools to
external data sources and APIs. MCP servers give Claude Code access to
databases, file systems, APIs, and more.

### 6.2 Add a Filesystem MCP Server

For enhanced file operations on your site files:

On Windows:

```
claude mcp add --transport stdio canvas-fs -- cmd /c npx -y @anthropic-ai/mcp-filesystem --root .
```

On macOS/Linux:

```
claude mcp add --transport stdio canvas-fs -- npx -y @anthropic-ai/mcp-filesystem --root .
```

After adding, check the status:

```
/mcp
```

You should see `canvas-fs` listed and connected.

> **STOP -- What you just did:** You connected your first MCP server and verified it with `/mcp`. The filesystem MCP server gives Claude enhanced file operations beyond the built-in Read/Write tools. The key command pattern is `claude mcp add --transport stdio <name> -- <command>`. You will use this same pattern to add any MCP server.

Shall we add a Fetch server to pull in real web content?

### 6.3 Add a Fetch MCP Server

The Fetch MCP server lets Claude pull in real content from the web -- perfect
for populating your portfolio with real data.

On Windows:

```
claude mcp add --transport stdio canvas-fetch -- cmd /c npx -y @anthropic-ai/mcp-fetch
```

On macOS/Linux:

```
claude mcp add --transport stdio canvas-fetch -- npx -y @anthropic-ai/mcp-fetch
```

Now try it out. Ask Claude to use the Fetch server to pull in real content for your portfolio. For example:

> "Using the canvas-fetch MCP server, fetch my GitHub profile and use the data to populate the projects page with real project cards."

Or if you do not have public repos, give Claude any URL and ask it to pull content from there:

> "Use the fetch server to grab content from [your URL] and convert it to an HTML entry for the site."

### 6.4 Check MCP Status

```
/mcp
```

This shows all connected servers, their status, and available tools. You
should see both `canvas-fs` and `canvas-fetch`.

> **STOP -- What you just did:** You used the Fetch MCP server to pull real data from the web into your portfolio. This is a powerful pattern: instead of manually copying content, Claude can fetch, parse, and integrate external data directly. You used a natural language prompt ("fetch my GitHub profile") and Claude handled the MCP tool calls behind the scenes.

> **Quick check before continuing:**
> - [ ] `/mcp` shows both `canvas-fs` and `canvas-fetch` as connected
> - [ ] You used the Fetch server to pull real content into your site
> - [ ] The content rendered correctly in your browser

### 6.5 Create .mcp.json for Team Sharing

To share MCP configuration with your team, use the project scope:

```
claude mcp add --transport stdio canvas-fs --scope project -- npx -y @anthropic-ai/mcp-filesystem --root .
```

This creates a `.mcp.json` file at your project root:

```json
{
  "mcpServers": {
    "canvas-fs": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-filesystem", "--root", "."],
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

> **Why this step:** The three scopes (local, project, user) control who sees an MCP configuration. The `project` scope creates `.mcp.json` which gets committed to git -- every teammate who clones the repo gets the same MCP servers automatically. This is how you standardize a team's tool setup.

### 6.7 Create a Skill That Orchestrates MCP Tools

Create a "publish" skill that combines MCP tools with built-in tools to validate and package your site for deployment. Describe the workflow to Claude:

> "Create a 'publish' skill that validates the site, generates a sitemap.xml, copies everything into a dist/ directory, minifies the CSS, and shows a deployment summary. Set disable-model-invocation to true and include mcp__canvas-fs__* in the allowed-tools so it can use the filesystem MCP server."

Discuss the publish steps with Claude -- you might want different minification, or maybe you want to skip certain files. This is your deployment workflow.

Test it: `/publish`

> **STOP -- What you just did:** You created a skill that combines MCP tools with built-in tools into a single workflow. The `allowed-tools` frontmatter field (`mcp__canvas-fs__*`) grants the skill access to MCP server tools using the naming pattern `mcp__<server-name>__<tool-name>`. This is the Skills + MCP integration pattern -- your most powerful automation combines custom skills with external data sources.

### Checkpoint

- [ ] Filesystem MCP server is connected (`/mcp` shows it active)
- [ ] Fetch MCP server is connected
- [ ] You used Fetch to pull real data into the site
- [ ] `.mcp.json` exists for team sharing
- [ ] You understand the three MCP scopes (local, project, user)
- [ ] Publish skill orchestrates MCP tools to validate and package the site
- [ ] `dist/` directory contains a deployable version of the site
