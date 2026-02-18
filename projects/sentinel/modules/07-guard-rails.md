# Module 7 -- Guard Rails

**CC features:** PreToolUse, hook decision control, prompt-based hooks, permissionDecision, additionalContext, updatedInput

> **Persona — Peer:** Terse guidance, point to docs, let them debug first. "Your call", "What would you do here?"

In this module you build hooks that act as guardrails -- preventing bad actions, injecting context, and modifying inputs before tools execute.

### Step 1: Understand PreToolUse decision control

> **Why this step:** PreToolUse is the most powerful hook event because it fires *before* a tool runs, giving you three options: allow it silently, block it with a reason, or ask the user to confirm. On top of that, you can inject extra context or even modify the tool's input. This is Claude Code's programmable permission system -- you are about to build custom guardrails for Sentinel.

Ask Claude to explain how PreToolUse decision control works.

> "Explain PreToolUse hooks -- what are the permissionDecision options (allow, deny, ask), and how do additionalContext and updatedInput work?"

PreToolUse hooks can return JSON with:
- `permissionDecision: "allow"` -- auto-approve the tool call
- `permissionDecision: "deny"` -- block the tool call, with a reason shown to Claude
- `permissionDecision: "ask"` -- prompt the user to confirm
- `additionalContext` -- inject extra information into Claude's context
- `updatedInput` -- modify the tool's input parameters before execution

### Step 2: Guard against invalid rule schemas

Ask Claude to create a hook that prevents saving analysis rules with missing required fields. Describe the behavior you want -- it should check files being written to the rules or analyzers directory, validate they have the right structure, and deny the write with a helpful reason if something is missing.

> "Create a PreToolUse hook that validates rule schemas. If I'm writing a file to rules/ or analyzers/, the hook should check that it has the required fields. If invalid, deny the write with a reason. If valid, let it through. Put the script in .claude/scripts/ and add it to settings.json on the 'Write' tool."

Claude may ask what "required fields" means for your rules. Point it to your rule format documentation.

A denial returns JSON like: `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Rule file missing required 'severity' field."}}`

> **STOP -- What you just did:** You built a schema validation guardrail. When Claude tries to write a rule file with missing required fields, the hook blocks the write and tells Claude exactly what is wrong. Claude then sees the denial reason and can fix the file before trying again. This is "fail fast" automation -- bad data never reaches disk. You will use this pattern whenever you have strict format requirements for generated files.

Ready to try context injection with additionalContext?

### Step 3: Inject context about related analyzers

Now create a hook that enriches Claude's context when it reads rule files. Ask Claude to build a script that detects when a rule file is being read and injects information about related analyzer files using `additionalContext`.

> "Create a PreToolUse hook on 'Read' that checks if the file being read is in rules/. If so, find all related analyzer files and inject them as additionalContext so you know the full picture when working on rules. Put the script in .claude/scripts/ and add it to settings.json."

The output uses `additionalContext` to inject text like: "Related analyzers: complexity_rule, naming_rule, docstring_rule. See docs/rule-format.md for the rule interface."

> **STOP -- What you just did:** You built a context injection hook. Unlike the deny hook which blocks actions, this one enriches Claude's understanding by adding information when it reads certain files. When Claude opens a rule file, the hook automatically tells it about related analyzers. This is like giving Claude a "see also" sidebar -- it makes connections between files that Claude might not discover on its own.

> **Quick check before continuing:**
> - [ ] Your deny hook blocks writes of invalid rule schemas
> - [ ] Your context injection hook adds related analyzer info when reading rule files
> - [ ] Both hooks are configured in `.claude/settings.json` as PreToolUse entries

### Step 4: Auto-add metadata to generated test files

Now create a hook that silently adds metadata to generated test files. Ask Claude to build a script that detects when a test file is being written and uses `updatedInput` to prepend a metadata comment with the generation timestamp and the source file being tested.

> "Create a PreToolUse hook on 'Write' that checks if the file being written is a test file. If so, use updatedInput to prepend a metadata comment with the timestamp and the source file being tested. Put the script in .claude/scripts/ and add it to settings.json."

The output uses `updatedInput` to modify the file content before it is written, prepending a metadata header with the timestamp and source file path.

> **Why this step:** `updatedInput` is the third and most subtle PreToolUse capability. While `deny` blocks an action and `additionalContext` injects information, `updatedInput` silently transforms what Claude writes. The test file reaches disk with metadata already included -- Claude does not even need to remember to add it. Use this for any boilerplate that should always be present in generated files.

### Step 5: Prompt-based quality gate for generated tests

Add a second prompt-based Stop hook that specifically reviews test quality. Ask Claude to create one that checks whether generated tests have good edge case coverage, meaningful assertions (not just "assert true"), and proper test independence.

> "Add a prompt-based Stop hook (type: prompt, timeout: 30) that evaluates test quality when tests were generated. It should check for edge case coverage, meaningful assertions, and test independence. Return ok: false with a reason if it finds quality issues."

This demonstrates stacking multiple Stop hooks -- the Module 5 hook checks that tests exist, this one checks that they are good.

> **STOP -- What you just did:** You now have four PreToolUse/Stop hooks working together: schema validation (deny), context injection (additionalContext), metadata insertion (updatedInput), and quality review (prompt-based Stop). These hooks form a layered defense -- each catches a different category of problem. Notice how they stack: you can have multiple hooks on the same event, and they all run. This composability is what makes hooks powerful for real projects.

### Step 6: Test the guard rails

> **Quick check before continuing:**
> - [ ] All four hooks are configured in `.claude/settings.json`
> - [ ] You understand the difference between deny, additionalContext, and updatedInput
> - [ ] The prompt-based Stop hook is set up to review test quality

1. Try to create a rule file with missing fields -- the deny hook should block it
2. Read a rule file -- check that additional context is injected
3. Generate a test file -- check that metadata is added
4. Complete a task involving tests -- the Stop hook should review quality

### Checkpoint

- [ ] PreToolUse hook denies writes of invalid rule schemas
- [ ] PreToolUse hook injects additionalContext when reading rule files
- [ ] PreToolUse hook uses updatedInput to add metadata to test files
- [ ] Prompt-based Stop hook reviews test quality
- [ ] All hooks are configured in `.claude/settings.json`
- [ ] You tested each guard rail and saw it work
