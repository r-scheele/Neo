# B06 Server-Side Permissions And Audit Logs Prompt

Status:
Complete. B04 server auth/profile bootstrap and B05 commerce records backend sync are complete, and B06 now enforces trusted role checks plus audit writes for current sensitive commerce endpoints according to `docs/backend/permissions-audit-contract.md` and `docs/backend/audit-log-retention.md`.

Do not run this prompt until:
- B04 server auth/profile bootstrap is complete
- B05 commerce records backend sync is complete
- trusted role source contract is approved
- audit write contract is approved
- audit retention policy is confirmed

## When to run this prompt

Run after B05. The backend contract for roles, permissions, denied writes, and audit log creation is approved.

## What this prompt will do

Replace client/mock role gates with trusted backend authorization for sensitive actions and record audit logs for payment, receipt, approval, and settings decisions.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/backend-api-boundary.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/release-blockers.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/backend/permissions-audit-contract.md
- docs/backend/audit-log-retention.md
- features/permissions/PermissionDeniedScreen.tsx
- features/permissions/permissionData.ts
- features/approvals/ApprovalQueueScreen.tsx
- features/receipts/ReceiptReviewScreen.tsx
- features/settings/SettingsScreen.tsx
- features/order/OrderDetailScreen.tsx
- app/modals/permission.tsx
- lib/api/

Also verify that backend decisions are approved and that `lib/api/` exists from B02.

If any required file or backend decision is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only server-side permissions and audit logs.

Scope:
- Consume trusted role/permission data from Clerk/backend according to `docs/backend/permissions-audit-contract.md`.
- Remove or isolate mock `role` query-param behavior from production paths.
- Require server authorization for sensitive approval, receipt, payment, order cancellation, delivery update, and settings actions.
- Show permission denied UI from real denied-write responses.
- Record or rely on backend audit log creation for sensitive actions.
- Keep client-side role checks as visual gates only, not final authorization.
- Treat receipt decisions, order changes, settings changes, and approvals as audit-required actions.

Constraints:
- Do not trust client-only authorization for sensitive actions.
- Do not log private customer messages, receipt images, payment proof, exact addresses, phone numbers, AI prompts, or draft text.
- Do not refactor unrelated files.
- Keep the diff small and reviewable.

Validation:
- Owner, manager, and staff permission states come from a trusted source.
- Staff cannot bypass permission checks through route params.
- Sensitive denied writes do not mutate data.
- Sensitive allowed writes create or confirm backend audit records.
- npm run typecheck passes.
- npm run lint passes.
- App starts.

Stop when:
- Server-side permissions and audit logs are configured for MVP.
- Files changed, what changed, env vars added, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`enforce server permissions`
