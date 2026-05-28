# Backend Deferred Integration Prompts

This folder holds Phase B prompts. They are required for a real backend-backed MVP.

B01 Supabase backend foundation, B02 API/client auth boundary, and B03 database schema readiness are complete. Continue with B04 next if Clerk server verification inputs are ready.

Approved B01 foundation:

- Backend provider: Supabase.
- Database/schema direction: Supabase Postgres with local MVP migration scaffold.
- Deployment target: Supabase Edge Functions.
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`.
- Clerk-to-backend auth handoff strategy: Clerk-authenticated requests to Edge Functions.
- Media storage: Supabase Storage.
- Webhook strategy: Supabase Edge Functions.
- Audit log retention: 180-day MVP planning target.

The active runnable prompt sequence lives in `../integration-prompt-index.md`.

## How To Use Later

1. Run `prompts/B04-server-auth-profile-bootstrap.md` if Clerk server verification inputs are ready.
2. Verify, review, and commit.
3. Continue through B04-B08 one prompt at a time only after each prompt's required secrets/contracts exist.

Do not replace fixture data, run remote schema pushes, or configure WhatsApp/OpenAI/payment behavior from this folder unless the active prompt explicitly scopes that work.

## Current Phase B Order

| Order | Prompt | Run Now? |
| --- | --- | --- |
| B01 | Supabase backend foundation | Complete |
| B02 | API client and auth boundary | Complete |
| B03 | Database schema readiness | Complete |
| B04 | Server auth and profile bootstrap | Yes if Clerk server verification inputs are ready |
| B05 | Commerce records backend sync | Not until B03-B04 are complete |
| B06 | Server-side permissions and audit logs | Not until B05 is complete |
| B07 | WhatsApp workflow integration | Not until B04 and Meta WhatsApp secrets/contracts are ready |
| B08 | AI draft generation backend | Not until B04 and AI provider prompt/secrets are ready |
