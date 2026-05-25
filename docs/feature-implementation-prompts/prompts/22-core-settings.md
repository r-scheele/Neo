# Core Settings Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after setup screens and main tab navigation exist.

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
- docs/state-management-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/settings-screen.md
- design-assets/ui-screens/settings.png
- assets/images/icon-settings.png
- constants/images.ts
- app/(tabs)/settings.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Core Settings.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/auth-plan.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/settings-screen.md
- design-assets/ui-screens/settings.png

Scope:
- Replace only the Settings tab placeholder.
- Show business, AI, payment, delivery, role, and safety settings sections shown in the reference.
- Use local/mock settings data only.

Constraints:
- Do not implement billing, admin console, advanced analytics, or marketing settings.
- Do not implement real auth provider settings unless already available.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for toggles and controls.
- Use Zustand only if settings must be shared with setup screens now.
- Use AsyncStorage only if safe settings persistence is already approved and available.
- Do not store secrets or sensitive payment proof.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/settings.png` exactly.
- Long settings content should scroll cleanly.
- Sensitive settings should be clear and deliberate.
- Make sure the screen works on small and large phones.

Validation:
- Settings sections render in the expected order.
- Local toggles/controls work.
- Restricted/sensitive settings are not misleading.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Core Settings works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Settings tab.
- [ ] Compare the screen to `design-assets/ui-screens/settings.png`.
- [ ] Test visible toggles and controls.
- [ ] Scroll through long content.
- [ ] Confirm no secrets or real provider settings are added.

## Regression checklist

- [ ] Main tabs still work.
- [ ] Setup screens still work.
- [ ] App startup still works.

## Suggested commit message

add core settings

