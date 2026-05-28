# MVP Implementation Audit

Date: 2026-05-27

Scope: full MVP implementation audit against `AGENTS.md`, product docs, screen map, architecture plans, source folders, dependencies, runtime assets, and release checks. This report documents current project reality after the Phase A client release readiness precheck.

## Executive Summary

The MVP app shell and all primary screen routes now exist. The implemented product is a strong local/mobile prototype with Expo Router, NativeWind/Tailwind CSS tokens, typed route files, runtime image registry, setup persistence, user preference persistence, typed PostHog analytics helpers, and current client/local screen-state coverage.

The implementation is not release-ready because core production integrations are still missing or intentionally mocked:

- Clerk auth is installed and wired for MVP session creation, token cache, auth-route redirect, and sign-out clearing.
- Root, auth, setup, tab, detail, and permission routes now guard with Clerk session state and setup completion state.
- Safe tab attention counts and connectivity UI metadata now use shared runtime Zustand stores.
- Real WhatsApp sync, AI draft generation, order persistence, receipt review records, payment verification, staff authorization, audit logs, and customer memory require a backend boundary and are not implemented.
- Most commerce workflows are local-only using typed fixtures or component state.
- Mock state query params such as `?state=offline` and mock role params such as `?role=staff` are development-only local preview controls. Non-development builds ignore mock state params and do not grant owner/manager behavior from mock role params.
- Environment/config cleanup is the first integration pass; stale readiness and prompt-status docs should stay aligned with this audit.
- Prompt 11 added a manual QA baseline because Maestro was unavailable and no package or external tool install was allowed.
- Prompt 12 completed the client release readiness precheck and confirmed the client is not release-ready until live/manual QA and backend work are completed.

Phase A prompts 01-12 have now been run. Prompt 08 local-only state hardening completed after Prompts 10-12 were run out of order. Phase A prompt 09 PostHog production analytics is complete for safe client wiring. Phase A prompt 10 loading/empty/error state completion is complete for current client/local state coverage. Phase A prompt 11 is complete as a manual QA baseline because Maestro was unavailable and not installed. Phase A prompt 12 is complete as a client release readiness precheck, with a not-release-ready verdict. Backend/API implementation prompts are deferred until backend provider, database, deployment, API URL, Clerk-to-backend auth, media, webhook, and audit-retention decisions are approved.

## Verification Results

| Check | Command | Result | Notes |
| --- | --- | --- | --- |
| TypeScript | `npm run typecheck` | Passed | `tsc --noEmit` exited 0. |
| Lint | `npm run lint` | Passed | `eslint .` exited 0. |
| App start smoke | `npm run web -- --host localhost --port 8104` | Started | Metro reported Web at `http://localhost:8104`; route-level HTTP smoke returned HTTP 200 for root and representative local-preview state/role paths. Server was stopped after the check. |
| Manual QA baseline | `docs/manual-qa-baseline.md` | Added | Maestro CLI was unavailable; the baseline documents public/auth, setup, tabs, detail routes, state variants, and backend-deferred QA. |
| Client release precheck | `docs/client-release-readiness-precheck.md` | Added | Precheck documents public env status, runtime image registry status, backend boundary status, and remaining client/backend blockers. |
| Unit tests | N/A | Not available | No test script exists in `package.json`. |

## Core Config Audit

