# Register / Sign In Screen Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the Welcome screen is implemented and the auth route placeholder exists. This prompt is for the screen UI and safe local route behavior only unless Clerk has already been installed and configured.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/auth-plan.md
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/register-sign-in-screen.md
- design-assets/ui-screens/register-sign-in.png
- assets/images/logo-mark-neo.png
- constants/images.ts
- app/(auth)/sign-in.tsx
- app/(setup)/index.tsx
- package.json

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Register / Sign In screen.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/auth-plan.md
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/register-sign-in-screen.md
- design-assets/ui-screens/register-sign-in.png

Scope:
- Replace only the Register / Sign In route placeholder.
- Build the screen UI shown in the reference.
- If Clerk is not already installed/configured, do not install it and do not fake production auth; provide a clearly local placeholder continue action to the setup route if the existing app already uses placeholder navigation.

Constraints:
- Do not build setup screens.
- Do not install Clerk or any new library.
- Do not create real auth secrets or `.env` files.
- Do not modify unrelated screens.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.
- Preserve the visual direction exactly.
- Keep the implementation simple and maintainable.

State/persistence rules:
- Use local state for form fields and inline validation.
- Do not use Zustand.
- Do not use AsyncStorage.
- Do not manually persist auth tokens.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/register-sign-in.png` exactly.
- Include clear validation for required input if the reference includes input.
- Make sure the screen works on small and large phones.

Validation:
- Register / Sign In renders without placeholder copy.
- Required field validation works if input exists.
- The safe continue path reaches the setup route or clearly reports missing Clerk setup.
- Navigation still works.
- Existing app startup still works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Register / Sign In screen works within the available auth setup.
- The diff is small and reviewable.
- You provide:
  1. Files changed
  2. What changed
  3. How to test
  4. Any risks
  5. Suggested commit message

## Manual test checklist

- [ ] Open Welcome and navigate to Register / Sign In.
- [ ] Compare the screen to `design-assets/ui-screens/register-sign-in.png`.
- [ ] Test empty required input states if present.
- [ ] Test the continue action.
- [ ] Confirm no real secret or auth token is stored.

## Regression checklist

- [ ] Welcome screen still works.
- [ ] Setup route still loads.
- [ ] App startup still works.

## Suggested commit message

add sign in screen

