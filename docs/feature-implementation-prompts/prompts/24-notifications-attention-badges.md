# Notifications And Attention Badges Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Today Command Center and main tab navigation exist.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/state-management-plan.md
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- assets/images/icon-warning.png
- constants/images.ts
- app/(tabs)/_layout.tsx
- app/(tabs)/today.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only in-app attention badges and notification indicators.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/state-management-plan.md
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Scope:
- Add small in-app badge/count indicators for urgent Today, Inbox, Approvals, and Follow-ups counts if those screens/data shapes exist.
- Keep indicators local/mock and visually consistent with the tab/navigation design.
- Add no push notification infrastructure.

Constraints:
- Do not implement push notifications.
- Do not install notification libraries.
- Do not add backend/database logic.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use existing local/mock operations data.
- Use Zustand only if counts must be shared across tabs now.
- Do not use AsyncStorage for notification counts.
- Do not track private message content.

UI rules:
- Follow `docs/visual-direction.md` and `docs/ui-style-guide.md`.
- Badges must include accessible labels and not rely on color alone.
- Keep tab touch targets at least 44px.
- Make sure badges work on small and large phones.

Validation:
- Badge counts appear only where data exists.
- Counts update from the local/mock source.
- Tabs remain usable and visually stable.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- In-app attention badges work end to end.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open main tabs.
- [ ] Confirm badges appear for mock urgent counts.
- [ ] Confirm tabs remain tappable.
- [ ] Check accessibility labels if available.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Main tab navigation still works.
- [ ] Today still works.
- [ ] Inbox, Approvals, and Follow-ups still load.

## Suggested commit message

add attention badges

