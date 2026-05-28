# API Contracts

Date: 2026-05-28

Status: approved response envelope; B02 client parser exists; B04 auth bootstrap endpoints exist; B05 commerce endpoints are implemented and deployed; B06 permissions/audit handling is implemented for current sensitive commerce endpoints; B07 WhatsApp workflow endpoints are implemented.

Base URL env var:

- `EXPO_PUBLIC_API_BASE_URL`

Project API base URL pattern:

- `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`

## Response Envelope

Success:

```json
{
  "data": {},
  "error": null
}
```

Failure:

```json
{
  "data": null,
  "error": {
    "code": "STRING_CODE",
    "message": "Safe user-facing message",
    "details": {}
  }
}
```

## Scaffolded Endpoints

- `health`
- `me-bootstrap`
- `setup-business`
- `customers`
- `orders`
- `receipts`
- `follow-ups`
- `approvals`
- `whatsapp-send-message`
- `whatsapp-webhook`
- `ai-drafts`
- `media-sign-upload`
- `clerk-webhook`

Implemented:

- `health`: safe foundation status.
- `me-bootstrap`: authenticated profile/business context bootstrap.
- `setup-business`: minimal first-business/owner-membership bootstrap.
- `orders`: create/list/detail order records and Today commerce counts.
- `customers`: customer profile, customer list, and safe customer creation.
- `receipts`: receipt review detail/list and human receipt review decision updates.
- `follow-ups`: follow-up queue/list, complete, and reschedule actions.
- `approvals`: list safe approval records and record owner/manager approval decisions.
- `whatsapp-send-message`: authenticated WhatsApp setup status, conversation list/detail, and server-side send actions.
- `whatsapp-webhook`: public Meta webhook challenge/signature receiver; stores redacted raw webhook events and normalizes inbound/status events.

Other function folders return safe deferred errors until their matching Phase B prompt is implemented.

## B07 WhatsApp Endpoint Contracts

WhatsApp provider credentials live only in Supabase secrets. Client requests must use the normal Clerk bearer-token API client except for Meta's public webhook callback.

Function: `whatsapp-send-message`

- `GET /whatsapp-send-message/status`
  - Returns safe connection metadata: setup state, can-send/can-receive booleans, last checked time, source label, and last-four identifiers only.
- `GET /whatsapp-send-message/conversations`
  - Returns conversation list cards for the active business, with customer display labels, unread counts, safe latest previews, and status labels.
- `GET /whatsapp-send-message/conversations/:id`
  - Returns a conversation detail payload and marks the conversation read for the active business.
- `POST /whatsapp-send-message/conversations/:id/messages`
  - Body: `{ "body": "string" }`
  - Requires server permission `whatsapp.send`.
  - Sends through Meta Graph API with server-owned credentials, stores only a safe body preview, updates conversation metadata, and writes a safe `whatsapp.send_attempted` audit event.

Function: `whatsapp-webhook`

