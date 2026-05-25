# Today Command Center Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after main tab navigation exists and setup feature routes are in place or intentionally deferred.

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
- docs/ui-design-prompts/screens/today-command-center-screen.md
- design-assets/ui-screens/today-command-center.png
- assets/images/illustration-today-command-center.png
- constants/images.ts
- app/(tabs)/today.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Today Command Center Home screen.

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
- docs/ui-design-prompts/screens/today-command-center-screen.md
- design-assets/ui-screens/today-command-center.png

Scope:
- Replace only the Today tab placeholder.
- Show urgent operational work: receipts, unread chats, unpaid orders, due follow-ups, and AI recommendations as shown.
- Use typed local/mock data only.

Constraints:
- Do not build Inbox, Approval, Receipt, Order, or Follow-up screens.
- Do not add backend/database logic.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local typed mock data unless the app already has an operations store.
- Use Zustand only if counts must be shared with tabs now.
- Do not use AsyncStorage unless already approved for safe preferences.

UI rules:
- Match `design-assets/ui-screens/today-command-center.png` exactly.
- Include loading, empty, and error states where relevant.
- Keep queue cards scannable and operationally dense.
- Make sure the screen works on small and large phones.

Validation:
- Today screen renders the expected sections and metrics.
- Tapping visible queue items navigates only to existing routes or safe placeholders.
- Empty state works if mock data is empty.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Today Command Center works end to end.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open the Today tab.
- [ ] Compare the screen to `design-assets/ui-screens/today-command-center.png`.
- [ ] Tap each visible queue/action item.
- [ ] Test empty/mock no-work state if available.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Main tabs still work.
- [ ] Setup routes still load.
- [ ] Existing app startup still works.

## Suggested commit message

add home dashboard

