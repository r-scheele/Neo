# Integration Build Sequence

Date: 2026-05-27

This sequence follows the Practical Vibe Coding workflow: one focused prompt, verify, commit, continue. Phase A is complete. Backend/API implementation is Phase B; B01-B05 are complete and B06 is the next gated prompt.

## Current Active Sequence

- Phase A prompts 01-12 have been run.
- Backend work is Phase B.
- B02 API client and auth boundary is complete.
- B03 database schema readiness is complete.
- B04 server auth/profile bootstrap is complete.
- B05 commerce records backend sync is complete.
- Prepare B06 next after approving its role/audit contract for server-side permissions and audit logs.
- Do not run B07-B08 yet.
- Prompt 05 AsyncStorage persistence completion is complete.
- Prompt 06 Backend/API boundary is complete as a documentation-only boundary.
- Prompt 07 Integration status/index cleanup is complete.
- Prompt 08 Local-only state hardening is complete.
- Prompt 09 PostHog production analytics is complete for Phase A wiring.
- Prompt 10 Loading/empty/error state completion is complete for Phase A state coverage.
- Prompt 11 Maestro/QA baseline is complete as a manual QA baseline because Maestro was unavailable and not installed.
- Prompt 12 Client release readiness precheck is complete and found the client is not release-ready yet.
- Backend B01 Supabase foundation is complete.
- Backend feature implementation has started; WhatsApp, AI, permissions/audit, OCR, and payment-provider work remain deferred.

## Phase A: Runnable Client/Local Prompts

| Order | Integration | MVP required | Status | Why it comes here | Depends on | Test after this one |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | Environment/config cleanup | Yes | Complete | Aligns docs, env placeholders, and config assumptions before service work. | None | Typecheck, lint, app start, docs consistency. |
| 02 | Clerk authentication | Yes | Complete for MVP wiring | Auth is required before route protection and user-local state clearing. | 01 | Sign up/sign in where keys exist, session restore, sign out, no secret exposure. |
| 03 | Navigation/app shell protection | Yes | Complete for MVP wiring | Guards need Clerk session and setup state. | 01-02 | Signed-out direct protected route, setup-incomplete route, setup-complete route. |
| 04 | Zustand shared state completion | Yes | Complete for MVP wiring | Shared counts and connectivity metadata should have one owner. | 01-03 | Tab badge/count consistency, offline indicator behavior. |
| 05 | AsyncStorage persistence completion | Yes | Complete | Safe local data must rehydrate and clear on sign-out. | 01-04 | Restart setup/preferences, sign-out clearing, corrupt storage fallback. |
| 06 | Backend/API boundary documentation | Yes | Complete as docs boundary | Defines server ownership and explicitly defers implementation decisions. | 01-05 | Boundary doc exists, no client secrets, no `lib/api/`. |
| 07 | Integration status/index cleanup | Yes | Complete | Makes the prompt system runnable again after backend deferral. | 01-06 | Index/docs agree on Phase A and Phase B. |
| 08 | Local-only state hardening | Yes | Complete | Keeps local/demo controls honest while backend remains deferred. | 07 | Mock state/role behavior is isolated or clearly local-only. |
| 09 | PostHog production analytics | Yes | Complete for Phase A wiring | Analytics can be configured safely without backend decisions. | 07, auth wiring | No-key no-op, with-key event QA if public keys exist, payload privacy review. |
| 10 | Loading/empty/error state completion | Yes | Complete for Phase A state coverage | Completes client-side state coverage without claiming real API states. | 08 | State screens render; backend-driven states are documented as deferred. |
| 11 | Maestro/QA baseline | Yes | Complete as manual QA baseline | Establishes repeatable QA before release precheck. | 10 | Maestro if already available, otherwise manual QA baseline. |
| 12 | Client release readiness precheck | Yes | Complete; not release-ready | Final client-side precheck before Phase B. | 07-11 | Typecheck, lint, app start, screen smoke, blocker review. |

## Phase B: Deferred Backend/API Prompts

Phase B lives in `docs/integration-prompts/backend-deferred/`.

| Order | Integration | Status | Why blocked |
| --- | --- | --- | --- |
| B01 | Backend provider decision | Complete | Supabase project linked and local backend foundation scaffolded. |
| B02 | API client and auth boundary | Complete | Typed API/auth boundary exists. |
| B03 | Database schema readiness | Complete | Local migration verified; remote schema pushed. |
| B04 | Server auth and profile bootstrap | Complete | Requires B03 and Clerk verification secrets/strategy. |
| B05 | Commerce records backend sync | Complete | Requires B03-B04 and reviewed/pushed durable records schema. |
| B06 | Server-side permissions and audit logs | Gated next | Requires B04-B05, trusted role source, authorization, and audit writes. |
| B07 | WhatsApp workflow integration | Deferred | Requires B04 plus WhatsApp token/webhook/media secrets and endpoint contracts. |
| B08 | AI draft generation backend | Deferred | Requires B04 plus AI provider secret and server-side prompt policy. |

## Dependency Notes

- Clerk must precede navigation guards and sign-out clearing.
- Zustand and AsyncStorage cleanup should happen before live data integrations so local state ownership is intentional.
- Backend/API documentation can be complete while backend implementation remains deferred.
- PostHog production configuration does not require backend decisions, but must remain privacy-safe.
- Loading/empty/error client completion must not pretend query-param or fixture states are real backend states.
- Release readiness before Phase B is a client-side precheck, not a real backend MVP launch gate.

## Tests After Every Phase A Prompt

- Run `npm run typecheck`.
- Run `npm run lint`.
- Start the app.
- Test the changed integration flow.
- Test related old flows.
- Verify no private secrets or real `.env` values are committed.
- Verify no unrelated behavior changed.
