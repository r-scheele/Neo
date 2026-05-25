# Delivery Zones Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the Setup Checklist and Business Profile setup screen exist.

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
- docs/ui-design-prompts/screens/delivery-zones-screen.md
- design-assets/ui-screens/delivery-zones.png
- assets/images/icon-delivery.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Delivery Zones and fees.

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
- docs/ui-design-prompts/screens/delivery-zones-screen.md
- design-assets/ui-screens/delivery-zones.png

Scope:
- Add or replace only the Delivery Zones setup route.
- Implement the add/list/edit UI shown in the reference.
- Keep delivery zones local/mock until backend architecture exists.

Constraints:
- Do not build order detail or logistics workflows.
- Do not add maps, location services, or delivery provider integrations.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for form fields and visible list edits.
- Use Zustand only if setup progress or order flow needs this data now.
- Use AsyncStorage only if already available and approved for safe draft persistence.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/delivery-zones.png` exactly.
- Validate zone name and fee fields.
- Use tabular numbers for fees.
- Make sure the screen works on small and large phones.

Validation:
- A zone can be added or edited locally.
- Invalid fee values show inline errors.
- Long location names wrap or truncate cleanly.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Delivery Zones works end to end in local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Delivery Zones from setup.
- [ ] Compare the screen to `design-assets/ui-screens/delivery-zones.png`.
- [ ] Add a valid zone and fee.
- [ ] Try invalid fee input.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Payment Rules still work.
- [ ] App startup still works.

## Suggested commit message

add delivery zones

