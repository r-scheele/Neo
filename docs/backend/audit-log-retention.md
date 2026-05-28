# Audit Log Retention

Date: 2026-05-27

Status: approved for B06 implementation.

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

## B06 Requirement

B06 must implement authoritative permissions and audit writes according to `docs/backend/permissions-audit-contract.md`.
