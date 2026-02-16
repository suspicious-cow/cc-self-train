# cc-self-train

This is a "learn Claude Code by doing" repository. Users clone it and pick one of 4 projects to master every major Claude Code feature through 10 progressive modules.

## Repository Structure

```
cc-self-train/
├── README.md                    # Top-level overview, quick start, feature matrix
├── CLAUDE.md                    # This file — project conventions for Claude
├── .claude/
│   ├── skills/start/SKILL.md    # /start onboarding skill — the entry point
│   ├── scripts/welcome.sh       # SessionStart hook — prints welcome banner
│   ├── scripts/check-updates.js # SessionStart hook — checks for newer CC versions
│   ├── last-synced.json         # Cutoff markers for the update checker
│   └── settings.json            # Hook configuration (welcome + update checker)
├── context/                     # Reference documentation for all CC features
│   ├── changelog-cc.txt         # Claude Code changelog (v2.0.0 — v2.1.42)
│   ├── claudemd.txt             # CLAUDE.md hierarchy, @imports, rules
│   ├── skillsmd.txt             # Skills system (SKILL.md, frontmatter)
│   ├── hooks.txt                # Hook lifecycle, events, scripting
│   ├── configure-hooks.txt      # Practical hook configuration
│   ├── subagents.txt            # Custom subagents (.claude/agents/)
│   ├── plugins.txt              # Plugin structure and distribution
│   ├── tasks.txt                # Tasks system, dependencies
│   ├── mcp.txt                  # MCP servers and integrations
│   ├── skills-plus-mcp.txt      # Skills + MCP patterns
│   ├── interactive-mode.txt     # Keyboard shortcuts, vim mode
│   ├── boris-workflow.txt       # Real-world workflow patterns
│   └── ...                      # Additional reference docs
├── projects/
│   ├── canvas/README.md         # Personal Portfolio Site (10 modules) — HTML/CSS/JS, no build tools
│   ├── forge/README.md          # Personal Dev Toolkit (10 modules)
│   ├── nexus/README.md          # Local API Gateway (10 modules)
│   └── sentinel/README.md       # Code Analyzer & Test Generator (10 modules)
└── workspace/                   # User project directories (gitignored)
    └── <project-name>/          # Scaffolded by /start, has its own git repo
```

## Onboarding Flow

When a user runs `claude` in this repo:
1. Claude Code detects two project hooks in `.claude/settings.json` and prompts the user to trust them. They should approve both — they are read-only and safe. Users can review them with `/hooks` if they want to.
2. **Hook 1 — welcome.sh**: Prints a welcome banner telling them to type `/start` and explains the hooks.
3. **Hook 2 — check-updates.js**: Pings GitHub to check if a newer version of Claude Code is available. If so, it tells the user to run `claude update`. Fails silently if offline.
4. The `/start` skill walks them through: pick a project (Canvas, Forge, Nexus, or Sentinel), pick a language (skipped for Canvas), optionally choose an environment (skipped for Canvas; venv/conda/Docker for others), verify environment, scaffold project in `workspace/<name>/`, then deliver Module 1 inline.
5. From there, users say "next module" to continue through Modules 2-10. Claude reads the project guide from `projects/<name>/README.md` and walks them through each module — all within the same cc-self-train session. No terminal switching needed.

## Conventions

- **Language-agnostic:** Never assume a specific programming language. Describe what to build, not how. When giving examples, show multiple languages or use pseudocode.
- **Local-only:** No cloud services required. All projects work with local files, local git, and local tools.
- **Same curriculum, different domains:** All 4 projects cover the same 10 modules and the same CC features. The user picks based on what they want to build, not difficulty.
- **Hands-on:** Every module ends with verification. Users should be doing, not just reading.
- **Subdirectory projects:** Each project lives in `workspace/<name>/` with its own nested git repo. The `workspace/` directory is gitignored by cc-self-train. Users stay in the cc-self-train session for all modules.

## First Message Behavior

When a user starts a session in this repo, ALWAYS greet them warmly and direct them to get started.

**If `CLAUDE.local.md` exists with an active project**, greet the user and offer to continue (e.g., "Welcome back! You're on Module 3 of Forge. Say 'next module' when you're ready to continue."). Read `CLAUDE.local.md` for the project name, language, directory, and current module.

**If `CLAUDE.local.md` does not exist** (new user), and they send a vague first message (like "hi", "hello", "help", "what is this", or anything that suggests they're new), respond with:

1. A brief welcome explaining this is a hands-on Claude Code learning repo
2. The 4 project choices: Canvas (Personal Portfolio Site — recommended for first-timers), Forge (Personal Dev Toolkit), Nexus (Local API Gateway), Sentinel (Code Analyzer)
3. Tell them to type `/start` to begin the guided onboarding (picks project, picks language, verifies environment, scaffolds project)

This is critical — new users must not land in a blank, confusing session. Always orient them.

## When Helping Users

- Ask what language they're using before giving code examples
- Point them to the relevant `context/` file for deep dives on any CC feature
- If they're stuck on environment setup, help them get their toolchain working first
- Encourage the build→test→fix→commit cycle from Module 2 onward
- Keep suggestions practical and incremental, not theoretical
- When the user says "next module", read `projects/<name>/README.md` (from `CLAUDE.local.md`) and walk them through the next module. Update `Current Module` in `CLAUDE.local.md` after completion.

## The 10 Modules (Same for All 3 Projects)

Every project follows these same 10 modules:

1. **Setup & First Contact** — CLAUDE.md, /init, /memory, interactive mode, keyboard shortcuts
2. **Blueprint & Build** — Plan mode, git integration, basic prompting
3. **Rules, Memory & Context** — .claude/rules/, CLAUDE.local.md, @imports, /context, /compact, memory hierarchy
4. **Skills & Commands** — SKILL.md, frontmatter, custom commands, hot-reload, argument substitution
5. **Hooks** — SessionStart, PostToolUse, Stop hooks, matchers, hook scripting
6. **MCP Servers** — MCP servers, .mcp.json, scopes, skills+MCP integration
7. **Guard Rails** — PreToolUse, hook decision control, prompt-based hooks
8. **Subagents** — .claude/agents/, subagent frontmatter, chaining, parallel, background
9. **Tasks & TDD** — Tasks system, dependencies, cross-session persistence, TDD loops
10. **Parallel Dev, Plugins & Evaluation** — Worktrees, plugins, eval, PermissionRequest hooks, continuous learning
