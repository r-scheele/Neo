# Follow-up Queue Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after main tab navigation and basic order/conversation data shapes exist.

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
- docs/ui-design-prompts/screens/follow-ups-screen.md
- design-assets/ui-screens/follow-ups.png
- assets/images/empty-follow-ups.png
- assets/images/illustration-follow-up-recovery.png
- assets/images/success-follow-up-sent.png
- constants/images.ts
- app/(tabs)/follow-ups.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Follow-up Queue.

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
- docs/ui-design-prompts/screens/follow-ups-screen.md
- design-assets/ui-screens/follow-ups.png

Scope:
- Replace only the Follow-ups tab placeholder.
- Show due, overdue, AI-suggested, and completed follow-up states shown in the reference.
- Implement local send/edit/mark-done UI behavior using typed mock data.

Constraints:
- Do not send real WhatsApp messages.
- Do not build broadcast campaigns.
- Do not add spammy bulk workflows.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for filters, editing, and completion.
- Use Zustand only if follow-up counts are shared with Today or tabs now.
- Use AsyncStorage only if local draft persistence is already approved.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/follow-ups.png` exactly.
- Follow-up copy must feel respectful, not spammy.
- Include empty and success states where relevant.
- Make sure the screen works on small and large phones.

Validation:
- Follow-up cards render from typed mock data.
- Send/edit/mark-done update local UI only.
- Empty follow-up state works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Follow-up Queue works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Follow-ups tab.
- [ ] Compare the screen to `design-assets/ui-screens/follow-ups.png`.
- [ ] Edit a suggested message.
- [ ] Mark a follow-up done.
- [ ] Test empty state.

## Regression checklist

- [ ] Main tabs still work.
- [ ] Today still works.
- [ ] Conversation Detail still works.

## Suggested commit message

add follow up queue

