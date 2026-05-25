# Customer Profile Summary Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Conversation Detail and Order Detail can link to a customer route.

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
- docs/ui-design-prompts/screens/customer-profile-screen.md
- design-assets/ui-screens/customer-profile.png
- assets/images/icon-customer.png
- constants/images.ts
- app/customer/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Customer Profile summary.

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
- docs/ui-design-prompts/screens/customer-profile-screen.md
- design-assets/ui-screens/customer-profile.png

Scope:
- Replace only the Customer Profile placeholder.
- Show customer summary, preferences, notes, order history, and linked next action shown in the reference.
- Use typed local/mock customer data only.

Constraints:
- Do not implement full CRM segments/imports.
- Do not persist sensitive notes in AsyncStorage.
- Do not expose private details to public routes.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use route params for customer identity.
- Use local state for note editing only if shown in the reference.
- Use Zustand only if customer context must be shared with Conversation Detail now.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/customer-profile.png` exactly.
- Long customer names and notes must wrap or truncate predictably.
- Include loading, empty, and error states where relevant.
- Make sure the screen works on small and large phones.

Validation:
- Customer profile renders from typed mock data.
- Linked conversation/order actions navigate safely to existing routes.
- No sensitive data is persisted unsafely.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Customer Profile summary works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open a customer profile route.
- [ ] Compare the screen to `design-assets/ui-screens/customer-profile.png`.
- [ ] Test linked conversation/order actions.
- [ ] Try long customer/name note content.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Conversation Detail still works.
- [ ] Order Detail still works.
- [ ] Main tabs still work.

## Suggested commit message

add customer profile summary

