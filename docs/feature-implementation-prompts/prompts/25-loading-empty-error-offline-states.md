# Loading Empty Error Offline States Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the core screens are implemented: Setup Checklist, Today, Inbox, Conversation Detail, Approvals, Receipt Review, Follow-ups, Customer Profile, and Settings.

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
- docs/asset-inventory.md
- assets/images/empty-inbox.png
- assets/images/empty-approvals.png
- assets/images/empty-follow-ups.png
- assets/images/empty-products.png
- assets/images/empty-receipts.png
- assets/images/error-offline.png
- assets/images/error-permission-denied.png
- assets/images/error-receipt-unreadable.png
- constants/images.ts

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only loading, empty, error, offline, and permission state coverage for existing MVP screens.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Scope:
- Add or refine reusable feedback components only if reuse is real across existing screens.
- Add missing state handling to existing implemented screens.
- Keep behavior local/mock; do not add new integrations.

Constraints:
- Do not build new feature screens.
- Do not redesign completed screens beyond state coverage.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for simulated loading/error/empty/offline states where needed.
- Use Zustand only if connectivity state is shared now.
- Do not use AsyncStorage unless safe offline cache behavior already exists.
- Disable risky actions while offline.

UI rules:
- Follow `docs/screen-state-inventory.md`.
- Preserve layout height during loading where practical.
- Empty states should offer one clear next action.
- Error states should be plain-language with retry where useful.
- Offline states must disable risky actions.

Validation:
- Existing MVP screens have appropriate loading, empty, error, offline, and permission states where relevant.
- Feedback components use runtime assets through `constants/images.ts`.
- No state implies payment auto-confirmation or autonomous AI decisions.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- State coverage works across existing MVP screens.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Test loading state on each implemented core screen.
- [ ] Test empty state on list/queue screens.
- [ ] Test error state with retry where available.
- [ ] Test offline state disables risky actions.
- [ ] Test permission state for sensitive actions.

## Regression checklist

- [ ] Main tabs still work.
- [ ] Setup flow still works.
- [ ] Conversation, order, receipt, follow-up, customer, and settings routes still load.

## Suggested commit message

add screen states
