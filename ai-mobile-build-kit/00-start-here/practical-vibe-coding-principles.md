# Practical Vibe Coding Principles

Practical vibe coding uses AI as a fast implementer inside a controlled product and engineering system. Random vibe coding asks AI to improvise the system itself. The first can ship real apps. The second usually creates a codebase nobody trusts.

## Practical Vibe Coding Versus Random Vibe Coding

Practical vibe coding:

- Starts with a clear product outcome.
- Uses a stable stack.
- Defines visual direction before UI implementation.
- Keeps `AGENTS.md` current.
- Builds one feature at a time.
- Reviews every diff.
- Tests before committing.

Random vibe coding:

- Starts with "build me an app."
- Lets AI choose architecture on the fly.
- Mixes design styles across screens.
- Repeats context in prompts instead of documenting decisions.
- Combines unrelated features.
- Accepts large diffs because they look impressive.
- Skips real device and production build checks.

## Why Unstructured Prompting Breaks Codebases

AI is excellent at generating plausible code. Plausible is not the same as correct, consistent, maintainable, or releasable.

Unstructured prompts cause AI to:

- Invent folder patterns.
- Add libraries without approval.
- Refactor working files during unrelated tasks.
- Create duplicate components.
- Ignore edge states.
- Use weak types.
- Hide app logic in screens.
- Drift away from the product goal.

The solution is not less AI. The solution is tighter instructions.

## Why Over-Planning Kills Momentum

The opposite failure is trying to fully design the next six months. That slows learning and makes the plan fragile.

Plan enough to:

- Know the target user.
- Define the MVP boundary.
- Select the stack.
- Establish visual direction.
- Create `AGENTS.md`.
- Build the next feature safely.

Do not plan every future feature in detail before validating the first useful flow.

## Why Small Verifiable Prompts Work

Small prompts work because the human can review the output.

A good prompt asks for:

- One screen.
- One component.
- One state store.
- One integration.
- One bug fix.
- One test pass.

Small prompts make it easier to:

- Inspect the diff.
- Run focused manual tests.
- Catch regressions.
- Revert if needed.
- Commit cleanly.

## Why AGENTS.md Is The Project Constitution

`AGENTS.md` prevents repeated context and architecture drift. It tells every coding model:

- What the app is.
- What the stack is.
- Which folders to use.
- Which UI rules matter.
- How state is managed.
- How secrets are handled.
- What actions are forbidden.

When a decision becomes stable, put it in `AGENTS.md`. When a task is temporary, keep it in the feature prompt.

## Why Every Prompt Needs Scope And Constraints

Every coding prompt should include:

- Anchor: read `AGENTS.md` first.
- Task: the exact feature or fix.
- Constraints: files, behavior, UI, dependencies, and boundaries.
- Reference: design image, docs, existing files, screenshots, or APIs.
- Acceptance criteria: what done means.

Example:

```md
Read AGENTS.md first and follow it strictly.

Task:
Build the empty state for the Habits screen.

Constraints:
- Do not change navigation.
- Do not add dependencies.
- Do not alter existing completed habit UI.
- Keep text content in the screen file for now.

Reference:
- assets/images/empty-habits.png
- app/(tabs)/habits.tsx
- components/PrimaryButton.tsx

Acceptance criteria:
- Empty state appears when the habit list is empty.
- Primary action navigates to Create Habit.
- Layout works on small iPhone and large Android screens.
- TypeScript and lint pass.
```

## The Human Role

The human is responsible for:

- Product decisions.
- Taste decisions.
- Reviewing diffs.
- Testing on device.
- Accepting or rejecting AI output.
- Choosing when to ship.

AI can move quickly, but the product owner decides what good means.
