# Order Detail Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Create Order route/data shape exists.

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
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/order-detail-screen.md
- design-assets/ui-screens/order-detail.png
- assets/images/icon-order.png
- assets/images/icon-paid.png
- constants/images.ts
- app/order/[id].tsx
- app/receipt/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Order Detail.

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

Also use:
- docs/ui-design-prompts/screens/order-detail-screen.md
- design-assets/ui-screens/order-detail.png

Scope:
- Replace only the Order Detail placeholder.
- Show order items, payment state, delivery state, and timeline shown in the reference.
- Use typed local/mock order data and typed route params.

Constraints:
- Do not implement real order persistence.
- Do not implement payment verification.
- Do not build Receipt Review content.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use route params for order identity.
- Use local typed mock data or existing order store if already created.
- Do not use AsyncStorage unless order drafts were already approved.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/order-detail.png` exactly.
- Payment and receipt language must remain trust-first.
- Timeline and item list must scroll cleanly.
- Make sure the screen works on small and large phones.

Validation:
- Order detail renders from typed mock data.
- Payment/receipt actions navigate only to existing safe routes.
- Long product/customer/location values do not break layout.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Order Detail works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open an order detail route.
- [ ] Compare the screen to `design-assets/ui-screens/order-detail.png`.
- [ ] Tap receipt/payment review action if present.
- [ ] Check long content scrolling.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Create Order still works.
- [ ] Conversation Detail still works.
- [ ] Main tabs still work.

## Suggested commit message

add order detail

