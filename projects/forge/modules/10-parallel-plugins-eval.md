# Module 10 -- Parallel Dev, Plugins, and Evaluation

**CC features:** Git worktrees, plugins, evaluation, PermissionRequest hooks,
continuous learning

> **Persona — Launcher:** State the goal, step back. Only help if stuck after multiple tries. "You've got this", "Go build it."

## 10.1 Git Worktrees for Parallel Development

> **Why this step:** Until now, you have worked on one feature at a time: create a branch, build, merge, repeat. Git worktrees let you work on multiple features *simultaneously* in separate directories, each with its own Claude Code session. This is parallel development -- two features being built at the same time by two Claude instances, coordinating through a shared task list.

Git worktrees let you work on multiple branches simultaneously without
switching. Each worktree is a separate directory pointing to the same repo.

Create two worktrees for parallel feature development:

```
! git worktree add ../forge-api feature/api
! git worktree add ../forge-export feature/export
```

Now you have three directories:
- `forge-toolkit/` -- main branch
- `../forge-api/` -- feature/api branch
- `../forge-export/` -- feature/export branch

## 10.2 Run Parallel Claude Instances

Open separate terminals. Share a task list across both:

```
# Terminal 1:
cd ../forge-api && CLAUDE_CODE_TASK_LIST_ID=forge-parallel claude

# Terminal 2:
cd ../forge-export && CLAUDE_CODE_TASK_LIST_ID=forge-parallel claude
```

In Terminal 1, create tasks for the API feature (design routes, implement
server, write tests -- with dependencies). In Terminal 2, create tasks for
the export feature (design formats, implement exporters, write tests).

Both sessions see all tasks. When one completes a task, the other is notified.

> **STOP -- What you just did:** You set up parallel development with two Claude instances sharing a task list via `CLAUDE_CODE_TASK_LIST_ID`. Each instance works in its own worktree on its own feature branch, but they can see each other's task progress. This is the most advanced workflow pattern in Claude Code -- it lets you multiply your throughput by running independent features in parallel. When one session completes a task that unblocks work in the other session, both see the update.

> **Quick check before continuing:**
> - [ ] Two worktree directories exist (`forge-api/` and `forge-export/`)
> - [ ] Each has its own Claude Code session running
> - [ ] Both sessions see the same shared task list
> - [ ] Tasks created in one session appear in the other

## 10.3 Plugin Creation

> **Why this step:** Everything you have built -- skills, agents, hooks -- lives inside your project. A plugin packages these components into a portable, reusable bundle that can be shared with other projects or other people. Think of it as turning your project-specific customizations into a distributable tool.

Package everything you have built into a reusable plugin. Describe to Claude what you want to include and let it figure out the plugin structure.

> "Package my forge toolkit into a reusable plugin called knowledge-base-plugin. Include the add-item, search, daily-summary, and backup skills, the search, format, and review agents, and extract the relevant hooks into plugin format. Create a plugin.json manifest with name and version."

Claude may ask about which hooks to include or how to handle project-specific paths. The directory layout must be:

```
knowledge-base-plugin/
  .claude-plugin/plugin.json    <-- manifest (required)
  skills/                       <-- at root, NOT inside .claude-plugin/
  agents/
  hooks/hooks.json
```

## 10.4 Test the Plugin

Test your plugin locally:

```
claude --plugin-dir ./knowledge-base-plugin
```

Verify everything works:
- Skills invoke correctly: `/knowledge-base:add-item`, `/knowledge-base:search`
- Agents appear in `/agents`
- Hooks fire as expected

Note the namespacing: plugin skills are prefixed with the plugin name to
prevent conflicts.

> **STOP -- What you just did:** You packaged your forge toolkit's skills, agents, and hooks into a standalone plugin with a manifest file. The plugin can be loaded into any project with `--plugin-dir`, and all skills are automatically namespaced (e.g., `/knowledge-base:add-item`) to prevent conflicts with the host project's own skills. This is how you share Claude Code customizations across projects and teams.

Ready to build an evaluation suite for your skills and agents?

## 10.5 Evaluation