| Area | Current Reality | Status | Risk |
| --- | --- | --- | --- |
| Expo app config | `app.json` exists with app metadata, image assets, `expo-router`, `expo-localization`, `expo-secure-store`, and typed routes. | Partial | Native auth token cache plugin is configured; live auth route QA still needs real Clerk local credentials. |
| Package scripts | `start`, `android`, `ios`, `web`, `lint`, and `typecheck` exist. | Complete | No unit/integration test script. |
| TypeScript | `tsconfig.json` is strict and uses `@/*` path alias. | Complete | None found in audit. |
| ESLint | `eslint.config.js` exists and passes. | Complete | None found in audit. |
| Metro | `metro.config.js` wraps NativeWind. | Complete | Revalidated after Clerk package additions. |
| Tailwind/NativeWind | Tailwind v4 tokens live in `src/global.css`; `metro.config.js` wraps NativeWind; `postcss.config.mjs` uses `@tailwindcss/postcss`; `babel.config.js`, `tailwind.config.js`, and `nativewind.config.js` are intentionally absent for the current NativeWind v5/Tailwind v4 setup. | Complete for current local setup | Revalidate before release because NativeWind v5 is a preview dependency. |
| Env example | `.env.example` includes only public Clerk and PostHog Expo placeholders. | Complete for placeholders | Real values belong only in uncommitted local/hosted env. The app fails safely when the Clerk publishable key is absent. |
| Git ignore | `.env`, `.env.*`, and generated local build folders are ignored while `.env.example` is allowed. | Complete | Good secrets hygiene. |
| Runtime assets | `constants/images.ts` maps runtime PNGs in `assets/images/`. | Complete | No source imports from `design-assets/ui-screens/` were found. |
| Docs | Product, readiness, audit, and integration docs describe the app as a local MVP prototype with pending integrations. | Complete for this pass | Keep docs synchronized after each integration prompt. |

## Dependency Audit

| Integration | Required By Docs | Installed | Configured | Current Status |
| --- | --- | --- | --- | --- |
| Expo / React Native | Yes | Yes | Yes | Working app shell. |
| Expo Router | Yes | Yes | Yes | Routes exist and use auth/setup guards; live signed-in QA needs Clerk credentials. |
| NativeWind / Tailwind | Yes | Yes | Partial | Current CSS/token setup works with lint/typecheck; config pass needed before release. |
| Zustand | Yes | Yes | Partial | Setup, preference, operations, and connectivity stores exist; draft store is deferred until local draft text ownership is approved. |
| AsyncStorage | Yes | Yes | Complete for safe local MVP persistence | Safe storage helpers and persistence exist; first-run setup defaults are incomplete; corrupt persisted values recover; sign-out clearing is connected to Clerk. |
| Clerk | Yes | Yes | Partial | Provider, SecureStore token cache, auth screen, sign-out, and route guards are wired; live credentials QA remains. |
| PostHog | Yes | Yes | Complete for Phase A wiring | Provider, typed events, no-key no-op behavior, safe property filtering, production-safe SDK options, and sign-out reset are wired. Live event QA still needs real public env values outside git. |
| Backend/API | Required before production commerce workflows | No decision | No | Release blocker for real WhatsApp, AI, payment, customer, order, receipt, role, and audit behavior. |
| Push notifications | Not required by current feature prompt | No | No | Deferred. In-app tab badges exist. |
| Camera/photos/media picker | Future receipt/product media need | No | No | Deferred until backend/media intake decision. |

## Route And Navigation Audit

| Expected Route | Current Files | Current Status | Notes |
| --- | --- | --- | --- |
| Welcome | `app/(auth)/welcome.tsx`, `features/welcome/WelcomeScreen.tsx` | Partial | Public UI exists; signed-in users redirect by setup status through the auth layout. |
| Register / Sign In | `app/(auth)/sign-in.tsx`, `features/auth/RegisterSignInScreen.tsx` | Partial | Uses Clerk sign-in/sign-up and opens setup after session activation. Live QA requires a real local Clerk publishable key and test account. |
| Setup group | `app/(setup)/*` | Partial | Requires Clerk auth; setup-complete users redirect to Today. Screens still use local setup data. |
| Tabs | `app/(tabs)/*` | Partial | Requires Clerk auth and setup completion. Tab data remains fixture/local. |
| Root | `app/index.tsx` | Partial | Redirects by signed-out, setup-incomplete, and setup-complete state. |
| Detail screens | `app/conversation/[id].tsx`, `app/order/[id].tsx`, `app/receipt/[id].tsx`, `app/customer/[id].tsx` | Partial/local-only | Routes require auth and setup completion; data is still fixture/local. |
| Permission modal | `app/modals/permission.tsx` | Local-only | Route requires auth/setup completion; role params are development-only mock previews and not trusted authorization. |

