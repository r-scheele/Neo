# UI Design Prompts

This folder contains chat-ready image generation prompts for creating high-fidelity mobile UI reference images for Neo before app screens are coded.

These images are planning artifacts. They should be saved in `design-assets/ui-screens/` and used later as visual references for implementation prompts. They are not runtime app assets and should not be shipped inside the Expo app.

## Workflow

1. Open `docs/ui-design-prompts/master-ui-design-style-prompt.md`.
2. Use it to generate the master UI style reference image.
3. Save the master reference image as `design-assets/ui-screens/master-ui-style-reference.png`.
4. Open each prompt in `docs/ui-design-prompts/screens/`.
5. Send the prompt text in an image-capable chat or paste it into an image generation tool. Each prompt starts with an `IMAGE GENERATION REQUEST` block so it can generate immediately.
6. Generate one UI image per screen using the master style reference as an attached reference image.
7. Save each generated screen image into `design-assets/ui-screens/`.
8. Update `docs/ui-design-prompts/screen-prompt-index.md` from `Not generated` to `Generated` as each image is created.
9. Later, after `AGENTS.md` and the Expo app are ready, attach each generated UI image to the coding assistant when implementing that screen.

## Prompt Pack Contents

- `master-ui-design-style-prompt.md`: reusable style anchor prompt for the whole app UI.
- `ui-design-generation-rules.md`: rules for keeping every generated screen visually consistent.
- `ui-screen-prompt-template.md`: reusable template for future screen prompt creation.
- `screen-prompt-index.md`: generation tracking table for all MVP screen prompts.
- `screens/`: one dedicated prompt file per MVP screen.

## Chat-Ready Usage

Each UI design prompt begins with `IMAGE GENERATION REQUEST`. If you paste the prompt text into this chat, it should be interpreted as a request to generate the image immediately, not as a request to explain the prompt.

For screen prompts, attach or reference `design-assets/ui-screens/master-ui-style-reference.png` when available. If the master reference is not attached, the prompt still includes the Neo visual system.

## Important Asset Boundary

- Runtime app assets such as logos, mascots, icons, empty-state illustrations, splash images, and screen illustrations belong in `assets/images/` or `assets/icons/`.
- UI design reference screenshots belong in `design-assets/ui-screens/`.
- UI design reference screenshots are not imported by the app. They are attached to later implementation prompts so implementation can match the intended screen composition.

## Later AI-Assisted Implementation Flow

When implementing a screen later, attach the generated UI reference image and include:

- `AGENTS.md`
- `docs/ui-style-guide.md`
- `docs/visual-direction.md`
- `docs/ui-design-prompts/screens/[screen-prompt-file].md`
- `design-assets/ui-screens/[screen-image-file].png`
- `assets/images/`
- `constants/images.ts`

Do not start screen implementation from this prompt pack alone. This folder is for visual planning only.
