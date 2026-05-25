# Design Assets

This folder stores planning-only visual references for Neo.

## UI Screen References

Generated UI design reference images should be saved in `design-assets/ui-screens/`.

These images are used later as visual references for implementation prompts. They are not runtime app assets, are not imported by the app, and should not be shipped inside the Expo bundle.

## Runtime Asset Boundary

- Runtime images, illustrations, logos, splash artwork, and app icon sources belong in `assets/images/`.
- Runtime SVG icon sources belong in `assets/icons/`.
- UI design reference screenshots belong here in `design-assets/ui-screens/`.

## Naming

Use lowercase kebab-case names that match `docs/ui-design-prompts/screen-prompt-index.md`, such as:

- `master-ui-style-reference.png`
- `today-command-center.png`
- `conversation-detail.png`
- `receipt-review.png`
