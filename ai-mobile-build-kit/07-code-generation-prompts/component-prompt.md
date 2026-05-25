# Component Prompt

Use this to build a reusable component.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create or update the [COMPONENT_NAME] component.

Component purpose:
[WHAT_THIS_COMPONENT_DOES]

Requirements:
- Props: [PROP_LIST]
- Variants: [VARIANTS]
- States: [DEFAULT / PRESSED / DISABLED / LOADING / ERROR]
- Accessibility behavior: [LABELS / ROLES / HINTS]
- Example usage: [WHERE_IT_WILL_BE_USED]

Constraints:
- Do not change screens except for one minimal usage example if requested.
- Do not create a component abstraction unless it is needed by the current feature.
- Do not install libraries.
- Do not change existing component APIs unless requested.
- Keep styling aligned with AGENTS.md.
- Avoid `any`.

Reference:
- Existing components: [FILES]
- Design reference: [IMAGE_OR_LINK]
- Style guide: [PASTE_OR_LINK]

Acceptance criteria:
- Component has typed props.
- Component supports required states.
- Component is accessible.
- Component does not own feature-specific business logic.
- Existing usages still work if modified.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
