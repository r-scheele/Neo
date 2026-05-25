# Feature Build Loop

Use this loop for every feature. Do not skip steps because the feature seems small.

## The Loop

For every feature:

1. Write a feature spec.
2. Write one AI prompt.
3. Send it.
4. Review the diff.
5. Run the app.
6. Test the new feature.
7. Test old features.
8. Run lint and typecheck.
9. Fix with one targeted prompt if needed.
10. Commit.
11. Move to next feature.

## Step 1: Write A Feature Spec

Use `feature-spec-template.md`.

The spec should answer:

- What is the feature?
- Who is it for?
- What files or screens are involved?
- What is in scope?
- What is out of scope?
- What states are required?
- What does done mean?

## Step 2: Write One AI Prompt

Use a prompt from `07-code-generation-prompts/`.

Do not combine:

- UI plus backend plus analytics.
- Bug fix plus refactor.
- Setup plus feature work.
- Feature plus release prep.

## Step 3: Send It

Paste the full prompt. Include references:

- `AGENTS.md`.
- Feature spec.
- Design image.
- Existing file names.
- Current docs.

## Step 4: Review The Diff

Use `diff-review-checklist.md`.

Reject changes that:

- Modify unrelated files.
- Add dependencies without approval.
- Rewrite architecture.
- Change visuals outside scope.
- Introduce `any`.
- Skip required states.

## Step 5: Run The App

Run the app before declaring the feature done. A clean diff is not enough.

## Step 6: Test The New Feature

Use `manual-testing-template.md`. Test success, failure, empty, loading, and edge states where relevant.

## Step 7: Test Old Features

Use `regression-checklist.md`. Test nearby flows, navigation, auth, persistence, and old screens that may be affected.

## Step 8: Run Lint And Typecheck

Use the commands documented in `AGENTS.md`. If they fail, fix with a targeted prompt.

## Step 9: Fix With One Targeted Prompt

Use `07-code-generation-prompts/bug-fix-prompt.md`.

Do not say:

```md
Fix everything and clean up the app.
```

Say:

```md
Fix only the TypeScript error in stores/habitStore.ts where the persisted value is parsed as unknown.
```

## Step 10: Commit

Use `commit-message-guide.md`.

## Done Looks Like

A feature is done when implementation, diff review, manual testing, regression testing, lint/typecheck, and commit are complete.
