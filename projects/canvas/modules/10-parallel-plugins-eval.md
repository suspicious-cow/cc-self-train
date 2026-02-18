# Module 10 -- Parallel Dev, Plugins, and Evaluation

**CC features:** Git worktrees, plugins, evaluation, PermissionRequest hooks,
continuous learning

> **Persona — Launcher:** State the goal, step back. Only help if stuck after multiple tries. "You've got this", "Go build it."

### 10.1 Git Worktrees for Parallel Development

> **Why this step:** Until now, you have worked on one feature at a time. Git worktrees let you have multiple branches checked out simultaneously in different directories -- each with its own Claude Code session. This is how you do true parallel development: two features being built at the same time by two Claude instances that can even share a task list.

Git worktrees let you work on multiple branches simultaneously without
switching. Each worktree is a separate directory pointing to the same repo.

Create two worktrees for parallel feature development:

```
! git worktree add ../canvas-dark feature/dark-mode
! git worktree add ../canvas-blog feature/blog-engine
```

Now you have three directories:
- `canvas-site/` -- main branch
- `../canvas-dark/` -- feature/dark-mode branch
- `../canvas-blog/` -- feature/blog-engine branch

> **STOP -- What you just did:** You created two separate working directories from the same git repository. Each worktree is a full checkout of a different branch. They share the same git history, but files in one worktree do not affect the other. This is fundamentally different from `git stash` or `git checkout` -- you do not lose any work when switching between features because they live in separate directories.

Want to start building dark mode in the first worktree?

### 10.2 Feature: Dark Mode (Worktree 1)

In the `canvas-dark` worktree, tell Claude to build dark mode support. Describe the behavior you want:

> "Add dark mode to the site. I want a toggle button in the header, CSS custom properties for both light and dark themes, localStorage to remember the preference, and detection of the system's preferred color scheme. Make the transitions smooth."

Claude will probably ask about your color choices for dark mode. Answer based on your design preferences -- this is your portfolio.

### 10.3 Feature: Blog Engine (Worktree 2)

In the `canvas-blog` worktree, describe the blog engine you want to Claude:

> "Build a markdown-powered blog engine. I want to write blog posts as .md files in a posts/ directory, and have vanilla JS render them as HTML. I need an index page listing all posts, individual post pages, tag filtering, and previous/next navigation between posts."

Discuss the implementation details with Claude -- how the markdown rendering should work, what the post format should look like, how tags should be organized. These design decisions are yours to make.

> **Quick check before continuing:**
> - [ ] `../canvas-dark/` directory exists with the feature/dark-mode branch checked out
> - [ ] `../canvas-blog/` directory exists with the feature/blog-engine branch checked out
> - [ ] You can open files in each worktree independently without affecting the other
> - [ ] Dark mode and blog engine features are defined but may not be fully built yet

### 10.4 Run Parallel Claude Instances

Open separate terminals. Share a task list across both:

```
# Terminal 1:
cd ../canvas-dark && CLAUDE_CODE_TASK_LIST_ID=canvas-parallel claude

# Terminal 2:
cd ../canvas-blog && CLAUDE_CODE_TASK_LIST_ID=canvas-parallel claude
```

In Terminal 1, tell Claude to create tasks for dark mode -- design tokens, implement the toggle, persist the preference, test transitions -- with dependencies between them. In Terminal 2, do the same for the blog engine -- markdown parser, post renderer, index page, tag filtering.

Both sessions see all tasks. When one completes a task, the other is notified.

> **STOP -- What you just did:** You ran two Claude Code instances simultaneously, each in its own worktree with its own branch, sharing a single task list via `CLAUDE_CODE_TASK_LIST_ID`. This is the most powerful development pattern in Claude Code: parallel feature development with coordination. Each instance works independently but can see the other's progress. In a real team workflow, you might have three or four worktrees running simultaneously -- one per feature.

Ready to package everything into a reusable plugin?

### 10.5 Plugin Creation

> **Why this step:** Plugins let you package everything you have built -- skills, agents, hooks -- into a single distributable unit. Instead of every new project needing to recreate these tools from scratch, you bundle them once and reuse them anywhere. This is how you go from "project-specific tooling" to "reusable toolkit."

Package everything you have built into a reusable plugin. Tell Claude what you want to bundle:

> "Create a plugin called 'web-dev-plugin' that packages all the skills, agents, and hooks we have built. It needs a .claude-plugin/plugin.json manifest, the skills and agents directories at the root level, and the hooks extracted into a hooks/hooks.json file."

Claude will handle the file copying and manifest creation. Review the structure it creates against the expected layout:

The directory layout must be:

```
web-dev-plugin/
  .claude-plugin/plugin.json    <-- manifest (required)
  skills/                       <-- at root, NOT inside .claude-plugin/
  agents/
  hooks/hooks.json
```

### 10.6 Test the Plugin

Test your plugin locally:

```
claude --plugin-dir ./web-dev-plugin
```

Verify everything works:
- Skills invoke correctly: `/web-dev:new-page`, `/web-dev:component`, `/web-dev:check-site`
- Agents appear in `/agents`
- Hooks fire as expected

Note the namespacing: plugin skills are prefixed with the plugin name to
prevent conflicts.

