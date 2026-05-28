# Client Release Readiness Precheck

Date: 2026-05-27

Verdict: not ready for a client release candidate.

The current app is a strong local/client MVP prototype, but it should not be treated as a release candidate yet. Prompt 12 confirmed the client-side boundary, release blockers, env placeholders, runtime assets, and backend deferrals. Since then, B01 Supabase backend foundation has been linked and scaffolded, but backend feature workflows are still not implemented.

## Precheck Results

| Area | Result | Notes |
| --- | --- | --- |
| Required files | Passed | All required Prompt 12 files and folders exist. |
| Public env placeholders | Passed | `.env.example` contains only public Expo placeholders for Clerk, Supabase, API base URL, and PostHog. |
| Runtime image registry | Passed | `constants/images.ts` maps runtime PNG assets under `assets/images/`. |
| Backend API boundary | Passed | Supabase foundation exists, but no `lib/api/` directory or feature API usage has been added. |
| Phase B status | Passed | B01-B03 are complete, B04 is next if Clerk server verification inputs are ready, and B05-B08 remain deferred in `docs/integration-prompts/backend-deferred/backend-deferred-index.md`. |
| Client verification commands | Passed | `npm run typecheck`, `npm run lint`, and app start smoke on port 8103 pass. |
| Manual QA baseline | Partially executed and recorded | `docs/manual-qa-results-2026-05-27.md` records preflight and route-smoke checks; full signed-in QA still needs a Clerk test account. |
| Local-only hardening | Passed for Phase A | Prompt 08 gates mock `state` and `role` route params behind development-only helpers and documents preview paths in `docs/local-preview-controls.md`. |

## Client-Side Release Blockers

| Blocker | Why it matters | Required next action |
| --- | --- | --- |
| Full signed-in manual QA baseline is not recorded | Local preflight and route smoke are recorded, but signed-in screen-by-screen QA needs a configured Clerk test account. | Complete `docs/manual-qa-baseline.md` with a real Clerk test account before release candidate work. |
| Live Clerk QA is not recorded | Auth is wired, but live sign-in, setup guards, sign-out clearing, and protected redirects need a real test project/account. | Run Clerk test-account QA outside git with public env values only. |
| Live PostHog QA is not recorded | Analytics is wired and privacy-filtered, but event arrival requires real public PostHog values. | Verify safe events with public PostHog env values outside git. |
| No automated test suite exists | Typecheck/lint catch code quality issues, but no unit or E2E suite exists. | Continue with manual QA unless an E2E dependency decision approves tooling. |

## Phase B Release Blockers

These remain intentionally deferred and must not be marked complete from Phase A:

| Phase B item | Blocked until |
| --- | --- |
| Backend provider decision | Complete as Supabase foundation. |
| API client and auth boundary | Complete as typed client boundary. |
| WhatsApp workflow integration | WhatsApp token, webhook, and media secrets/contracts. |
| AI draft generation backend | B02 plus server-side AI provider secret and prompt policy. |
| Commerce records backend sync | B02 plus reviewed/pushed schema and API contracts for orders, customers, receipts, follow-ups, and Today counts. |
| Server-side permissions and audit logs | B04/B05 plus trusted role source, server authorization, and audit writes. |

## Final Prompt 12 Notes

- Do not remove local-only fallbacks until real backend replacements work.
- Do not add private secrets or backend env vars to the Expo client.
- Run B04 next for backend work if Clerk server verification inputs are ready; do not run B05-B08 until required auth/secrets/contracts are ready.
- Complete the signed-in portions of `docs/manual-qa-baseline.md` before release candidate work.
