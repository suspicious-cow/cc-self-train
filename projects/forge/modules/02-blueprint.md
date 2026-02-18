# Module 2 -- Blueprint and Build

**CC features:** Plan mode, git integration, basic prompting

## 2.1 Enter Plan Mode

> **Why this step:** Plan mode is one of Claude Code's most powerful features. It lets Claude analyze, reason, and design *without* touching any files. You always want to think before you build -- plan mode enforces that discipline.

Press `Shift+Tab` to switch to plan mode. You will see the mode indicator
change. In plan mode, Claude analyzes and plans without making changes. This
is where you design before you build.

Alternatively, type:

```
/plan
```

## 2.2 Design the Architecture

Now describe your dev toolkit to Claude. Tell it about the data types you want to manage -- notes, code snippets, bookmarks, templates -- and how you would want to interact with them from the CLI. Don't worry about getting the prompt perfect. Just describe your vision and let Claude ask clarifying questions.

Something like:

> "I want to build a CLI tool called forge that stores notes, code snippets, bookmarks, and templates. Help me design the architecture -- ask me questions about storage format, CLI commands, and data models. Don't write any code yet, just the plan."

Claude will probably ask about your storage preferences (JSON files vs SQLite), how you want IDs to work, and how search should behave. Answer naturally -- these are your design decisions. The back-and-forth is how you get a plan that actually fits your needs.

Once Claude produces a plan, read it carefully. Push back on anything you would do differently.

## 2.3 Review and Iterate

Still in plan mode, challenge the plan. Ask Claude about the trade-offs it made -- storage format, ID generation strategy, how search will work across types. If something feels over-engineered or too simple, say so. This is a design conversation, not a rubber stamp.

For example:

> "Why did you choose that storage format? What are the trade-offs vs the alternatives? And how will search work efficiently across all four types?"

Refine the plan until you are satisfied with the design.

> **STOP -- What you just did:** You used plan mode to design your entire storage layer, data models, and CLI interface before writing a single line of code. This is one of Claude Code's most valuable patterns: *think with Claude before you build with Claude.* Plan mode prevents the "just start coding" trap that leads to rewrites. You will use this design-first approach whenever you start a new feature.

Ready to exit plan mode and start building?

## 2.4 Exit Plan Mode and Execute

Press `Shift+Tab` to return to normal mode. Now ask Claude to start building -- but keep the scope narrow. Tell it to create the data models and storage layer first, without the CLI interface. You want to build in layers, not all at once.

Something like:

> "Let's start building from the plan. Create the data models and the storage layer first -- no CLI yet. I want to review the core library before we add the interface on top."

Let Claude create the files. Review what it produces -- check that the models match what you agreed on in the plan.

> **Why this step:** Feature branches keep your experiments separate from working code. If something goes wrong, you can throw away the branch without affecting main.

## 2.5 Create a Feature Branch

```
! git checkout -b feature/core
```

## 2.6 Build the Storage Layer

If the storage layer is not fully implemented yet, describe what you still need. Tell Claude about the operations you want -- creating, reading, updating, deleting items -- plus tag filtering, search, timestamps, and validation. Let Claude figure out the implementation details.

> "The storage layer still needs full CRUD operations, tag-based filtering, search across all text fields, automatic timestamps, and validation before writes. Can you fill in what's missing?"

If Claude asks you questions about how search should work or what validation means for your data types, answer based on what makes sense for your toolkit.

> **STOP -- What you just did:** You went from an architecture plan to working code -- data models and a storage layer -- by giving Claude specific, scoped instructions. Notice you did not ask Claude to build everything at once. You built the core library *without* the CLI, keeping the first step focused. This incremental approach (plan, then build layer by layer) gives you chances to review and course-correct at each stage.

> **Quick check before continuing:**
> - [ ] Your data models exist for Note, Snippet, Bookmark, and Template
> - [ ] The storage layer handles create, read, update, and delete
> - [ ] You are on the `feature/core` branch (not main)

## 2.7 Write and Run Tests

Ask Claude to write tests for the storage layer. Describe what you want covered -- the happy paths (create, read, list, search, delete) and the edge cases (what happens with duplicate IDs, empty fields, missing files). Claude will likely ask about your test framework preferences if it is not obvious from your language choice.

> "Write tests for the storage layer. I want coverage for all CRUD operations, tag filtering, search, and edge cases like duplicate IDs and missing files."

Run the tests:

```
! <your-test-command>
```

For example: `python -m pytest`, `npm test`, `go test ./...`, `cargo test`

If tests fail, ask Claude to fix them. This is the build-test-fix cycle you
will use throughout the project.

> **Why this step:** The build-test-fix cycle is the heartbeat of working with Claude Code. You ask Claude to build something, run tests to verify it, and fix what is broken -- all without leaving the conversation. This tight loop is much faster than writing code in an editor and debugging manually.

## 2.8 Build the CLI Interface

Now ask Claude to build the CLI on top of your storage layer. Describe the commands you want -- adding items, listing them, searching, showing details, deleting, and browsing tags. Claude already knows your data models and storage API, so it can wire everything together.

> "Build the CLI interface for forge. I want commands for add, list, search, show, delete, and tags. Wire them up to the storage layer we already built."

If Claude suggests a CLI framework (like argparse, click, cobra, clap), discuss whether it fits your project's needs.

## 2.9 Manual Testing

Test your CLI by actually using it:

```
! forge add note --title "First Note" --body "Testing the forge CLI" --tags "test,meta"
! forge list notes
! forge search "First"
! forge show <ID-from-list>
! forge tags
! forge delete <ID>
```

Verify each command works. Fix anything broken.

> **STOP -- What you just did:** You just tested your CLI by running real commands -- not unit tests, but the actual tool a user would run. Manual testing catches problems that unit tests miss: bad argument parsing, unclear output formatting, confusing error messages. Always do both: automated tests for correctness, manual tests for usability.

Want to commit and merge everything to main?

## 2.10 Commit and Merge

```
! git add -A
! git commit -m "feat: core data models, storage layer, and CLI interface"
! git checkout main
! git merge feature/core
```

## Checkpoint

- [ ] You used plan mode to design the architecture before writing code
- [ ] Data models exist for Note, Snippet, Bookmark, Template
- [ ] Storage layer handles CRUD, search, and tag filtering
- [ ] CLI commands work: `forge add`, `forge list`, `forge search`, `forge show`, `forge delete`, `forge tags`
- [ ] Tests pass
- [ ] Changes are committed and merged to main
