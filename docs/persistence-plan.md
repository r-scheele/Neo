# Persistence Plan

Status: Partial local MVP implementation. AsyncStorage helpers and setup/preference persistence exist; production sign-out clearing is wired through Clerk, operations/connectivity state is runtime-only, and sensitive-data boundaries still need integration hardening.

## Persistence Decision

Use AsyncStorage only for small, safe local data in V1. Do not add a database in the Expo client.

AsyncStorage is not secure storage and must not hold secrets, auth tokens, raw customer conversations, receipt images, bank alerts, or sensitive payment proof.

## Persistence Inventory

| Data | Persist? | Storage | Sensitive? | Clear On Sign-Out? | Notes |
| --- | --- | --- | --- | --- | --- |
| Onboarding/setup completion | Yes | AsyncStorage | Low | Yes | Required to resume setup |
| Setup task progress | Yes | AsyncStorage | Low/Medium | Yes | Store status, not sensitive documents |
| Business profile draft | Maybe | AsyncStorage | Medium | Yes | Avoid sensitive details; production source moves to backend |
| Business type | Yes | AsyncStorage | Low | Yes | Useful for defaults |
| AI tone preferences | Yes | AsyncStorage | Low/Medium | Yes | No private examples or message text |
| Payment rule setup status | Yes | AsyncStorage | Medium | Yes | Do not store secret bank/provider credentials |
| Delivery zone drafts | Maybe | AsyncStorage | Medium | Yes | Safe enough for local draft; backend later |
| Product basics drafts | Maybe | AsyncStorage | Medium | Yes | Keep small and clear on sign-out |
| UI preferences | Yes | AsyncStorage | Low | Optional | Dismissed tips, selected non-sensitive view options |
| Draft replies | Maybe | AsyncStorage | Medium/High | Yes | Only if product approves local draft persistence; not owned by Zustand today |
| Customer messages | No | Future backend | High | N/A | Do not persist private chat history locally for production |
| Receipt images | No | Future backend/media storage | High | N/A | Do not store in AsyncStorage |
| Bank alerts/payment proof | No | Future backend | High | N/A | Requires secure backend handling |
| Auth tokens | No | Clerk-managed | High | Provider-managed | Never manually persist |
| Analytics queue | Provider-managed | PostHog SDK | Medium | Provider-managed | Must exclude sensitive event data |

## Storage Key Plan

Use namespaced keys:

```text
@neo/setup-progress
@neo/setup-drafts
@neo/user-preferences
@neo/ui-state
@neo/local-drafts
@neo/mock-data-version
```

Do not create keys for secrets, tokens, receipt images, raw chats, or payment proof.

## Migration Rules

If persisted data can change shape:

- Include a version field.
- Parse unknown data before using it.
- Provide defaults for missing fields.
- Treat corrupt data as recoverable.
- Never crash the app because local persisted data is malformed.

## Offline Rules

V1 offline support is limited:

- Show cached setup state and safe local queues where available.
- Disable risky actions while offline.
- Do not send replies while offline.
- Do not confirm payments while offline.
- Do not introduce offline action queues without explicit product approval.

## Future Persistence

A database or backend storage becomes required before production launch of:

- Real WhatsApp message sync.
- Real customer profiles.
- Orders and order history.
- Receipt uploads and review records.
- Team access and permissions.
- Cross-device sync.
- Admin monitoring and audit logs.

The database choice is intentionally deferred.

## Done Looks Like

Persistence is ready when restart behavior is predictable, local data is safe to store, user-specific data clears on sign-out, and production-sensitive data waits for a proper backend.
