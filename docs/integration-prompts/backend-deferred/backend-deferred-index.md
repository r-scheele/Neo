# Backend Deferred Prompt Index

Status values: `Blocked`, `Ready`, `Complete`, `Deferred`.

All prompts in this index are Phase B. B01 Supabase foundation, B02 API/auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, B05 commerce records backend sync, and B06 server-side permissions/audit logs are complete. Continue in numeric order only when each prompt's secrets/contracts are ready.

| Order | Integration | Prompt File | Status | Unlocking Decisions | Suggested Commit |
| --- | --- | --- | --- | --- | --- |
| B01 | Backend provider decision | `prompts/B01-backend-provider-decision.md` | Complete | Supabase project linked; local `supabase/` foundation scaffolded | `document supabase backend foundation` |
| B02 | API client and auth boundary | `prompts/B02-api-client-and-auth-boundary.md` | Complete | `lib/api/` client boundary, Clerk token handoff, safe error parsing | `add api client boundary` |
| B03 | Database schema readiness | `prompts/B03-database-schema-readiness.md` | Complete | Local migration validated; remote schema pushed | `verify supabase schema readiness` |
| B04 | Server auth and profile bootstrap | `prompts/B04-server-auth-profile-bootstrap.md` | Complete | JWKS verification, profile bootstrap, and setup-business bootstrap exist | `add server auth bootstrap` |
| B05 | Commerce records backend sync | `prompts/B05-commerce-records-backend-sync.md` | Complete | Commerce functions deployed; client sync wiring added | `connect commerce records sync` |
| B06 | Server-side permissions and audit logs | `prompts/B06-server-side-permissions-audit-logs.md` | Complete; signed-in QA pending before release | Shared permission/audit helper, order/receipt/follow-up/approval authorization, denied-write responses, audit writes, and deployed Edge Functions | `enforce server permissions` |
| B07 | WhatsApp workflow integration | `prompts/B07-whatsapp-workflow-integration.md` | Deferred | B04 plus Meta WhatsApp token/webhook/media secrets and contracts | `connect whatsapp workflow` |
| B08 | AI draft generation backend | `prompts/B08-ai-draft-generation-backend.md` | Deferred | B04 plus AI provider secret, prompt policy, and B07 if live WhatsApp context is required | `connect ai draft workflow` |

## Current Backend Foundation

- Supabase project ref: `xtalfjnmxnwtogxgtlxn`
- Supabase URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co`
- Edge Functions base URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`
- Local migrations exist, validate locally, and are applied to the remote Supabase project.
- Edge Function foundations exist. `orders`, `customers`, `receipts`, `follow-ups`, `approvals`, `me-bootstrap`, and `setup-business` are deployed.
- `CLERK_JWKS_URL` is set in Supabase secrets. `CLERK_SECRET_KEY` remains pending for future Clerk API/webhook needs.

## Next Prompt

B06 is complete and deployed. Do not treat permissions/audit enforcement as release-confirmed until signed-in Clerk QA confirms owner/manager/staff behavior and audit rows.

Next backend work is B07 only after Meta WhatsApp secrets/contracts are ready. Until B07-B08 are complete, keep WhatsApp, AI, OCR, payment-provider, and external-provider workflows disabled or clearly marked as dev/demo behavior.
