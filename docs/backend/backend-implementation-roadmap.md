# Backend Implementation Roadmap

Date: 2026-05-28

Status: B01-B06 foundation, commerce sync, and deployed permissions/audit implementation complete; signed-in QA still pending.

## Current State

- Existing Supabase project `xtalfjnmxnwtogxgtlxn` is linked locally.
- Local `supabase/` structure exists.
- Initial MVP schema migrations exist locally, validate with local Supabase reset, and are applied remotely.
- Edge Function folders are scaffolded.
- Storage and secrets setup docs exist.
- Typed Expo API client boundary exists in `lib/api/`.
- Clerk token handoff is defined through `useApiClient()` and Clerk's `getToken()`.
- Server-side Clerk JWT verification, profile bootstrap, and setup-business bootstrap exist in Supabase Edge Functions.
- `CLERK_JWKS_URL` is set in Supabase secrets. `CLERK_SECRET_KEY` remains pending for future Clerk API/webhook needs.
- B05 commerce endpoint contracts are approved for orders, customers, receipts, follow-ups, and Today counts.
- B05 commerce Edge Functions are implemented and deployed for `orders`, `customers`, `receipts`, and `follow-ups`.
- The Expo client now uses backend-backed commerce APIs for Create Order, Order Detail, Customer Profile, Receipt Review, Follow-ups, and Today counts, with isolated demo fixture fallback for old local/demo IDs.
- B06 permissions/audit contracts are approved in `docs/backend/permissions-audit-contract.md`.
- B06 implementation adds shared permission/audit helpers, owner/manager/staff authorization, audit writes, denied-write envelopes, approval decisions, receipt decisions, order cancellation/delivery updates, and follow-up mutation audit logging.
- B06 Edge Functions are deployed to Supabase and remote unauthenticated smoke checks return the expected safe envelopes.
- Signed-in Clerk QA is still required before treating B06 permissions/audit enforcement as release-confirmed.
- WhatsApp, AI, receipt OCR, and payment-provider verification remain deferred.

## Backend Phase Order

| Order | Phase | Status |
| --- | --- | --- |
| B01 | Backend provider/project foundation | Complete |
| B02 | API client and Clerk auth boundary | Complete |
| B03 | Database schema readiness | Complete |
| B04 | Server auth and profile bootstrap | Complete |
| B05 | Commerce records backend sync | Complete |
| B06 | Server-side permissions and audit logs | Complete and deployed; signed-in QA pending |
| B07 | WhatsApp workflow integration | Deferred until B04 plus Meta secrets and endpoint contracts |
| B08 | AI draft generation backend | Deferred until B04 plus AI provider secret and prompt policy |

## Do Not Do Yet

- Do not rerun remote schema pushes without reviewing the migration diff and confirming intent.
- Do not integrate WhatsApp, OpenAI, payments, OCR, or webhooks outside their prompts.
- Do not treat B06 permissions/audit as release-confirmed until signed-in QA confirms owner/manager/staff behavior and audit rows.
