# Architecture Plan

Status: Draft technical architecture for Neo. This document is for planning only; no app source code has been created yet.

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

The first implementation should be an app-first MVP that can be built feature by feature with typed local/mock data, generated assets, and clear route boundaries. Real WhatsApp, AI, receipt extraction, payment, and multi-user sync integrations require a server boundary later because their secrets and sensitive operations cannot safely live in a mobile client.

## Primary Decision

Build the client app first. Do not introduce a custom backend or database during the initial app scaffold or first UI screen work.

This keeps the MVP simple and lets design, navigation, assets, state ownership, TypeScript, and linting stabilize before live integrations are added. Production integrations must be introduced through explicit future architecture decisions.

## V1 Architecture

V1 means the first buildable mobile app foundation and feature-by-feature MVP screens.

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
| Backend | Deferred | Not needed for first app shell or static UI implementation |
| Database | Deferred | Do not choose one until live sync, team data, or integrations require it |

## Future Architecture

Future architecture begins when the app needs real data sync, live WhatsApp messages, AI calls, payment/receipt workflows, team roles, or admin operations.

Future backend decisions must answer:

- Where customer conversations, orders, receipts, follow-ups, and settings live.
- How WhatsApp webhooks are received and verified.
- Where AI prompts, provider keys, guardrails, and audit logs run.
- How manual receipt review records are stored without implying automatic payment confirmation.
- How owner/staff permissions are enforced beyond client-side checks.
- How analytics and support logs avoid private customer content.

No future backend or database is selected in this plan.

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
| Generated assets | `constants/images.ts` later | Bundled app assets | Centralize imports and names |
| Analytics events | `lib/analytics/` later | PostHog service | Typed events, no message text or private data |
| Live external data | Future backend | Future decision | WhatsApp, AI, payments, receipts, multi-user data |

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

The visual system belongs in app constants and reusable UI components once the app is scaffolded.

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

When the app is scaffolded:

- Create `constants/images.ts`.
- Import generated PNG assets through that constants file.
- Treat `assets/icons/*.svg` as source artwork until an SVG rendering approach is approved.
- Do not add an SVG runtime dependency during screen implementation without an explicit dependency decision.

## Integration Boundary

The following must remain mocked, local, disabled, or represented as placeholders until backend architecture exists:

- WhatsApp message sync and webhooks.
- AI draft generation calls.
- Receipt image extraction.
- Payment verification.
- Team permission enforcement beyond local UI gates.
- Cross-device sync.
- Admin monitoring.

## Quality Gates

After the app scaffold exists, every implementation step should keep these checks green:

- TypeScript check.
- Lint.
- App starts locally.
- Screen works on small and large phones.
- No secrets in client code.
- No new libraries without approval.

## Ready For Next Step

This architecture is ready for:

- `AGENTS.md` generation.
- Expo scaffold planning.
- UI design prompt generation.
- Home/Today Command Center implementation planning.

It is not a signal to start feature coding yet.

