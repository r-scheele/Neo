# UI Screen Prompt

Use this to implement one mobile screen.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the [SCREEN_NAME] screen UI.

Screen purpose:
[WHAT_THE_SCREEN_HELPS_THE_USER_DO]

Requirements:
- Route: [ROUTE]
- Primary action: [PRIMARY_ACTION]
- Secondary actions: [SECONDARY_ACTIONS]
- Screen states: [LOADING / EMPTY / ERROR / SUCCESS / OFFLINE / PERMISSION_DENIED]
- Use these existing components if appropriate: [COMPONENTS]

Constraints:
- Implement this screen only.
- Do not change navigation structure unless explicitly requested.
- Do not add persistence, API calls, or auth unless requested.
- Do not install new libraries.
- Do not refactor unrelated components.
- Match the visual direction in AGENTS.md.
- Use approved assets only.
- Keep text readable on small screens and long content.

Reference:
- Design reference: [IMAGE_OR_LINK]
- Screen map: [PASTE_OR_LINK]
- Style guide: [PASTE_OR_LINK]
- Existing files: [FILES]

Acceptance criteria:
- Screen matches the approved visual direction.
- Primary action is visible and accessible.
- Required states are implemented or clearly stubbed with safe mock data.
- Layout works on small and large mobile screens.
- No text overlap or clipped buttons.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
