# Test Generation Prompt

Use this after behavior exists and needs automated coverage.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Add tests for [FEATURE_OR_COMPONENT].

Behavior to cover:
- [BEHAVIOR_1]
- [BEHAVIOR_2]
- [BEHAVIOR_3]

Constraints:
- Do not change production behavior unless required to make code testable, and explain before doing so.
- Do not rewrite the feature.
- Do not install testing libraries without approval.
- Use the existing test setup.
- Keep tests focused on meaningful behavior.
- Avoid brittle snapshot-only tests unless already standard in the project.

Reference:
- Existing tests: [FILES]
- Feature files: [FILES]
- Acceptance criteria: [PASTE]

Acceptance criteria:
- Tests cover the listed behavior.
- Tests fail for meaningful regressions.
- Tests are readable.
- Existing tests still pass.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what tests were added, how to run them, and risks.
```
