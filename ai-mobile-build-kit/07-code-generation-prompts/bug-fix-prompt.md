# Bug Fix Prompt

Use this when something is broken. Keep it strict.

```md
Anchor:
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
- Fix only the described bug.
- Do not refactor.
- Do not change UI unless required to fix the bug.
- Do not change unrelated files.
- Do not install libraries.
- Do not change public APIs unless required and explained.
- Do not add new features.
- Keep the diff minimal.

Reference:
- Error logs: [LOGS]
- Screenshot or recording: [LINK]
- Suspected files: [FILES]
- Related docs: [DOCS]

Acceptance criteria:
- The bug no longer reproduces.
- The expected behavior works.
- Existing related behavior still works.
- TypeScript passes.
- Lint passes.

After implementation:
Return:
1. Root cause.
2. Files changed.
3. What changed.
4. How to test.
5. Any remaining risk.
```

## Emergency Rule

If this prompt does not fix the bug, do not broaden the scope immediately. Add better reproduction evidence and run one more targeted bug-fix prompt.
