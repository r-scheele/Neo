# Business Type Selection Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the Setup Checklist exists and the Business Type setup route is present or approved to add under the setup route group.

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
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/business-type-screen.md
- design-assets/ui-screens/business-type.png
- assets/images/icon-product.png
- assets/images/icon-customer.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Business Type selection.

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
- docs/ui-design-prompts/screens/business-type-screen.md
- design-assets/ui-screens/business-type.png

Scope:
- Add or replace only the Business Type setup route.
- Present the business categories shown in the spec/reference.
- Save the selected category only to local/setup state.

Constraints:
- Do not build other setup screens.
- Do not create a workflow builder.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for selected category.
- Use Zustand only if setup progress needs shared state now.
- Use AsyncStorage only if already available and needed.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/business-type.png` exactly.
- Include clear selected and unselected states.
- Make all choices touch-friendly.
- Make sure the screen works on small and large phones.

Validation:
- A user cannot continue without a selected business type if the reference requires selection.
- Selected state is visually clear and accessible.
- Navigation back to setup still works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Business Type selection works end to end.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Business Type from setup.
- [ ] Compare the screen to `design-assets/ui-screens/business-type.png`.
- [ ] Select each visible business type.
- [ ] Try continuing with and without a selection.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Business Profile still works.
- [ ] App startup still works.

## Suggested commit message

add business type selection

