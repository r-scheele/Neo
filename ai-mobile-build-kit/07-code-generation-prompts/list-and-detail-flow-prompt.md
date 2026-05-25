# List And Detail Flow Prompt

Use this for a list screen connected to a detail screen.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the [ITEM_NAME] list and detail flow.

Requirements:
- List route: [ROUTE]
- Detail route: [ROUTE]
- Item fields shown in list: [FIELDS]
- Item fields shown in detail: [FIELDS]
- Empty state: [DESCRIPTION]
- Missing item behavior: [DESCRIPTION]
- Primary actions: [ACTIONS]

Constraints:
- Do not add create/edit/delete unless requested.
- Do not change unrelated navigation.
- Do not install libraries.
- Keep route params typed.
- Use existing list/card components where appropriate.
- Handle long content.
- Avoid `any`.

Reference:
- Screen map: [PASTE_OR_LINK]
- Data model: [PASTE_OR_LINK]
- Design reference: [IMAGE_OR_LINK]
- Existing files: [FILES]

Acceptance criteria:
- List displays items correctly.
- Empty list state is handled.
- Tapping an item opens detail.
- Detail handles missing or invalid IDs.
- Back navigation works.
- Long content does not break layout.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
