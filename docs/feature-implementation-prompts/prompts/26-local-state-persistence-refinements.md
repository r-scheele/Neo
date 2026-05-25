# Local State And Persistence Refinements Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after setup screens, draft/edit flows, and settings exist. Run only if Zustand and AsyncStorage are installed/configured or if the prompt can complete with existing project utilities.

## Codex prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/feature-backlog.md
- docs/state-management-plan.md
- docs/persistence-plan.md
- docs/security-and-secrets-plan.md
- package.json

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only local state and persistence refinements for already-built MVP flows.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/feature-backlog.md
- docs/state-management-plan.md
- docs/persistence-plan.md
- docs/security-and-secrets-plan.md

Scope:
- Add or refine setup/preferences/draft stores only where existing screens need shared state.
- Add safe AsyncStorage persistence only for approved small local values.
- Add parsing/default handling for persisted values.

Constraints:
- Do not add backend/database logic.
- Do not install Zustand, AsyncStorage, or any new library in this prompt.
- Do not persist secrets, auth tokens, raw customer messages, receipt images, bank alerts, or payment proof.
- Do not refactor unrelated files.
- Do not change screen UI except where needed to use shared state.
- Do not import UI design reference screenshots into app code.
- Do not import images directly inside screens or components.
- Keep the diff small and reviewable.

State/persistence rules:
- Use local component state for one-screen-only values.
- Use Zustand only for shared client state.
- Use AsyncStorage only for safe restart persistence listed in `docs/persistence-plan.md`.
- Use namespaced keys such as `@neo/setup-progress`.
- Clear user-specific local state on sign-out where existing auth flow supports it.

UI rules:
- Preserve existing implemented UI exactly.
- Do not change layout, spacing, or visual hierarchy unless required by state behavior.
- Existing screens must still work on small and large phones.

Validation:
- Setup progress or approved preferences survive app restart if persistence is implemented.
- Corrupt or missing persisted data is handled safely.
- No sensitive data is persisted.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Local state and persistence refinements work for existing MVP flows.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Complete or change a persisted setup/preference value.
- [ ] Restart the app and confirm safe values restore.
- [ ] Sign out if auth exists and confirm user-specific data clears.
- [ ] Confirm no sensitive values are written to storage.

## Regression checklist

- [ ] Setup screens still work.
- [ ] Settings still work.
- [ ] Conversation/order/follow-up draft behavior still works if present.

## Suggested commit message

add local persistence
