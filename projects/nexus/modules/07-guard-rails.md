# Module 7 -- Guard Rails

**CC features:** PreToolUse, hook decision control, prompt-based hooks, permissionDecision, additionalContext, updatedInput

> **Why this step:** In Module 5 you built hooks that react *after* things happen (PostToolUse, Stop). PreToolUse hooks are different -- they fire *before* a tool runs, giving you the power to block, modify, or annotate tool calls before they execute. This is how you build guardrails that prevent mistakes rather than just catching them.

### Step 1: PreToolUse with Decision Control

PreToolUse hooks fire before a tool executes. They can return JSON to control the outcome:

| Decision | Effect |
|----------|--------|
| `"permissionDecision": "allow"` | Auto-approve the tool call |
| `"permissionDecision": "deny"` | Block the tool call, show reason to Claude |
| `"permissionDecision": "ask"` | Show the permission dialog to the user |
| `additionalContext` | Inject context for Claude before the tool runs |
| `updatedInput` | Modify the tool's input parameters |

### Step 2: Guard -- Prevent Unvalidated Config Edits

Ask Claude to create a PreToolUse hook that blocks writes to route config files when they are missing required fields. Describe the guardrail behavior you want.

> "Create a PreToolUse hook that guards config file edits. If Claude tries to write a route config file that's missing a 'path' field, deny the write with a clear reason. Put the script in .claude/hooks/guard-config-edit.sh and add it to settings.json with a Write|Edit matcher."

Claude will create the hook script that reads the tool input from stdin, checks config file writes, and returns a `permissionDecision: deny` JSON response when validation fails. Test it: ask Claude to write a config file missing the `path` field. The hook should block it.

> **STOP -- What you just did:** You created your first guardrail that actively *prevents* a mistake. When Claude tries to write an invalid config, the hook blocks it with a clear reason. Claude sees the denial reason and corrects its approach automatically. This is fundamentally different from the PostToolUse validation in Module 5 -- that caught errors after the write; this prevents the write from happening at all.

Want to try softer guardrails with context injection?

### Step 3: Guard -- Add Context to Route Handler Reads

> **Why this step:** Not all guardrails block actions. `additionalContext` is a softer approach: it injects helpful information into Claude's context before a tool runs, nudging Claude toward better behavior without forcing it. Think of it as whispering a reminder rather than slamming a door.

Ask Claude to create a PreToolUse hook that injects helpful context whenever Claude reads a route handler file. The context should remind Claude about method validation, proper status codes, and rate limit checks.

> "Create a PreToolUse hook that detects when you're reading a route handler file and injects a reminder about validating HTTP methods, returning proper status codes, and checking rate limits. Use additionalContext, not deny -- I want to nudge your behavior, not block the read."

The `additionalContext` field injects text into Claude's context before the tool runs, without changing the tool's behavior.

### Step 4: Guard -- Auto-Add Logging to New Route Handlers

Ask Claude to create another PreToolUse hook that checks whether a route handler being written includes logging. If not, it should inject a reminder via `additionalContext`.

> "Create a PreToolUse hook that checks when you're writing a route handler file. If the content doesn't include any logging, inject an additionalContext reminder to add request logging with method, path, status code, and response time. Don't block the write -- just remind."

Using `additionalContext` to remind Claude is more reliable than forcibly rewriting content with `updatedInput`.

> **STOP -- What you just did:** You now have three guard rail strategies: `deny` (block the action), `additionalContext` (inject a reminder), and `ask` (show the user a permission dialog). You also saw the logging injection hook, which demonstrates a pattern you will use often: instead of trying to rewrite Claude's output with `updatedInput`, use `additionalContext` to add instructions that Claude follows naturally.

> **Quick check before continuing:**
> - [ ] The config validation hook blocks writes to config files that are missing required fields
> - [ ] The route context hook injects reminders when Claude reads route handler files
> - [ ] The logging injection hook reminds Claude to add logging to new route handlers
> - [ ] You can explain the difference between `deny`, `additionalContext`, and `updatedInput`

### Step 5: Prompt-Based Hook -- Security Gate

> **Why this step:** Shell script hooks are great for pattern matching (does this file contain "path"?), but some decisions require judgment. Prompt-based hooks send the context to a fast LLM (Haiku) that can evaluate nuanced questions like "is this route config a security risk?" This is how you build guardrails for things that cannot be checked with a regex.

Prompt-based hooks use an LLM (Haiku) to evaluate decisions. Create a Stop hook that checks whether route configs are secure:

Add to `.claude/settings.json`:

```json
"Stop": [
  {
    "hooks": [
      {
        "type": "prompt",
        "prompt": "Review the conversation and check if any route configuration changes were made. If they were, evaluate: 1) Are any routes exposing internal-only paths like /admin or /internal to public access? 2) Are there routes without rate limiting that should have it? 3) Are there routes forwarding to external hosts that could be a security risk? If any security issues exist, respond with {\"ok\": false, \"reason\": \"Security issue found: <description>. Fix before stopping.\"}. If everything looks safe, respond with {\"ok\": true}.",
        "timeout": 30
      }
    ]
  }
]
```

Prompt-based hooks send the context to a fast LLM which returns a JSON decision. This is more flexible than shell scripts for nuanced evaluations.

> **STOP -- What you just did:** You built a complete guard rail system for your gateway: shell-script hooks for deterministic checks (config validation, logging reminders) and a prompt-based hook for judgment calls (security review). The prompt-based hook is especially powerful -- it evaluates route configs for security issues using an LLM, catching things that no regex could. You now have hooks at every stage of the lifecycle: SessionStart (context), PreToolUse (guard), PostToolUse (validate), and Stop (quality gate + security check).

### Checkpoint

- [ ] PreToolUse hook blocks config writes that fail validation
- [ ] PreToolUse hook injects context when reading route handlers
- [ ] PreToolUse hook reminds Claude to add logging to route handlers
- [ ] Prompt-based Stop hook checks for security issues in route configs
- [ ] You understand the three decision types: allow, deny, ask
- [ ] You understand additionalContext vs updatedInput vs permissionDecision
- [ ] All hooks configured in `.claude/settings.json`
- [ ] Changes committed to git
