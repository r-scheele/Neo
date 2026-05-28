# Auth Strategy

Date: 2026-05-28

Status: B04 server auth/profile bootstrap implemented locally.

## Decision

Neo keeps Clerk as the Expo app auth provider. The Expo app calls Supabase Edge Functions with Clerk-authenticated requests. Edge Functions verify the Clerk session and map the actor to Supabase records.

## B02 Client Handoff

- `lib/api/useApiClient.ts` uses Clerk's `useAuth().getToken()` API.
- `lib/api/client.ts` sends the token as `Authorization: Bearer <token>`.
- Tokens are never manually persisted by Neo app code.
- Missing token/provider cases return a safe `auth_error` result.

## B04 Server Bootstrap

- Supabase Edge Functions verify Clerk session tokens with `CLERK_JWKS_URL`.
- `me-bootstrap` maps authenticated Clerk users to `profiles`.
- `setup-business` creates or returns the first business and owner membership for a signed-in user.
- Active `business_members` records are resolved before returning business context.
- Missing or invalid tokens return safe auth errors through the approved response envelope.

`CLERK_SECRET_KEY` is still pending. The current B04 implementation does not need it for JWKS token verification, but future Clerk API calls or Clerk webhook verification may require it.

## Client Boundary

- Do not manually persist Clerk auth tokens.
- Do not expose Clerk secret keys in Expo.
- Do not treat client role params or local Zustand state as authorization.

## Deferred

Authoritative role checks, audit writes, Clerk webhook processing, commerce sync, WhatsApp, and AI workflows remain deferred to later backend prompts.