## Feature And Screen Audit

| Feature/screen | Files involved | Current status | What is real | What is fake/mock/local-only | Missing dependency or service | Missing env vars | Required for MVP | Risk | Recommended integration pass | Suggested commit message after fixing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Welcome | `app/(auth)/welcome.tsx`, `features/welcome/WelcomeScreen.tsx` | Partial | Polished public screen, runtime assets, navigation to sign-in, signed-in redirect through auth layout. | Live signed-in redirect QA requires a real local Clerk publishable key and configured test account. | Future backend for business ownership. | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` real value. | Yes | Medium | Persistence/backend boundary. | `complete safe local persistence` |
| Register / Sign In | `app/(auth)/sign-in.tsx`, `features/auth/RegisterSignInScreen.tsx` | Partial | Controlled email/password auth, Clerk sign-in/sign-up, email verification code, submit state, analytics event, signed-in redirect through auth layout. | Live auth still depends on a real local Clerk publishable key and configured test account. | Future backend for business ownership. | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` real value. | Yes | Medium | Persistence/backend boundary. | `complete safe local persistence` |
| Setup Checklist | `app/(setup)/index.tsx`, `features/setup/SetupChecklistScreen.tsx`, `stores/useSetupStore.ts` | Partial | Zustand-backed progress, persisted setup state, route links. | Default store starts with most setup steps complete; status is not tied to authenticated user/business record. | Clerk, backend business profile later. | Clerk key. | Yes | High | Auth, persistence cleanup, backend boundary. | `protect setup checklist` |
| Business Profile | `app/(setup)/business-profile.tsx`, `features/setup/BusinessProfileScreen.tsx`, `stores/useSetupStore.ts` | Partial | Controlled form, validation, saved local draft, analytics. | No server business record, no auth ownership, phone is not used for real account identity. | Clerk, future backend. | Clerk key; no backend env selected. | Yes | Medium | Auth, persistence cleanup, backend boundary. | `connect business profile to setup state` |
| Business Type | `app/(setup)/business-type.tsx`, `features/setup/BusinessTypeScreen.tsx`, `stores/useSetupStore.ts` | Partial | Selection state, validation, persisted preference. | Local business type only; no backend defaults. | Clerk, future backend. | Clerk key. | Yes | Medium | Auth and persistence cleanup. | `finalize business type setup` |
| WhatsApp Setup | `app/(setup)/whatsapp-setup.tsx`, `features/setup/WhatsAppSetupScreen.tsx` | Local-only | Clear status UI, retry state, safe copy. | Mock connection statuses; manual number entry disabled; no WhatsApp API, webhook, or validation. | Backend/API, WhatsApp Cloud API server integration. | None in client; backend secrets must not be in Expo. | Yes | High | Backend/API boundary after auth. | `connect whatsapp setup boundary` |
| AI Personality | `app/(setup)/ai-personality.tsx`, `features/setup/AiPersonalityScreen.tsx`, `stores/useSetupStore.ts` | Partial | Controlled preferences, guardrail validation, local preview, analytics. | No backend prompt policy or AI runtime. | Future backend AI orchestration. | None in client. | Yes | Medium | Auth, persistence cleanup, backend boundary. | `persist ai personality safely` |
| Payment Rules | `app/(setup)/payment-rules.tsx`, `features/setup/PaymentReceiptRulesScreen.tsx`, `stores/useSetupStore.ts` | Partial | Controlled payment method and receipt rule preferences, strict manual-review validation. | Payment providers are not connected; pay-on-delivery addition is local only; permissions are visual. | Backend/API, payment/bank verification boundary. | None in client. | Yes | High | Auth, backend/API boundary, permissions. | `connect payment rules boundary` |
| Delivery Zones | `app/(setup)/delivery-zones.tsx`, `features/setup/DeliveryZonesScreen.tsx`, `stores/useSetupStore.ts` | Partial | Local CRUD-like form and validation; persisted count. | Zones are screen-local examples and only a count is shared. No backend business delivery settings. | Future backend. | None in client. | Yes | Medium | Persistence cleanup and backend boundary. | `persist delivery setup safely` |
| Product Basics | `app/(setup)/product-basics.tsx`, `features/setup/ProductBasicsScreen.tsx`, `stores/useSetupStore.ts` | Partial | Local product form and validation; persisted count; onboarding completion analytics. | Products are local component data; no product catalog record. | Future backend/product storage. | None in client. | Yes | Medium | Persistence cleanup and backend boundary. | `persist product setup safely` |
| Main Tabs / Attention Badges | `app/(tabs)/_layout.tsx`, `features/operations/attentionBadges.ts`, `stores/useOperationsStore.ts` | Partial/local-only | Tab structure matches screen map and requires auth/setup completion; image icons and badge labels read safe counts from the operations store. | Counts still derive from local fixture screens, not backend queues. | Backend. | None. | Yes | Medium | Backend/API boundary. | `connect tab attention badges` |
| Today Command Center | `app/(tabs)/today.tsx`, `features/today/TodayCommandCenterScreen.tsx`, `features/today/todayCommandData.ts`, `stores/useOperationsStore.ts`, `stores/useConnectivityStore.ts` | Backend-backed for commerce counts | Polished Today screen, queue sections, loading/empty/error/offline/permission states, analytics, safe shared attention count, backend commerce counts, and shared last-synced UI metadata. | Urgent chat counts remain deferred until WhatsApp; connectivity is local UI state, not real network truth. | WhatsApp/API, real connectivity source. | Public API base URL outside git. | Yes | Medium | WhatsApp workflow. | `connect whatsapp workflow` |
| Inbox | `app/(tabs)/inbox.tsx`, `features/inbox/InboxConversationListScreen.tsx`, `features/inbox/inboxConversationData.ts` | Local-only | Search/filter UI, states, route links, analytics. | Conversations are typed fixtures; no WhatsApp sync or assignment. | Backend/API, WhatsApp sync. | None in client. | Yes | High | Backend/API boundary. | `connect inbox data boundary` |
| Conversation Detail / AI Draft | `app/conversation/[id].tsx`, `features/conversation/ConversationDetailScreen.tsx` | Local-only | Chat-style UI, draft editing, create order link, customer/order links, states, analytics. | Messages and drafts are fixtures; send/edit feedback is local; attachments/manual send are disabled; draft text remains component-local. | Backend/API, WhatsApp send, AI generation, approved draft-state decision. | None in client. | Yes | High | Backend/API boundary, draft-state decision. | `connect conversation draft workflow` |
| Create Order | `app/order/new.tsx`, `features/order/CreateOrderScreen.tsx`, `features/order/createOrderForm.ts` | Backend-backed for B05 | Controlled order form, validation, totals, backend submit state, analytics. | Old fixture/demo fallback remains isolated; server permissions/audit are deferred. | Permissions, audit logs. | Public API base URL outside git. | Yes | Medium | B06 permissions/audit. | `enforce server permissions` |
| Order Detail | `app/order/[id].tsx`, `features/order/OrderDetailScreen.tsx`, `features/order/orderDetailData.ts` | Backend-backed for B05 | Detailed order view loads backend records by durable ID. | Missing/local IDs can still show isolated demo fallback; reminders/status/cancel are not connected. | Permissions, audit logs, follow-on order actions. | Public API base URL outside git. | Yes | Medium | B06 permissions/audit. | `enforce server permissions` |
| AI Approval Queue | `app/(tabs)/approvals.tsx`, `features/approvals/ApprovalQueueScreen.tsx`, `features/approvals/approvalQueueData.ts` | Local-only | Queue UI, search/filter, role-gated visual decisions, states, analytics. | Approve/reject/edit/escalate mutate local UI only; no AI/payment/customer action. | Backend/API, server permissions, audit logs. | None in client. | Yes | High | Backend/API boundary, permissions. | `connect approval queue workflow` |
| Receipt Review | `app/receipt/[id].tsx`, `features/receipts/ReceiptReviewScreen.tsx`, `features/receipts/receiptReviewData.ts` | Backend-backed for B05 | Trust-first UI loads backend receipt records and saves human review decisions. | No OCR, bank lookup, payment provider verification, customer message, permissions/audit enforcement, or staff workflow yet. | Media/OCR/payment verification, server permissions, audit logs. | Public API base URL outside git. | Yes | High | B06 permissions/audit. | `enforce server permissions` |
| Follow-ups | `app/(tabs)/follow-ups.tsx`, `features/follow-ups/FollowUpsScreen.tsx`, `features/follow-ups/followUpQueueData.ts` | Backend-backed for B05 | Queue UI loads backend follow-ups; complete/reschedule persist to backend. | No WhatsApp send or reminder engine; local fixture IDs remain isolated fallback. | WhatsApp send, optional notifications later, permissions/audit. | Public API base URL outside git. | Yes | Medium | B06 then B07. | `enforce server permissions` |
| Customer Profile | `app/customer/[id].tsx`, `features/customer/CustomerProfileScreen.tsx`, `features/customer/customerProfileData.ts` | Backend-backed for B05 | Profile UI loads safe backend metrics, order history, notes summary, and preferences. | Note editing and follow-up creation remain local/not connected; permissions/audit are deferred. | Permissions, audit logs, follow-up creation contract. | Public API base URL outside git. | Yes | Medium | B06 permissions/audit. | `enforce server permissions` |
| Settings | `app/(tabs)/settings.tsx`, `features/settings/SettingsScreen.tsx`, `features/settings/settingsData.ts`, `stores/useUserPreferencesStore.ts`, `stores/localStateReset.ts` | Partial | Settings UI, persisted safe toggles, Clerk-backed sign-out, local clear-state action. | Business/team/security settings are local rows; support/help not connected. | Backend/API, server permissions. | Clerk key; PostHog env for analytics. | Yes | High | Persistence cleanup, backend boundary. | `complete safe local persistence` |
| Permission Denied | `app/modals/permission.tsx`, `features/permissions/PermissionDeniedScreen.tsx`, `features/permissions/permissionData.ts` | Local-only | Clear role explanation UI, safe back paths, analytics. | Role comes from route params or mock defaults; ask-owner action is local only. | Clerk/org metadata or backend authorization. | Clerk key; no backend env selected. | Yes | High | Auth and server permissions boundary. | `connect permission denied roles` |