> **Why this step:** How do you know your skills and agents actually work well? Evaluation gives you a systematic way to test them with defined inputs, expected outputs, and scoring criteria. This is not the same as unit testing your code -- it is testing your *Claude Code configuration*: do skills produce the right output? Do agents make good decisions?

Describe to Claude the test cases you want for each skill and agent. Think about what "correct behavior" looks like for each one -- both the happy path and the failure cases.

> "Create an evaluation suite for the forge toolkit. I want test cases for each skill and agent with defined inputs, expected outputs, and scoring criteria. For add-item: test with a valid note, an empty title, and missing fields. For the search agent: test exact title match, tag search, and no-results behavior. For the review agent: test with an incomplete item and duplicates. Write a script that runs each test and reports pass/fail."

Claude may ask about how strict the scoring should be or what counts as "close enough." These are your standards -- discuss them.

> **STOP -- What you just did:** You created an evaluation suite that tests your Claude Code configuration the same way you would test code. Each test case specifies what to input, what output to expect, and how to score the result. This closes the feedback loop: you built skills and agents in earlier modules, and now you have a way to measure whether they work correctly. In real projects, run evaluations after any change to skills, agents, or hooks to catch regressions.

Shall we set up auto-approval hooks for eval runs?

## 10.6 PermissionRequest Hooks for Eval Automation

> **Why this step:** Running evaluations means invoking many tool calls in rapid succession. Without auto-approval, you would have to manually confirm every Read, Grep, and Bash command -- dozens of permission prompts that slow everything down. PermissionRequest hooks let you auto-approve safe operations during eval while keeping the safety prompts during normal development.

During evaluation, auto-approve safe operations to avoid prompt fatigue. Ask Claude to set up the auto-approval hook in your local settings (not the shared project settings).

> "Add a PermissionRequest hook to .claude/settings.local.json that auto-approves Read, Grep, Glob, and forge commands during evaluation. Use a matcher for those specific tools and output a decision with behavior: allow. Keep it in settings.local.json since this is a personal workflow choice."

> **STOP -- What you just did:** You used a PermissionRequest hook to auto-approve safe operations (Read, Grep, Glob, and forge commands) during evaluation. Notice this hook lives in `settings.local.json` -- not committed to version control -- because auto-approval is a personal workflow choice, not a team policy. This is a good example of the local vs. project settings distinction: safety-reducing configurations stay local.

> **Quick check before continuing:**
> - [ ] Your plugin loads with `--plugin-dir` and skills work with namespace prefix
> - [ ] Evaluation suite exists with test cases for skills and agents
> - [ ] PermissionRequest hook auto-approves safe operations during eval
> - [ ] The auto-approval hook is in `settings.local.json`, not `settings.json`

## 10.7 Continuous Learning

> **Why this step:** This is the most important habit you can build. Claude Code's effectiveness comes from its configuration -- CLAUDE.md, rules, skills, agents, hooks. Every time you discover a pattern that works or a mistake to avoid, capturing it in your configuration makes every future session better. This is compound learning: each session builds on everything that came before.

Reflect on the full project and have a conversation with Claude about what you have learned. Ask it to review your configuration and suggest improvements based on how things actually worked.

> "Review our CLAUDE.md, rules, skills, agents, and hooks. What patterns worked well? What should we refine? Are there edge cases we missed or descriptions that could be clearer? Help me update everything based on what we've learned building this project."

This is the continuous learning cycle: build, reflect, refine, repeat.

> **STOP -- What you just did:** You completed the full learning loop. Over 10 modules, you built a personal dev toolkit while systematically learning every major Claude Code feature. This final step -- reviewing and refining your configuration -- is what separates people who use Claude Code from people who master it. Your CLAUDE.md, rules, skills, agents, and hooks are a living system that gets better with every session. Keep updating them.

## Checkpoint

- [ ] Created git worktrees for parallel feature development
- [ ] Ran two Claude instances with a shared task list
- [ ] Both instances could see and update the same tasks
- [ ] Plugin created with manifest, skills, agents, and hooks
- [ ] Plugin tested with `--plugin-dir` and skills work with namespace prefix
- [ ] Evaluation suite exists with test specs for skills and agents
- [ ] PermissionRequest hook auto-approves safe operations during eval
- [ ] CLAUDE.md and rules updated with lessons learned from the project

