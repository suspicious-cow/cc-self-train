# Learn Claude Code by Doing

A hands-on, project-based curriculum for mastering [Claude Code](https://docs.anthropic.com/en/docs/claude-code). You pick a project, pick your language, and learn every major CC feature by building something real.

## Quick Start

```bash
# 1. Install Claude Code (if you haven't already)
npm install -g @anthropic-ai/claude-code

# 2. Clone this repo
git clone https://github.com/suspicious-cow/cc-self-train.git
cd cc-self-train

# 3. Launch Claude Code
claude

# 4. When prompted to trust project hooks, approve them
#    (they show a welcome banner and check GitHub for
#     CC updates, nothing else — /hooks to review if curious)

# 5. Type this when Claude starts:
/start
```

That's it. Claude will walk you through picking a project, checking your dev environment, and scaffolding everything. You'll need an [Anthropic API key](https://console.anthropic.com/) or a Max subscription.

> **What are those hooks?** This repo includes two small SessionStart hooks. The first shows the welcome banner above. The second pings GitHub to check if new Claude Code releases or reference material have dropped since this repo was last updated — if so, it feeds that info to Claude so your session always has the latest guidance. Both are read-only, open source, and visible in `.claude/scripts/`.

## Who This Is For

You've installed Claude Code and maybe run `/init`. Now what? Pick one of 4 projects and work through 10 progressive modules that take you from "first session" to "multi-agent orchestration." Every project teaches every CC feature — you choose based on what you want to build.

**No specific language required.** Forge, Nexus, and Sentinel describe *what* to build, not *how*. You choose Python, TypeScript, Go, Rust, or whatever you're comfortable with. Canvas uses plain HTML/CSS/JS — no build tools needed.

## Manual Setup (if you prefer)

<details>
<summary>Click to expand manual setup instructions</summary>

### Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### Set Up Your Dev Environment

Make sure your language toolchain is ready:

| Language | What you need | Quick check |
|----------|--------------|-------------|
| **Python** | Python 3.10+, a package manager (conda, venv, uv, or pip) | `python --version` |
| **TypeScript/Node** | Node.js 18+, npm/pnpm/yarn | `node --version` |
| **Go** | Go 1.21+ | `go version` |
| **Rust** | Rust via rustup, cargo | `rustc --version` |
| **Other** | Whatever your language needs — Claude can help you set it up | |

**Docker users:** Any project can be done inside a container. Bring your own Dockerfile or ask Claude to generate one for your language.

### Install Git

```bash
git --version
```

If you don't have it: [git-scm.com/downloads](https://git-scm.com/downloads)

### Pick a Project and Go

Each project covers all 10 modules. Pick based on what sounds fun to build.

</details>

## The 4 Projects

### [Canvas — Personal Portfolio Site](projects/canvas/README.md) ⭐ Recommended for first-timers

Build a multi-page portfolio site with responsive design, a blog, and a contact form using plain HTML, CSS, and JavaScript. No build tools needed — just open it in your browser.

**Best for:** Anyone who wants the simplest setup to focus purely on learning CC

---

### [Forge — Personal Dev Toolkit](projects/forge/README.md)

Build a CLI for notes, snippets, bookmarks, and templates that grows into a searchable, pluggable knowledge base with API.

**Best for:** Tool builders, "I want something I'll actually use"

---

### [Nexus — Local API Gateway](projects/nexus/README.md)

Build an HTTP gateway with routing, rate limiting, SQLite caching, and health checks that grows into a full-featured service mesh.

**Best for:** Backend and service builders

---

### [Sentinel — Code Analyzer & Test Generator](projects/sentinel/README.md)

Build a tool that scans code for issues, generates tests, and tracks coverage, growing into a full quality dashboard with CI integration.

**Best for:** Quality-focused devs, "meta-tool" appeal

---

All four projects are **local-only** and **genuinely useful**. Canvas uses HTML/CSS/JS (no setup needed); Forge, Nexus, and Sentinel are **language-agnostic** — you choose. They all teach the same CC features through the same 10 modules — pick based on interest, not difficulty.

## The 10 Modules

Every project follows this same progression:

| # | Module | CC Features Taught |
|---|--------|--------------------|
| 1 | **Setup & First Contact** | CLAUDE.md, /init, /memory, interactive mode, keyboard shortcuts |
| 2 | **Blueprint & Build** | Plan mode, git integration, basic prompting |
| 3 | **Rules, Memory & Context** | .claude/rules/, CLAUDE.local.md, @imports, /context, /compact, memory hierarchy |
| 4 | **Skills & Commands** | SKILL.md, frontmatter, custom commands, hot-reload, argument substitution |
| 5 | **Hooks** | SessionStart, PostToolUse, Stop hooks, matchers, hook scripting |
| 6 | **MCP Servers** | MCP servers, .mcp.json, scopes, skills+MCP integration |
| 7 | **Guard Rails** | PreToolUse, hook decision control, prompt-based hooks |
| 8 | **Subagents** | .claude/agents/, subagent frontmatter, chaining, parallel, background |
| 9 | **Tasks & TDD** | Tasks system, dependencies, cross-session persistence, TDD loops |
| 10 | **Parallel Dev, Plugins & Evaluation** | Worktrees, plugins, eval, PermissionRequest hooks, continuous learning |

## Feature Coverage Matrix

Every major CC feature is taught in all 4 projects:

| Feature | Canvas | Forge | Nexus | Sentinel | Module |
|---------|:------:|:-----:|:-----:|:--------:|:------:|
| CLAUDE.md, /init, /memory | x | x | x | x | 1 |
| Interactive mode (shortcuts, @, /, !) | x | x | x | x | 1 |
| Plan mode | x | x | x | x | 2 |
| Git integration | x | x | x | x | 2 |
| .claude/rules/ (path-scoped) | x | x | x | x | 3 |
| CLAUDE.local.md, memory hierarchy | x | x | x | x | 3 |
| @imports, /context, /compact | x | x | x | x | 3 |
| Skills (SKILL.md, frontmatter, hot-reload) | x | x | x | x | 4 |
| Custom slash commands ($0, $1) | x | x | x | x | 4 |
| Hooks (SessionStart, PostToolUse, Stop) | x | x | x | x | 5 |
| Hook scripting (matchers, timeouts) | x | x | x | x | 5 |
| MCP servers (.mcp.json, scopes) | x | x | x | x | 6 |
| Skills + MCP integration | x | x | x | x | 6 |
| PreToolUse, hook decision control | x | x | x | x | 7 |
| Prompt-based hooks (LLM quality gates) | x | x | x | x | 7 |
| Subagents (.claude/agents/) | x | x | x | x | 8 |
| Subagent chaining, parallel, background | x | x | x | x | 8 |
| Tasks system (dependencies, cross-session) | x | x | x | x | 9 |
| TDD & verification loops | x | x | x | x | 9 |
| Git worktrees, parallel dev | x | x | x | x | 10 |
| Plugins (bundling everything) | x | x | x | x | 10 |
| Evaluation framework | x | x | x | x | 10 |
| Continuous learning patterns | x | x | x | x | 10 |

## Reference Docs

The `context/` folder contains detailed reference documentation for every CC feature:

| File | Covers |
|------|--------|
| `context/claudemd.txt` | CLAUDE.md hierarchy, @imports, rules |
| `context/skillsmd.txt` | Skills SKILL.md format, frontmatter, arguments |
| `context/hooks.txt` | Hook lifecycle, events, scripting, decision control |
| `context/configure-hooks.txt` | Practical hook configuration examples |
| `context/subagents.txt` | Subagent creation, frontmatter, patterns |
| `context/plugins.txt` | Plugin structure, manifest, bundling |
| `context/tasks.txt` | Tasks system, dependencies, cross-session |
| `context/mcp.txt` | MCP servers, transports, scopes |
| `context/skills-plus-mcp.txt` | Combining skills with MCP tools |
| `context/interactive-mode.txt` | Keyboard shortcuts, vim mode |
| `context/boris-workflow.txt` | Real-world patterns, parallel Claude workflows |
| `context/changelog-cc.txt` | Claude Code changelog (v2.0.0 — v2.1.42) |

## Design Principles

- **Language-agnostic:** Every project works in any language. You choose.
- **Local-only:** No cloud services required (MCP connections are optional/local).
- **Same curriculum, different domains:** All 3 projects teach the same features in the same order. Pick based on interest.
- **Hands-on:** You learn by building, not by reading. Every module ends with verification.
- **Real tools:** Every project produces something genuinely useful, not a toy.

## Companion Resources

- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) — Reference docs, agents, skills, and commands for Claude Code
- [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code) — Official documentation
- [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) — Latest changes
