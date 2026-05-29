# Backend Deferred Prompt Index

Status values: `Blocked`, `Ready`, `Planned`, `Complete`, `Deferred`.

All prompts in this index are Phase B. B01 Supabase foundation, B02 API/auth boundary, B03 database schema readiness, B04 server auth/profile bootstrap, B05 commerce records backend sync, B06 permissions/audit logging, B07 WhatsApp workflow integration, and B08 AI draft generation backend are complete for MVP wiring. B09 is planned as split live-provider QA and credential-rotation prompts.

Monorepo note: backend prompts target `supabase/` plus client API boundaries in `apps/mobile` or future `apps/web`. They should not target the public marketing site except for harmless public CTA/config references.

| Order | Integration | Prompt File | Status | Unlocking Decisions | Suggested Commit |
| --- | --- | --- | --- | --- | --- |
| B01 | Backend provider decision | `prompts/B01-backend-provider-decision.md` | Complete | Supabase project linked; local `supabase/` foundation scaffolded | `document supabase backend foundation` |
| B02 | API client and auth boundary | `prompts/B02-api-client-and-auth-boundary.md` | Complete | `lib/api/` client boundary, Clerk token handoff, safe error parsing | `add api client boundary` |
| B03 | Database schema readiness | `prompts/B03-database-schema-readiness.md` | Complete | Local migration validated; remote schema pushed | `verify supabase schema readiness` |
| B04 | Server auth and profile bootstrap | `prompts/B04-server-auth-profile-bootstrap.md` | Complete | JWKS verification, profile bootstrap, and setup-business bootstrap exist | `add server auth bootstrap` |
| B05 | Commerce records backend sync | `prompts/B05-commerce-records-backend-sync.md` | Complete | Commerce functions deployed; client sync wiring added | `connect commerce records sync` |
| B06 | Server-side permissions and audit logs | `prompts/B06-server-side-permissions-audit-logs.md` | Complete | Trusted role checks, denied-write responses, and audit writes for current sensitive commerce endpoints | `enforce server permissions` |
| B07 | WhatsApp workflow integration | `prompts/B07-whatsapp-workflow-integration.md` | Complete | Meta WhatsApp secrets in Supabase secrets; webhook/send/status/conversation endpoints implemented | `connect whatsapp workflow` |
| B08 | AI draft generation backend | `prompts/B08-ai-draft-generation-backend.md` | Complete | Server-side OpenAI secret configured; minimized WhatsApp context, guardrail routing, and approval queue wiring implemented | `connect ai draft workflow` |
| B09 | Live provider QA and credential rotation | `prompts/B09-live-provider-qa-and-credential-rotation.md` plus `B09/prompts/B09A-B09G` | Planned | Run one B09 prompt at a time; use approved test providers only; rotate shared test credentials after QA | `add B09 live provider qa prompts` |

## Current Backend Foundation

- Supabase project ref: `xtalfjnmxnwtogxgtlxn`
- Supabase URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co`
- Edge Functions base URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`
- Future web dashboard public API base URL env var: `NEXT_PUBLIC_API_BASE_URL`
- Local migrations exist, validate locally, and are applied to the remote Supabase project.
- Edge Function foundations exist. `orders`, `customers`, `receipts`, `follow-ups`, `approvals`, `whatsapp-send-message`, `whatsapp-webhook`, and `ai-drafts` are implemented for the current backend passes.
- `CLERK_JWKS_URL`, Meta WhatsApp secrets, and `OPENAI_API_KEY` are set in Supabase secrets. `CLERK_SECRET_KEY` remains pending for future Clerk API/webhook needs.

## Next Prompt

Run `B09/prompts/B09A-whatsapp-webhook-live-qa.md` first only when approved test numbers/accounts are ready. Do not run all B09 prompts at once.

Deferred web/marketing/dashboard work is tracked separately in `docs/integration-prompts/deferred-web-marketing/` and is not part of B09.
