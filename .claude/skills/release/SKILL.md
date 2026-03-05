---
name: release
description: Walk through the full release checklist — version bump, tag, GitHub Release, sparq sync.
argument-hint: "[version] [short description]"
---

# Release Checklist

You are a release manager. Walk the user through each step of the release process interactively.

## Parse Arguments

- If the user provided a version (e.g., `/release v2.7.0`), use it. Otherwise, ask what version to release.
- If the user provided a short description after the version (e.g., `/release v2.7.0 add release skill`), use it. Otherwise, ask for a one-line description of what changed.
- Validate the version matches `vX.Y.Z` format. Remind them of semver: patch for fixes, minor for new content/features, major for curriculum overhauls.

## Step 1: Check Working Tree

Run `git status` and `git diff --staged`. If the tree is dirty, tell the user what's uncommitted and ask them to commit or stash before continuing. Do NOT proceed until the tree is clean.

## Step 2: Update README.md Badge

- Read line 1 of `README.md` to show the current badge version.
- Edit the badge to replace the old version with the new version (both the label and the text).
- Show the user the change.

## Step 3: Update CHANGELOG.md

- Read the top of `CHANGELOG.md` to show the latest entry.
- Ask the user what to include in the changelog entry (or use the short description they already provided).
- Prepend a new `## vX.Y.Z` section at the top of the changelog with today's date and the description.

## Step 4: Commit the Version Bump

- Stage `README.md` and `CHANGELOG.md`.
- Commit with message: `docs: bump version to vX.Y.Z`
- Show the commit.

## Step 5: Tag & Push

- **Ask for confirmation before pushing.** Show exactly what will be pushed (the commit and the tag).
- Run: `git tag vX.Y.Z && git push origin master && git push origin --tags`

## Step 6: Create GitHub Release

- **Ask for confirmation before creating the release.**
- Run: `gh release create vX.Y.Z --title "vX.Y.Z — Short Description" --notes "## What's New\n- item1\n- item2"`
- Use the changelog entry content for the release notes.
- Show the release URL when done.

## Step 7: Sync Sparq Remote

- Run: `bash .claude/scripts/sync-sparq.sh`
- If the sparq remote doesn't exist, skip this step and tell the user.

## Step 8: Update MEMORY.md

- Edit `~/.claude/projects/C--Users-Zain--Dropbox-Personal-Data-Science-Projects-cc-self-train/memory/MEMORY.md` to update "Current version: vX.Y.Z" to the new version.
- Tell the user the release is complete.

## Important

- **Never skip confirmations** on push and release creation steps — these are irreversible.
- **One step per message.** Complete each step, show results, then move to the next. Don't rush through multiple steps at once.
- If any step fails, stop and help the user fix it before continuing.
