# Loading Empty Error State Prompt

Use this to add non-happy-path states to an existing screen.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Add loading, empty, and error states to [SCREEN_OR_FEATURE].

Requirements:
- Loading state: [DESCRIPTION]
- Empty state: [DESCRIPTION]
- Error state: [DESCRIPTION]
- Retry behavior: [DESCRIPTION]
- Offline behavior if relevant: [DESCRIPTION]

Constraints:
- Do not change the happy-path UI unless necessary to integrate states.
- Do not refactor unrelated code.
- Do not change data fetching behavior unless required.
- Do not install libraries.
- Use existing feedback components where possible.
- Keep copy concise and aligned with product tone.

Reference:
- Existing screen: [FILE]
- Screen state inventory: [PASTE_OR_LINK]
- Approved assets: [ASSET_NAMES]

Acceptance criteria:
- Loading state appears while data is unavailable.
- Empty state appears when valid data is empty.
- Error state appears on failure.
- Retry works if specified.
- Happy path still works.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test each state, and risks.
```
