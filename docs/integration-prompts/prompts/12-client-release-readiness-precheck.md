# Client Release Readiness Precheck Prompt

## When to run this prompt

Run after Phase A prompts 07-11 are complete. This is not full backend MVP release readiness; it is a client-side precheck before Phase B.

## What this prompt will do

Re-audit the current client/local MVP, update release docs, and make the remaining backend blockers explicit without implementing backend work.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- README.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/release-blockers.md
- docs/security-and-secrets-plan.md
- docs/screen-map.md
- docs/ui-style-guide.md
- docs/backend-api-boundary.md
- docs/integration-prompts/integration-prompt-index.md
- docs/integration-prompts/backend-deferred/backend-deferred-index.md
- app/
- components/
- features/
- stores/
- lib/
- constants/

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only the client release readiness precheck.

Scope:
- Re-audit local-only/mock/dev-only behavior after Phase A.
- Update release docs with current client-side status.
- Confirm `.env.example` remains public-placeholder-only.
- Confirm runtime image registry still resolves through `constants/images.ts`.
- Confirm no backend-deferred work is marked complete.
- Document remaining Phase B blockers and the decisions that unlock them.
- Run final client-side verification checks.

Constraints:
- Do not implement backend/API work.
- Do not create `lib/api/`.
- Do not add API base URL usage.
- Do not install unrelated packages.
- Do not refactor unrelated files.
- Do not redesign UI.
- Keep the diff small.
- Preserve existing working flows.
- Do not remove local-only fallback until real backend replacements work.

Validation:
- Client-side release blockers are closed or documented.
- Backend blockers remain deferred and explicit.
- `.env.example` contains placeholders only.
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts.
- Primary MVP screens still render.

Stop when:
- This one pass is complete.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`precheck client release readiness`
