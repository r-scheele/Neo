# Loading Empty Error State Completion Prompt

## When to run this prompt

Run after local-only state hardening. This client-side pass completes current screen-state coverage without requiring backend/API decisions.

## What this prompt will do

Improve loading, empty, error, offline, and permission state coverage for the current local/client MVP while keeping backend-driven state work deferred.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- components/feedback/ScreenState.tsx
- docs/screen-state-inventory.md
- docs/local-only-placeholder-report.md
- docs/mvp-implementation-audit.md
- docs/missing-integrations.md
- docs/security-and-secrets-plan.md
- docs/ui-style-guide.md
- docs/visual-direction.md
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
Implement only loading/empty/error state completion for the current client MVP.

Scope:
- Audit current loading, empty, error, offline, and permission states.
- Fill narrow client-side gaps where screens already have local/mock data sources.
- Preserve state copy that says actions are local-only where backend work is deferred.
- Ensure risky offline actions remain disabled.
- Keep payment and receipt errors calm, specific, and trust-first.
- Document any state that must wait for backend/API sources.

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
- Loading, empty, error, offline, and permission states render for the current client/local flows.
- Backend-required state sources are documented as deferred, not faked as real.
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts.
- Related flows still work.

Stop when:
- This one pass is complete.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`complete client state screens`
