# approvals

Status: B08 updated for safe approval listing, AI draft approval details, and owner/manager decision recording.

Implemented:
- List safe approval records for the active business.
- Include generated AI draft text only when needed for authenticated human approval review.
- Record approval decisions through trusted owner/manager server authorization.
- Write `approval.decision_recorded` audit rows with safe metadata only.

Future scope:
- Launch-harden approval decisions with transaction-safe audit/mutation RPCs.
