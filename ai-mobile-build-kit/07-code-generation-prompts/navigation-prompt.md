# Navigation Prompt

Use this for Expo Router route changes.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement navigation for [FLOW_OR_SCREEN].

Requirements:
- Add or update route(s): [ROUTES]
- Entry point: [WHERE_USER_STARTS]
- Destination: [WHERE_USER_ENDS]
- Route params: [PARAMS_AND_TYPES]
- Auth requirement: [PUBLIC / PROTECTED / AUTH_ONLY]

Constraints:
- Do not redesign screens.
- Do not implement unrelated feature logic.
- Do not rename existing routes unless requested.
- Do not change auth redirects unless required and explained.
- Do not install libraries.
- Keep route params typed.

Reference:
- Screen map: [PASTE_OR_LINK]
- Existing route files: [FILES]
- Expo Router docs: [PASTE_DOCS_OR_LINK]

Acceptance criteria:
- User can navigate through the requested flow.
- Back behavior is correct.
- Route params are typed and validated where relevant.
- Protected routes behave correctly if auth is involved.
- Existing navigation still works.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
