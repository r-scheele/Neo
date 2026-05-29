# Backend Deferred Integration Prompts

This folder holds Phase B prompts. They are required for a real backend-backed MVP.

B01 Supabase backend foundation, B02 API/client auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, B05 commerce records backend sync, B06 permissions/audit logging, B07 WhatsApp workflow integration, and B08 AI draft generation backend are complete for MVP wiring. B09 live provider QA and credential rotation is planned and split into B09A-B09G. The remote schema is pushed and the implemented commerce/WhatsApp/AI draft functions are deployed or ready to deploy.

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

1. Verify, review, and commit each remaining launch-hardening or later integration prompt.
2. Continue one prompt at a time only after each prompt's required secrets/contracts exist.
3. Run B09 one sub-prompt at a time. Do not run B09A-B09G as one batch.
4. Rotate shared test provider credentials only in B09F.

Do not run remote schema pushes or configure WhatsApp/OpenAI/payment behavior from this folder unless the active prompt explicitly scopes that work.

Web dashboard, marketing, deployment, and signup/waitlist prompts live separately in `../deferred-web-marketing/` and are not part of B09.

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
| B08 | AI draft generation backend | Complete |
| B09 | Live provider QA and credential rotation | Planned; split into B09A-B09G |
