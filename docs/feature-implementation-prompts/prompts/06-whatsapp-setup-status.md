# WhatsApp Setup Status Implementation Prompt

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
- docs/security-and-secrets-plan.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/whatsapp-setup-screen.md
- design-assets/ui-screens/whatsapp-setup.png
- assets/images/error-whatsapp-disconnected.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only WhatsApp setup status.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/security-and-secrets-plan.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/whatsapp-setup-screen.md
- design-assets/ui-screens/whatsapp-setup.png

Scope:
- Add or replace only the WhatsApp Setup route.
- Show the connection/status UI from the reference.
- Use local/mock status only; do not connect to WhatsApp.

Constraints:
- Do not implement real WhatsApp sync, webhooks, access tokens, or provider calls.
- Do not install new libraries.
- Do not create backend code.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for mock connection status and retry UI.
- Use Zustand only if setup checklist must read this status now.
- Do not store WhatsApp tokens or secrets.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/whatsapp-setup.png` exactly.
- Include loading, disconnected/error, and safe retry states where relevant.
- Make sure the screen works on small and large phones.

Validation:
- The screen clearly says this is a connection/status setup flow.
- No real WhatsApp credentials or API calls are added.
- Disconnected/error state is calm and actionable.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- WhatsApp setup status works within local/mock scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open WhatsApp Setup from setup.
- [ ] Compare the screen to `design-assets/ui-screens/whatsapp-setup.png`.
- [ ] Test visible status and retry controls.
- [ ] Confirm no real provider call is made.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Business Type still works.
- [ ] App startup still works.

## Suggested commit message

add whatsapp setup status

