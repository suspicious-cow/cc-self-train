# Module 7 -- Guard Rails

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
