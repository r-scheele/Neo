# Client Release Readiness Precheck

Date: 2026-05-27

Verdict: not ready for a client release candidate.

The current app is a strong MVP prototype with initial backend commerce sync, but it should not be treated as a release candidate yet. Prompt 12 confirmed the client-side boundary, release blockers, env placeholders, runtime assets, and backend deferrals. Since then, B01-B05 have added Supabase foundation, API/auth boundary, schema readiness, server auth/profile bootstrap, and commerce records sync.

## Precheck Results

| Area | Result | Notes |
| --- | --- | --- |
| Required files | Passed | All required Prompt 12 files and folders exist. |
| Public env placeholders | Passed | `.env.example` contains only public Expo placeholders for Clerk, Supabase, API base URL, and PostHog. |
| Runtime image registry | Passed | `constants/images.ts` maps runtime PNG assets under `assets/images/`. |
| Backend API boundary | Passed | Supabase foundation and `lib/api/` exist; B05 commerce screens now use backend APIs with isolated demo fallback. |
| Phase B status | Passed | B01-B06 are complete for current backend commerce/permission workflows, and B07-B08 remain deferred in `docs/integration-prompts/backend-deferred/backend-deferred-index.md`. |
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
| Commerce records backend sync | Complete. |
| Server-side permissions and audit logs | B06 complete for current sensitive commerce endpoints; transaction-atomic audit hardening remains before launch. |

## Final Prompt 12 Notes

- Do not remove local-only fallbacks until real backend replacements work.
- Do not add private secrets or backend env vars to the Expo client.
- Do not run B07-B08 until required auth/secrets/contracts are ready.
- Complete the signed-in portions of `docs/manual-qa-baseline.md` before release candidate work.
