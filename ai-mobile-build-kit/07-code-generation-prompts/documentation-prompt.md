# Documentation Prompt

Use this to document a feature, setup step, or convention.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Document [TOPIC].

Audience:
[FUTURE_DEVELOPER / PRODUCT_OWNER / QA_TESTER / RELEASE_MANAGER]

Requirements:
- Explain what it is.
- Explain where the relevant files live.
- Explain how to run or test it.
- Include common failure modes.
- Include examples where useful.

Constraints:
- Do not change app behavior.
- Do not modify unrelated docs.
- Do not invent unsupported features.
- Keep docs practical and current.
- Do not include secrets.

Reference:
- Existing docs: [FILES]
- Implementation files: [FILES]
- Commands: [COMMANDS]

Acceptance criteria:
- A new contributor can follow the documentation.
- Commands and file paths are accurate.
- Docs match current implementation.
- No sensitive data is included.

After implementation, return files changed, what changed, and how to verify the docs.
```
