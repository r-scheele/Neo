# Product Basics Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the Setup Checklist and Business Type setup screen exist.

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
- docs/persistence-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/product-basics-screen.md
- design-assets/ui-screens/product-basics.png
- assets/images/empty-products.png
- assets/images/icon-product.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Product Basics.

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
- docs/ui-design-prompts/screens/product-basics-screen.md
- design-assets/ui-screens/product-basics.png

Scope:
- Add or replace only the Product Basics setup route.
- Implement starter product list and add-product form shown in the reference.
- Keep product data local/mock until backend architecture exists.

Constraints:
- Do not build full inventory management.
- Do not build WhatsApp catalog sync.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for product form fields.
- Use Zustand only if setup progress or create-order flow needs product data now.
- Use AsyncStorage only if already available and approved for safe local product drafts.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/product-basics.png` exactly.
- Include empty state using the approved runtime asset where appropriate.
- Validate product name and price.
- Make sure the screen works on small and large phones.

Validation:
- A product can be added locally.
- Empty product state works.
- Invalid price values show inline errors.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Product Basics works end to end in local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Product Basics from setup.
- [ ] Compare the screen to `design-assets/ui-screens/product-basics.png`.
- [ ] Add a valid product.
- [ ] Try missing name and invalid price.
- [ ] Confirm empty state appears when no products exist.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Business Type still works.
- [ ] Delivery Zones still work.

## Suggested commit message

add product basics