## Auth Audit

- Clerk is required by `AGENTS.md`, `docs/auth-plan.md`, and `docs/stack-decision.md`.
- `@clerk/clerk-expo` is installed.
- `expo-secure-store` is installed for Clerk Expo token cache.
- `ClerkProvider` is configured in `app/_layout.tsx`.
- Public auth routes redirect signed-in users based on setup completion.
- Setup routes require auth and redirect setup-complete users to Today.
- Protected tabs, protected detail routes, and the permission modal require auth and setup completion.
- Signed-out users are redirected away from setup, tabs, detail screens, and the permission modal.
- No tokens are manually stored in app code, which is good.
- `.env.example` has `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`; the app consumes it and shows a safe setup screen when it is missing.

## State And Persistence Audit

- Zustand and AsyncStorage are installed.
- `useSetupStore` persists setup progress and safe setup preferences.
- `useUserPreferencesStore` persists safe settings toggles.
- `clearUserLocalState` clears local setup/preference/draft keys and is connected to Clerk sign-out in Settings.
- `useOperationsStore` shares safe tab attention counts across tabs, Today, Inbox, Approvals, and Follow-ups.
- `useConnectivityStore` shares online/last-synced UI metadata for runtime screen state.
- `useDraftStore` is intentionally not created because current drafts include customer-facing message text and need an explicit local-storage decision.
- Today, Inbox, Approvals, Follow-ups, Orders, Receipts, Customers, and tab badges still use typed fixtures or component state for commerce details instead of backend data.
- Sensitive data is not being persisted in AsyncStorage by the audited code.
- The default setup store currently starts with most setup steps marked complete, which is useful for a prototype but wrong for a true first-run MVP.

