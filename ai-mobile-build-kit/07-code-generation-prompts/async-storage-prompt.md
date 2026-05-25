# AsyncStorage Prompt

Use this to add small safe local persistence.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement AsyncStorage persistence for [DATA_NAME].

Persistence purpose:
[WHY_THIS_DATA_MUST_SURVIVE_APP_RESTART]

Requirements:
- Storage key: [NAMESPACED_KEY]
- Data shape: [TYPE]
- Default value: [DEFAULT]
- Hydration behavior: [WHEN_LOADED]
- Clear behavior: [WHEN_CLEARED]
- Migration behavior if needed: [VERSION_PLAN]

Constraints:
- Do not store secrets, tokens, passwords, payment data, or sensitive personal data.
- Do not persist more data than necessary.
- Do not change unrelated state.
- Do not install libraries.
- Parse stored data before trusting it.
- Handle corrupt or missing data gracefully.
- Avoid `any`.

Reference:
- Persistence plan: [PASTE_OR_LINK]
- Existing storage helpers: [FILES]
- AsyncStorage docs: [PASTE_DOCS_OR_LINK]

Acceptance criteria:
- Data persists after app restart.
- Missing storage uses safe defaults.
- Invalid stored data does not crash the app.
- Clear behavior works where required.
- Loading or hydration state is handled.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test restart behavior, and risks.
```
