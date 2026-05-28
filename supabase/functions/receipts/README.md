# receipts

Status: B06 implemented locally; B05 commerce deployment existed before this pass.

Current scope:
- Read receipt review records and safe media-reference status.
- Save human receipt review decisions through the backend.
- Enforce owner/manager receipt-review permission and write `receipt.review_decision_recorded`.
- Keep receipt/payment copy trust-first and avoid returning raw receipt images or bank alerts.

Never auto-confirm manual transfer screenshots as proof of payment.

Future hardening:
- Move review mutation plus audit write into a transaction-safe database function/RPC before launch.
