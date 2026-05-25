# Business Profile Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the Setup Checklist exists and the Business Profile route is present or approved to add under the setup route group.

## Codex prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/state-management-plan.md
- docs/persistence-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/business-profile-screen.md
- design-assets/ui-screens/business-profile.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Business Profile setup screen.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/state-management-plan.md
- docs/persistence-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/business-profile-screen.md
- design-assets/ui-screens/business-profile.png

Scope:
- Add or replace only the Business Profile setup route.
- Capture the fields shown in the UI reference, such as business name, category/location/phone where shown.
- Validate required fields and provide a safe next action back to setup progress.

Constraints:
- Do not build other setup screens.
- Do not add real backend saving.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for form fields.
- Use Zustand only if setup state must be shared with the checklist now.
- Use AsyncStorage only if already available and needed for draft persistence.
- Do not persist sensitive data beyond the approved local draft shape.

UI rules:
- Match `design-assets/ui-screens/business-profile.png` exactly.
- Include inline validation and disabled submit behavior where relevant.
- Make sure the screen works on small and large phones.

Validation:
- Required field validation works.
- User input is preserved on recoverable validation errors.
- Save/continue updates only the local setup flow or placeholder state.
- Navigation still works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Business Profile works end to end within local setup scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Setup Checklist.
- [ ] Open Business Profile.
- [ ] Compare the screen to `design-assets/ui-screens/business-profile.png`.
- [ ] Try submitting with missing required fields.
- [ ] Fill valid values and continue.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Auth routes still load.
- [ ] App startup still works.

## Suggested commit message

add business profile setup

