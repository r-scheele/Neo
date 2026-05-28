# Integration Completion Plan

Date: 2026-05-27

Goal: move the current local MVP prototype forward through small, ordered prompts without repeatedly running backend-blocked work.

Current status: Phase A prompts 01-12 have been run. Prompt 05 completed safe AsyncStorage persistence. Prompt 06 completed the backend/API documentation boundary. Prompt 07 completed integration status/index cleanup. Prompt 08 completed local-only state hardening after Prompts 10-12 were run out of order. Prompt 09 is complete for production-safe PostHog wiring, Prompt 10 is complete for current client/local state coverage, Prompt 11 is complete as a manual QA baseline, and Prompt 12 is complete as a client release readiness precheck. Backend Phase B B01 is complete as a Supabase project/foundation setup. B02 is complete as the typed API/client auth boundary. B03 is complete with remote schema pushed. B04 is complete locally. B05 is ready to run.

## Guiding Rules

- Run one prompt at a time.
- Verify.
- Commit.
- Continue to the next incomplete Phase A prompt.
- Do not run backend prompts out of order. B05 is next; B06-B08 require their listed prerequisites.
- Do not implement real WhatsApp, AI, payment verification, receipt extraction, backend sync, staff enforcement, or audit logs from Phase A.

## Phase A Required Order

| Order | Integration pass | Status | Required for MVP | Backend required? | Main acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| 01 | Environment/config cleanup | Complete | Yes | No | Docs match reality; env placeholders are public only; typecheck/lint/app start pass. |
| 02 | Clerk authentication | Complete for MVP wiring | Yes | No | ClerkProvider, auth flows, token cache, and sign-out are wired with no private keys. |
| 03 | Navigation/app shell protection | Complete for MVP wiring | Yes | No | Public/setup/protected routes redirect correctly for current auth/setup states. |
| 04 | Safe state management completion | Complete for MVP wiring | Yes | No | Safe shared counts and connectivity metadata have one owner. |
| 05 | AsyncStorage persistence completion | Complete | Yes | No | First-run setup is incomplete; setup/preferences persist safely; corrupt storage recovers; sign-out clears safe user-local data. |
| 06 | Backend/API boundary documentation | Complete as docs boundary | Yes | No implementation | Server ownership and open decisions are documented; B02 later created `lib/api/`. |
| 07 | Integration status/index cleanup | Complete | Yes | No | Active prompt index is runnable; backend prompts are separated into Phase B. |
| 08 | Local-only state hardening | Complete | Yes | No | Mock/dev controls and local-only behavior are isolated or clearly labeled. |
| 09 | PostHog production analytics | Complete for Phase A wiring | Yes | No | Analytics works safely with public env values and no private commerce payloads. |
| 10 | Loading/empty/error state completion | Complete for Phase A state coverage | Yes | No | Current client/local screen states render and risky offline actions remain disabled. |
| 11 | Maestro/QA baseline | Complete as manual QA baseline | Yes | No | Repeatable QA baseline exists without installing unapproved tools. |
| 12 | Client release readiness precheck | Complete; not release-ready | Yes | No | Client-side blockers are documented; backend blockers remain explicit. |

## Phase B Deferred Order

| Order | Integration pass | Status | Decision that unlocks it |
| --- | --- | --- | --- |
| B01 | Backend provider decision | Complete | Supabase project linked and local foundation scaffolded. |
| B02 | API client and auth boundary | Complete | `lib/api/` client boundary and Clerk token handoff exist. |
| B03 | Database schema readiness | Complete | Local migration validated; remote schema pushed. |
| B04 | Server auth and profile bootstrap | Complete locally | B03 plus Clerk token verification secrets/strategy. |
| B05 | Commerce records backend sync | Ready | B03-B04 plus reviewed/pushed durable records schema and approved contracts. |
| B06 | Server-side permissions and audit logs | Deferred | B04-B05 plus trusted role source and audit writes. |
| B07 | WhatsApp workflow integration | Deferred | B04 plus WhatsApp token/webhook/media secrets and contracts. |
| B08 | AI draft generation backend | Deferred | B04 plus server-side AI provider/prompt policy and secret; B07 if live context is required. |

## Next Step

Complete and record the signed-in portions of `docs/manual-qa-baseline.md` before release candidate work. A partial local preflight and route-smoke run is recorded in `docs/manual-qa-results-2026-05-27.md`.

Run B05 next. Do not run B06-B08 yet; those backend feature passes remain deferred until their required implementation prerequisites are ready.
