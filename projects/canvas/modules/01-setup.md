# Module 1 -- Setup and First Contact

**CC features:** CLAUDE.md, `/init`, `/memory`, interactive mode, keyboard
shortcuts

> **Used `/start`?** Module 1 was completed during onboarding. Jump to [Module 2 -- Blueprint and Build](02-blueprint.md).

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
