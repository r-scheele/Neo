# UI Style Guide Template

Use this as the bridge between visual direction and implementation. Add the final version to `AGENTS.md` or link it from there.

## Design Tokens

### Colors

| Token | Value | Usage |
| --- | --- | --- |
| `color.primary` | `[HEX]` | Primary actions |
| `color.background` | `[HEX]` | App background |
| `color.surface` | `[HEX]` | Cards and panels |
| `color.text` | `[HEX]` | Main text |
| `color.textMuted` | `[HEX]` | Secondary text |
| `color.success` | `[HEX]` | Success state |
| `color.warning` | `[HEX]` | Warning state |
| `color.error` | `[HEX]` | Error state |

### Spacing

| Token | Value | Usage |
| --- | --- | --- |
| `space.1` | `[VALUE]` | Tight gaps |
| `space.2` | `[VALUE]` | Small gaps |
| `space.3` | `[VALUE]` | Row gaps |
| `space.4` | `[VALUE]` | Section gaps |
| `space.screen` | `[VALUE]` | Screen padding |

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| `radius.sm` | `[VALUE]` | Inputs, chips |
| `radius.md` | `[VALUE]` | Cards |
| `radius.full` | `999px` | Pills, avatars |

## Typography

| Style | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| `title` | `[VALUE]` | `[VALUE]` | `[VALUE]` | Screen titles |
| `section` | `[VALUE]` | `[VALUE]` | `[VALUE]` | Section headings |
| `body` | `[VALUE]` | `[VALUE]` | `[VALUE]` | Default text |
| `caption` | `[VALUE]` | `[VALUE]` | `[VALUE]` | Supporting text |

## Components

### Buttons

- Primary: `[DESCRIPTION]`
- Secondary: `[DESCRIPTION]`
- Destructive: `[DESCRIPTION]`
- Disabled: `[DESCRIPTION]`
- Loading: `[DESCRIPTION]`

### Cards

- Background: `[DESCRIPTION]`
- Border: `[DESCRIPTION]`
- Radius: `[DESCRIPTION]`
- Shadow: `[DESCRIPTION]`
- Padding: `[DESCRIPTION]`

### Inputs

- Default: `[DESCRIPTION]`
- Focus: `[DESCRIPTION]`
- Error: `[DESCRIPTION]`
- Disabled: `[DESCRIPTION]`
- Helper text: `[DESCRIPTION]`

### Lists

- Row height: `[VALUE]`
- Dividers: `[YES/NO/DESCRIPTION]`
- Swipe actions: `[YES/NO/DESCRIPTION]`
- Empty state: `[DESCRIPTION]`

## Accessibility Rules

- Text must be readable at larger font sizes.
- Touch targets should be at least 44px.
- Interactive icons need accessible labels.
- Do not rely on color alone for status.
- Error messages must be specific and actionable.

## Done Looks Like

The style guide is ready when a new screen can be implemented without inventing new colors, radii, typography, or card styles.
