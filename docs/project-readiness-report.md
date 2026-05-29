# Project Readiness Report

Date: 2026-05-27

## Current Phase

Neo is in the local MVP prototype and integration-readiness phase. The repo is now an npm workspace monorepo with separate marketing, future web dashboard, mobile, shared-contract, and Supabase surfaces.

The Expo/React Native app scaffold lives in `apps/mobile`. The primary MVP screens, route groups, runtime image registry, design tokens, Clerk wiring, route guards, safe local setup/preferences persistence, typed analytics helpers, typed API/auth boundary, screen-state coverage, local-only state hardening, manual QA baseline, partial manual QA results, client release precheck, Supabase backend foundation, backend commerce sync, and B06 permissions/audit handling are implemented for local use. The app is not ready for a client release candidate or real MVP release because full signed-in Clerk/manual QA, WhatsApp sync, AI calls, OCR/payment verification, and transaction-safe audit hardening remain pending.

## Workspace Inspection

| Item | Status | Notes |
| --- | --- | --- |
| `AGENTS.md` | Exists | Current project rules and product guardrails are present. |
| `package.json` | Exists | Root npm workspace orchestrator scripts are present. |
| `apps/mobile/package.json` | Exists | Expo scripts for start, web, iOS, Android, lint, and typecheck are present. |
| `apps/mobile/app/` | Exists | Expo Router auth, setup, tabs, detail, and modal routes are present. |
| `apps/mobile/components/` | Exists | Feedback and layout components exist. |
| `apps/mobile/features/` | Exists | MVP feature screens and typed fixture/local data exist. |
| `apps/mobile/stores/` | Exists | Setup, user preference, operations, connectivity, safe storage reset, and related local stores exist; customer-facing draft text remains component-local until a storage decision is approved. |
| `apps/mobile/lib/` | Exists | Analytics, safe storage, and API client boundary helpers exist. |
| `apps/marketing/` | Exists | `neo.com` Next.js marketing site exists with landing page implementation. |
| `apps/web/` | Exists | `app.neo.com` future dashboard scaffold exists; real workflows are deferred. |
| `packages/shared/` | Exists | Shared TypeScript contracts and constants exist without UI. |
| `supabase/` | Exists | Supabase project is linked; migration and Edge Function scaffolds exist locally. |
| `apps/mobile/constants/` | Exists | Colors, spacing, typography, routes, and runtime image imports exist. |
| `apps/mobile/assets/images/` | Exists | Runtime raster assets are present and referenced through `constants/images.ts`. |
| `.env.example` | Exists | Contains public Expo client placeholders only. |
| `metro.config.js` | Exists | Wraps the Expo Metro config with NativeWind. |
| `postcss.config.mjs` | Exists | Uses `@tailwindcss/postcss` for Tailwind v4. |
| `src/global.css` | Exists | Holds Tailwind v4 CSS-first imports and Neo theme tokens. |
| `babel.config.js` | Intentionally absent | Not required by the current NativeWind v5 setup. |
| `tailwind.config.js` | Intentionally absent | Optional for advanced Tailwind v4 customization only. |
| `nativewind.config.js` | Intentionally absent | Not used by the current stack. |

## What Already Exists

- Expo app shell with Expo Router in `apps/mobile`.
- Next.js marketing site in `apps/marketing`.
- Minimal future web dashboard scaffold in `apps/web`.
- Shared TypeScript contracts in `packages/shared`.
- Welcome, sign-in, setup, tabs, detail, receipt, customer, order, and permission routes.
- Clerk provider, auth screens, route guards, setup guards, protected tabs, protected details, and sign-out clearing.
- Local/mock MVP screens for Today, Inbox, Conversation, Orders, Approvals, Receipt Review, Follow-ups, Customer Profile, Settings, and setup.
- Runtime image registry through `constants/images.ts`.
- NativeWind/Tailwind tokens in `src/global.css`.
- Safe local setup and preference persistence using Zustand and AsyncStorage.
- Safe shared operations/connectivity metadata for local tab counts and offline UI.
- PostHog helper boundaries that no-op when public keys are missing.
- Typed API client boundary in `lib/api/`.
- Supabase project foundation linked to project ref `xtalfjnmxnwtogxgtlxn`.
- Local Supabase migration, storage/secrets docs, and Edge Function stubs.
- Manual QA baseline, partial manual QA results, and client release readiness precheck docs.
- Audit, integration order, release blocker, and integration prompt docs.

## What Is Missing For Real MVP

- Live Clerk test-account QA for auth, setup guards, protected redirects, and sign-out clearing.
- Full signed-in execution of the manual QA baseline.
- Live owner/manager/staff QA for trusted server-side role enforcement on backend-backed sensitive actions.
- Feature endpoints for OCR/payment verification, remaining customer/team workflows, and sync.
- Transaction-safe audit/mutation hardening for high-risk backend writes.
- Production PostHog public env values and event QA.
- Automated unit/integration test setup, if product decides it is required before release.

## Current Next Actions

1. Complete and record the signed-in portions of `docs/manual-qa-baseline.md` with a real Clerk test account.
2. Keep `docs/client-release-readiness-precheck.md` and `docs/release-blockers.md` aligned after manual QA.
3. Do not run later provider/media/payment prompts until required auth/secrets/contracts are ready.
4. After the client precheck blockers are closed, decide whether automated E2E tooling is required before release candidate work.

## Readiness Verdict

Ready for manual QA, launch hardening, and the remaining backend integration passes.

Not release-ready. Neo should remain a local MVP prototype until full signed-in manual QA, remaining backend integrations in `docs/integration-priority-order.md` and `docs/missing-integrations.md`, and launch hardening are completed.