- `GET /whatsapp-webhook`
  - Verifies Meta callback challenge with `META_WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
- `POST /whatsapp-webhook`
  - Verifies `x-hub-signature-256` with `META_APP_SECRET`.
  - Stores a redacted raw webhook payload.
  - Creates or updates customer, conversation, and message rows for inbound messages.
  - Updates outbound message status records from Meta status webhooks.

Webhook payload storage must redact private phone identifiers, profile names, captions, and message bodies. The app must not log provider tokens, webhook secrets, raw message text, phone numbers, receipt images, or customer private content.

## B06 Permissions And Audit Behavior

All sensitive writes derive the actor, active business membership, and role from the Clerk-authenticated backend context. Client-sent roles, route params, actor ids, business ids, and audit metadata are not trusted.

Denied sensitive writes return `PERMISSION_DENIED` with safe details containing `requiredPermission` and `role`; they do not mutate the target record and attempt to write `permission.denied` with safe metadata.

Allowed sensitive writes write the matching audit event before returning success. Current B06 coverage includes:

- `order.created`
- `order.cancelled`
- `order.delivery_status_updated`
- `payment.status_updated`
- `receipt.review_decision_recorded`
- `follow_up.completed`
- `follow_up.rescheduled`
- `approval.decision_recorded`

Audit metadata is restricted to safe fields such as permission, actor role, previous/next status, decision, result, amount band, and endpoint. It must not include raw message text, receipt images, media URLs, bank alerts, phone numbers, exact addresses, provider tokens, prompts, or draft text.

Residual launch-hardening risk: current Edge Functions perform mutation and audit insert as separate PostgREST requests in the same trusted server flow. If audit insert fails, the function returns `AUDIT_WRITE_FAILED`, but the mutation may already have reached Postgres. Convert high-risk writes to transaction-safe database functions/RPC before launch.

## Auth Bootstrap Responses

`GET /me-bootstrap` returns:

- `profile`
- `membership`
- `business`

`POST /setup-business` accepts:

- `name`
- `businessType`

It returns:

- `created`
- `profile`
- `membership`
- `business`

## B05 Commerce Endpoint Contracts

All B05 endpoints require a Clerk bearer token. The server derives the actor, profile, active membership, and `businessId` from B04 auth bootstrap data. Clients must not submit trusted `businessId`, actor ids, role ids, or audit metadata.

Amounts are integer whole NGN amounts for the MVP because current client screens use whole-naira values. Revisit minor-unit storage before payment-provider reconciliation or multi-currency work.

### Orders

Function: `orders`

`POST /orders`

Request:

```json
{
  "customerId": "uuid-or-null",
  "conversationId": "uuid-or-null",
  "customer": {
    "displayName": "Customer name",
    "phoneE164": "+234..."
  },
  "items": [
    {
      "name": "Product name",
      "description": "Optional short description",
      "variant": "Optional variant",
      "quantity": 1,
      "unitPriceAmount": 10000
    }
  ],
  "deliveryZone": "Lagos Mainland",
  "deliveryFeeAmount": 1500,
  "paymentStatus": "unpaid",
  "notes": "Optional internal note"
}
```

Response data:

```json
{
  "order": {
    "id": "uuid",
    "displayId": "#ORD-000001",
    "status": "draft",
    "paymentStatus": "unpaid",
    "deliveryStatus": "not_started",
    "currency": "NGN",
    "subtotalAmount": 10000,
    "deliveryFeeAmount": 1500,
    "totalAmount": 11500,
    "createdAt": "ISO-8601",
    "updatedAt": "ISO-8601"
  }
}
```

`GET /orders/:orderId`

Returns an order detail record with safe customer summary, items, totals, payment state, delivery state, linked receipt id when present, and timeline entries. It must not return raw customer message text.

`GET /orders?customerId=&status=&paymentStatus=&limit=&cursor=`

Returns a paginated list of order summaries for the active business.

Allowed payment status values:

- `unpaid`
- `awaiting_receipt`
- `receipt_review`
- `paid`

B05 may map these to existing client labels. It must not mark screenshots as paid without a human review decision.

`PATCH /orders/:orderId/cancel`

Requires owner or manager. Updates the order status to `cancelled` and writes `order.cancelled`.

`PATCH /orders/:orderId/delivery-status`

Requires owner or manager. Accepts:

```json
{
  "status": "delivered"
}
```

Allowed statuses:

- `not_started`
- `scheduled`
- `in_progress`
- `delivered`

Writes `order.delivery_status_updated`.

`PATCH /orders/:orderId/payment-status`

Requires owner or manager. Accepts:

```json
{
  "status": "paid"
}
```

Allowed statuses:

- `unpaid`
- `awaiting_receipt`
- `receipt_review`
- `paid`

Writes `payment.status_updated`. It must not mark screenshot-only evidence as paid without a human review decision.

### Customers

Function: `customers`

`GET /customers/:customerId`

Returns customer profile data for the active business:

- customer summary
- safe metrics
- order summaries
- follow-up summary
- safe preferences
- notes summary

Do not return raw WhatsApp message history in B05.

`GET /customers?search=&limit=&cursor=`

Returns a paginated list of customers for picker/search flows.

`POST /customers`

Creates or updates a customer by safe commerce fields only:

```json
{
  "displayName": "Customer name",
  "phoneE164": "+234...",
  "tags": ["returning"],
  "notesSummary": "Safe internal summary",
  "preferences": {
    "deliveryArea": "Yaba"
  }
}
```

### Receipts

Function: `receipts`

`GET /receipts/:receiptId`

Returns receipt review data for the active business:

- receipt id
- customer summary
- order id and display id
- expected amount
- claimed/extracted amount when available
- review status
- extraction status
- payment decision
- risk flags
- media reference status only

Do not return raw receipt images, bank alerts, exact payment proof, or storage credentials.

`PATCH /receipts/:receiptId/review`

Request:

```json
{
  "decision": "needs_bank_check",
  "note": "Optional safe note"
}
```

Allowed decisions:

- `needs_bank_check`
- `approved_after_bank_check`
- `rejected_mismatch`
- `unreadable`

This endpoint must not auto-confirm payment from screenshot extraction alone. `approved_after_bank_check` requires a deliberate human review action. B06 enforces the receipt-review permission and writes `receipt.review_decision_recorded` according to `docs/backend/permissions-audit-contract.md`.

`GET /receipts?reviewStatus=&limit=&cursor=`

Returns pending or historical receipt review summaries.

### Follow-Ups

Function: `follow-ups`

`GET /follow-ups?status=&due=&limit=&cursor=`

Returns follow-up queue items and counts for the active business.

`PATCH /follow-ups/:followUpId/complete`

Marks a follow-up as completed after a human action. It may record a safe completion note but must not send WhatsApp messages in B05.

B06 authorizes this through `follow_up.complete` and writes `follow_up.completed`.

`PATCH /follow-ups/:followUpId/reschedule`

Updates `dueAt` for a follow-up. It must validate that the date is future or intentionally overdue according to the requested status.

B06 authorizes this through `follow_up.reschedule` and writes `follow_up.rescheduled`.

Allowed statuses:

- `queued`
- `due`
- `overdue`
- `done`
- `dismissed`

### Approvals

Function: `approvals`

`GET /approvals?status=&limit=&cursor=`

Returns safe approval records for the active business. It must not return AI draft text, prompt text, private message text, bank proof, or receipt media URLs.

`PATCH /approvals/:approvalId/decision`

Requires owner or manager. Accepts:

```json
{
  "decision": "approved"
}
```

Allowed decisions:

- `approved`
- `asked`
- `edited`
- `escalated`
- `rejected`
- `sent`

Writes `approval.decision_recorded` with safe metadata only. The MVP endpoint records the approval decision; it does not send WhatsApp messages or AI draft text.

### Today Counts

Today counts are served from backend-backed commerce data without adding a separate function in B05.

`GET /orders/today-summary`

Response data:

```json
{
  "summary": {
    "pendingReceiptsCount": 0,
    "pendingReceiptsAmount": 0,
    "unpaidOrdersCount": 0,
    "unpaidOrdersAmount": 0,
    "dueFollowUpsCount": 0,
    "urgentChatsCount": 0,
    "lastUpdatedAt": "ISO-8601"
  },
  "queueItems": []
}
```

`urgentChatsCount` is populated from backend WhatsApp conversations with unread messages after B07. The client must preserve a clearly isolated dev/demo fallback if that field is unavailable.

## B02 Client Boundary

Client files:

- `lib/api/config.ts`
- `lib/api/response.ts`
- `lib/api/client.ts`
- `lib/api/endpoints.ts`
- `lib/api/health.ts`
- `lib/api/useApiClient.ts`

Rules:

- Parse all response bodies from `unknown`.
- Return typed `ApiResult<T>` values instead of throwing for expected request failures.
- Fail safely for missing or invalid `EXPO_PUBLIC_API_BASE_URL`.
- Use only safe error categories.
- Retrieve auth tokens through Clerk client APIs only.
- Do not log tokens or private commerce payloads.
