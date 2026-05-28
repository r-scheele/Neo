# receipts

Status: B06 permissions/audit implemented and deployed.

Current scope:
- Read receipt review records and safe media-reference status.
- Save human receipt review decisions through the backend.
- Keep receipt/payment copy trust-first and avoid returning raw receipt images or bank alerts.
- Require owner or manager permission for receipt review decisions.
- Write `receipt.review_decision_recorded` audit rows for every receipt decision.

Never auto-confirm manual transfer screenshots as proof of payment.

QA note:
- Signed-in Clerk QA still needs to verify owner/manager receipt review behavior, staff denial, and receipt audit rows before release.
