# Release Blockers

Date: 2026-05-27

Verdict: Neo is not ready for a client release candidate or a real backend-backed MVP release. The current implementation now includes Clerk wiring, protected route wiring, safe local persistence, current client state coverage, a linked Supabase backend foundation, and B05 commerce records sync. WhatsApp, AI, permissions/audit enforcement, and full signed-in QA remain release blockers.

## Verification Snapshot

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| Expo web start | Started successfully; localhost returned HTTP 200 |
| Manual QA baseline | Partially executed and recorded in `docs/manual-qa-results-2026-05-27.md`; full signed-in Clerk QA remains open |
| Client release precheck | Documented in `docs/client-release-readiness-precheck.md`; not release-ready |
| Unit tests | No test script exists |

## Blockers

| Severity | Blocker | Evidence | Required resolution | Owner integration |
| --- | --- | --- | --- | --- |
| P0 | Remaining backend feature workflows are not implemented | B01-B05 are complete, but WhatsApp, AI, permissions, audit logs, OCR, and payment-provider verification are still deferred. | Run B06 next using the approved permissions/audit contract, then continue through B07-B08 only when each prompt's prerequisites are ready. | Backend deferred B06-B08 |
| P0 | Receipt/payment decisions lack server permissions and audit logs | Receipt review decisions now save through the backend, but B06 still needs authoritative role enforcement and audit writes. | Add server-side permissions and audit logs before release. | Backend permissions, audit logs |
| P0 | Staff roles are mock route params | `role` query params drive approvals/receipt/permission state. | Use trusted auth/backend role source and server-side authorization. | Clerk auth and server-side permissions |
| P0 | WhatsApp connection and messaging are mocked | WhatsApp setup uses local status; inbox/conversation/follow-ups use fixture data and local send notices. | Integrate WhatsApp through backend; keep tokens and webhooks server-side. | WhatsApp workflow integration |
| P0 | AI draft generation is not real | Drafts are fixtures/local text; approvals mutate local UI only. | Generate drafts through backend with guardrails and approval routing. | AI backend integration |
| P1 | Local-only preview controls must stay dev-only | `?state=` and `?role=` params are now gated behind development-only helpers and documented in `docs/local-preview-controls.md`. | Keep this boundary in place until real backend state and trusted roles replace it. | Release readiness cleanup |
| P1 | Full signed-in manual QA baseline is not recorded | `docs/manual-qa-results-2026-05-27.md` records local preflight and route smoke, but a signed-in Clerk test-account run has not been recorded. | Complete and record the signed-in manual QA baseline before release candidate work. | Release readiness cleanup |
| P1 | Some operations state is still fixture-backed | Today and Follow-ups now have backend commerce sync, but Approvals, Inbox, and Conversation data still depend on fixtures until WhatsApp/AI/approval prompts run. | Keep fixture behavior honest and replace remaining workflows in B06-B08. | Backend deferred B06-B08 |
| P1 | Analytics is only partially configured | PostHog package/provider/events exist but real env values and Clerk identify/reset behavior are not validated. | Configure production public env values and privacy QA. | PostHog analytics |
| P1 | No automated test suite exists | `package.json` has no test script; Prompt 11 added a manual QA baseline because Maestro was unavailable. | Decide whether MVP needs automated tests before release; keep typecheck/lint and execute the manual QA baseline until an E2E tool is approved. | Release readiness cleanup |
| P2 | Some feature components are very large | Several screens exceed 900 lines. | Keep stable during integration; split only when needed for safe ownership or testing. | Release cleanup or targeted refactor later |
| P2 | Native permission strategy is not decided | No push/media/camera/location config in `app.json`. | Defer unless receipt upload/media intake enters MVP implementation. | Optional media/notification pass later |

## Not Blockers

| Area | Reason |
| --- | --- |
| TypeScript/lint | Both currently pass. |
| Runtime image registry | `constants/images.ts` exists and maps existing `assets/images` files. |
| Design reference imports | No app source imports from `design-assets/ui-screens/` were found. |
| Client secret leaks | No hardcoded private keys, tokens, database URLs, or provider secrets were found. |
| AsyncStorage persistence cleanup | Prompt 05 is complete for safe local MVP persistence. |
| Zustand package | Installed and used for setup/preferences. |
| PostHog package | Installed; configuration still needs production values and QA. |
| Manual QA baseline | `docs/manual-qa-baseline.md` exists and a partial local run is recorded; automated E2E remains a separate dependency decision. |
| Client release precheck | `docs/client-release-readiness-precheck.md` exists and keeps backend blockers explicit. |
| Backend provider decision | Supabase project `xtalfjnmxnwtogxgtlxn` is linked and local foundation files exist. |
| API client/auth boundary | `lib/api/` exists with safe parsing, env validation, endpoint constants, and Clerk token handoff. |

## Release Gate Checklist

Before release, the following must be true:

- Real Clerk auth works.
- Signed-out users cannot access protected data.
- Setup completion is tied to the authenticated user/business.
- WhatsApp status, inbox, conversations, and send actions are backend-backed.
- AI draft generation happens server-side.
- Orders, customers, receipts, and follow-ups persist through backend records.
- Receipt decisions never rely on screenshot-only auto-confirmation.
- Sensitive actions are server-authorized and audit logged.
- Mock route params and local-only success notices are removed or dev-only.
- Analytics events are privacy-reviewed and configured with public env values.
- Typecheck and lint pass.
- App starts.
- Full signed-in manual QA baseline is executed and recorded.
