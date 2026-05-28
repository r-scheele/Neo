# Backend Implementation Roadmap

Date: 2026-05-27

Status: B01-B03 foundation complete; continue with B04 server auth/profile bootstrap if Clerk server inputs are ready.

## Current State

- Existing Supabase project `xtalfjnmxnwtogxgtlxn` is linked locally.
- Local `supabase/` structure exists.
- Initial MVP schema migration exists locally and validates with local Supabase reset.
- Edge Function folders are scaffolded.
- Storage and secrets setup docs exist.
- Typed Expo API client boundary exists in `lib/api/`.
- Clerk token handoff is defined through `useApiClient()` and Clerk's `getToken()`.
- No backend feature has been completed yet.

## Backend Phase Order

| Order | Phase | Status |
| --- | --- | --- |
| B01 | Backend provider/project foundation | Complete |
| B02 | API client and Clerk auth boundary | Complete |
| B03 | Database schema readiness | Complete |
| B04 | Server auth and profile bootstrap | Ready if Clerk server verification inputs exist |
| B05 | Commerce records backend sync | Deferred until B03-B04 |
| B06 | Server-side permissions and audit logs | Deferred until B05 |
| B07 | WhatsApp workflow integration | Deferred until B04 plus Meta secrets and endpoint contracts |
| B08 | AI draft generation backend | Deferred until B04 plus AI provider secret and prompt policy |

## Do Not Do Yet

- Do not replace fixture data.
- Do not run `supabase db push` until explicitly confirmed; B03 recorded remote push as deferred.
- Do not deploy Edge Functions as production features.
- Do not integrate WhatsApp, OpenAI, payments, OCR, or webhooks.
- Do not call B05-B08 endpoints from production flows until their prompts are implemented.
