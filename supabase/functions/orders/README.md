# orders

Status: B06 permissions/audit implemented and deployed.

Current scope:
- Create backend-owned orders and order items for the active business.
- Read order detail and order summaries.
- Return Today commerce counts from backend records.
- Keep payment review human-led; receipt screenshots are never auto-confirmed.
- Enforce active membership permissions for order creation, cancellation, and delivery status changes.
- Write audit rows for order creation, cancellation, and delivery status changes.

QA note:
- Signed-in Clerk QA still needs to verify owner/manager/staff behavior and order audit rows before release.
