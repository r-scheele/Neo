# Welcome Screen Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this first after the app shell, `AGENTS.md`, design docs, UI reference image, runtime assets, and `constants/images.ts` exist.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/welcome-screen.md
- design-assets/ui-screens/welcome.png
- assets/images/logo-mark-neo.png
- assets/images/onboarding-hero-neo-operating-system.png
- constants/images.ts
- app/(auth)/welcome.tsx
- app/(auth)/sign-in.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Welcome screen.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/welcome-screen.md
- design-assets/ui-screens/welcome.png

Scope:
- Replace only the Welcome route placeholder with the production Welcome screen.
- Use approved runtime assets through `constants/images.ts`.
- Wire the primary action to the existing Register / Sign In route.

Constraints:
- Do not build onboarding setup screens.
- Do not build auth logic.
- Do not modify unrelated screens.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not change existing navigation unless required for this screen.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.
- Preserve the visual direction exactly.
- Keep the implementation simple and maintainable.

State/persistence rules:
- Use local state only if needed for button press or small UI behavior.
- Do not use Zustand.
- Do not use AsyncStorage.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/welcome.png` exactly.
- Match layout, spacing, typography hierarchy, colors, border radius, shadows, component proportions, and navigation placement.
- Make sure the screen works on small and large phones.

Validation:
- The Welcome screen renders without placeholder copy.
- The primary action navigates to Register / Sign In.
- Runtime assets come from `constants/images.ts`.
- Navigation still works.
- Existing app startup still works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Welcome screen works end to end.
- The diff is small and reviewable.
- You provide:
  1. Files changed
  2. What changed
  3. How to test
  4. Any risks
  5. Suggested commit message

## Manual test checklist

- [ ] Launch the app.
- [ ] Confirm the Welcome screen appears for the auth route.
- [ ] Compare the screen to `design-assets/ui-screens/welcome.png`.
- [ ] Tap the primary action and confirm it reaches Register / Sign In.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] App startup still works.
- [ ] Existing route placeholders still load.
- [ ] No runtime image import bypasses `constants/images.ts`.

## Suggested commit message

add welcome screen

