# Image Generation Prompts

This folder contains reusable prompts for generating mobile app visual assets. Use them before screen implementation so AI-coded UI has a clear visual target.

## Recommended Order

1. Generate a style anchor first.
2. Use the style anchor as reference for all later assets.
3. Generate logo and mascot if needed.
4. Generate onboarding hero and screen illustrations.
5. Generate empty, success, and error states.
6. Generate icons, splash screen, and app store screenshots.
7. Record every asset in `asset-inventory-template.md`.

## Consistency Rules

- Do not generate all assets randomly.
- Keep the same palette, proportions, line weight, lighting, and material style.
- Keep characters consistent across poses and states.
- Avoid text inside generated images unless specifically needed.
- Export mobile-friendly images.
- Use transparent backgrounds for illustrations where possible.
- Save assets under `assets/images`.
- Use centralized image imports later, such as `constants/images.ts`.

## Before Accepting An Asset

Check:

- Does it match the style anchor?
- Does it work at mobile size?
- Does it have unwanted text, logos, watermarks, or artifacts?
- Does it work on the intended background?
- Is the file name clear?
- Is the asset recorded in the inventory?

## Prompt Pattern

Each prompt includes:

- App context.
- Visual direction.
- Asset goal.
- Requirements.
- Avoid list.
- Output format.
- Acceptance check.

Use placeholders directly. Replace bracketed values before generating.
