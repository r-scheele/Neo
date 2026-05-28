# Auth Strategy

Date: 2026-05-28

Status: B04 server auth/profile bootstrap and B06 authorization helpers implemented and deployed.

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

## B06 Authorization Layer

- Supabase Edge Functions derive the trusted role from the active `business_members` row selected through the Clerk-authenticated profile.
- Shared permission helpers enforce owner, manager, and staff capabilities for B06 commerce and approval mutations.
- Denied sensitive writes return a safe `PERMISSION_DENIED` envelope.
- Sensitive allowed writes use server-owned audit log creation.

## Deferred

Clerk webhook processing, WhatsApp, AI workflows, OCR, payment-provider verification, and signed-in B06 audit QA remain deferred to later backend work.
