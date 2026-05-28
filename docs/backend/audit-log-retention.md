# Audit Log Retention

Date: 2026-05-27

Status: approved and implemented for current B06 sensitive commerce endpoints.

## Decision

Create `audit_logs` as the server-owned audit table. Retention is planned as 180 days for MVP unless product/legal review changes it before launch.

The canonical role, permission, audit event, and safe metadata contract is `docs/backend/permissions-audit-contract.md`.

## Log These Events

- AI approval decisions.
- Receipt review decisions.
- Payment state changes.
- Role and permission changes.
- Sensitive settings changes.
- Order creation, order changes, order cancellation, and high-risk order edits.
- Follow-up completion or rescheduling.
- WhatsApp send attempts where audit is needed for accountability.
- Media upload or signed media URL issuance for sensitive files.
- Denied sensitive write attempts.

## Privacy Rules

- Do not store raw private message text, AI prompts, full AI draft text, receipt images, bank alerts, phone numbers, exact addresses, provider tokens, or secrets in audit metadata.
- Prefer safe categories, IDs, request IDs, timestamps, and actor references.

## Implementation Requirement

B06 implements authoritative permissions and audit writes for current sensitive commerce endpoints according to `docs/backend/permissions-audit-contract.md`. Later sensitive endpoints must continue to use the same retention and safe metadata rules.
