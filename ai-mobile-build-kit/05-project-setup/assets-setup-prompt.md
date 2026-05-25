# Assets Setup Prompt

Copy, fill, and send this to a coding agent after approved assets exist.

```md
Anchor:
Read AGENTS.md first if it exists and follow it strictly.

Task:
Set up the app asset structure and centralized image imports.

Constraints:
- Do not modify unrelated screens.
- Do not generate new assets.
- Do not rename approved files unless necessary and explained.
- Do not install libraries.
- Do not add visual features beyond verifying one safe import if requested.

Reference:
- Asset inventory: [PASTE_OR_LINK]
- Approved image files: [LIST_FILES]
- Naming guide: ai-mobile-build-kit/03-image-generation-prompts/asset-naming-guide.md

Acceptance criteria:
- `assets/images` exists.
- Approved assets are placed or referenced there.
- `constants/images.ts` exports centralized image imports.
- Existing screens are unchanged unless a minimal verification import is requested.
- Explain files changed and how to test image rendering.
```

## Done Looks Like

Assets are ready when future screen prompts can reference `constants/images.ts` instead of importing image files ad hoc.
