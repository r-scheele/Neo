# Missing Integrations

Date: 2026-05-27

This file lists what is complete, what is runnable now, and what is deferred until each backend phase is ready.

## Product Surface Note

The repository is now separated into:

- `apps/mobile`: current Expo mobile MVP app and primary integration target.
- `apps/marketing`: `neo.com` marketing site. It should not call sensitive commerce APIs.
- `apps/web`: future `app.neo.com` dashboard scaffold. Real dashboard workflows remain deferred.
- `packages/shared`: shared TypeScript contracts only.

## Current Summary

- Prompt 05 AsyncStorage persistence completion is complete.
- Prompt 06 Backend/API boundary is complete as a documentation boundary.
- Prompt 07 Integration status/index cleanup is complete.
- Prompt 09 PostHog production analytics is complete for Phase A wiring.
- Prompt 10 Loading/empty/error state completion is complete for Phase A state coverage.
- Prompt 11 Maestro/QA baseline is complete as a manual QA baseline because Maestro was unavailable and not installed.
- Prompt 12 Client release readiness precheck is complete and documents that the client is not release-ready yet.
- Prompt 08 Local-only state hardening is complete; it was run after Prompts 10-12.
- Backend Phase B B01 Supabase foundation is complete.
- Backend Phase B B02 API client/auth boundary is complete.
- Backend Phase B B03 database schema readiness is complete with remote schema pushed.
- Backend Phase B B04 server auth/profile bootstrap is complete.
- Backend Phase B B05 commerce records backend sync is complete; commerce functions are deployed and the client uses the backend API with isolated demo fallback.
- Backend Phase B B06 server-side permissions/audit logging is complete for current sensitive commerce endpoints.
- Backend Phase B B07 WhatsApp workflow integration is complete for setup status, webhook ingestion, conversations, send actions, follow-up sends, and Today unread chat counts.
- Backend Phase B B08 AI draft generation backend is complete for server-side draft generation, guardrail routing, and approval queue wiring.
- Backend Phase B B09 live provider QA and credential rotation is planned, split into B09A-B09G, and must not be run all at once.
- Active runnable prompts are Phase A in `docs/integration-prompts/integration-prompt-index.md`.
- Backend/API prompts are Phase B in `docs/integration-prompts/backend-deferred/backend-deferred-index.md`.

## Phase A: Runnable Client/Local Integrations

