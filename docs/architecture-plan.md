# Architecture Plan

Status: Current client architecture for the local MVP prototype. App source exists; production integrations remain pending.

## Sources

- `docs/product-brief.md`
- `docs/mvp-scope.md`
- `docs/feature-backlog.md`
- `docs/screen-map.md`
- `docs/visual-direction.md`
- `docs/ui-style-guide.md`
- `docs/project-readiness-report.md`
- `docs/next-required-steps.md`
- `ai-mobile-build-kit/04-stack-and-architecture/`

## Architecture Summary

Neo should be built as a mobile-first Expo app using React Native, TypeScript, Expo Router, NativeWind, Zustand, AsyncStorage, Clerk, PostHog, and EAS Build.

The current implementation is an app-first local MVP prototype built feature by feature with typed local/mock data, generated assets, and clear route boundaries. Real WhatsApp, AI, receipt extraction, payment, and multi-user sync integrations require the approved Supabase backend boundary because their secrets and sensitive operations cannot safely live in a mobile client.

## Primary Decision

The client app has been built first. The backend provider is now selected as Supabase, with Supabase Postgres, Edge Functions, and Storage. Keep the current fixture-driven client intact until B05-B08 complete the backend feature workflows.

This keeps service work narrow and lets design, navigation, assets, state ownership, TypeScript, and linting stay stable before live integrations are added. Production integrations must be introduced through ordered backend prompts, not broad rewrites.

## V1 Architecture

V1 means the current buildable mobile app foundation and feature-by-feature local MVP screens.

| Area | V1 Decision | Reason |
| --- | --- | --- |
| App framework | Expo with React Native | Stable mobile path for iOS and Android with EAS Build support |
| Language | TypeScript | Keeps AI-assisted code safer and route/state/data contracts explicit |
| Routing | Expo Router | Matches the screen map with route groups, tabs, stacks, and modals |
| Styling | NativeWind plus design tokens | Keeps styling close to UI while honoring the existing visual system |
| Global state | Zustand | Small shared client state without Redux-level complexity |
| Persistence | AsyncStorage | Safe for small local flags, setup progress, UI preferences, and drafts |
| Auth | Clerk | Required for a business app with private conversations, staff roles, and settings |
| Analytics | PostHog | Useful for activation and funnel learning, with strict privacy limits |
| Builds | EAS Build | Standard production build path for Expo |
| Backend | Supabase Edge Functions | Server-owned API boundary for Clerk-authenticated mobile requests |
| Database | Supabase Postgres | Durable records for businesses, members, customers, orders, receipts, follow-ups, conversations, approvals, media references, and audit logs |
| Media storage | Supabase Storage | Private buckets and signed URLs for receipt, WhatsApp, customer, product, and business media |

## Future Architecture

Future architecture implementation begins when the app needs real data sync, live WhatsApp messages, AI calls, payment/receipt workflows, team roles, or admin operations.

The B01 backend foundation answers the provider-level decisions:

- Customer conversations, orders, receipts, follow-ups, and settings live in Supabase Postgres.
- WhatsApp and Clerk webhooks are received through Supabase Edge Functions.
- AI provider keys, Meta tokens, Clerk secrets, webhook secrets, and service role keys live in Supabase secrets.
- Receipt media lives in private Supabase Storage buckets.
- Owner/staff permissions must be enforced in Edge Functions.
- Audit logs live in Supabase Postgres with safe metadata.

Feature implementation remains deferred to B05-B08. B04 now supplies the local server auth/profile bootstrap foundation.

## Route Architecture

Expo Router should follow the existing screen map without inventing extra screens.

| Route Group | Purpose | Example Routes |
| --- | --- | --- |
| `app/(auth)/` | Logged-out and identity routes | welcome, sign-in |
| `app/(setup)/` | Required business setup | setup checklist, business profile, WhatsApp setup, AI rules, payments, delivery zones, products |
| `app/(tabs)/` | Main returning-user tabs | Today, Inbox, Approvals, Follow-ups, Settings |
| `app/conversation/[id].tsx` | Conversation detail | Chat context and AI draft review |
| `app/order/[id].tsx` | Order detail | Order, payment, delivery, and timeline |
| `app/order/new.tsx` | Create order | Focused create-order flow |
| `app/receipt/[id].tsx` | Receipt review | Focused human payment-review flow |
| `app/customer/[id].tsx` | Customer profile | Customer memory and history |
| `app/modals/` | Focused decisions | Filters, confirmations, permission explanations |

