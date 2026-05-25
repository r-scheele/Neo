# AI Approval Queue Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after main tab navigation and AI draft review data shape exist.

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
- docs/security-and-secrets-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/ai-approval-queue-screen.md
- design-assets/ui-screens/ai-approval-queue.png
- assets/images/empty-approvals.png
- assets/images/icon-approvals.png
- constants/images.ts
- app/(tabs)/approvals.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only the AI Approval Queue.

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
- docs/ui-design-prompts/screens/ai-approval-queue-screen.md
- design-assets/ui-screens/ai-approval-queue.png

Scope:
- Replace only the Approvals tab placeholder.
- Show approval cards for low-confidence AI drafts and sensitive actions using typed mock data.
- Implement local approve/edit/reject UI states only.

Constraints:
- Do not implement real AI actions.
- Do not implement receipt payment confirmation here.
- Do not add backend/database logic.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for card decisions and expansion.
- Use Zustand only if approval counts are shared with Today or tabs now.
- Do not use AsyncStorage for sensitive approval content.

UI rules:
- Match `design-assets/ui-screens/ai-approval-queue.png` exactly.
- Approval cards must show risk reason, recommendation, source context, and decision buttons.
- Include empty and error states where relevant.
- Make sure the screen works on small and large phones.

Validation:
- Approval cards render from typed mock data.
- Approve/edit/reject updates local UI only.
- Empty approvals state works.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- AI Approval Queue works end to end within local scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Approvals tab.
- [ ] Compare the screen to `design-assets/ui-screens/ai-approval-queue.png`.
- [ ] Test approve, edit, and reject UI states.
- [ ] Test empty state.
- [ ] Check small and large phone sizes.

## Regression checklist

- [ ] Main tabs still work.
- [ ] Conversation Detail still works.
- [ ] Today still works.

## Suggested commit message

add approval queue

