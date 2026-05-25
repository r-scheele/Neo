# Main Tab Navigation Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the auth/setup route groups exist. It can run before the full tab screen content exists because it only aligns navigation structure.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/architecture-plan.md
- docs/folder-structure.md
- docs/asset-inventory.md
- assets/images/icon-today.png
- assets/images/icon-inbox.png
- assets/images/icon-approvals.png
- assets/images/icon-follow-ups.png
- assets/images/icon-settings.png
- constants/images.ts
- app/(tabs)/_layout.tsx
- app/(tabs)/today.tsx
- app/(tabs)/inbox.tsx
- app/(tabs)/approvals.tsx
- app/(tabs)/follow-ups.tsx
- app/(tabs)/settings.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the main tab navigation structure.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/architecture-plan.md
- docs/folder-structure.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Scope:
- Align the main tabs to Today, Inbox, Approvals, Follow-ups, and Settings.
- Match navigation placement and active/inactive visual rules from the style guide.
- Keep placeholder content inside tab screens if feature screens are not implemented yet.

Constraints:
- Do not build tab screen content.
- Do not create extra tabs.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use no global state unless already established for navigation.
- Do not use AsyncStorage.
- Do not add backend/database logic.

UI rules:
- Follow `docs/visual-direction.md` and `docs/ui-style-guide.md`.
- Active tab uses deep forest green.
- Inactive tabs use warm muted gray.
- Minimum touch target is 44px.
- Make sure tabs work on small and large phones.

Validation:
- The five main tabs are present in the correct order.
- Active/inactive tab states are clear.
- Existing route navigation still works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Main tab navigation works end to end.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open the app after setup/auth entry path.
- [ ] Tap Today, Inbox, Approvals, Follow-ups, and Settings.
- [ ] Confirm active tab state changes.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Auth routes still load.
- [ ] Setup routes still load.
- [ ] Detail route placeholders still load.

## Suggested commit message

add main tab navigation

