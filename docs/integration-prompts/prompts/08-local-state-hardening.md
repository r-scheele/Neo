# Local-Only State Hardening Prompt

## When to run this prompt

Run after prompt 07 confirms the active sequence and deferred backend phase are accurate.

## What this prompt will do

Harden local-only/dev-only state so mock controls, fixture behavior, and local notices are clearly isolated without pretending backend work exists.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/local-only-placeholder-report.md
- docs/mvp-implementation-audit.md
- docs/missing-integrations.md
- docs/state-management-plan.md
- docs/persistence-plan.md
- docs/security-and-secrets-plan.md
- components/feedback/ScreenState.tsx
- app/(tabs)/today.tsx
- app/(tabs)/inbox.tsx
- app/(tabs)/approvals.tsx
- app/(tabs)/follow-ups.tsx
- app/(tabs)/settings.tsx
- app/conversation/[id].tsx
- app/order/new.tsx
- app/order/[id].tsx
- app/receipt/[id].tsx
- app/customer/[id].tsx

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only local-only state hardening.

Scope:
- Audit `?state=` and `?role=` query-param behavior.
- Isolate mock/demo controls behind explicit dev-only helpers or docs-supported local preview paths.
- Preserve current local fixture rendering for screens that still lack backend decisions.
- Ensure local-only success notices remain honest and do not claim real sends, payment verification, backend sync, or audit logging.
- Ensure no private messages, receipt images, bank alerts, payment proof, tokens, or provider credentials are moved into Zustand or AsyncStorage.

Constraints:
- Do not implement backend/API work.
- Do not create `lib/api/`.
- Do not add API base URL usage.
- Do not install unrelated packages.
- Do not refactor unrelated files.
- Do not redesign UI.
- Keep the diff small.
- Preserve existing working flows.

Validation:
- Public production paths cannot use mock role/state controls as trusted behavior.
- Local/demo fallbacks remain clearly labeled.
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts.
- Related screens still render.

Stop when:
- This one pass is complete.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`harden local-only state`