## Backend/API Audit

The current docs intentionally deferred a backend during screen implementation. That decision is still correct for a UI prototype, but a real MVP cannot ship core commerce flows without a backend boundary.

Backend/API work is required before treating these features as real:

- WhatsApp message sync, send, media attachments, and webhooks.
- AI draft generation and guardrail evaluation.
- Customer records, notes, conversation history, and order history.
- Order creation, order status updates, delivery updates, reminders, and cancellation.
- Receipt upload/intake, OCR/extraction, review decisions, payment state updates, and bank/payment reconciliation.
- Server-side staff role enforcement, owner/manager permissions, and audit logs.
- Cross-device sync and multi-user business membership.

No client-side secrets were found. No `fetch`, `axios`, or websocket production API calls were found in app source.

## Analytics Audit

- `posthog-react-native` is installed.
- `AnalyticsProvider` wraps the root layout.
- Typed analytics events are centralized under `lib/analytics/`.
- Analytics no-ops safely when `EXPO_PUBLIC_POSTHOG_KEY` is missing.
- The PostHog SDK is configured with autocapture, native lifecycle capture, surveys, feature flag preload, remote config, session replay, GeoIP, and person profiles disabled for this Phase A client pass.
- Sign-out resets PostHog's anonymous identity and stored super properties without tracking Clerk/provider IDs.
- Event properties use bands/categories and avoid obvious private message/receipt content.
- `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` are present in `.env.example`.
- Production readiness still needs real public env values and live event QA.

