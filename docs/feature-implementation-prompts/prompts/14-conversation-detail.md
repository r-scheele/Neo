# Conversation Detail Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the Inbox conversation list exists and can navigate to `app/conversation/[id].tsx`.

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
- docs/ui-design-prompts/screens/conversation-detail-screen.md
- design-assets/ui-screens/conversation-detail.png
- assets/images/illustration-inbox-ai-draft.png
- constants/images.ts
- app/conversation/[id].tsx
- app/order/new.tsx
- app/customer/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Conversation Detail.

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
- docs/ui-design-prompts/screens/conversation-detail-screen.md
- design-assets/ui-screens/conversation-detail.png

Scope:
- Replace only the Conversation Detail placeholder.
- Show typed mock chat messages, customer context, order action, and draft area shown in the reference.
- Type the dynamic route param.

Constraints:
- Do not implement AI draft send behavior yet.
- Do not build create order content.
- Do not implement real WhatsApp sync.
- Do not persist raw conversations in AsyncStorage.
- Do not install new libraries.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for composer UI and local row expansion.
- Use route params for conversation identity.
- Use Zustand only if shared conversation mock data already exists.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/conversation-detail.png` exactly.
- Chat scroll and composer layout must work on small and large phones.
- Long messages must wrap cleanly.
- Include loading, empty, and error states where relevant.

Validation:
- Conversation detail renders from the route param and typed mock data.
- Customer profile and create order actions navigate only to existing routes/placeholders.
- Composer does not send real messages.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Conversation Detail works end to end within mock scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Inbox and tap a conversation.
- [ ] Compare the screen to `design-assets/ui-screens/conversation-detail.png`.
- [ ] Scroll the chat.
- [ ] Tap customer and create order actions.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Inbox still works.
- [ ] Main tabs still work.
- [ ] App startup still works.

## Suggested commit message

add conversation detail

