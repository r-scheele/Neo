# orders

Status: B06 implemented locally; B05 commerce deployment existed before this pass.

Current scope:
- Create backend-owned orders and order items for the active business.
- Read order detail and order summaries.
- Return Today commerce counts from backend records.
- Keep payment review human-led; receipt screenshots are never auto-confirmed.
- Enforce role-specific permissions and write audit logs for sensitive order changes.
- Cancel orders, update delivery status, and update payment status through owner/manager authorization.

Future hardening:
- Move high-risk mutation plus audit writes into transaction-safe database functions/RPC before launch.
