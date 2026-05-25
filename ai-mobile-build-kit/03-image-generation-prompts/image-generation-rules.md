# Image Generation Rules

Use these rules for every generated mobile app asset.

## Asset Sizes

Recommended starting sizes:

- Logo mark: `1024x1024`, transparent background.
- App icon source: `1024x1024`, no transparency for final app icon.
- Mascot or character: `2048x2048`, transparent background if possible.
- Onboarding hero: `2048x1536` or `1536x2048` depending on layout.
- Empty state: `1600x1200`, transparent background if possible.
- Success/error state: `1600x1200`, transparent background if possible.
- Splash screen mark: `2048x2048`, centered composition.
- App store screenshots: platform-specific final exports, usually composed from real screen captures plus generated background if appropriate.

## Naming Convention

Use lowercase kebab-case:

- `logo-mark-primary.png`
- `mascot-wave.png`
- `onboarding-hero-focus.png`
- `empty-habits.png`
- `success-checkin.png`
- `error-network.png`
- `icon-category-health.png`
- `splash-mark.png`

## Prompting For Consistency

Always include:

- App name and target user.
- Core outcome.
- Style anchor reference.
- Palette.
- Illustration style.
- Line weight or material style.
- Lighting.
- Background requirement.
- What to avoid.

## Using Reference Images

When the tool supports reference images:

- Use the style anchor as the first reference.
- Use the approved mascot as a character reference.
- Use screenshots only as layout references, not as copied visual content.
- Tell the model which aspects to preserve and which to ignore.

Example:

```md
Use the attached style anchor only for palette, lighting, line weight, and overall mood. Do not copy the exact composition.
```

## Avoiding Inconsistent Characters

For mascots:

- Define species or object clearly.
- Define body proportions.
- Define face style.
- Define clothing or accessories.
- Define allowed expressions.
- Generate a neutral pose first.
- Use the neutral pose as reference for new states.

## Creating Multiple Mascot States

Generate states from the same approved mascot:

- Welcome.
- Thinking.
- Success.
- Error.
- Empty state.
- Offline.
- Celebration.

Each prompt should say:

```md
Keep the exact same mascot identity, proportions, color palette, face style, and accessory details as the reference image. Change only the pose and expression.
```

## Acceptance Checklist

- [ ] No unreadable or accidental text.
- [ ] No watermarks.
- [ ] No distorted hands, faces, or UI objects.
- [ ] Clear silhouette at small size.
- [ ] Works on the intended background.
- [ ] Matches style anchor.
- [ ] Exported at adequate resolution.
- [ ] Saved in `assets/images`.
- [ ] Recorded in asset inventory.
