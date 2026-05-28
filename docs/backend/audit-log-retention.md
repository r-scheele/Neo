# Audit Log Retention

Date: 2026-05-27

Status: initial decision for MVP planning.

## Decision

Create `audit_logs` as the server-owned audit table. Retention is planned as 180 days for MVP unless product/legal review changes it before launch.

## Log These Events

- AI approval decisions.
- Receipt review decisions.
- Payment state changes.
- Role and permission changes.
- Sensitive settings changes.
- Order cancellation or high-risk order edits.
- WhatsApp send attempts where audit is needed for accountability.

## Privacy Rules

- Do not store raw private message text, AI prompts, full AI draft text, receipt images, bank alerts, phone numbers, exact addresses, provider tokens, or secrets in audit metadata.
- Prefer safe categories, IDs, request IDs, timestamps, and actor references.

## Deferred

B06 must implement authoritative permissions and audit writes.
