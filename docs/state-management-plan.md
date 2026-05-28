# State Management Plan

Status: Partial local MVP implementation. Setup, user preference, operations, and connectivity stores exist. Draft state remains local until the product explicitly approves what customer-facing draft text can be stored or persisted.

## Principle

Use the smallest state owner that solves the problem.

Do not put everything in Zustand. Use local state for local UI, route params for route identity, Zustand for shared app state, AsyncStorage for safe restart persistence, and a future backend for synced production data.

## State Ownership

| State | Owner | Persist? | Notes |
| --- | --- | --- | --- |
| Button loading, row expansion, selected filter | Local component state | No | Belongs to one screen or component |
| Conversation ID, order ID, receipt ID, customer ID | Expo Router params | Route only | Keeps detail screens addressable |
| Setup progress | Zustand | Yes, AsyncStorage | Safe to persist locally while setup is incomplete |
| Business profile draft | Zustand | Maybe, AsyncStorage | Persist only non-sensitive draft fields |
| AI tone preferences | Zustand | Yes, AsyncStorage | Preferences only; no private prompt logs |
| Delivery zone drafts | Zustand | Maybe, AsyncStorage | Local draft only until backend exists |
| Product basics drafts | Zustand | Maybe, AsyncStorage | Local draft only; clear on sign-out |
| Today queue mock data | Feature data plus Zustand counts | Runtime only | Keep fixture details local; share only safe attention counts |
| Inbox mock conversations | Feature data or Zustand | No for real messages | Do not persist private messages in AsyncStorage for production |
| AI draft review state | Local component state | No | Current drafts include customer-facing message text; do not move to Zustand without a draft-storage decision |
| Connectivity status and last synced UI label | Zustand | Runtime only | Safe cross-screen UI metadata; not production network truth yet |
| Receipt review UI state | Local component state | No | Do not persist receipt images or payment proof locally |
| User session | Clerk | Clerk-managed | Do not duplicate tokens in Zustand |
| UI preferences | Zustand | Yes, AsyncStorage | Safe values such as dismissed tips |

## Planned Stores

Create stores only when shared state is truly needed.

| Store | Purpose | Create When |
| --- | --- | --- |
| `useSetupStore` | Setup progress, setup drafts, next required task | Exists |
| `useUserPreferencesStore` | Safe UI preferences and dismissed education | Exists |
| `useOperationsStore` | Safe tab attention counts for Today, Inbox, Approvals, Follow-ups, and Settings | Exists |
| `useDraftStore` | Safe local unsent drafts | Deferred until product/security approves local draft text ownership |
| `useConnectivityStore` | Online/offline and last synced UI metadata | Exists |

Avoid creating all stores during scaffold. Add them feature by feature.

## Store Rules

- Stores must use explicit TypeScript types.
- Stores must expose actions with clear names.
- Stores must not import route files or UI components.
- Stores must not store auth tokens, API secrets, receipt images, bank alerts, or private message history.
- Derived values such as counts, completion percentages, and filtered lists should be computed with selectors or helper functions.
- Persistence logic should live in `lib/storage/` or in a small store-specific persistence wrapper.

## Mock Data Strategy

Before real integrations exist:

- Use typed fixture data in `features/*/data/`.
- Mark demo/mock data clearly in code and screen specs.
- Keep fixture data realistic but not personally identifiable.
- Do not let mock data shape become the unreviewed production schema.

## Future Backend State

A future backend becomes required when Neo needs:

- Cross-device sync.
- Multi-user staff collaboration.
- Real WhatsApp conversations.
- Real receipt uploads.
- Real AI draft generation.
- Payment or bank alert reconciliation.
- Audit logs and admin monitoring.

At that point, Zustand should hold client UI state and cached views only. It should not become the source of truth for production business data.

## Done Looks Like

State management is clear when every value has one owner, restart behavior is intentional, and sensitive data is not persisted in unsafe storage.
