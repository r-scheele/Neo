# B04 Server Auth And Profile Bootstrap Prompt

Status:
Complete locally. `CLERK_JWKS_URL` is set and used for Clerk JWT verification. `CLERK_SECRET_KEY` remains pending for future Clerk API or webhook work.

Do not run this prompt until:
- B01 Supabase foundation is complete
- B02 API client and auth boundary is complete
- B03 database schema readiness is complete or its remote push decision is explicitly deferred
- Clerk backend verification strategy is approved
- Required Supabase secrets are available locally for setting, or already set in Supabase

## When to run this prompt

Run after B03. This prompt creates the server-owned auth bootstrap needed before feature APIs can safely read or write business data.

## What this prompt will do

Implement only the Supabase Edge Function auth foundation: Clerk token verification, safe actor/profile lookup, `me-bootstrap`, and shared function helpers. It must not implement WhatsApp, AI, commerce sync, permissions/audit enforcement, or fixture replacement.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- supabase/config.toml
- supabase/functions/
- supabase/functions/_shared/
- supabase/functions/me-bootstrap/
- supabase/functions/setup-business/
- supabase/migrations/
- docs/backend/auth-strategy.md
- docs/backend/api-contracts.md
- docs/backend/env-vars.md
- docs/backend/backend-implementation-roadmap.md
- docs/security-and-secrets-plan.md
- docs/backend-api-boundary.md
- lib/api/

Also verify that the approved backend auth strategy is Clerk-authenticated requests to Supabase Edge Functions.

If any required file or decision is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only the server auth/profile bootstrap boundary.

Scope:
- Add shared Supabase Edge Function helpers for CORS, response envelopes, safe errors, and Clerk token verification.
- Use Supabase secrets for Clerk verification inputs; do not put secrets in client code.
- Implement `me-bootstrap` so an authenticated Clerk user can resolve or create a safe `profiles` row according to the approved schema.
- Implement the minimum `setup-business` bootstrap needed to create/select a business only if the approved contract already covers it.
- Return the approved success/failure response envelope.
- Keep unauthenticated and permission-denied cases safe and non-leaky.
- Update backend prompt status docs.

Constraints:
- Do not implement WhatsApp, AI draft generation, commerce record sync, receipt OCR, payment verification, or audit logs.
- Do not replace fixture data in the app.
- Do not put Clerk secret keys, Supabase service role keys, database passwords, OpenAI keys, Meta tokens, or webhook secrets in Expo code.
- Do not print secret values.
- Do not commit `.env`.
- Do not deploy functions to production unless explicitly requested.
- Keep the diff small and reviewable.

Validation:
- npm run typecheck passes.
- npm run lint passes.
- Local Supabase functions compile or serve if the local stack supports it.
- `me-bootstrap` returns a safe auth error without a token.
- `me-bootstrap` returns the approved envelope for an authenticated test request if a valid local test token is available.
- No secrets appear in tracked files or logs.

Stop when:
- Server auth/profile bootstrap is complete or blocked with exact missing secrets/input.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`add server auth bootstrap`
