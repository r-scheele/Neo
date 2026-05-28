# Permissions And Audit Contract

Date: 2026-05-28

Status: approved for B06 implementation.

This document defines the MVP role model, server-side permission rules, and audit events required before running B06 server-side permissions and audit logs.

## Roles

Neo has three MVP business roles:

| Role | Intent |
| --- | --- |
| `owner` | The business owner or administrator with full authority over business setup, team access, sensitive settings, payment decisions, approvals, and audit visibility. |
| `manager` | A trusted operator who can run daily commerce workflows, make receipt/payment/order decisions, and approve operational actions, but cannot change ownership, team roles, security settings, secrets, or audit retention. |
| `staff` | A limited operator who can read assigned work, prepare orders, view safe customer context, and complete ordinary follow-up work, but cannot make sensitive payment, approval, settings, team, or audit decisions. |

## Trusted Role Source

The server is the only authority for production permissions.

- The trusted role comes from the authenticated Clerk actor mapped to a Supabase `profiles` row and an active `business_members` row for the selected business.
- The trusted membership role must be one of `owner`, `manager`, or `staff`.
- Client route params, mock role params, local preview state, and UI-only role checks are not authoritative.
- Client role checks may remain as visual gates only. Sensitive writes must be authorized again inside Supabase Edge Functions.
- If the actor has no active membership for the requested business, the server must return a safe `PERMISSION_DENIED` or `BUSINESS_NOT_FOUND` envelope and must not mutate data.

## Role Permission Matrix

| Action | Owner | Manager | Staff | Audit required? | Notes |
| --- | --- | --- | --- | --- | --- |
| Read business workspace | Yes | Yes | Yes | No | Reads must still be scoped to the actor's active business membership. |
| Update business profile | Yes | No | No | Yes | Includes name, business category, contact settings, and core profile fields. |
| Update payment rules | Yes | No | No | Yes | Payment rules are sensitive because they shape payment trust and customer instructions. |
| Update AI personality or guardrails | Yes | Yes | No | Yes | Managers may adjust operational tone/guardrails, but not provider secrets. |
| Update delivery zones or product basics | Yes | Yes | No | Yes | Managers may maintain operational setup records. |
| Manage team members | Yes | No | No | Yes | Includes invite, disable, remove, and role changes. |
| Change owner, security, integration, webhook, or secret settings | Yes | No | No | Yes | Server secrets stay in Supabase secrets and are never exposed to the client. |
| View audit logs | Yes | No | No | Yes for exports or sensitive filters | MVP keeps audit visibility owner-only. |
| Read customer summaries | Yes | Yes | Yes | No | Staff can see safe summaries only; no raw sensitive message/payment data in audit metadata. |
| Update customer notes or safe summary fields | Yes | Yes | No | Yes | Notes must avoid private raw message dumps and payment proof. |
| Create order draft or order | Yes | Yes | Yes | Yes | Staff may capture work, but sensitive status changes remain restricted. |
| Update ordinary order fields | Yes | Yes | No | Yes | Includes items, delivery fields, or customer-linked details. |
| Cancel order | Yes | Yes | No | Yes | Cancellation is a high-impact commerce action. |
| Update order payment status | Yes | Yes | No | Yes | Never auto-confirm from screenshot-only evidence. |
| Update order delivery or fulfillment status | Yes | Yes | No | Yes | Staff can view status but cannot change production fulfillment state in MVP. |
| Read receipts | Yes | Yes | Yes | No | Read access is business-scoped. |
| Record receipt review decision | Yes | Yes | No | Yes | Required for every receipt decision, including approval after bank check, mismatch rejection, unreadable, or needs bank check. |
| Read approvals queue | Yes | Yes | Yes | No | Staff may view assigned/safe approvals, but cannot decide sensitive approvals. |
| Approve, reject, or escalate approval item | Yes | Yes | No | Yes | Includes AI draft approvals and sensitive workflow approvals. |
| Read follow-ups | Yes | Yes | Yes | No | Business-scoped. |
| Complete or reschedule follow-up | Yes | Yes | Yes | Yes | Staff may complete ordinary follow-ups; WhatsApp sending remains separately authorized. |
| Send WhatsApp message from Neo | Yes | Yes | No by default | Yes | Staff sending may be added later only through an explicit permission decision. |
| Generate AI draft | Yes | Yes | Yes | Yes | Server must not log raw prompt text or draft text in audit metadata. |
| Approve or send AI draft | Yes | Yes | No | Yes | Human approval remains required for sensitive actions. |
| Request media upload or signed media URL | Yes | Yes | Staff for assigned work only | Yes | Audit safe metadata only; no image contents or private URLs. |
| Attempt denied sensitive write | Yes | Yes | Yes | Yes | Denied sensitive writes should record `permission.denied` with safe metadata. |

