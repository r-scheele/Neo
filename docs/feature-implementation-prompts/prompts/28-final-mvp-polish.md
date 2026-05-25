# Final MVP Polish Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this only after prompts 01 through 27 are complete, intentionally skipped, or explicitly marked blocked with a known reason.

## Codex prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/mvp-scope.md
- docs/feature-backlog.md
- docs/screen-map.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/design-quality-checklist.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- docs/feature-implementation-prompts/feature-prompt-index.md
- docs/ui-design-prompts/screen-prompt-index.md
- design-assets/ui-screens/
- assets/images/
- constants/images.ts
- package.json

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only final MVP polish for already-built screens.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/mvp-scope.md
- docs/feature-backlog.md
- docs/screen-map.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/design-quality-checklist.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- docs/feature-implementation-prompts/feature-prompt-index.md
- docs/ui-design-prompts/screen-prompt-index.md
- assets/images/
- constants/images.ts

Scope:
- Fix small visual mismatches against generated UI references.
- Fix spacing, typography, touch target, overflow, and state coverage issues on already-built MVP screens.
- Run a focused regression pass and make only small corrective edits.

Constraints:
- Do not build new features.
- Do not add new screens.
- Do not install new libraries.
- Do not refactor architecture.
- Do not rewrite completed screens wholesale.
- Do not import UI design reference screenshots into app code.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Keep the diff small and reviewable.

State/persistence rules:
- Do not add new state systems.
- Do not add backend/database logic.
- Do not change persistence behavior unless fixing a clear bug.
- Do not store sensitive data.

UI rules:
- Preserve `docs/visual-direction.md` and `docs/ui-style-guide.md`.
- Compare against each relevant UI reference image.
- Check small and large phones.
- Ensure no overlapping text, broken touch targets, nested cards, or misleading payment/AI language.

Validation:
- All implemented MVP screens render cleanly.
- Main navigation and detail routes still work.
- Loading, empty, error, offline, and permission states still work where relevant.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Final MVP polish is complete.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Compare implemented screens to their UI reference images.
- [ ] Test small phone layout.
- [ ] Test large phone layout.
- [ ] Test navigation across auth, setup, tabs, and detail routes.
- [ ] Test state coverage and sensitive action copy.

## Regression checklist

- [ ] Welcome and Sign In still work.
- [ ] Setup flow still works.
- [ ] Today, Inbox, Approvals, Follow-ups, and Settings still work.
- [ ] Conversation, Order, Receipt, and Customer detail routes still work.
- [ ] TypeScript and lint pass.

## Suggested commit message

polish mvp screens