---

## Final Verification Checklist

Confirm you have touched every major Claude Code feature across all 10 modules:

- [ ] `/init`, `/memory`, `CLAUDE.md` -- project memory and configuration
- [ ] Keyboard shortcuts -- Tab, Shift+Tab, Ctrl+C, Ctrl+L, @, !, Esc Esc, Ctrl+O, Ctrl+B
- [ ] Plan mode -- designed architecture before building
- [ ] Git integration -- branches, commits, merges through Claude
- [ ] `.claude/rules/` -- path-scoped rules with YAML frontmatter
- [ ] `CLAUDE.local.md` -- personal, non-committed preferences
- [ ] `@imports` -- modular CLAUDE.md referencing external docs
- [ ] `/context`, `/compact`, `/cost` -- context management tools
- [ ] Custom skills -- `SKILL.md` with frontmatter, `$ARGUMENTS`, hot-reload
- [ ] `disable-model-invocation` -- manual-only skills
- [ ] Hooks -- SessionStart, PostToolUse, PreToolUse, Stop in `.claude/settings.json`
- [ ] Hook decision control -- `permissionDecision`, `additionalContext`, `updatedInput`
- [ ] Prompt-based hooks -- `type: "prompt"` for LLM-powered quality gates
- [ ] MCP servers -- `claude mcp add`, `/mcp`, `.mcp.json`, scopes
- [ ] Skills + MCP -- skill orchestrating MCP tools
- [ ] Subagents -- `.claude/agents/` with frontmatter, chaining, parallel, resume
- [ ] Tasks -- TaskCreate, dependencies, `CLAUDE_CODE_TASK_LIST_ID`
- [ ] TDD -- test-first development cycle
- [ ] SubagentStop hooks -- verification of subagent output
- [ ] Git worktrees -- parallel development with multiple Claude instances
- [ ] Plugins -- manifest, skills, agents, hooks, `--plugin-dir`
- [ ] Evaluation -- test specs for skills and agents
- [ ] PermissionRequest hooks -- auto-approval for eval automation
- [ ] Continuous learning -- updated CLAUDE.md with project insights

---

## Tips

**Start small, then expand.** Do not try to build everything at once. Each
module builds on the last. If you get stuck, go back and make sure the
previous module's checkpoint is complete.

**Use plan mode liberally.** Before any significant change, switch to plan
mode and think it through. This is cheaper than fixing mistakes.

**Read the context files.** The `cc-self-train/context/` directory has detailed
reference docs for every CC feature: `claudemd.txt`, `skillsmd.txt`,
`hooks.txt`, `configure-hooks.txt`, `mcp.txt`, `skills-plus-mcp.txt`,
`subagents.txt`, `tasks.txt`, `plugins.txt`, `interactive-mode.txt`,
`boris-workflow.txt`.

**Commit often.** Small, focused commits make it easy to revert mistakes and
track progress.

**Use `/cost` regularly.** Context management is a skill. Watch how different
operations consume tokens and use `/compact` strategically.

**Keep CLAUDE.md up to date.** Every time you discover a pattern, convention,
or lesson, add it to your project memory. Future sessions benefit immediately.

**Test your hooks locally first.** Before adding a hook to settings.json, run
the script manually with sample JSON input to make sure it works. A broken
hook can block your workflow.

**Use `Ctrl+O` for debugging.** Verbose mode shows hook execution, tool calls,
and other details that are hidden by default. Toggle it when troubleshooting.

**Background tasks are powerful.** Use `Ctrl+B` to background long-running
operations (tests, builds, agents) and keep working on something else.

---

## What Is Next

You have built a complete personal dev toolkit and mastered every major Claude
Code feature. Here are paths forward:

- **Extend your toolkit:** Add features you actually want -- full-text search
  with stemming, a web UI, import from Notion/Obsidian. The forge is yours.
- **Try another project:** The other projects in `cc-self-train/` explore
  different domains while reinforcing the same CC features.
- **Share your plugin:** Distribute the knowledge-base plugin to your team or
  the community.
- **Build from scratch:** Take a project idea you have been putting off and
  build it with Claude Code. You now have the full toolkit.

The best way to solidify what you learned is to use it on real problems.
