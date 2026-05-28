# Integration Priority Order

Date: 2026-05-27

This file mirrors the current two-phase integration plan. The canonical active prompt index is `docs/integration-prompts/integration-prompt-index.md`.

## Phase A: Runnable Now

| Order | Integration | Status | Backend required? | Why this order |
| --- | --- | --- | --- | --- |
| 01 | Environment/config cleanup | Complete | No | Establishes accurate docs and public env placeholders. |
| 02 | Clerk authentication | Complete for MVP wiring | No | Auth is required before route protection and local-state clearing. |
| 03 | Navigation/app shell protection | Complete for MVP wiring | No | Route guards depend on Clerk session and setup state. |
| 04 | Zustand shared state completion | Complete for MVP wiring | No | Shared operational metadata needs one safe owner. |
| 05 | AsyncStorage persistence completion | Complete | No | Safe setup/preferences persistence must rehydrate and clear on sign-out. |
| 06 | Backend/API boundary documentation | Complete as docs boundary | No implementation | Documents server ownership and deferred backend decisions. |
| 07 | Integration status/index cleanup | Complete | No | Keeps the next runnable prompt obvious after backend deferral. |
| 08 | Local-only state hardening | Complete | No | Keeps dev/demo state honest while backend remains deferred. |
| 09 | PostHog production analytics | Complete for Phase A wiring | No | Safe analytics can be completed without backend decisions. |
| 10 | Loading/empty/error state completion | Complete for Phase A state coverage | No | Completes client/local state coverage without faking API behavior. |
| 11 | Maestro/QA baseline | Complete as manual QA baseline | No | Creates repeatable QA before release precheck. |
| 12 | Client release readiness precheck | Complete; not release-ready | No | Confirms client readiness and documents remaining Phase B blockers. |

The Phase A prompt set has been run. A partial local preflight and route-smoke QA run is recorded in `docs/manual-qa-results-2026-05-27.md`; complete the signed-in portions of `docs/manual-qa-baseline.md` before release candidate work.

## Phase B: Backend/API

Phase B lives in `docs/integration-prompts/backend-deferred/`.

Backend provider-level decisions are approved, B01-B05 are complete, the remote schema is pushed, and B05 commerce functions are deployed. Prepare B06 next after approving its role/audit contract, then continue in backend-deferred numeric order only when each prompt's prerequisites are ready.

| Order | Integration | Status | Unlocking decision |
| --- | --- | --- | --- |
| B01 | Backend provider decision | Complete | Supabase project linked and foundation scaffolded. |
| B02 | API client and auth boundary | Complete | `lib/api/` boundary and Clerk token handoff exist. |
| B03 | Database schema readiness | Complete | Local schema verified and remote schema pushed. |
| B04 | Server auth and profile bootstrap | Complete | Clerk verification and profile bootstrap implemented server-side. |
| B05 | Commerce records backend sync | Complete | Commerce endpoints deployed and client sync wiring added. |
| B06 | Server-side permissions and audit logs | Gated next | B04-B05 plus trusted role source and audit writes. |
| B07 | WhatsApp workflow integration | Deferred | B04 plus WhatsApp token/webhook/media strategy implemented. |
| B08 | AI draft generation backend | Deferred | B04 plus server-side AI provider/prompt policy implemented. |

## Manual Regression Set After Each Runnable Prompt

- Welcome opens and navigates to sign-in.
- Sign-in/auth flow works for the current pass state.
- Setup Checklist opens and routes to each setup step.
- Main tabs render: Today, Inbox, Approvals, Follow-ups, Settings.
- Detail routes render from linked items: Conversation, Order, Receipt, Customer.
- Permission Denied route renders from a blocked sensitive action.
- Typecheck passes.
- Lint passes.
- App starts.
- Manual QA baseline in `docs/manual-qa-baseline.md` is reviewed or executed before release precheck; signed-in coverage still requires a real Clerk test account.
