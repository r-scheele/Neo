# Setup Checklist Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the auth route and setup route group exist. The Welcome and Register / Sign In screens should already be implemented or intentionally deferred.

## Codex prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/screen-state-inventory.md
- docs/state-management-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/setup-checklist-screen.md
- design-assets/ui-screens/setup-checklist.png
- assets/images/illustration-setup-checklist.png
- constants/images.ts
- app/(setup)/index.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Setup Checklist.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/screen-state-inventory.md
- docs/state-management-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/setup-checklist-screen.md
- design-assets/ui-screens/setup-checklist.png

Scope:
- Replace only the setup checklist placeholder.
- Show the required setup tasks from the screen map.
- Link task rows to existing setup routes only if those routes exist; otherwise keep disabled states with clear labels.

Constraints:
- Do not build the individual setup task screens.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not change existing navigation unless required for this feature.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.
- Preserve the visual direction exactly.

State/persistence rules:
- Use local state or existing app patterns for checklist display.
- Use Zustand only if a setup store already exists or this checklist needs shared state immediately.
- Use AsyncStorage only if setup persistence is already installed and approved in the project.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/setup-checklist.png` exactly.
- Include loading, empty, and error states where relevant.
- Make sure the screen works on small and large phones.

Validation:
- Setup tasks render in the expected order.
- Task completion/progress UI is visible.
- Existing setup navigation still works.
- Runtime assets come from `constants/images.ts`.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Setup Checklist works end to end within current route availability.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Navigate to the setup route.
- [ ] Compare the checklist to `design-assets/ui-screens/setup-checklist.png`.
- [ ] Tap available setup tasks.
- [ ] Confirm disabled/missing task destinations are clear and not broken.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Auth routes still load.
- [ ] Welcome and sign-in screens still navigate correctly.
- [ ] App startup still works.

## Suggested commit message

add setup checklist

