# Backend Deferred Integration Prompts

This folder holds Phase B prompts. They are required for a real backend-backed MVP.

B01 Supabase backend foundation, B02 API/client auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, B05 commerce records backend sync, B06 permissions/audit logging, and B07 WhatsApp workflow integration are complete for MVP wiring. The remote schema is pushed and the implemented commerce/WhatsApp functions are deployed.

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

1. Do not run `prompts/B08-ai-draft-generation-backend.md` until the required AI provider secret, prompt policy, and endpoint contracts are approved.
2. Verify, review, and commit.
3. Continue through B07-B08 one prompt at a time only after each prompt's required secrets/contracts exist.

Do not run remote schema pushes or configure WhatsApp/OpenAI/payment behavior from this folder unless the active prompt explicitly scopes that work.

## Current Phase B Order

| Order | Prompt | Run Now? |
| --- | --- | --- |
| B01 | Supabase backend foundation | Complete |
| B02 | API client and auth boundary | Complete |
| B03 | Database schema readiness | Complete |
| B04 | Server auth and profile bootstrap | Complete |
| B05 | Commerce records backend sync | Complete |
| B06 | Server-side permissions and audit logs | Complete |
| B07 | WhatsApp workflow integration | Complete |
| B08 | AI draft generation backend | Not until B04 and AI provider prompt/secrets are ready |
