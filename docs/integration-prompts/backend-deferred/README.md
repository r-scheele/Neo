# Backend Deferred Integration Prompts

This folder holds Phase B prompts. They are required for a real backend-backed MVP.

B01 Supabase backend foundation, B02 API/client auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, and B05 commerce records backend sync are complete. The remote schema is pushed and B05 commerce functions are deployed.

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

1. Approve the B06 role/audit contract, then run `prompts/B06-server-side-permissions-audit-logs.md`.
2. Verify, review, and commit.
3. Continue through B06-B08 one prompt at a time only after each prompt's required secrets/contracts exist.

Do not run remote schema pushes or configure WhatsApp/OpenAI/payment behavior from this folder unless the active prompt explicitly scopes that work.

## Current Phase B Order

| Order | Prompt | Run Now? |
| --- | --- | --- |
| B01 | Supabase backend foundation | Complete |
| B02 | API client and auth boundary | Complete |
| B03 | Database schema readiness | Complete |
| B04 | Server auth and profile bootstrap | Complete |
| B05 | Commerce records backend sync | Complete |
| B06 | Server-side permissions and audit logs | Yes |
| B07 | WhatsApp workflow integration | Not until B04 and Meta WhatsApp secrets/contracts are ready |
| B08 | AI draft generation backend | Not until B04 and AI provider prompt/secrets are ready |
