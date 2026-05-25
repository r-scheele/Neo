# Inbox Conversation List Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after main tab navigation exists and the Today screen is implemented or intentionally deferred.

## Codex prompt

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
- docs/ui-design-prompts/screens/inbox-screen.md
- design-assets/ui-screens/inbox.png
- assets/images/empty-inbox.png
- assets/images/illustration-inbox-ai-draft.png
- constants/images.ts
- app/(tabs)/inbox.tsx
- app/conversation/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the Inbox conversation list.

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
- docs/ui-design-prompts/screens/inbox-screen.md
- design-assets/ui-screens/inbox.png

Scope:
- Replace only the Inbox tab placeholder.
- Show conversation rows, labels, unread state, AI status, search/filter controls shown in the reference.
- Use typed local/mock conversation data only.

Constraints:
- Do not build Conversation Detail content.
- Do not implement real WhatsApp sync.
- Do not persist raw customer messages.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for filters and search.
- Use Zustand only if conversation counts are shared now.
- Do not use AsyncStorage for raw conversations.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/inbox.png` exactly.
- Include loading, empty, and error states where relevant.
- Long names and snippets must wrap or truncate predictably.
- Make sure the screen works on small and large phones.

Validation:
- Inbox rows render from typed mock data.
- Search/filter UI changes visible list state.
- Tapping a row navigates to `conversation/[id]`.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Inbox conversation list works end to end.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Inbox tab.
- [ ] Compare the screen to `design-assets/ui-screens/inbox.png`.
- [ ] Use search/filter controls.
- [ ] Tap a conversation row.
- [ ] Test empty state.

## Regression checklist

- [ ] Today tab still works.
- [ ] Main tabs still work.
- [ ] App startup still works.

## Suggested commit message

add inbox conversation list

