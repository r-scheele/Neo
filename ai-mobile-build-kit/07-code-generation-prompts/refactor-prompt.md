# Refactor Prompt

Use this only when refactor is the task.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Refactor [TARGET_CODE] to [REFACTOR_GOAL].

Reason:
[WHY_THIS_REFACTOR_IS_NEEDED]

Constraints:
- No behavior changes.
- No visual changes.
- No public API changes unless explicitly requested.
- Do not add features.
- Do not install libraries.
- Keep the diff small.
- Preserve tests and existing behavior.
- Avoid broad file moves unless requested.

Reference:
- Current files: [FILES]
- Desired structure or pattern: [REFERENCE]
- Existing similar code: [FILES]

Acceptance criteria:
- Existing behavior is preserved.
- Existing visuals are preserved.
- Public APIs are preserved unless approved.
- Code is easier to read or maintain for the stated reason.
- TypeScript passes.
- Lint passes.
- Existing tests pass if available.

After implementation, return files changed, what changed, how to test, and any risk.
```

## Warning

Do not combine this with feature work. Refactor first or feature first, not both.