## Runtime Asset Audit

- `constants/images.ts` exists.
- Runtime assets are imported from `assets/images/`.
- No source import from `design-assets/ui-screens/` was found.
- Referenced image names in `constants/images.ts` match files currently present under `assets/images/`.
- SVG sources exist under `assets/icons/` but are not imported at runtime, matching the no-SVG-runtime-dependency rule.

## UI, Forms, And Screen State Audit

- Primary screens generally follow Neo's warm ivory, forest green, border-first, 8px-radius visual direction.
- Loading, empty, error, offline, and permission states exist on the primary operational screens through `MockScreenState` route params and local screen state.
- Prompt 10 completed current client/local state coverage and documented backend-deferred state sources.
- Prompt 08 now gates mock state and role query params through development-only local preview helpers documented in `docs/local-preview-controls.md`.
- Customer Profile disables local note and follow-up creation in offline and permission states.
- Most forms are controlled and include useful inline validation and submit-disabled/loading states.
- Some UI state coverage is simulated through query params instead of real loading/error/offline sources.
- Several large feature components are over 900 lines and contain business workflow logic inside screens. This is acceptable for a local prototype but should be watched during integration passes.

## Security And Secrets Audit

- No hardcoded private keys, tokens, database URLs, or provider secrets were found in app source during this precheck.
- `.gitignore` ignores `.env` and `.env.*` while preserving `.env.example`.
- Client code only references approved public Expo env vars for Clerk and PostHog today.
- No `lib/api/` directory or public API base URL usage exists.
- Clerk secret keys, AI keys, WhatsApp tokens, payment secrets, webhook secrets, and database URLs must remain out of the Expo app.
- Payment and receipt UI copy consistently warns that screenshots are not automatic proof of payment.

## Release Readiness Verdict

Not release-ready for a client release candidate or backend-backed MVP.

The app is ready for manual QA and backend decision work. It is not ready for a real MVP launch because key commerce workflows are local-only, backend-required operations are not implemented, server-side permissions are missing, and live Clerk/manual QA is not recorded.
