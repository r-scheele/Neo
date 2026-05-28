# Local Preview Controls

Date: 2026-05-27

These controls exist only for local development and QA of the current client MVP. They are not production authorization, backend state, network state, or payment state.

## Development-Only Query Params

The app accepts these query params only when local preview mode is enabled in development builds:

```text
?state=loading
?state=empty
?state=error
?state=offline
?state=permission
?role=owner
?role=manager
?role=staff
```

In non-development builds, mock state params are ignored and return the ready state. Mock role params are ignored and fall back to the safest visual role, `staff`, so public routes cannot use a query param to grant owner/manager behavior.

## Supported Preview Paths

Use these paths for local QA only:

```text
/(tabs)/today?state=offline
/(tabs)/inbox?state=empty
/(tabs)/approvals?state=permission
/(tabs)/approvals?role=staff
/conversation/aisha-order-review?state=loading
/order/new?conversationId=aisha-order-review&state=error
/order/ord-2025-0561?state=offline
/receipt/aisha-receipt-18000?role=staff
/receipt/aisha-receipt-18000?state=permission
/customer/aisha-o?state=empty
```

## Safety Rules

- Keep local fixture data until backend replacements work end to end.
- Do not treat mock roles as trusted permissions.
- Do not treat mock offline/error/loading states as real network or API states.
- Do not move private messages, receipt images, bank alerts, payment proof, auth tokens, or provider credentials into Zustand or AsyncStorage.
- Do not create `lib/api/` or add public API URL usage from local preview work.

## Backend Boundary

Real WhatsApp sync, AI draft generation, receipt OCR, payment verification, server-side permissions, backend sync, and audit logs remain deferred until B04-B08 complete the approved Supabase backend sequence.
