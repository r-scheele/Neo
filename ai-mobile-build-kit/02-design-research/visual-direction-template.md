# Visual Direction Template

Use this as the design source for `AGENTS.md`, image generation prompts, and UI screen prompts.

## App Context

- App name: `[APP_NAME]`
- Target user: `[TARGET_USER]`
- Core outcome: `[CORE_OUTCOME]`
- Emotional promise: `[HOW_THE_APP_SHOULD_FEEL]`

## Mood

Choose 3 to 5 words:

- `[MOOD_1]`
- `[MOOD_2]`
- `[MOOD_3]`

Example: calm, practical, optimistic, focused.

## Color Palette

- Primary: `[HEX_OR_DESCRIPTION]`
- Secondary: `[HEX_OR_DESCRIPTION]`
- Accent: `[HEX_OR_DESCRIPTION]`
- Background: `[HEX_OR_DESCRIPTION]`
- Surface: `[HEX_OR_DESCRIPTION]`
- Text primary: `[HEX_OR_DESCRIPTION]`
- Text muted: `[HEX_OR_DESCRIPTION]`
- Success: `[HEX_OR_DESCRIPTION]`
- Warning: `[HEX_OR_DESCRIPTION]`
- Error: `[HEX_OR_DESCRIPTION]`

Rules:

- Define contrast for readable text.
- Avoid one-note palettes where everything is the same hue.
- Keep semantic colors consistent.

## Typography Feel

- Preferred feel: `[SYSTEM / ROUNDED / EDITORIAL / COMPACT / TECHNICAL]`
- Heading behavior: `[BOLD / FRIENDLY / RESTRAINED]`
- Body behavior: `[READABLE / DENSE / AIRY]`
- Numbers and metrics: `[TABULAR / LARGE / COMPACT]`

## Layout And Spacing

- Screen density: `[LOW / MEDIUM / HIGH]`
- Default padding: `[e.g. 16px / 20px / token name]`
- Card radius: `[e.g. 8px]`
- Button height: `[e.g. 48px]`
- Touch target minimum: `44px`
- Safe area behavior: `[DESCRIBE]`

## Component Style

- Buttons: `[SHAPE, FILL, STATES]`
- Cards: `[BORDER, SHADOW, BACKGROUND]`
- Inputs: `[BORDER, FOCUS, ERROR]`
- Lists: `[DIVIDERS, SPACING, ROW_HEIGHT]`
- Navigation: `[TABS, HEADER, MODALS]`

## Icon Style

- Style: `[OUTLINE / FILLED / DUOTONE]`
- Stroke: `[THIN / MEDIUM / BOLD]`
- Corners: `[SHARP / ROUNDED]`
- Usage: `[BUTTONS / EMPTY STATES / CATEGORIES]`

## Illustration Style

- Style: `[FLAT / 3D / LINE / COLLAGE / PHOTOGRAPHIC / MASCOT]`
- Proportions: `[REALISTIC / CHUNKY / SLIM / GEOMETRIC]`
- Lighting: `[FLAT / SOFT / HIGH_CONTRAST]`
- Background: `[TRANSPARENT / SIMPLE_SCENE / GRADIENT_ALLOWED?]`

## Motion

- Motion personality: `[MINIMAL / SNAPPY / CALM / PLAYFUL]`
- Use motion for: `[TRANSITIONS / SUCCESS / LOADING / MICROINTERACTIONS]`
- Avoid motion for: `[AREAS]`

## What To Avoid

- `[STYLE_TO_AVOID_1]`
- `[STYLE_TO_AVOID_2]`
- `[STYLE_TO_AVOID_3]`

## Ready For AGENTS.md

Paste this summary into `AGENTS.md`:

```md
Visual direction:
[APP_NAME] should feel [MOOD]. Use [PALETTE] with [TYPOGRAPHY_FEEL], [CARD_STYLE], [ICON_STYLE], and [ILLUSTRATION_STYLE]. Avoid [WHAT_TO_AVOID].
```

## Done Looks Like

Visual direction is done when a coding model can implement a new screen and make it feel like it belongs to the same app.