> **STOP -- What you just did:** You packaged your skills, agents, and hooks into a plugin and tested it with `--plugin-dir`. Notice the namespacing: when loaded as a plugin, `/new-page` becomes `/web-dev:new-page`. This prevents conflicts when multiple plugins provide skills with similar names. The plugin directory structure (`.claude-plugin/plugin.json` at root, `skills/` and `agents/` alongside it) is the standard layout Claude Code expects.

> **Quick check before continuing:**
> - [ ] `web-dev-plugin/.claude-plugin/plugin.json` exists with name and version
> - [ ] `web-dev-plugin/skills/` contains your skills (not nested inside `.claude-plugin/`)
> - [ ] `web-dev-plugin/agents/` contains your agents
> - [ ] `--plugin-dir` loaded the plugin and skills work with the `web-dev:` prefix

### 10.7 Evaluation

> **Why this step:** Building skills and agents is only half the job -- you need to verify they work correctly across different inputs. Evaluation suites test your tools systematically: does the `new-page` skill handle an empty name gracefully? Does the accessibility agent catch a missing alt attribute? This is how you catch regressions and build confidence in your toolkit.

Ask Claude to help you build an evaluation suite for your toolkit. Describe the kinds of test cases you want:

> "Create an evaluation suite for our skills and agents. I want test cases for the new-page skill (valid name, empty name, duplicate name), check-site skill (pages with issues, clean pages), accessibility-agent (missing alt text, missing labels, clean pages), and design-agent (inconsistent CSS, clean CSS). Each test should define input, expected output, and scoring criteria. Write a script that runs everything and reports pass/fail."

Discuss with Claude which edge cases matter most to you and whether the scoring criteria make sense.

> **STOP -- What you just did:** You wrote evaluation test specs for your skills and agents. Each test case defines an input, expected output, and scoring criteria. This is the same pattern used in professional software testing -- define expectations, run the tool, compare results. The evaluation script gives you a pass/fail report you can run any time you change a skill or agent.

Want to automate eval permissions with a PermissionRequest hook?

### 10.8 PermissionRequest Hooks for Eval Automation

During evaluation, auto-approve safe operations to avoid prompt fatigue. Tell Claude what you need:

> "Add a PermissionRequest hook to settings.local.json (not the committed settings file) that auto-approves Read, Grep, and Glob operations. Use a matcher of 'Read|Grep|Glob' and output hookSpecificOutput.decision.behavior 'allow'."

Keep this in `settings.local.json` (not committed) and use only during eval.

> **STOP -- What you just did:** You created a PermissionRequest hook that auto-approves safe, read-only operations during evaluation runs. Without this, every `Read` and `Grep` call would prompt you for permission -- making automated evaluation tedious and slow. The key safety decision: this lives in `settings.local.json` (not committed to git) and only covers read-only tools. You would never auto-approve `Write` or `Bash` in production.

Shall we wrap up with continuous learning and a final review?

### 10.9 Continuous Learning

Reflect on the full project and update your configuration. Ask Claude to help you review what you have built:

> "Review our CLAUDE.md, rules, skills, agents, and hooks. What worked well? What should we refine? Update each one based on what we learned -- better descriptions, missing edge cases, patterns to avoid, hook interaction notes."

This is a conversation about your own tooling. Tell Claude what surprised you, what felt clunky, and what you would do differently. Then update the configuration together.

This is the continuous learning cycle: build, reflect, refine, repeat.

> **STOP -- What you just did:** You completed the full loop: build tools, use them, evaluate them, then refine them based on what you learned. This is the most important pattern in all of Claude Code -- your CLAUDE.md, rules, skills, agents, and hooks are living documents. Every project teaches you something, and updating your configuration captures that knowledge for future sessions. The best Claude Code users are the ones who continuously refine their setup.

### Checkpoint

- [ ] Created git worktrees for parallel feature development
- [ ] Dark mode works with toggle, localStorage persistence, and system preference detection
- [ ] Blog engine renders markdown posts with tag filtering
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

**No build tools needed.** This is the beauty of Canvas. Open `index.html` in
your browser and refresh to see changes. No compilers, no bundlers, no watchers.

**Use plan mode liberally.** Before any significant change, switch to plan
mode and think it through. This is cheaper than fixing mistakes.

**Read the context files.** The `cc-self-train/context/` directory has detailed
reference docs for every CC feature: `claudemd.txt`, `skillsmd.txt`,
`hooks.txt`, `configure-hooks.txt`, `mcp.txt`, `skills-plus-mcp.txt`,
`subagents.txt`, `tasks.txt`, `plugins.txt`, `interactive-mode.txt`,
`boris-workflow.txt`.

**Commit often.** Small, focused commits make it easy to revert mistakes and
track progress.

**Test in the browser.** After every change to an HTML or CSS file, refresh
your browser to verify. Use the browser's DevTools (F12) for debugging
JavaScript and inspecting layout.

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

You have built a complete personal portfolio site and mastered every major
Claude Code feature. Here are paths forward:

- **Extend your portfolio:** Add features you actually want -- a resume page,
  project case studies, animations, a real blog with RSS feed. The canvas is
  yours.
- **Deploy it:** Host on GitHub Pages, Netlify, or Vercel for free. Your
  portfolio is already a static site -- it just works.
- **Try another project:** The other projects in `cc-self-train/` explore
  different domains while reinforcing the same CC features.
- **Share your plugin:** Distribute the web-dev plugin to your team or the
  community.
- **Build from scratch:** Take a project idea you have been putting off and
  build it with Claude Code. You now have the full toolkit.

The best way to solidify what you learned is to use it on real problems.
