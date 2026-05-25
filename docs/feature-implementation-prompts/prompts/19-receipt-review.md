# Receipt Review Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Order Detail and AI Approval Queue are implemented or their safe route/data shape exists.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/screen-state-inventory.md
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/receipt-review-screen.md
- design-assets/ui-screens/receipt-review.png
- assets/images/illustration-receipt-review.png
- assets/images/error-receipt-unreadable.png
- assets/images/success-payment-verified.png
- constants/images.ts
- app/receipt/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Receipt Review.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/screen-state-inventory.md
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/receipt-review-screen.md
- design-assets/ui-screens/receipt-review.png

Scope:
- Replace only the Receipt Review placeholder.
- Show receipt preview, extracted rows, confidence/risk, warning copy, and decision buttons shown in the reference.
- Use typed local/mock receipt data only.

Constraints:
- Do not implement OCR, extraction, bank lookup, or payment verification.
- Do not auto-confirm manual transfer receipts from screenshots.
- Do not store receipt images or payment proof in AsyncStorage.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use route params for receipt identity.
- Use local state for decision confirmation UI.
- Use Zustand only if receipt decision state is shared with Order Detail now.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/receipt-review.png` exactly.
- Warning copy must be visible before confirmation.
- Confirm, reject, ask customer, and escalate actions must be visually distinct.
- Include unreadable/error state where relevant.
- Make sure the screen works on small and large phones.

Validation:
- Receipt review renders from typed mock data.
- Confirm/reject/ask/escalate produce local-only feedback.
- No automatic payment confirmation language appears.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Receipt Review works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open a receipt review route.
- [ ] Compare the screen to `design-assets/ui-screens/receipt-review.png`.
- [ ] Test confirm, reject, ask customer, and escalate controls.
- [ ] Test unreadable/error state if available.
- [ ] Confirm warning copy is visible before confirmation.

## Regression checklist

- [ ] Order Detail still works.
- [ ] Approval Queue still works.
- [ ] App startup still works.

## Suggested commit message

add receipt review

