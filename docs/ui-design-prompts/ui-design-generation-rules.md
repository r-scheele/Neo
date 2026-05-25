# UI Design Generation Rules

Use these rules when generating Neo UI design reference images.

## Generation Order

1. Generate the master UI style reference first from `master-ui-design-style-prompt.md`.
2. Save it as `design-assets/ui-screens/master-ui-style-reference.png`.
3. Use the master style reference as an input/reference image for every screen generation.
4. Generate one screen image per prompt in `docs/ui-design-prompts/screens/`.
5. Save every generated UI design image into `design-assets/ui-screens/`.
6. Update `screen-prompt-index.md` after generating each image.

## Consistency Rules

- Use the same Neo palette across every screen.
- Use the same typography hierarchy across every screen.
- Use the same bottom tab navigation pattern across main tabs.
- Use the same button, card, input, status badge, and form styles across every screen.
- Use the same rounded outline icon style where icons appear.
- Use the same 8px card/input/button radius system.
- Use the same border-first card style with subtle warm shadows only where needed.
- Keep the visual density operational and mobile-friendly.
- Do not let each screen look like a different app.

## Screen Composition Rules

- Generate a single full-screen mobile app UI mockup per screen.
- Use portrait mobile aspect ratio around 390x844 or 430x932.
- Use clean app screenshot style.
- Do not include phone frames, browser frames, laptop mockups, device hands, or lifestyle scenes.
- Do not create desktop layouts or compressed desktop dashboards.
- Do not overstuff screens.
- Do not use tiny unreadable text.
- Keep primary actions visible and thumb-friendly.
- Respect safe areas and bottom navigation spacing.

## Text Rendering Rules

- Use clear readable UI labels where possible.
- Avoid tiny paragraphs and dense blocks of body copy.
- Use realistic short text blocks and labels.
- Exact final copy will be implemented in code.
- Prioritize layout accuracy, hierarchy, component structure, and spacing over perfect text rendering.

## Asset Boundary Rules

- Runtime app assets belong in `assets/images/` or `assets/icons/`.
- UI design reference screenshots belong in `design-assets/ui-screens/`.
- UI design reference screenshots are not shipped inside the app.
- Do not invent unrelated mascots, photos, stock imagery, or fake partner logos.
- When an existing runtime illustration is relevant, reserve an appropriate area for it or ask the model for an illustration treatment consistent with Neo's approved style.

## Visual Safety Rules

- Never imply manual bank transfer screenshots are enough to auto-confirm payment.
- Receipt review screens must show deliberate human confirmation.
- Approval screens must make risk, recommendation, and decision actions clear.
- Offline and permission states should disable risky actions.
- Status colors must include labels or icons, not color alone.

## Avoid

- Random gradients.
- Neon AI visuals.
- Robot heads.
- Magic wand or sparkle-heavy AI cues.
- Green-only interfaces.
- Generic crypto or analytics dashboards.
- Cards nested inside cards.
- Decorative bokeh/orb backgrounds.
- Fake browser chrome.
- Laptop or desktop frames.
- Device hands or lifestyle mockups.
- Extra features not in the MVP.

## Acceptance Check

Before accepting each generated screen image, confirm:

- It matches the master style reference.
- It is a single portrait mobile screen with no frame.
- It uses Neo's palette, radii, card style, shadows, typography, and icon style.
- It shows the intended screen purpose and primary action.
- It does not include unrelated features.
- Text is readable enough for layout reference.
- Sensitive payment or AI actions remain human-approved.
- The image file name matches `screen-prompt-index.md`.
