# approvals

Status: B06 server permissions/audit foundation implemented and deployed.

Scope:
- `GET /approvals` lists approval records for the authenticated business.
- `PATCH /approvals/:approvalId/decision` records an owner/manager approval decision.
- Staff denied-write attempts return `PERMISSION_DENIED`.
- Allowed approval decisions write `approval.decision_recorded` audit rows.

Deferred:
- AI draft creation and WhatsApp send execution remain in later backend prompts.
- The Expo approvals queue still uses local fixture data until its integration prompt wires this endpoint.
- Signed-in Clerk QA still needs to verify owner/manager approval decisions, staff denial, and audit rows before release.
