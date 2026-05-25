# Create Order Flow Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Conversation Detail and Product Basics are implemented or their typed mock data shape exists.

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
- docs/state-management-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/create-order-screen.md
- design-assets/ui-screens/create-order.png
- assets/images/icon-order.png
- assets/images/success-order-created.png
- constants/images.ts
- app/order/new.tsx
- app/conversation/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Create Order flow.

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
- docs/ui-design-prompts/screens/create-order-screen.md
- design-assets/ui-screens/create-order.png

Scope:
- Replace only the Create Order placeholder.
- Pre-fill safe mock customer/context when opened from Conversation Detail.
- Implement product, quantity, delivery, total, and payment status fields shown in the reference.

Constraints:
- Do not build Order Detail content.
- Do not add real backend saving.
- Do not implement payment verification.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local form state.
- Use Zustand only if created order data must be shared with Order Detail now.
- Use AsyncStorage only if local order draft persistence is already approved.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/create-order.png` exactly.
- Validate required fields and numeric totals.
- Prevent duplicate submissions.
- Make sure the screen works on small and large phones.

Validation:
- Create Order form validates required values.
- Totals update predictably from local state.
- Save action produces local success feedback and safe navigation.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Create Order works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Create Order from a conversation.
- [ ] Compare the screen to `design-assets/ui-screens/create-order.png`.
- [ ] Try submitting missing required fields.
- [ ] Add product, quantity, delivery fee, and payment status.
- [ ] Save and confirm local success behavior.

## Regression checklist

- [ ] Conversation Detail still works.
- [ ] Product Basics still works.
- [ ] Main tabs still work.

## Suggested commit message

add create order flow

