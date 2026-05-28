# B05 Commerce Records Backend Sync Prompt

Status:
Deferred until B03 database readiness and B04 server auth/profile bootstrap are complete.

Do not run this prompt until:
- B03 database schema readiness is complete
- B04 server auth/profile bootstrap is complete
- durable records schema is reviewed and pushed, or this prompt explicitly scopes a local-only backend implementation pass
- orders/customers/receipts/follow-ups endpoint contracts are approved

## When to run this prompt

Run after B04. If records depend on live WhatsApp IDs, B07 should also be complete.

## What this prompt will do

Replace local-only commerce fixtures and `local-*` records with backend-backed orders, customers, receipt review records, follow-ups, and Today operational counts.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/backend-api-boundary.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/persistence-plan.md
- docs/state-management-plan.md
- features/order/CreateOrderScreen.tsx
- features/order/OrderDetailScreen.tsx
- features/order/createOrderForm.ts
- features/order/orderDetailData.ts
- features/receipts/ReceiptReviewScreen.tsx
- features/receipts/receiptReviewData.ts
- features/customer/CustomerProfileScreen.tsx
- features/customer/customerProfileData.ts
- features/follow-ups/FollowUpsScreen.tsx
- features/follow-ups/followUpQueueData.ts
- features/today/TodayCommandCenterScreen.tsx
- lib/api/

Also verify that backend decisions are approved and that `lib/api/` exists from B02.

If any required file or backend decision is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only commerce records backend sync.

Scope:
- Persist Create Order through backend APIs instead of generating only `local-*` IDs.
- Load Order Detail from backend by route ID.
- Load Customer Profile and customer history from backend by route ID.
- Load Follow-ups from backend and persist actions approved by backend contract.
- Load Receipt Review records from backend and save receipt review decisions without auto-confirming screenshots.
- Update Today operational counts from backend-backed data.
- Keep local fixtures only as clearly isolated dev/demo fallback until real endpoints work.

Constraints:
- Do not store raw customer messages, receipt images, bank alerts, or exact payment proof in AsyncStorage or Zustand.
- Do not auto-confirm manual transfer screenshots.
- Do not implement server-side permissions/audit logs beyond consuming approved API responses.
- Do not refactor unrelated files.
- Keep the diff small and reviewable.

Validation:
- Create Order persists and opens a backend-backed Order Detail.
- Order Detail reloads by ID after restart.
- Customer Profile loads backend customer data and does not persist sensitive notes unsafely.
- Receipt Review decision saves through backend and does not imply screenshot auto-verification.
- Follow-up actions persist through backend where approved.
- npm run typecheck passes.
- npm run lint passes.
- App starts.

Stop when:
- Commerce records backend sync is configured for MVP.
- Files changed, what changed, env vars added, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`connect commerce records sync`
