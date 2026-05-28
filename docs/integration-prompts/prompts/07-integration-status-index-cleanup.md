# Integration Status Index Cleanup Prompt

## When to run this prompt

Run after prompts 05 and 06 are complete and before continuing with client-side completion work.

## What this prompt will do

Reconcile integration indexes and status docs so the next runnable prompt is clear and backend-deferred work is not mixed into the active sequence.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/integration-prompts/integration-prompt-index.md
- docs/integration-prompts/prompts/
- docs/integration-prompts/backend-deferred/backend-deferred-index.md
- docs/backend-api-boundary.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/integration-build-sequence.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/architecture-plan.md
- docs/persistence-plan.md
- docs/state-management-plan.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only integration status/index cleanup.

Scope:
- Confirm prompt 05 is marked complete.
- Confirm prompt 06 is marked complete as documentation-only.
- Confirm backend implementation remains deferred.
- Confirm Phase A prompts are runnable without backend decisions.
- Confirm backend-blocked prompts live only in `docs/integration-prompts/backend-deferred/`.
- Update stale integration docs if they still point to backend-blocked prompts as the next runnable work.
- Do not change app source.

Constraints:
- Do not implement backend/API work.
- Do not create `lib/api/`.
- Do not add API base URL usage.
- Do not install packages.
- Do not refactor unrelated files.
- Do not redesign UI.
- Keep the diff small.
- Preserve existing working flows.

Validation:
- `docs/integration-prompts/integration-prompt-index.md` shows only Phase A by default.
- `docs/integration-prompts/backend-deferred/backend-deferred-index.md` lists deferred Phase B prompts.
- `docs/integration-build-sequence.md`, `docs/integration-completion-plan.md`, and `docs/missing-integrations.md` agree on the next runnable prompt.
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts if docs changes warrant a smoke check.

Stop when:
- This one pass is complete.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`reorganize integration prompts`
