# Canvas -- Personal Portfolio Site

A hands-on, project-based guide to mastering Claude Code. You will build a
multi-page personal portfolio site with responsive design, a blog, and a
contact form using plain HTML, CSS, and JavaScript.

**Who this is for:** Anyone who wants the simplest possible setup to focus
purely on learning Claude Code. No build tools, no package managers, no
compilers -- just open a file in your browser and start building.

**What you will learn:** All 10 modules cover the full Claude Code feature set,
from CLAUDE.md and plan mode through skills, hooks, MCP servers, subagents,
tasks, plugins, and parallel development.

**Time estimate:** 3-5 focused sessions (roughly 10-15 hours total).

**Prerequisites:** Familiarity with the terminal, git basics, and basic
HTML/CSS/JS. No frameworks or build tools required.

---

## Set Up Your Dev Environment

Canvas uses plain HTML, CSS, and JavaScript. No build tools, no npm, no
compilers. You just need a browser and a text editor.

### Install Claude Code

```
npm install -g @anthropic-ai/claude-code
claude --version
```

You need an [Anthropic API key](https://console.anthropic.com/) or a Max
subscription.

### Install Git

```
git --version
```

If you do not have it: [git-scm.com/downloads](https://git-scm.com/downloads)

### Verify Your Browser

Open any `.html` file in your browser of choice (Chrome, Firefox, Safari, Edge).
That is your entire runtime. No server needed until Module 6 when you optionally
add a local dev server via MCP.

### Initialize Your Project

```
mkdir -p workspace/canvas-site && cd workspace/canvas-site && git init
```

Create the basic project structure:

| File | Purpose |
|------|---------|
| `index.html` | Home page -- hero section, intro, navigation |
| `styles/main.css` | CSS reset, custom properties, base styles |
| `scripts/main.js` | Shared JavaScript (navigation, utilities) |
| `.gitignore` | Standard web project ignores |

### Verify Everything

Run these checks before continuing:

- [ ] `claude --version` prints a version number
- [ ] `git --version` prints a version number
- [ ] You can open an `.html` file in your browser
- [ ] You can create and enter the `workspace/canvas-site` directory

---

## Module 1 -- Setup and First Contact

**CC features:** CLAUDE.md, `/init`, `/memory`, interactive mode, keyboard
shortcuts

> **Used `/start`?** Module 1 was completed during onboarding. Jump to [Module 2 -- Blueprint and Build](#module-2--blueprint-and-build).

### 1.1 Create Your Project

Open a terminal in the cc-self-train directory and create the project:

```
mkdir -p workspace/canvas-site
cd workspace/canvas-site
git init
```

### 1.2 Launch Claude Code

```
claude
```

Claude Code starts in interactive mode. You are now inside a session.

### 1.3 Run /init

Type this into Claude Code:

```
/init
```

Claude scans your project and generates a `CLAUDE.md` file. This is the single
most important file for working with Claude Code -- it is loaded into context
at the start of every session and tells Claude about your project.

Read through the generated `CLAUDE.md`. It should contain:

- A project description
- Build and test commands
- Code style conventions

If it is sparse, that is fine. You will build it up throughout this project.

### 1.4 Tour of CLAUDE.md

Ask Claude:

```
Explain what CLAUDE.md is, how Claude Code uses it, and why it matters.
Mention the memory hierarchy: user, project, project-local, and managed.
```

Key points to understand:

- **Project memory** (`./CLAUDE.md` or `./.claude/CLAUDE.md`): shared with
  your team via version control
- **Project local** (`./CLAUDE.local.md`): your personal preferences for this
  project, auto-added to `.gitignore`
- **User memory** (`~/.claude/CLAUDE.md`): your personal preferences across
  all projects
- **Managed policy**: organization-wide, deployed by IT

### 1.5 Keyboard Shortcuts

Try each shortcut below and note what happens:

| Shortcut | What It Does |
|----------|-------------|
| `Tab` | Accept suggestion or autocomplete |
| `Shift+Tab` | Toggle between normal mode, plan mode, and auto-accept mode |
| `Ctrl+C` | Cancel current input or generation |
| `Ctrl+L` | Clear terminal screen (keeps conversation history) |
| `@` | File path mention -- trigger file autocomplete |
| `!` | Bash mode -- run a shell command directly |
| `Shift+Enter` | Multiline input (or `\` + `Enter` in any terminal) |
| `Esc Esc` | Rewind conversation/code to a previous point |
| `Ctrl+O` | Toggle verbose output |
| `Ctrl+R` | Reverse search command history |
| `/` | Start a command or skill |

Try these now:

1. Type `@` and browse files in your project
2. Type `! git status` to run a shell command
3. Press `Shift+Tab` twice to cycle through modes -- notice the mode indicator
4. Type a long prompt using `Shift+Enter` for multiple lines
5. Press `Ctrl+L` to clear the screen

### 1.6 Explore /memory

Type:

```
/memory
```

This opens your memory files in your system editor. You can directly edit
`CLAUDE.md` here. Add a line:

```
This project is a personal portfolio site called "canvas" built with plain
HTML, CSS, and JavaScript. No build tools or frameworks -- just open index.html
in a browser.
```

Save and close the editor.

### 1.7 Exercise

Ask Claude:

```
Read the CLAUDE.md file in this project and explain what it contains.
Then suggest three improvements I could make to it for a portfolio site project.
```

Review Claude's suggestions. Apply at least one of them by editing `CLAUDE.md`.

### 1.8 Create the Starting Files

Ask Claude to create the basic project files:

```
Create index.html with an HTML5 boilerplate, a heading that says "My Portfolio",
and links to styles/main.css and scripts/main.js. Also create styles/main.css
with a CSS reset and custom properties for colors and fonts, and scripts/main.js
with a comment placeholder.
```

Open `index.html` in your browser to verify it works.

### 1.9 First Commit

```
! git add -A
! git commit -m "Initial project setup with CLAUDE.md"
```

### Checkpoint

- [ ] `workspace/canvas-site/` directory exists with `git init` completed
- [ ] `CLAUDE.md` exists and describes the project
- [ ] `index.html`, `styles/main.css`, `scripts/main.js` exist
- [ ] You can open `index.html` in your browser and see the page
- [ ] You ran `/init` and `/memory` successfully
- [ ] You tried all keyboard shortcuts from the table above
- [ ] You made your first commit

---

## Module 2 -- Blueprint and Build

**CC features:** Plan mode, git integration, basic prompting

### 2.1 Enter Plan Mode

> **Why this step:** Plan mode is one of Claude Code's most important features. It lets you think through architecture *with* Claude before any code gets written. This prevents the "just start coding" trap that leads to messy rewrites later.

Press `Shift+Tab` to switch to plan mode. You will see the mode indicator
change. In plan mode, Claude analyzes and plans without making changes. This
is where you design before you build.

Alternatively, type:

```
/plan
```

### 2.2 Design the Architecture

Now describe your portfolio site to Claude. Tell it what pages you want -- home, about, projects, blog, contact -- and what each page should include. Don't worry about getting the prompt perfect. Just describe your vision and let Claude ask clarifying questions.

Something like:

> "I want to build a personal portfolio site with about five pages. Help me plan the architecture -- what pages should I have, what goes on each one, and how should the CSS and file structure work? Don't write any code yet, just the plan."

Claude will probably ask about your design preferences, layout style, and what kind of content you want to feature. Answer naturally -- these choices are yours. The back-and-forth is the point: you are designing *with* Claude, not dictating to it.

Once Claude produces a plan, read it carefully.

### 2.3 Review and Iterate

Still in plan mode, push back on the plan. Ask about the trade-offs Claude made. Challenge the decisions you are unsure about. For example:

> "Why did you choose that approach for the CSS? What are the trade-offs? And how should the navigation highlight the current page?"

Claude does not get defensive about its plans -- ask hard questions and it will revise. If something does not feel right, say so. Refine the plan until you are satisfied with the architecture.

> **STOP -- What you just did:** You used plan mode to design your entire site architecture before writing a single line of code. This is a pattern you will use constantly: plan first, then build. The back-and-forth questioning in step 2.3 is how you pressure-test a design. Claude does not get defensive about its plans -- ask hard questions and it will revise.

### 2.4 Exit Plan Mode and Execute

Press `Shift+Tab` to return to normal mode. Now tell Claude to start building -- but scope it down. You do not want all five pages at once. Ask for just the foundation:

> "Let's start building from the plan. Create the shared navigation, footer, the home page with its hero section, and the CSS design system. Don't build the other pages yet -- just the home page and shared components."

Constraining scope is a key prompting skill -- it keeps Claude focused and prevents runaway file creation. Let Claude create the files, then open `index.html` in your browser to check it.

> **STOP -- What you just did:** You went from plan mode to normal mode and gave Claude a focused, scoped instruction. Notice that you told Claude what to build *and* what NOT to build yet ("Do NOT build the other pages yet"). Constraining scope is a key prompting skill -- it keeps Claude focused and prevents runaway file creation.

> **Quick check before continuing:**
> - [ ] Your site plan covers all 5 pages (home, about, projects, blog, contact)
> - [ ] Claude created the shared nav, footer, home page, and CSS design system
> - [ ] You opened `index.html` in your browser and it renders correctly
> - [ ] You are back in normal mode (check the mode indicator)

### 2.5 Create a Feature Branch

> **Why this step:** Feature branches keep your experiments separate from working code. If something goes wrong, you can throw away the branch without affecting main. This is also how real teams work -- every feature gets its own branch.

```
! git checkout -b feature/core-pages
```

### 2.6 Build the About Page

Ask Claude to build your About page. Describe what sections you want -- a bio, your skills, your experience or education timeline. Tell Claude about yourself (or use placeholder content for now). Something like:

> "Create the about page with my bio, a skills section grouped by category, and a timeline of my experience. Use the shared nav and footer and the CSS design system we already have."

If the result does not match what you imagined, tell Claude what to change. This is a conversation, not a one-shot.

### 2.7 Build the Projects Page

Now ask Claude for the projects page. Describe the layout you want -- a card grid with your projects (or placeholders). Tell Claude how you want the cards to look and how many columns at different screen sizes:

> "Build a projects page with a responsive card grid. Each card should have a title, description, technology tags, and a link. Make it responsive -- one column on mobile, more on larger screens."

Open each page in your browser. Test the navigation links between pages.

> **STOP -- What you just did:** You gave Claude two separate, focused prompts to build two pages. Notice the pattern: each prompt specified the page structure, the content sections, and the CSS approach. The more specific your prompt, the closer the result matches what you want. You also tested in the browser after each page -- always verify Claude's output visually.

### 2.8 Manual Testing

Test your site by opening each page in the browser. Click through the navigation, resize the window to check responsiveness, and look for anything that seems off. If you find issues -- broken links, layout problems, pages that look wrong on mobile -- tell Claude what you see and ask it to fix them.

### 2.9 Commit and Merge

> **Why this step:** Committing through Claude Code (using `!` prefix for shell commands) keeps everything in one place. You do not need to switch terminals. The merge back to main means your feature branch work is now part of your stable codebase.

```
! git add -A
! git commit -m "feat: home, about, and projects pages with CSS design system"
! git checkout main
! git merge feature/core-pages
```

### Checkpoint

- [ ] You used plan mode to design the architecture before writing code
- [ ] CSS design system exists with custom properties for colors, fonts, spacing
- [ ] Home page has a hero section, intro, and navigation
- [ ] About page has bio, skills, and timeline sections
- [ ] Projects page has a responsive card grid
- [ ] Navigation works between all pages
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] Changes are committed and merged to main

---

## Module 3 -- Rules, Memory, and Context

**CC features:** `.claude/rules/`, `CLAUDE.local.md`, `@imports`, `/context`,
`/compact`, memory hierarchy, `/cost`

### 3.1 Create Project Rules

> **Why this step:** Rules are how you teach Claude your project's standards permanently. Instead of repeating "use semantic HTML" every session, you write it once in a rule file and Claude follows it automatically. Path-scoped rules only activate when Claude works on matching files, keeping context lean.

Create the rules directory in your project:

```
! mkdir -p .claude/rules
```

Rules are modular, topic-specific instructions that Claude loads automatically.
They use markdown files with optional YAML frontmatter for path scoping.

### 3.2 Create Path-Scoped Rules

Now you need three rule files -- one each for HTML, CSS, and JavaScript. Each file uses YAML frontmatter to scope it to specific file types, so Claude only loads the relevant rules when working on matching files.

Tell Claude what coding standards matter to you for each language. Think about the conventions you want enforced. Something like:

> "Create three rule files in .claude/rules/. For HTML rules (scoped to *.html files), I want semantic elements, accessibility standards like alt attributes on images, proper heading hierarchy, and correct meta tags. For CSS rules (scoped to *.css and styles/**), I want mobile-first design, CSS custom properties for all design tokens, BEM naming, and visible focus styles. For JavaScript rules (scoped to *.js and scripts/**), I want vanilla JS only, addEventListener instead of inline handlers, const by default, and explicit error handling. Use path-scoped YAML frontmatter in each file."

Claude will create the rule files. Review them and adjust any rules that do not match your preferences -- these are *your* coding standards, not Claude's.

> **STOP -- What you just did:** You created three rule files, each scoped to specific file types using YAML frontmatter. When Claude edits an `.html` file, it loads `html-rules.md` automatically. When it edits `.css`, it loads `css-rules.md`. This is how you enforce coding standards without repeating yourself -- and unlike CLAUDE.md instructions, path-scoped rules only consume context when relevant files are being worked on.

Ready to create your CLAUDE.local.md for personal preferences?

### 3.3 Create CLAUDE.local.md

Create a personal preferences file that will not be committed to git. Ask Claude to create `CLAUDE.local.md` and tell it about your personal workflow preferences -- your design taste, how you like commit messages, which browser you test in, anything that is about *you* rather than the project.

> "Create a CLAUDE.local.md with my personal preferences. I like [describe your design style], I test in [your browser], and I prefer [your commit message style]."

Verify it was added to `.gitignore`:

```
! cat .gitignore
```

If `CLAUDE.local.md` is not listed, add it.

> **STOP -- What you just did:** You created a personal preferences file that is not committed to git. This is the split between team standards (rules, CLAUDE.md) and personal preferences (CLAUDE.local.md). On a real team, everyone shares the same rules but can have different personal preferences -- like which browser they test in or what commit message style they prefer.

Want to see how the memory hierarchy works?

### 3.4 Understand the Memory Hierarchy

Ask Claude to explain the memory hierarchy -- where each file lives, what order they are loaded in, and which ones are shared with a team versus kept private.

> "Explain the full Claude Code memory hierarchy. Which files take precedence over which? Which ones get shared with teammates?"

The hierarchy from highest to lowest precedence:

1. Managed policy (organization-wide, system directory)
2. Project memory (`./CLAUDE.md` or `./.claude/CLAUDE.md`)
3. Project rules (`.claude/rules/*.md`)
4. User memory (`~/.claude/CLAUDE.md`)
5. Project local (`./CLAUDE.local.md`)

> **Quick check before continuing:**
> - [ ] `.claude/rules/` contains three rule files with path-scoped frontmatter
> - [ ] `CLAUDE.local.md` exists and is listed in `.gitignore`
> - [ ] You can explain the five levels of the memory hierarchy

### 3.5 Modularize CLAUDE.md with @imports

As your CLAUDE.md grows, it eats into your available context window. The solution is to break detailed documentation into separate files and reference them with `@imports`.

Ask Claude to create supporting docs for your project and wire them up:

> "Create a docs/style-guide.md that documents our visual design system -- the color palette, typography, spacing, and component patterns. Also create docs/sitemap.md listing all pages and their components. Then add @imports to CLAUDE.md so Claude Code loads these when needed."

The `@path` syntax tells Claude Code to load those files as additional context
when needed. Both relative and absolute paths work.

> **Why this step:** As your CLAUDE.md grows, it eats into your available context window. The `@import` pattern keeps CLAUDE.md concise while making detailed documentation available on demand. Think of it like splitting a large function into smaller helpers -- same information, better organized.

### 3.6 /context Deep Dive

Run:

```
/context
```

This shows a visual grid of your current context usage. Observe:

- How much context is used by CLAUDE.md and rules
- How much is used by conversation history
- How much remains available

Understanding context is critical. As your session grows, context fills up.

### 3.7 /compact with Focus Argument

When context gets large, use `/compact` to summarize the conversation:

```
/compact Preserve all details about the CSS design system and page structure.
```

The argument tells Claude what to prioritize when compacting. Without it,
Claude uses its own judgment.

> **STOP -- What you just did:** You used `/context` to see how your session's context is distributed, then `/compact` to reclaim space. Context management is a real skill -- long sessions accumulate history, and eventually Claude "forgets" earlier details. Using `/compact` with a focus argument lets you control what survives the compression. You will use this pattern whenever a session gets long or sluggish.

Shall we check your token usage with /cost?

### 3.8 /cost Tracking

Run:

```
/cost
```

This shows your token usage for the current session. Check it periodically to
understand how much context different operations consume.

### 3.9 Build a Feature Using These Tools

Now build the blog listing page to see your rules and context tools in action. Create a feature branch first:

```
! git checkout -b feature/blog
```

Then describe the blog page you want to Claude. Tell it about the layout, how blog post cards should look, and ask it to follow all the rules you just created:

> "Build a blog listing page with post cards showing title, date, excerpt, and tags. Add a few sample posts so I can see how it looks. Make sure to follow our HTML, CSS, and JS rules."

After building, run `/context` again to see how context changed. Then commit.

### Checkpoint

- [ ] `.claude/rules/` directory contains `html-rules.md`, `css-rules.md`, `js-rules.md`
- [ ] Each rule file has correct path-scoped frontmatter
- [ ] `CLAUDE.local.md` exists with personal preferences
- [ ] `docs/style-guide.md` and `docs/sitemap.md` exist
- [ ] `CLAUDE.md` contains `@imports` referencing the docs
- [ ] You ran `/context` and understand the context grid
- [ ] You ran `/compact` with a focus argument
- [ ] You ran `/cost` and checked token usage
- [ ] Blog listing page works with styled post cards
- [ ] Changes committed on a feature branch and merged

---

## Module 4 -- Skills and Commands

**CC features:** SKILL.md, frontmatter, custom slash commands, hot-reload,
argument substitution, `disable-model-invocation`

### 4.1 Create the Skills Directory

> **Why this step:** Skills are reusable, parameterized workflows you invoke with a slash command. Instead of typing the same multi-step prompt every time you need a new page, you write it once as a skill and invoke it with `/new-page faq`. Skills are the difference between using Claude Code casually and using it like a power tool.

```
! mkdir -p .claude/skills/new-page
! mkdir -p .claude/skills/component
! mkdir -p .claude/skills/check-site
```

### 4.2 Create the "new-page" Skill

Describe the skill you want to Claude. You want a skill that scaffolds a new HTML page with your site's shared layout -- so every time you invoke `/new-page faq`, it reads your existing nav and footer, creates a new page with the right boilerplate, and reminds you to update links.

> "Create a 'new-page' skill in .claude/skills/new-page/SKILL.md. It should take a page name as an argument (using $0), read index.html to get the shared nav and footer, then create a new HTML file with the full boilerplate and shared layout. Also create a page-template.md reference file showing the expected structure. Set allowed-tools to Read, Write, Edit, and Bash."

Claude will ask you clarifying questions about the template structure or what the skill should do after creating the file. Answer based on how you want your pages to work.

> **STOP -- What you just did:** You created a skill with a supporting file. The `SKILL.md` is the instruction template -- it tells Claude what to do when you invoke `/new-page`. The `page-template.md` is a reference document the skill can read for the HTML boilerplate. This pattern (instruction + reference files) is how you build skills that produce consistent, high-quality output every time.

Ready to build the component skill?

### 4.3 Create the "component" Skill

Now create a skill for generating reusable CSS components. This one should take a component type as an argument (like "card", "button", "hero") and create the CSS following your design system.

> "Create a 'component' skill that takes a component type as $0, reads the existing CSS to understand our design tokens, then creates a new BEM-style CSS class with responsive styles and hover/focus states. Also create a component-templates.md reference with example HTML and CSS for common component types."

Discuss with Claude what component types you want supported and how the CSS should be organized -- appended to the main file or in separate component files.

> **Quick check before continuing:**
> - [ ] `.claude/skills/new-page/SKILL.md` exists with frontmatter and a supporting template file
> - [ ] `.claude/skills/component/SKILL.md` exists with a component templates reference
> - [ ] Both skills use `$0` for argument substitution

### 4.4 Create the "check-site" Skill

This skill is different -- it validates your site without modifying anything. Describe the quality checks you want to Claude:

> "Create a 'check-site' skill that scans all HTML pages and checks for common issues -- missing doctype, missing lang attribute, missing meta tags, heading hierarchy problems, images without alt text, broken internal links, missing title elements. Output a pass/fail report. Set disable-model-invocation to true so it only runs when I explicitly invoke it, and limit allowed-tools to Read, Bash, Grep, and Glob."

Notice `disable-model-invocation: true` -- this skill can only be triggered
by you typing `/check-site`. Claude will not invoke it automatically.

> **STOP -- What you just did:** You created three skills with different purposes: `new-page` generates files, `component` creates CSS, and `check-site` validates without modifying anything. The `disable-model-invocation: true` flag on `check-site` is important -- it means Claude will never run this validation on its own, only when you explicitly ask. You will use this flag whenever a skill should be user-triggered only (like destructive operations or expensive checks).

Want to test all three skills in action?

### 4.5 Test Your Skills

Test each skill:

```
/new-page faq
/component card
/check-site
```

Try with different arguments:

```
/new-page resume
/component hero
```

### 4.6 Argument Substitution

Skills support these substitution variables:

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed after the skill name |
| `$ARGUMENTS[0]` or `$0` | First argument |
| `$ARGUMENTS[1]` or `$1` | Second argument |
| `$ARGUMENTS[N]` or `$N` | Nth argument (zero-indexed) |
| `${CLAUDE_SESSION_ID}` | Current session ID |

### 4.7 Hot-Reload

> **Why this step:** Hot-reload means you can iterate on your skills without restarting Claude Code. This makes skill development fast -- edit, save, test, repeat. No restart cycle.

With Claude Code still running, open `.claude/skills/check-site/SKILL.md` in a
separate editor and add a line to the checks:

```
8. All <a> tags with external URLs have target="_blank" and rel="noopener"
```

Save the file. Now invoke `/check-site` again in Claude Code. The updated skill
content takes effect immediately -- no restart needed.

### 4.8 Create a Manual-Only Skill

Create one more skill -- a page brief template that outputs a planning document for a new page without Claude processing it.

> "Create a 'page-brief' skill with disable-model-invocation set to true. It should take a page name as $0 and output a planning template with fields like purpose, target audience, key sections, SEO keywords, and design notes."

Test it: `/page-brief "Services"`

> **STOP -- What you just did:** You now have four custom skills that extend Claude Code's capabilities specifically for your portfolio project. The `new-page` and `component` skills are productivity multipliers -- what used to be a multi-paragraph prompt is now a single slash command. The `check-site` skill is a quality gate. The `page-brief` skill outputs raw text without Claude processing it (because of `disable-model-invocation`). Together, these skills form a custom toolkit tailored to your project.

### Checkpoint

- [ ] `.claude/skills/new-page/SKILL.md` exists with frontmatter and supporting files
- [ ] `.claude/skills/component/SKILL.md` exists with component templates
- [ ] `.claude/skills/check-site/SKILL.md` exists with `disable-model-invocation: true`
- [ ] All three skills invoke correctly with `/skill-name`
- [ ] Argument substitution works (`$0`, `$ARGUMENTS`)
- [ ] Hot-reload works: edit SKILL.md while Claude runs, changes take effect
- [ ] Page brief skill outputs raw text without Claude processing

---

## Module 5 -- Hooks

**CC features:** SessionStart, PostToolUse, Stop hooks, matchers, hook
scripting, settings.json

### 5.1 Hook Lifecycle Overview

> **Why this step:** Hooks are Claude Code's automation layer. While skills require you to type a command, hooks fire automatically at specific moments -- when a session starts, after a file is written, when Claude finishes responding. This is how you build guardrails and quality gates that work without you remembering to invoke them.

Hooks fire at specific points during a Claude Code session:

| Hook Event | When It Fires |
|-----------|--------------|
| `SessionStart` | Session begins or resumes |
| `UserPromptSubmit` | User submits a prompt |
| `PreToolUse` | Before a tool executes |
| `PermissionRequest` | When a permission dialog appears |
| `PostToolUse` | After a tool succeeds |
| `Stop` | Claude finishes responding |
| `SubagentStop` | When a subagent finishes |
| `PreCompact` | Before context compaction |
| `SessionEnd` | Session terminates |

Hooks are configured in settings files:
- `.claude/settings.json` -- project hooks (shared with team)
- `.claude/settings.local.json` -- local hooks (personal, not committed)
- `~/.claude/settings.json` -- user hooks (all projects)

### 5.2 Create a SessionStart Hook

This hook will inject a site summary into context when Claude starts. Describe what you want the hook to do:

> "Create a SessionStart hook that runs a Python script (.claude/hooks/site-summary.py) to count my HTML pages, total CSS size, and images, then prints a one-line summary. Add it to .claude/settings.json as a SessionStart hook."

Claude will create both the Python script and the settings.json configuration. For SessionStart hooks, stdout is added to Claude's context automatically.

Restart Claude Code (exit and re-launch `claude`) to test it. You should see
the stats injected on startup.

> **STOP -- What you just did:** You created your first hook -- a SessionStart hook that runs a Python script every time Claude Code launches. The script counts your site's pages and injects a summary into Claude's context. This means Claude always knows the current state of your site without you having to explain it. SessionStart hooks are perfect for injecting project status, environment info, or reminders.

Ready to build a PostToolUse hook for HTML validation?

### 5.3 Create a PostToolUse Hook

This hook validates HTML structure after Claude writes or edits an HTML file. Tell Claude what you want it to check:

> "Create a PostToolUse hook that validates HTML files after they are written or edited. The Python script (.claude/hooks/validate-html.py) should check for doctype, lang attribute, title element, and basic tag matching. Use a matcher of 'Write|Edit' so it only fires on those tools. Remember, PostToolUse hooks are feedback only -- they cannot block."

Claude will ask you about the specifics of the validation or handle them based on the description. Review the script it creates to make sure the checks match what you care about.

> **STOP -- What you just did:** You created a PostToolUse hook with a matcher. The matcher `"Write|Edit"` ensures this hook only fires when Claude writes or edits a file -- not on every tool call. PostToolUse hooks cannot block actions (the file is already written), but they give Claude immediate feedback. If the validator finds issues, Claude sees them in its next response and can fix them automatically.

> **Quick check before continuing:**
> - [ ] `.claude/settings.json` has both SessionStart and PostToolUse hooks configured
> - [ ] `.claude/hooks/` contains `site-summary.py` and `validate-html.py`
> - [ ] You restarted Claude Code and saw the site summary on startup

### 5.4 Create a Stop Hook

This hook checks all internal links before Claude stops to catch broken links. Describe the behavior you want:

> "Create a Stop hook that scans all HTML files for internal links and checks if the linked files actually exist. If any broken links are found, it should block (exit 2) and report which page links to which missing file. Add it to .claude/settings.json."

The key difference from PostToolUse: a Stop hook with exit code 2 is *blocking* -- it forces Claude to address the issue before moving on.

> **Why this step:** Stop hooks are different from PostToolUse hooks -- they run once when Claude finishes its entire response, not after each individual tool call. A Stop hook with exit code 2 is *blocking*: it forces Claude to address the issue before moving on. This makes Stop hooks ideal for final validation checks like broken link detection.

Want to learn about matchers and hook scripting?

### 5.5 Matchers, Timeouts, and Scripting

Matchers filter which tools trigger a hook. Key patterns:

| Pattern | Matches |
|---------|---------|
| `"Write"` | Exactly the Write tool |
| `"Write\|Edit"` | Write or Edit tools |
| `"Bash(npm test*)"` | Bash commands starting with `npm test` |
| `"*"` | All tools |
| `"mcp__.*"` | All MCP tools |

Add `"timeout": 30` to any hook command to override the default 60-second
timeout. Every hook script receives JSON on stdin, uses exit codes to
communicate (0 = success, 2 = blocking error), and can access
`$CLAUDE_PROJECT_DIR` for the project root.

### 5.7 Exercise: Trigger Each Hook

1. **SessionStart:** Exit and restart `claude`. Check that the site summary appears.
2. **PostToolUse:** Ask Claude to create a new HTML file. Verify the validator ran.
3. **Stop:** Ask Claude a question and let it finish. Verify the link checker ran.

Use `Ctrl+O` (verbose mode) to see hook execution details.

> **STOP -- What you just did:** You built a three-layer hook system: SessionStart injects context at launch, PostToolUse validates individual file writes, and Stop performs a final quality check when Claude finishes. These layers work together without you doing anything -- they are the automated quality gates that catch mistakes before they accumulate. This is how professional teams use Claude Code: automate the boring checks so you can focus on the creative work.

### Checkpoint

- [ ] `.claude/settings.json` exists with hook configuration
- [ ] SessionStart hook injects site summary on session start
- [ ] PostToolUse hook validates HTML structure after writes/edits
- [ ] Stop hook checks for broken internal links before Claude stops
- [ ] Matchers filter correctly (Write|Edit, not all tools)
- [ ] You verified each hook fires by triggering it and checking output

---

## Module 6 -- MCP Servers

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

---

## Module 7 -- Guard Rails

**CC features:** PreToolUse, hook decision control, prompt-based hooks,
`permissionDecision`, `additionalContext`, `updatedInput`

### 7.1 PreToolUse Hooks with Decision Control

> **Why this step:** In Module 5 you built hooks that observe and report. PreToolUse hooks are fundamentally different -- they can *intercept and change* what Claude does before it happens. This is the most powerful hook type because it lets you enforce rules at the tool level, not just detect violations after the fact.

PreToolUse hooks intercept tool calls before they execute. They can:
- **Allow:** bypass the permission system entirely
- **Deny:** block the tool call and tell Claude why
- **Ask:** show the user a confirmation prompt
- **Modify:** change the tool's input parameters

### 7.2 Guard: Accessibility Enforcer

Create a hook that prevents Claude from writing `<img>` tags without `alt` attributes. Tell Claude what behavior you want:

> "Create a PreToolUse hook that blocks any Write to an HTML file if it contains img tags without alt attributes. The script (.claude/hooks/enforce-alt.py) should use permissionDecision 'deny' with a clear reason. Add it to settings.json with a 'Write' matcher."

Claude will create the Python script and update the settings. Review the script to understand how `permissionDecision: "deny"` works -- it is fundamentally different from the PostToolUse feedback you built in Module 5.

> **STOP -- What you just did:** You created a guard that *prevents* Claude from writing inaccessible HTML. Unlike the PostToolUse validator from Module 5 that reports issues after the file is already written, this PreToolUse hook blocks the write entirely. Claude receives the denial reason and must fix the content before trying again. This is the difference between detection and prevention -- and prevention is always better.

How about we build a guard that injects context when reading HTML?

### 7.3 Guard: Context Injection for HTML Files

Create a hook that nudges Claude's behavior by injecting reminders when it reads HTML files:

> "Create a PreToolUse hook with a 'Read' matcher that checks if the file is an HTML file. If so, inject additionalContext reminding Claude to use semantic HTML elements, add ARIA roles, and keep heading hierarchy sequential. Don't block anything -- just add context."

The key is `hookSpecificOutput.additionalContext` -- it injects a string into
Claude's context before the tool executes.

> **STOP -- What you just did:** You created a hook that does not block or modify anything -- it injects *extra context* before Claude reads a file. This is a subtle but powerful pattern: you are nudging Claude's behavior by giving it reminders at the exact moment they are relevant. The `additionalContext` field appears in Claude's context alongside the file contents, making it much more likely Claude will follow those guidelines.

Want to see how hooks can silently fix content before it gets written?

### 7.4 Guard: Auto-Add Meta Tags

Create a hook that silently fixes a common omission -- missing meta tags in HTML files:

> "Create a PreToolUse hook with a 'Write' matcher that checks if an HTML file is missing charset or viewport meta tags. If they are missing, inject them using updatedInput to modify the content before it gets written. Set permissionDecision to 'allow' so the write proceeds with the fixed content."

The key is `hookSpecificOutput.updatedInput` -- it replaces the tool's input
parameters before execution.

> **STOP -- What you just did:** You created a hook that silently modifies Claude's output before it is written to disk. The `updatedInput` field replaces the tool's input parameters -- in this case, injecting missing meta tags into the HTML content. Claude does not even know the modification happened. This is the most advanced hook pattern: invisible, automatic correction. Use it carefully -- it is powerful but can be confusing to debug if overused.

> **Quick check before continuing:**
> - [ ] You have three different PreToolUse hooks using three different mechanisms: `permissionDecision` (deny), `additionalContext` (inject), `updatedInput` (modify)
> - [ ] You understand the difference between these three approaches
> - [ ] All hooks are configured in `.claude/settings.json` with appropriate matchers

### 7.5 Prompt-Based Quality Gate

Now try a different kind of hook -- a prompt-based Stop hook that uses an LLM to evaluate quality instead of a Python script. Describe to Claude what you want checked:

> "Add a prompt-based Stop hook to settings.json. Use type 'prompt' with a timeout of 30 seconds. The prompt should review whether any HTML files were modified this turn and, if so, check for accessibility issues -- alt text, form labels, heading hierarchy, ARIA landmarks. It should respond with ok true or ok false with a reason."

Prompt-based hooks use a fast LLM (Haiku) to evaluate context and return a
structured decision. They are powerful for nuanced, context-aware checks that would be hard to write as a script.

> **Why this step:** Prompt-based hooks are a leap beyond script-based hooks. A Python script can check for a missing `alt` attribute with string matching, but it cannot evaluate whether an `alt` attribute is *descriptive enough*. A prompt-based hook uses an LLM to make nuanced judgments -- exactly the kind of check that is hard to write as code.

### 7.6 Test Each Guard

1. **Accessibility enforcer:** Ask Claude to write an HTML file with an
   `<img src="photo.jpg">` (no alt). Verify the hook blocks it.
2. **HTML context:** Ask Claude to read an HTML file. Use `Ctrl+O` to verify
   the additional context was injected.
3. **Meta tag injection:** Ask Claude to write an HTML file without meta tags.
   Verify they were auto-added.
4. **Quality gate:** Ask Claude to add images without alt text and let it stop.
   Verify the stop hook catches it.

> **STOP -- What you just did:** You tested all four guard patterns: deny, inject context, modify input, and prompt-based evaluation. Together, these form a comprehensive guard rail system. The deny hook catches hard errors (missing alt text). The context hook nudges Claude toward good practices. The input modifier silently fixes common omissions. The prompt hook handles nuanced quality checks. In real projects, you will mix these patterns based on how strict the enforcement needs to be.

### Checkpoint

- [ ] PreToolUse hook denies `<img>` tags without alt attributes
- [ ] PreToolUse hook injects `additionalContext` when reading HTML files
- [ ] PreToolUse hook uses `updatedInput` to inject meta tags on writes
- [ ] Prompt-based Stop hook reviews accessibility quality
- [ ] Each guard was tested and verified working
- [ ] You understand the difference between `permissionDecision`, `additionalContext`, and `updatedInput`

---

## Module 8 -- Subagents

**CC features:** `.claude/agents/`, subagent frontmatter, chaining, parallel,
background (`Ctrl+B`), resuming

### 8.1 What Are Subagents

> **Why this step:** Until now, everything has happened in your main Claude Code conversation. Subagents are separate AI assistants that work in their own context windows. This is important because your main conversation has limited context space -- heavy analysis (like scanning every HTML file for accessibility issues) fills it up fast. Subagents do the heavy lifting in their own space and return just the results.

Subagents are specialized AI assistants with their own context windows, system
prompts, tool access, and permissions. When Claude encounters a task matching
a subagent's description, it delegates to that subagent. The subagent works
independently and returns results.

Benefits:
- **Preserve context:** heavy work stays out of your main conversation
- **Enforce constraints:** limit which tools a subagent can use
- **Specialize behavior:** focused system prompts for specific domains
- **Control costs:** route tasks to faster, cheaper models

### 8.2 Create the Agents Directory

```
! mkdir -p .claude/agents
```

### 8.3 Create: accessibility-agent

Tell Claude to create an accessibility scanning agent. Describe what you want it to check and how you want the output formatted:

> "Create an accessibility-agent in .claude/agents/. It should scan all HTML files for WCAG issues -- missing alt text, missing form labels, skipped heading levels, missing ARIA landmarks, and anything else you think is important. Use haiku model since it only needs to read and report, and limit its tools to Read, Grep, and Glob. Output should be a report grouped by severity."

Claude will create the agent file. Notice it only has read-only tools -- this agent cannot modify your files, which is intentional.

> **STOP -- What you just did:** You created a subagent with constrained tools (`Read, Grep, Glob` -- no `Write` or `Edit`) and a cheaper model (`haiku`). This is intentional: the accessibility agent only needs to *read and report*, not modify files. Using haiku instead of the default model saves tokens on a task that does not need the most powerful reasoning. Matching the model to the task complexity is a key cost optimization pattern.

Shall we create the design review agent next?

### 8.4 Create: design-agent

Create a design review agent focused on CSS consistency. Describe the kinds of issues you want it to catch:

> "Create a design-agent that reviews CSS for consistency issues -- hardcoded values that should use custom properties, missing responsive breakpoints, spacing inconsistencies, missing hover/focus states. Use haiku model and read-only tools. It should output specific suggestions with code fixes."

### 8.5 Create: content-agent

Create a content quality reviewer that checks for real-world issues like leftover placeholder text and missing SEO basics:

> "Create a content-agent that reviews page content for quality -- leftover lorem ipsum, inconsistent tone, missing calls-to-action, SEO issues like missing meta descriptions, broken links, and placeholder images. Use sonnet model since it needs stronger reasoning for content quality, and set permissionMode to plan so it is read-only."

Note `permissionMode: plan` -- this agent is read-only.

> **STOP -- What you just did:** You created three agents with different specializations, tool access, and models. Notice the design: accessibility-agent uses haiku (cheap, fast scans), design-agent uses haiku (CSS analysis does not need heavy reasoning), and content-agent uses sonnet with `permissionMode: plan` (it needs stronger reasoning for content quality but should not modify files). Each agent is tuned for its specific job.

> **Quick check before continuing:**
> - [ ] `.claude/agents/` contains three agent files
> - [ ] Each agent has `name`, `description`, `tools`, and `model` in frontmatter
> - [ ] content-agent has `permissionMode: plan` (read-only)
> - [ ] accessibility-agent and design-agent use `haiku` model

### 8.6 Subagent Frontmatter Reference

| Field | Required | Description |
|-------|---------|-------------|
| `name` | Yes | Unique identifier (lowercase, hyphens) |
| `description` | Yes | When Claude should use this agent |
| `tools` | No | Tools the agent can use (inherits all if omitted) |
| `disallowedTools` | No | Tools to explicitly deny |
| `model` | No | `sonnet`, `opus`, `haiku`, or `inherit` (default: `inherit`) |
| `permissionMode` | No | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `skills` | No | Skills to preload into the agent's context |
| `hooks` | No | Lifecycle hooks scoped to this agent |

### 8.7 Invoke Subagents

Try invoking your subagents. You can be explicit:

> "Use the accessibility-agent to scan all HTML pages for WCAG issues."

Or you can just describe what you want and let Claude figure out which agent to use:

> "Check my portfolio for accessibility problems."

Claude reads the agent's `description` field and matches it to your request. Try both approaches and notice whether Claude delegates automatically or handles it directly.

> **Why this step:** You can invoke subagents explicitly ("Use the accessibility-agent") or let Claude auto-delegate based on the task description. Auto-delegation works because Claude reads the agent's `description` field and matches it to your request. Writing clear, specific descriptions in your agent frontmatter makes auto-delegation more reliable.

### 8.8 Patterns: Chain, Parallel, Resume

**Chaining:** Connect agents in sequence. Ask Claude to run one agent and then feed its results into another:

> "Use the accessibility-agent to find all issues, then use the design-agent to suggest CSS fixes for the visual problems it found."

**Parallel (background):** Press `Ctrl+B` to background a running agent,
then start another task. Ask for one scan:

> "Use the accessibility-agent to scan all pages."

While it runs, press `Ctrl+B`, then start another:

> "Use the content-agent to review all page content."

Both agents work simultaneously.

**Resuming:** After an agent completes, continue its work by asking a follow-up:

> "Continue that accessibility review and now also check the contact form for keyboard navigation issues."

Claude resumes the previous agent with its full context preserved.

> **STOP -- What you just did:** You learned the three core subagent patterns. Chaining connects agents in sequence (accessibility finds issues, then design suggests fixes). Parallel runs agents simultaneously with `Ctrl+B` -- both work at the same time without blocking each other. Resuming continues a completed agent's work without losing its context. In real projects, you will use parallel agents for comprehensive code reviews (run accessibility + design + content checks simultaneously) and chaining for multi-step workflows.

### Checkpoint

- [ ] `.claude/agents/` contains `accessibility-agent.md`, `design-agent.md`, `content-agent.md`
- [ ] Each agent has correct frontmatter (name, description, tools, model)
- [ ] You invoked each agent manually and it produced results
- [ ] You chained two agents (accessibility then design)
- [ ] You backgrounded an agent with `Ctrl+B` and started another task
- [ ] You resumed a completed agent to continue its work

---

## Module 9 -- Tasks and TDD

**CC features:** Tasks system, `TaskCreate`, dependencies/blockedBy,
cross-session persistence, TDD loops, SubagentStop

### 9.1 Tasks System Overview

> **Why this step:** Tasks give Claude Code a built-in project management system. Instead of keeping a mental checklist of what needs to happen, you define tasks with explicit dependencies -- task B cannot start until task A finishes. This prevents Claude from jumping ahead or working on things out of order, which is especially important for multi-step features like building a contact form.

Tasks replace the old TODO system. They provide:
- Dependency graphs (task A blocks task B)
- Cross-session persistence (stored on disk at `~/.claude/tasks/`)
- Multi-agent collaboration (shared task lists)
- Progress tracking visible in the terminal

Press `Ctrl+T` to toggle the task list view at any time.

### 9.2 Cross-Session Persistence

To share a task list across sessions, set the environment variable:

```
CLAUDE_CODE_TASK_LIST_ID=canvas-contact claude
```

Any session started with this ID shares the same task list. This enables
multiple Claude instances to coordinate work.

> **Why this step:** Cross-session persistence means you can close Claude Code, come back tomorrow, and your task list is still there. It also means multiple Claude instances can share the same task list -- you will use this in Module 10 for parallel development with git worktrees.

### 9.3 Build a Multi-Step Pipeline

Create a task chain for building the contact form end-to-end. Describe the steps and their dependencies to Claude:

> "I want to build a contact form as a multi-step task pipeline. The steps are: design the form layout first, then create the HTML, then style it with CSS, then write JS validation, then add success/error states, then test everything. Each step depends on the previous one. Create these as tasks with blockedBy dependencies."

Press `Ctrl+T` to see tasks in the status area. Then tell Claude to execute:

> "Work through the contact form pipeline. Execute each task in dependency order."

> **STOP -- What you just did:** You created a dependency graph where each task explicitly blocks the next. Task 3 ("Style form with CSS") cannot start until task 2 ("Create HTML form") is complete. Claude respects these dependencies automatically -- it will not jump to styling before the HTML exists. Press `Ctrl+T` to see the task list update in real time as each task completes. This is how you manage complex, multi-step features without losing track of progress.

> **Quick check before continuing:**
> - [ ] All 6 contact form tasks were created with `blockedBy` dependencies
> - [ ] `Ctrl+T` shows the task list in the terminal status area
> - [ ] Tasks executed in order (no blocked task ran before its dependency completed)
> - [ ] The contact form page exists with HTML, CSS, and basic structure

### 9.4 TDD Workflow: Build with Tests First

Use strict test-driven development to build the form validation. Since this
is plain JavaScript, you will use a simple browser-based test runner.

Tell Claude you want to do strict TDD and describe the test cases:

> "Let's build form validation with strict TDD. First, create a test.html file that acts as a simple test runner -- loads the validation script, runs assertions, and shows pass/fail in the browser. I want test cases for email validation, required field checks, XSS prevention on the name field, message length limits, and correct error messages. Write the test runner and the first failing test now -- do NOT write any validation code yet."

The key discipline: Claude writes a test first, you verify it fails in the browser (red), then Claude writes the minimum code to pass, you verify it passes (green), then refactor. Push back if Claude tries to write all the validation code at once.

Let Claude work through the TDD cycle. For each test:
1. Claude writes the test
2. You open test.html in the browser (it should show red/fail)
3. Claude writes just enough code to pass
4. Refresh the browser (should show green/pass)
5. Refactor

This enforces disciplined development and gives you a solid test suite.

> **STOP -- What you just did:** You used TDD (test-driven development) with Claude Code. The discipline is critical: write the test *first*, see it fail, *then* write the minimum code to pass. This prevents Claude from writing a monolithic validation function and then backfilling tests. The browser-based test runner (`test.html`) is your verification -- you can see red/green status with every refresh. TDD with Claude Code is one of the most effective development patterns because it forces both you and Claude to think about behavior before implementation.

Ready to add a SubagentStop hook for verifying agent output?

> **Why this step (for the next section):** SubagentStop hooks verify that subagents actually completed their work properly. Without this check, a subagent could fail silently or return incomplete results, and you might not notice.

### 9.5 Stop and SubagentStop Hooks for Verification

Add a SubagentStop hook that verifies subagent output. Describe the check to Claude:

> "Add a SubagentStop hook to settings.json with type 'prompt' that evaluates whether a subagent actually completed its task -- did it produce output? Were there errors? Is the work complete? It should respond with ok true or ok false with a reason."

This ensures subagents finish their work properly before returning results.

> **STOP -- What you just did:** You added a SubagentStop hook that acts as a quality gate for subagent output. This is a prompt-based hook (using an LLM to evaluate) rather than a script-based hook -- because determining whether a subagent "completed its task" requires judgment, not just string matching. This closes the loop on subagent reliability: you delegate work to a subagent, and the hook verifies the work was actually done.

### Checkpoint

- [ ] You created a multi-step task pipeline with dependencies
- [ ] Tasks appeared in the terminal status area (`Ctrl+T`)
- [ ] Tasks executed in dependency order (blocked tasks waited)
- [ ] You built form validation using strict TDD (test first, then implement)
- [ ] All form validation tests pass in the browser
- [ ] You understand cross-session persistence with `CLAUDE_CODE_TASK_LIST_ID`
- [ ] SubagentStop hook verifies subagent completion

---

## Module 10 -- Parallel Dev, Plugins, and Evaluation

**CC features:** Git worktrees, plugins, evaluation, PermissionRequest hooks,
continuous learning

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