The first Home screen implementation should map to the Today Command Center tab, not a marketing landing page.

## Data Flow

| Data Type | V1 Owner | Persistence | Notes |
| --- | --- | --- | --- |
| Screen UI state | Local component state | None | Selected filters, expanded rows, modal visibility |
| Resource identity | Expo Router params | Route | Conversation ID, order ID, receipt ID, customer ID |
| Shared client state | Zustand | Optional AsyncStorage | Setup progress, safe preferences, local demo queues |
| Auth state | Clerk | Clerk-managed | Do not manually persist auth tokens |
| Generated assets | `constants/images.ts` | Bundled app assets | Centralized imports and names |
| Analytics events | `lib/analytics/` | PostHog service | Typed events, no message text or private data |
| Live external data | Supabase backend | Supabase Postgres/Storage | WhatsApp, AI, payments, receipts, and multi-user data remain deferred until B05-B08 |

## Feature Build Pattern

Each feature should be buildable in a narrow vertical slice:

1. Add or confirm the route.
2. Add typed mock data or a typed client boundary.
3. Build the screen using the visual system.
4. Add only the components needed now.
5. Add Zustand only when state crosses screens.
6. Add AsyncStorage only when restart behavior matters.
7. Add analytics only for approved product questions.
8. Run TypeScript and lint when the app project exists.

## Design System Boundary

The visual system belongs in app constants and reusable UI components.

Required foundations:

- Color tokens from `docs/ui-style-guide.md`.
- 4px spacing scale.
- 8px card/input/button radius.
- Warm ivory app background.
- Border-first cards with subtle shadows only where needed.
- Compact screen titles, dense queue rows, and clear status labels.
- Minimum 44px touch targets.

Do not create a green-only interface, nested cards, oversized marketing hero screens, or UI that implies AI replaces human approval.

## Asset Boundary

Generated raster assets already live in `assets/images/`. Production SVG icon sources live in `assets/icons/`.

- Import generated PNG assets through `constants/images.ts`.
- Treat `assets/icons/*.svg` as source artwork until an SVG rendering approach is approved.
- Do not add an SVG runtime dependency during screen implementation without an explicit dependency decision.

## Environment And Styling Config

The current NativeWind v5/Tailwind v4 setup is CSS-first:

- `metro.config.js` wraps Expo Metro with `withNativewind`.
- `postcss.config.mjs` uses `@tailwindcss/postcss`.
- `src/global.css` imports Tailwind layers, imports `nativewind/theme`, and defines Neo theme tokens.
- `app/_layout.tsx` imports `src/global.css` at the root.

`babel.config.js`, `tailwind.config.js`, and `nativewind.config.js` are intentionally absent. Do not add them unless a future Tailwind customization or NativeWind version change makes them necessary.

## Integration Boundary

The following must remain mocked, local, disabled, or represented as placeholders until backend architecture exists:

- WhatsApp message sync and webhooks.
- AI draft generation calls.
- Receipt image extraction.
- Payment verification.
- Team permission enforcement beyond local UI gates.
- Cross-device sync.
- Admin monitoring.

Backend/API ownership, server-side data contracts, safe error categories, and approved Supabase foundation decisions are defined in `docs/backend-api-boundary.md` and `docs/backend/`. `lib/api/` owns the typed client boundary from B02 and B05 now connects commerce records through Supabase Edge Functions. WhatsApp, AI, permissions/audit, OCR, and payment-provider work remain behind later backend prompts.

## Quality Gates

Every implementation step should keep these checks green:

- TypeScript check.
- Lint.
- App starts locally.
- Screen works on small and large phones.
- No secrets in client code.
- No new libraries without approval.

## Ready For Next Step

This architecture is ready for the remaining ordered backend integration passes. B01 Supabase foundation, B02 API client/auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, and B05 commerce records backend sync are complete; run B06 server-side permissions and audit logs next.
