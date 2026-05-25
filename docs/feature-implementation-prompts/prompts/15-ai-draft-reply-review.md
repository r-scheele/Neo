# AI Draft Reply Review Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Conversation Detail is implemented.

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
- docs/ui-design-prompts/screens/conversation-detail-screen.md
- design-assets/ui-screens/conversation-detail.png
- assets/images/icon-ai-draft.png
- assets/images/success-reply-sent.png
- constants/images.ts
- app/conversation/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only AI draft reply review inside Conversation Detail.

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
- docs/ui-design-prompts/screens/conversation-detail-screen.md
- design-assets/ui-screens/conversation-detail.png

Scope:
- Add the AI draft card/review controls shown in the Conversation Detail reference.
- Support edit, send placeholder, and human takeover UI states.
- Use typed local/mock draft data only.

Constraints:
- Do not implement real AI generation calls.
- Do not send real WhatsApp messages.
- Do not store AI prompt text or draft text in analytics.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for draft editing and button loading.
- Use Zustand only if draft state is shared outside Conversation Detail.
- Use AsyncStorage only if local draft persistence is already approved.
- Do not add backend/database logic.

UI rules:
- Match the AI draft area in `design-assets/ui-screens/conversation-detail.png` exactly.
- Make edit/send/takeover controls deliberate and accessible.
- Include low-confidence or review-needed status where shown.
- Make sure the screen works on small and large phones.

Validation:
- Draft text can be edited locally.
- Send placeholder produces only local success feedback.
- Human takeover clearly disables or bypasses draft UI.
- No real AI or WhatsApp integration is added.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- AI draft reply review works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open a conversation.
- [ ] Compare the AI draft area to `design-assets/ui-screens/conversation-detail.png`.
- [ ] Edit the draft.
- [ ] Trigger send placeholder and confirm local feedback.
- [ ] Test human takeover state.

## Regression checklist

- [ ] Conversation Detail still loads.
- [ ] Inbox navigation still works.
- [ ] App startup still works.

## Suggested commit message

add ai draft review

