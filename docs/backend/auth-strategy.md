# Auth Strategy

Date: 2026-05-27

Status: client boundary complete; server verification implementation deferred.

## Decision

Neo keeps Clerk as the Expo app auth provider. The Expo app will call Supabase Edge Functions with Clerk-authenticated requests. Edge Functions will verify the Clerk session and map the actor to Supabase records.

## B02 Client Handoff

- `lib/api/useApiClient.ts` uses Clerk's `useAuth().getToken()` API.
- `lib/api/client.ts` sends the token as `Authorization: Bearer <token>`.
- Tokens are never manually persisted by Neo app code.
- Missing token/provider cases return a safe `auth_error` result.

## Required Server Behavior

- Verify Clerk tokens server-side.
- Map Clerk users to `profiles`.
- Resolve active `business_members` records before sensitive reads/writes.
- Reject unauthorized writes regardless of client UI state.
- Return safe `permission_denied` style errors without leaking private data.

## Client Boundary

- Do not manually persist Clerk auth tokens.
- Do not expose Clerk secret keys in Expo.
- Do not treat client role params or local Zustand state as authorization.

## Deferred

Edge Functions still need server-side Clerk token verification, profile bootstrap, business membership lookup, and authoritative role checks.