## Direct Answers For B06

- Receipt decisions require audit logs: Yes, every receipt review decision must write an audit event.
- Order changes require audit logs: Yes, create, update, cancel, payment status, delivery status, and fulfillment changes must write audit events.
- Settings changes require audit logs: Yes, business, payment, AI, delivery, product, team, integration, security, webhook, and secret-related changes must write audit events.
- Approvals require audit logs: Yes, every approve, reject, escalate, or send decision must write an audit event.

## Required Audit Events

B06 should use these canonical event names unless implementation discovers a stronger existing local convention.

| Event | Required for |
| --- | --- |
| `business.settings.updated` | Business profile or general settings changes. |
| `business.payment_rules.updated` | Payment and receipt rule changes. |
| `business.ai_settings.updated` | AI personality, guardrail, or approval policy changes. |
| `business.delivery_zones.updated` | Delivery zone setup changes. |
| `business.product_basics.updated` | Product basics/catalog setup changes. |
| `team.member.invited` | Team invite or membership creation. |
| `team.member.role_updated` | Role changes between owner, manager, and staff. |
| `team.member.disabled` | Team member disable/removal. |
| `customer.summary.updated` | Safe customer summary or note updates. |
| `order.created` | Order creation from the app or backend workflow. |
| `order.updated` | Non-trivial order edits. |
| `order.cancelled` | Order cancellation. |
| `order.delivery_status_updated` | Fulfillment or delivery status changes. |
| `payment.status_updated` | Payment status changes tied to an order or receipt. |
| `receipt.review_decision_recorded` | Receipt decisions such as needs bank check, approved after bank check, rejected mismatch, or unreadable. |
| `approval.decision_recorded` | Approval approve, reject, escalate, or send decisions. |
| `follow_up.completed` | Follow-up completion. |
| `follow_up.rescheduled` | Follow-up due date/status changes. |
| `whatsapp.send_attempted` | Future WhatsApp send attempts, including failures. |
| `ai_draft.generated` | Future server-side AI draft generation without prompt or draft text in metadata. |
| `ai_draft.approved` | Future AI draft approval. |
| `ai_draft.rejected` | Future AI draft rejection. |
| `media.upload_requested` | Future signed upload preparation for sensitive media. |
| `media.signed_url_issued` | Future signed read URL issuance for sensitive media. |
| `permission.denied` | Denied sensitive writes or sensitive access attempts. |

## Audit Row Metadata Rules

Audit rows must include enough information for accountability without storing private commerce content.

Required fields should be available from the schema or safe metadata:

- `business_id`
- `actor_profile_id`
- `actor_member_id` when available
- `action`
- `entity_type`
- `entity_id`
- `request_id` when available
- `source`, such as `edge_function`
- `safe_metadata`
- `created_at`

Allowed `safe_metadata` examples:

- `permission`
- `actor_role`
- `target_role`
- `previous_status`
- `next_status`
- `decision`
- `reason_code`
- `endpoint`
- `result`
- `amount_band`
- `has_bank_check`
- `delivery_status`
- `approval_type`
- `media_kind`

Never store these in audit metadata:

- Raw private customer messages.
- Full AI prompts or AI draft text.
- Receipt images or media URLs.
- Bank alerts, exact references, exact account details, or payment proof.
- Phone numbers.
- Exact addresses.
- Provider tokens, private keys, webhook secrets, or service role keys.

## Denied Write Contract

Sensitive denied writes must not mutate data. They should return the approved API error envelope:

```json
{
  "data": null,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to do that.",
    "details": {
      "requiredPermission": "receipt.review_decide",
      "role": "staff"
    }
  }
}
```

For sensitive denied write attempts, the server should write `permission.denied` with safe metadata. If the actor cannot be resolved at all, prefer a safe auth error and avoid storing untrusted identifiers.

## Audit Write Reliability

Sensitive allowed writes must not be treated as complete unless the corresponding audit event is written.

B06 should prefer a transaction-safe database path for sensitive mutations and audit writes. If an Edge Function cannot make the data mutation and audit write atomic yet, it must return a safe error if the audit write fails and document any residual consistency risk.

## Retention

Use the 180-day MVP audit retention target documented in `docs/backend/audit-log-retention.md` unless product or legal review changes it before launch.

