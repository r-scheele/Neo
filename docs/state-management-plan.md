# State Management Plan

Status: Draft state plan. No stores have been created yet.

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
| Today queue mock data | Feature data or Zustand | Optional | Use typed fixtures first; store only if shared |
| Inbox mock conversations | Feature data or Zustand | No for real messages | Do not persist private messages in AsyncStorage for production |
| AI draft review state | Local or Zustand | Draft only | Do not store sensitive generated text long-term locally |
| Receipt review UI state | Local component state | No | Do not persist receipt images or payment proof locally |
| User session | Clerk | Clerk-managed | Do not duplicate tokens in Zustand |
| UI preferences | Zustand | Yes, AsyncStorage | Safe values such as dismissed tips |

## Planned Stores

Create stores only when the relevant feature is implemented.

| Store | Purpose | Create When |
| --- | --- | --- |
| `useSetupStore` | Setup progress, setup drafts, next required task | Setup Checklist is implemented |
| `useUserPreferencesStore` | Safe UI preferences and dismissed education | First preference must survive restart |
| `useOperationsStore` | Shared Today queue, approval counts, follow-up counts for mock/local app state | Today data is shared by multiple tabs |
| `useDraftStore` | Safe local unsent drafts | Conversation or follow-up drafts need restart recovery |
| `useConnectivityStore` | Online/offline and last synced UI state | Offline states are implemented |

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

