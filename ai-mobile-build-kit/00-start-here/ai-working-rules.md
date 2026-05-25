# AI Working Rules

These rules keep AI useful without letting it take over the product or damage the codebase.

## Product Ownership

- AI is the implementer, not the product owner.
- The human decides user value, scope, taste, and release readiness.
- AI may suggest tradeoffs, but should not silently choose product direction.
- Every feature starts from a human-approved spec.

## Prompting Rules

- Never ask AI to "make it better" without defining better.
- Never combine unrelated features in one prompt.
- Never ask for "the whole app."
- Always include anchor, task, constraints, reference, and acceptance criteria.
- Always say what not to change.
- Always ask for files changed and how to test.
- Always paste or link current docs for current libraries when library behavior matters.
- Always provide screenshots, mockups, or visual references for UI work.

## Codebase Protection Rules

- Do not accept output without reading the diff.
- Do not allow unrelated refactors during feature work.
- Do not install new libraries without an explicit dependency decision.
- Do not let AI move files or rename folders unless the task requires it.
- Do not let AI change app architecture during a UI task.
- Do not accept `any` unless the prompt explicitly allows a temporary escape hatch and explains why.
- Do not expose secrets in client code.

## Implementation Preferences

- Prefer boring implementation over clever implementation.
- Prefer local state for local UI concerns.
- Prefer Zustand only for simple shared app state.
- Prefer AsyncStorage only for small local persistence.
- Prefer Expo-supported APIs before adding libraries.
- Prefer explicit types over inferred mystery objects.
- Prefer small components with clear ownership.

## Review Rules

After every AI coding response:

- Read the changed files.
- Check whether the diff matches the prompt.
- Look for unrelated changes.
- Look for unnecessary dependencies.
- Look for weak typing.
- Look for missing loading, empty, error, and permission states.
- Run the app.
- Run lint and typecheck.

## UI Rules

- Provide visual references before asking for screen implementation.
- Define the mood, palette, typography feel, spacing, shadows, icon style, and illustration style.
- Test small screens and long content.
- Check first-time and returning user states.
- Check light and dark modes only if both are in scope.

## Bug-Fix Rules

When something breaks:

- Describe the actual behavior.
- Describe the expected behavior.
- Include logs, screenshots, or reproduction steps.
- Ask for one targeted fix.
- Forbid refactors.
- Forbid visual changes unless the bug is visual.
- Ask for root cause and test steps.

## Copy-Paste Bug Prompt

```md
Read AGENTS.md first and follow it strictly.

Task:
Fix only this bug: [BUG_DESCRIPTION].

Actual behavior:
[WHAT_HAPPENS]

Expected behavior:
[WHAT_SHOULD_HAPPEN]

Reproduction steps:
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]

Constraints:
- Do not refactor.
- Do not change UI unless required to fix the bug.
- Do not add dependencies.
- Do not modify unrelated files.
- Do not change public APIs.

Reference:
[ERROR_LOGS / SCREENSHOT / FILES / DOCS]

Acceptance criteria:
- The bug no longer reproduces.
- Existing related behavior still works.
- TypeScript passes.
- Lint passes.

After implementation, return the root cause, files changed, and how to test.
```
