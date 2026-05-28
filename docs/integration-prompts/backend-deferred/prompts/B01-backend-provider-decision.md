# B01 Backend Provider Decision Prompt

Status:
Complete. Supabase is selected and the existing project `xtalfjnmxnwtogxgtlxn` is linked locally.

## What this prompt did

Documented and scaffolded the backend architecture decision that unlocks future API/client integration prompts.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/backend-api-boundary.md
- docs/architecture-plan.md
- docs/security-and-secrets-plan.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/integration-prompts/backend-deferred/backend-deferred-index.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only the backend provider decision documentation.

Scope:
- Record the selected backend provider and why it fits Neo.
- Record the selected database/schema ownership direction.
- Record deployment target and environment ownership.
- Record public API base URL env var name if approved.
- Record Clerk-to-backend auth handoff strategy.
- Record media storage, webhook strategy, and audit retention decisions.
- Update docs only.

Constraints:
- Do not implement backend code.
- Do not create lib/api/.
- Do not add API base URL usage to app code.
- Do not install packages.
- Do not create real secret values.
- Do not mark downstream backend prompts complete.
- Keep the diff small and reviewable.

Validation:
- docs/backend-api-boundary.md clearly lists approved decisions.
- docs/missing-integrations.md shows backend implementation still pending unless actually implemented.
- No app code changed.
- No packages installed.

Stop when:
- Backend decisions are documented clearly enough to unlock B02.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`document backend provider decision`
