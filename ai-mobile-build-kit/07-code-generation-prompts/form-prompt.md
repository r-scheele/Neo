# Form Prompt

Use this for one form or modal form.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the [FORM_NAME] form.

Requirements:
- Fields: [FIELD_LIST_WITH_TYPES]
- Required fields: [FIELDS]
- Validation rules: [RULES]
- Submit action: [ACTION]
- Success behavior: [BEHAVIOR]
- Error behavior: [BEHAVIOR]
- Initial values: [VALUES]

Constraints:
- Keep form state local unless shared state is explicitly required.
- Do not add a form library without approval.
- Do not change unrelated screens.
- Do not add backend calls unless requested.
- Prevent duplicate submissions.
- Preserve input on recoverable errors.
- Avoid `any`.

Reference:
- Design reference: [IMAGE_OR_LINK]
- Existing input/button components: [FILES]
- Data model: [PASTE_OR_LINK]

Acceptance criteria:
- Required fields validate.
- Errors appear near relevant fields.
- Submit disabled or guarded during submission.
- Success behavior works.
- Error behavior works.
- Keyboard and small-screen layout are usable.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test valid and invalid submissions, and risks.
```
