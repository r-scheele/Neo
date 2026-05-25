# Asset Naming Guide

Use predictable names so AI and humans can find assets without guessing.

## Folder

Save generated app images under:

```text
assets/images/
```

Recommended future import file:

```text
constants/images.ts
```

## Naming Rules

- Use lowercase kebab-case.
- Include purpose first.
- Include screen or state when relevant.
- Avoid vague names like `image1.png` or `final-final.png`.
- Do not include spaces.
- Do not include date stamps unless archiving.

## Examples

| Asset Type | Good Name | Bad Name |
| --- | --- | --- |
| Logo | `logo-mark-primary.png` | `logo new.png` |
| Mascot | `mascot-wave.png` | `character.png` |
| Empty state | `empty-habits.png` | `empty.png` |
| Error state | `error-network.png` | `oops.png` |
| Success state | `success-checkin.png` | `done-final.png` |
| Onboarding | `onboarding-hero-focus.png` | `hero.png` |
| Splash | `splash-mark.png` | `startup.png` |

## Import Pattern

Use centralized imports later:

```ts
export const images = {
  logoMark: require("../assets/images/logo-mark-primary.png"),
  emptyHabits: require("../assets/images/empty-habits.png"),
  successCheckin: require("../assets/images/success-checkin.png"),
} as const;
```

## Done Looks Like

Assets are named well when a coding agent can use them from a prompt without asking what they are.
