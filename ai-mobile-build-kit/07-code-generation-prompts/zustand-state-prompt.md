# Zustand State Prompt

Use this to create or update a small shared state store.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create or update Zustand state for [STATE_DOMAIN].

State purpose:
[WHY_SHARED_STATE_IS_NEEDED]

Requirements:
- State fields: [FIELDS]
- Actions: [ACTIONS]
- Derived values: [DERIVED_VALUES_TO_COMPUTE_OUTSIDE_STORE]
- Persistence: [NONE / ASYNCSTORAGE_KEY]
- Screens using it: [SCREENS]

Constraints:
- Use Zustand only for shared state.
- Do not move local form state into the store.
- Do not store secrets.
- Do not store derived values unless explicitly requested.
- Do not add middleware or libraries without asking.
- Do not change unrelated stores.
- Avoid `any`.

Reference:
- Existing stores: [FILES]
- State management guide: [PASTE_OR_LINK]
- Data model: [PASTE_OR_LINK]

Acceptance criteria:
- Store state and actions are typed.
- Actions are explicit and predictable.
- Screens can read and update required state.
- App restart behavior is correct if persistence is included.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