| Order | Integration | Required for MVP | Current status | Missing packages | Missing config | Missing env vars | Depends on | Acceptance criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Environment/config cleanup | Yes | Complete | None | None for current NativeWind v5/Tailwind v4 setup | Existing public placeholders only | None | Docs match actual app; typecheck/lint/app start pass. |
| 02 | Clerk authentication | Yes | Complete for MVP wiring | None | Real local Clerk test project/account for live QA | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` real public value outside git | 01 | Clerk session is created; token cache is Clerk-managed; sign-out works. |
| 03 | Navigation/app shell protection | Yes | Complete for MVP wiring | None | Real Clerk test account for live signed-in QA | Clerk publishable key outside git | 01-02 | Public/setup/protected routes redirect correctly. |
| 04 | Zustand shared state completion | Yes | Complete for MVP wiring | None | None | None | 01-03 | Safe shared counts/connectivity state have one owner. |
| 05 | AsyncStorage persistence completion | Yes | Complete | None | None | None | 01-04 | First-run setup is incomplete; setup/preferences persist safely; corrupt values recover; sign-out clears safe user-local data. |
| 06 | Backend/API boundary documentation | Yes | Complete as documentation boundary | None | Backend decisions still open; no `lib/api/` yet | No public API URL until approved | 01-05 | Server ownership, safe errors, secrets boundary, and open decisions are documented. |
| 07 | Integration status/index cleanup | Yes | Complete | None | None | None | 01-06 | Main prompt index is runnable and backend prompts are separated. |
| 08 | Local-only state hardening | Yes | Complete | None | Mock state/role behavior is isolated behind development-only local preview helpers | None | 07 | Local-only behavior is honest and not treated as production authority. |
| 09 | PostHog production analytics | Yes | Complete for Phase A wiring | None; PostHog installed | Live event QA still needs real public PostHog values outside git | `EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_POSTHOG_HOST` real public values outside git | 07, Clerk wiring | Safe events arrive; analytics no-ops without keys; payloads exclude private content. |
| 10 | Loading/empty/error state completion | Yes | Complete for Phase A state coverage | None | Backend-driven state sources remain deferred | None | 08 | Current client states render; backend-required states remain documented as deferred. |
| 11 | Maestro/QA baseline | Yes | Complete as manual QA baseline | Maestro not installed; no package/tool install was performed | Automated Maestro flows require a separate dependency/tool decision | None | 10 | Repeatable QA baseline exists without installing unapproved tools. |
| 12 | Client release readiness precheck | Yes | Complete; not release-ready | None | Live Clerk/manual QA remains open | Existing public placeholders only | 07-11 | Client blockers are documented; backend blockers are explicit. |

## Phase B: Backend/API Integrations

B01 Supabase foundation, B02 API client/auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, B05 commerce records backend sync, B06 server-side permissions/audit logging, B07 WhatsApp workflow integration, and B08 AI draft generation backend are complete for current MVP workflows. B09 is planned for live provider QA and credential rotation only.

| Order | Integration | Required for real MVP | Current status | Missing packages | Missing config | Missing env vars | Depends on | Decision that unlocks it | Acceptance criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B01 | Backend provider decision | Yes | Complete | Supabase CLI via `npx` only; no app package needed | Existing Supabase project linked; local `supabase/` foundation scaffolded | Private backend envs stay outside Expo; public placeholders added | Phase A 06 | Supabase project `xtalfjnmxnwtogxgtlxn` linked | Backend decisions are documented clearly enough to unlock API client work. |
| B02 | API client and auth boundary | Yes | Complete | No new package installed | `lib/api/` exists; Clerk token handoff is client-side only | Real public values stay outside git | B01 | B01 complete | Typed API client parses unknown responses and safe errors. |
| B03 | Database schema readiness | Yes for real MVP | Complete | Supabase CLI/Docker already available | Local and remote schema ready for durable records | No secrets in client | B01, B02 | Local migration verified; remote schema pushed | Backend feature prompts have a reviewed schema foundation. |
| B04 | Server auth and profile bootstrap | Yes for real MVP | Complete | Supabase Edge Functions | Clerk token verification, profile/bootstrap endpoint, shared function helpers | `CLERK_JWKS_URL` set in Supabase secrets; `CLERK_SECRET_KEY` pending only for future Clerk API/webhook needs | B03 | Clerk verification and profile bootstrap implemented server-side | Feature APIs can safely identify the actor. |
| B05 | Commerce records backend sync | Yes for real MVP | Complete | No client package decision needed | Durable orders/customers/receipts/follow-ups/Today endpoints implemented and deployed | Public API env values only in client; service role stays server-side | B03, B04 | Reviewed schema pushed and endpoint contracts approved | Orders, receipts, customers, follow-ups, and Today counts persist through backend records. |
| B06 | Server-side permissions and audit logs | Yes | Complete | No client package decision needed | Trusted role source implementation, server authorization, denied-write responses, audit log writes | Clerk and Supabase service secrets in Supabase secrets, not client | B04, B05, approved permissions/audit contract | Implemented for current order, receipt, follow-up, and approval write endpoints | Sensitive actions require server approval; denied writes do not mutate data; audit records exist. |
| B07 | WhatsApp workflow integration | Yes for real MVP | Complete for MVP wiring | No direct client package approved | Backend WhatsApp Cloud API/webhook integration, mobile status/conversation/send endpoints; media remains deferred | Meta WhatsApp secrets in Supabase secrets, not client | B04, B05 | Meta WhatsApp secrets configured; webhook and send/status/conversation endpoints implemented | Connection status, inbox, thread, and send actions use backend APIs safely. |
| B08 | AI draft generation backend | Yes for real MVP | Complete | No direct client package approved | Server-side AI orchestration, prompt minimization, draft API contract | OpenAI/API provider secret in Supabase secrets, not client | B04, B07 live WhatsApp context | Server-side OpenAI secret and guardrail policy implemented | Drafts are generated server-side and sensitive drafts route to approval. |
| B09 | Live provider QA and credential rotation | Yes before production | Planned | No new package approved | Live provider test plan, QA evidence, safety audit, and credential rotation docs | Existing provider secrets by name only; new test credentials handled outside git during B09F | B07, B08 | Approved test numbers/accounts and QA rules | Live provider behavior is verified safely and shared test credentials are rotated after QA. |

## Integrations Not Required Immediately

| Integration | Status | Reason |
| --- | --- | --- |
| Runtime image registry | Complete enough | `constants/images.ts` exists and runtime PNG assets resolve. Keep a smoke check in Phase A prompt 12. |
| Marketing website | Scaffolded separately | `apps/marketing` owns `neo.com`; it is not part of the mobile MVP integration queue. |
| Web dashboard | Scaffolded/deferred | `apps/web` reserves `app.neo.com`; do not build real workflows until product scope exists. |
| Full web dashboard workflows | Deferred web/marketing track | Tracked in `docs/integration-prompts/deferred-web-marketing/`; not part of B09. |
| Web auth enforcement | Deferred web/marketing track | Requires explicit switch to web dashboard work. |
| Production deployment config | Deferred web/marketing track | Requires explicit deployment scope and env/domain decisions. |
| Real signup/waitlist integrations | Deferred web/marketing track | Requires explicit marketing/signup integration scope. |
| Push notifications | Deferred | Current MVP only requires in-app attention badges. |
| Camera/photos/media picker | Deferred until backend/media decision | Real receipt upload needs secure backend/media storage first. |
| Location/maps | Not needed | Delivery zones use manual text entry. |
| Microphone/voice notes | Later | Voice note transcription is P2. |
| Payment provider client SDK | Not selected | Payment verification belongs behind backend decisions; no client secrets. |
| Admin console/monitoring | Later | Future operational surface, not mobile MVP. |

## Current Env Var Status

| Env var | Status | Notes |
| --- | --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Present in `.env.example`; real value outside git | Public key only. |
| `EXPO_PUBLIC_SUPABASE_URL` | Present in `.env.example`; real value outside git | Public Supabase project URL. |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Present in `.env.example`; real value outside git | Public anon key only; service role key stays in Supabase secrets. |
| `EXPO_PUBLIC_API_BASE_URL` | Present in `.env.example`; real value outside git | Supabase Edge Functions base URL. |
| `EXPO_PUBLIC_POSTHOG_KEY` | Present in `.env.example`; real value outside git for analytics QA | Public project key only. |
| `EXPO_PUBLIC_POSTHOG_HOST` | Present in `.env.example`; real value outside git if non-default host is used | Current code can default host. |

No private backend, WhatsApp, AI, payment, webhook, database, or Clerk secret env vars should be added to the Expo client. `OPENAI_API_KEY` is configured only as a Supabase secret for the B08 Edge Function.

See `docs/architecture/env-boundaries.md` for the separate `NEXT_PUBLIC_*` boundaries for marketing and web dashboard apps.
