# Master Feature Prompt

Use this for a normal feature that touches a small number of files.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement [FEATURE_NAME].

Context:
[WHERE_THIS_FEATURE_FITS]

Requirements:
- [REQUIREMENT_1]
- [REQUIREMENT_2]
- [REQUIREMENT_3]

Constraints:
- Do not change unrelated files.
- Do not refactor existing code.
- Do not install new libraries without asking.
- Preserve existing UI unless explicitly instructed.
- Do not add features not requested.
- Do not expose secrets in client code.
- Keep implementation simple.
- Keep the diff small enough to review.

Reference:
[DESIGN_IMAGE / DOCS / EXISTING_FILES / SCREEN_MAP / FEATURE_SPEC]

Acceptance criteria:
- [CRITERIA_1]
- [CRITERIA_2]
- Loading, empty, and error states are handled where relevant.
- Works on iOS and Android where relevant.
- TypeScript passes.
- Lint passes.

After implementation:
Return:
1. Files changed.
2. What changed.
3. How to test.
4. Any risks or follow-up tasks.
```

## Use When

- The feature is already specified.
- Architecture is already decided.
- The diff should be focused.

## Do Not Use When

- You need product planning.
- You need a refactor.
- You need a bug fix.
- You need release prep.
