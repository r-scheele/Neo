# API Contracts

Date: 2026-05-28

Status: approved response envelope; B02 client parser exists; B04 auth bootstrap endpoints exist locally; B05 commerce endpoint contracts approved.

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

Implemented locally:

- `health`: safe foundation status.
- `me-bootstrap`: authenticated profile/business context bootstrap.
- `setup-business`: minimal first-business/owner-membership bootstrap.

Other function folders return safe deferred errors until their matching Phase B prompt is implemented.

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

This endpoint must not auto-confirm payment from screenshot extraction alone. `approved_after_bank_check` requires a deliberate human review action and must leave audit enforcement to B06 if audit writes are not implemented yet.

`GET /receipts?reviewStatus=&limit=&cursor=`

Returns pending or historical receipt review summaries.

### Follow-Ups

Function: `follow-ups`

`GET /follow-ups?status=&due=&limit=&cursor=`

Returns follow-up queue items and counts for the active business.

`PATCH /follow-ups/:followUpId/complete`

Marks a follow-up as completed after a human action. It may record a safe completion note but must not send WhatsApp messages in B05.

`PATCH /follow-ups/:followUpId/reschedule`

Updates `dueAt` for a follow-up. It must validate that the date is future or intentionally overdue according to the requested status.

Allowed statuses:

- `queued`
- `due`
- `overdue`
- `done`
- `dismissed`

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

`urgentChatsCount` may remain `0` or omitted until B07 WhatsApp workflow integration provides live conversation state. The client must preserve a clearly isolated dev/demo fallback if that field is unavailable.

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
