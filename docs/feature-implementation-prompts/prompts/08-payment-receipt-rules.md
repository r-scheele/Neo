# Payment And Receipt Rules Implementation Prompt

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
- docs/security-and-secrets-plan.md
- docs/persistence-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/payment-rules-screen.md
- design-assets/ui-screens/payment-rules.png
- assets/images/icon-paid.png
- assets/images/icon-receipt-review.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Payment and Receipt Rules.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/security-and-secrets-plan.md
- docs/persistence-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/payment-rules-screen.md
- design-assets/ui-screens/payment-rules.png

Scope:
- Add or replace only the Payment Rules setup route.
- Implement the safe payment and manual receipt review settings shown in the reference.
- Include trust-first copy that tells users to verify against bank alert before confirming.

Constraints:
- Do not implement real payment verification.
- Do not store bank credentials, secrets, or payment proof.
- Do not imply screenshots auto-confirm payments.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for form controls.
- Use Zustand only if setup progress needs shared state now.
- Use AsyncStorage only for safe non-secret setup preferences if already available.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/payment-rules.png` exactly.
- Make warning text readable and visible before confirmation settings.
- Make sure the screen works on small and large phones.

Validation:
- Required payment rule fields validate correctly.
- Manual receipt review remains deliberate and human-approved.
- No payment provider or bank integration is added.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Payment and Receipt Rules work within local setup scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Payment Rules from setup.
- [ ] Compare the screen to `design-assets/ui-screens/payment-rules.png`.
- [ ] Toggle or edit each visible control.
- [ ] Confirm trust-first receipt copy is visible.
- [ ] Confirm no real payment integration is added.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Business Profile still works.
- [ ] AI Personality still works.

## Suggested commit message

add payment receipt rules

