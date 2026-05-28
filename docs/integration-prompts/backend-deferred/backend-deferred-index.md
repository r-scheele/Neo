# Backend Deferred Prompt Index

Status values: `Blocked`, `Ready`, `Complete`, `Deferred`.

All prompts in this index are Phase B. B01 Supabase foundation, B02 API/auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, B05 commerce records backend sync, B06 permissions/audit logging, and B07 WhatsApp workflow integration are complete. Continue in numeric order. External-provider prompts stay later so the next numbered prompt is actually runnable.

| Order | Integration | Prompt File | Status | Unlocking Decisions | Suggested Commit |
| --- | --- | --- | --- | --- | --- |
| B01 | Backend provider decision | `prompts/B01-backend-provider-decision.md` | Complete | Supabase project linked; local `supabase/` foundation scaffolded | `document supabase backend foundation` |
| B02 | API client and auth boundary | `prompts/B02-api-client-and-auth-boundary.md` | Complete | `lib/api/` client boundary, Clerk token handoff, safe error parsing | `add api client boundary` |
| B03 | Database schema readiness | `prompts/B03-database-schema-readiness.md` | Complete | Local migration validated; remote schema pushed | `verify supabase schema readiness` |
| B04 | Server auth and profile bootstrap | `prompts/B04-server-auth-profile-bootstrap.md` | Complete | JWKS verification, profile bootstrap, and setup-business bootstrap exist | `add server auth bootstrap` |
| B05 | Commerce records backend sync | `prompts/B05-commerce-records-backend-sync.md` | Complete | Commerce functions deployed; client sync wiring added | `connect commerce records sync` |
| B06 | Server-side permissions and audit logs | `prompts/B06-server-side-permissions-audit-logs.md` | Complete | Trusted role checks, denied-write responses, and audit writes for current sensitive commerce endpoints | `enforce server permissions` |
| B07 | WhatsApp workflow integration | `prompts/B07-whatsapp-workflow-integration.md` | Complete | Meta WhatsApp secrets in Supabase secrets; webhook/send/status/conversation endpoints implemented | `connect whatsapp workflow` |
| B08 | AI draft generation backend | `prompts/B08-ai-draft-generation-backend.md` | Deferred | B04 plus AI provider secret, prompt policy, and B07 if live WhatsApp context is required | `connect ai draft workflow` |

## Current Backend Foundation

- Supabase project ref: `xtalfjnmxnwtogxgtlxn`
- Supabase URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co`
- Edge Functions base URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`
- Local migrations exist, validate locally, and are applied to the remote Supabase project.
- Edge Function foundations exist. `orders`, `customers`, `receipts`, `follow-ups`, `approvals`, `whatsapp-send-message`, and `whatsapp-webhook` are implemented for the current backend passes.
- `CLERK_JWKS_URL` and Meta WhatsApp secrets are set in Supabase secrets. `CLERK_SECRET_KEY` remains pending for future Clerk API/webhook needs.

## Next Prompt

Run `prompts/B08-ai-draft-generation-backend.md` only after the AI provider secret, prompt policy, and endpoint contracts are approved.

Until B08 is complete, keep AI and remaining external-provider workflows disabled or clearly marked as dev/demo behavior.
