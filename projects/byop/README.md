# BYOP -- Bring Your Own Project

Already have a project you're working on? Learn every Claude Code feature by applying it to YOUR existing codebase. Same 10 modules, same CC skills, but every exercise targets your real code instead of a tutorial project.

**Who this is for:** Developers with an existing project who want practical CC
skills, not another tutorial. You'll learn Claude Code by solving real problems
in real code you already care about.

**Not recommended for first-timers.** If you've never used Claude Code before,
start with [Canvas](../canvas/README.md) — it has the simplest setup so you can
focus purely on learning CC features without fighting your toolchain.

**What you will learn:** All 10 modules cover the full Claude Code feature set,
from CLAUDE.md and plan mode through skills, hooks, MCP servers, subagents,
tasks, plugins, and parallel development.

**Time estimate:** 3-5 focused sessions (roughly 10-15 hours total).

**Prerequisites:**
- An existing project with source code (any language)
- Git initialized in the project (or willingness to `git init`)
- Familiarity with the terminal and your project's toolchain

---

## How BYOP Works

Unlike the four tutorial projects, BYOP does not scaffold a new project in `workspace/`. Your project stays where it is. Claude references it via an absolute path in CLAUDE.local.md using `@import`.

During onboarding (`/start`), Claude will:
1. Ask for your project's path
2. Auto-detect the language, existing CLAUDE.md, git status
3. Confirm what it found and set up the connection

From there, every module exercise is framed as "apply this CC feature to YOUR project" — you create rules for your conventions, skills for your workflows, hooks for your quality gates, and agents for your review process.

---

## What You'll Build

You won't build a new project — you'll supercharge the one you already have. By the end of all 10 modules, your existing project will have:

### After Module 3 — CC-Enhanced Project

Your project has a CLAUDE.md that knows your codebase, path-scoped rules enforcing your coding conventions, and context management configured for your workflow.

```
your-project/
├── your existing files...
├── CLAUDE.md               # Project memory (new or enhanced)
├── .claude/
│   └── rules/              # Your coding conventions
└── docs/                   # Optional @import targets
```

### After Module 6 — Connected and Automated

Custom skills automate your repetitive tasks, hooks enforce quality gates on every interaction, and MCP servers connect Claude to your external tools.

```
your-project/
├── your existing files...
├── CLAUDE.md
├── .claude/
│   ├── skills/             # Custom commands for your workflow
│   ├── settings.json       # Hook configuration
│   └── rules/
└── .mcp.json               # MCP server config
```

### After Module 10 — Full CC Mastery

Subagents review your code, a task system manages complex features, and a plugin packages your entire CC setup for reuse across projects.

---

## Modules

| # | Module | Focus | CC Features |
|---|--------|-------|-------------|
| 1 | [Setup & First Contact](modules/01-setup.md) | CLAUDE.md for your project, memory hierarchy, shortcuts | CLAUDE.md, /init, /memory, keyboard shortcuts |
| 2 | [Blueprint & Build](modules/02-blueprint.md) | Plan a real feature for your project, build it | Plan mode, git branches, scoped prompting |
| 3 | [Rules, Memory & Context](modules/03-rules-memory-context.md) | Rules for your conventions, context management | .claude/rules/, CLAUDE.local.md, @imports, /context, /compact, /stats, /cost, /statusline |
| 4 | [Skills & Commands](modules/04-skills-commands.md) | Custom commands for your workflow | SKILL.md, frontmatter, $ARGUMENTS, hot-reload, disable-model-invocation |
| 5 | [Hooks](modules/05-hooks.md) | Automated quality gates for your project | SessionStart, PostToolUse, Stop hooks, matchers, settings.json |
| 6 | [MCP Servers](modules/06-mcp-servers.md) | Connect Claude to your tools and services | MCP servers, .mcp.json, scopes, skills+MCP, claude mcp add |
| 7 | [Guard Rails](modules/07-guard-rails.md) | Enforce your project's patterns automatically | PreToolUse, permissionDecision, additionalContext, updatedInput, prompt hooks |
| 8 | [Subagents](modules/08-subagents.md) | Specialized review agents for your codebase | .claude/agents/, frontmatter, chaining, parallel (Ctrl+B), resuming |
| 9 | [Tasks & TDD](modules/09-tasks-tdd.md) | Feature pipeline with your test framework | Tasks, dependencies/blockedBy, cross-session persistence, TDD, SubagentStop |
| 10 | [Parallel Dev, Plugins & Eval](modules/10-parallel-plugins-eval.md) | Parallel features, package your CC setup | Git worktrees, plugins, evaluation, PermissionRequest hooks, continuous learning |
