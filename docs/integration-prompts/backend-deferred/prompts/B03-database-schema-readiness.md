# B03 Database Schema Readiness Prompt

Status:
Complete. Local Supabase reset applies the MVP schema migration cleanly, planned tables/RLS/indexes are verified, and remote schema push is explicitly deferred.

Do not run this prompt until:
- B01 Supabase foundation is complete
- B02 API client and auth boundary is complete
- Docker is available if local Supabase validation is required
- `supabase/` exists and is linked to the approved project

## When to run this prompt

This prompt was run immediately after B02 because commerce, auth bootstrap, permissions, WhatsApp, and AI backend work all need a reviewed database foundation.

## What this prompt will do

Verify the MVP schema migration against the approved backend docs, run local Supabase schema validation, document any schema gaps, and prepare the remote `supabase db push` decision. It must not push to the remote database unless the prompt explicitly receives confirmation to do so.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- supabase/config.toml
- supabase/migrations/
- supabase/seed.sql
- docs/backend/database-schema-plan.md
- docs/backend/api-contracts.md
- docs/backend/env-vars.md
- docs/backend/backend-implementation-roadmap.md
- docs/backend-api-boundary.md
- docs/integration-prompts/backend-deferred/backend-deferred-index.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only database schema readiness.

Scope:
- Review the local MVP migration against the approved schema docs.
- Confirm the local Supabase project is linked to the approved project ref.
- Run local Supabase schema validation/reset only if Docker is available.
- Document any schema gaps before feature endpoints depend on them.
- Prepare the exact remote `supabase db push` command and risk note.
- Run `supabase db push` only if I explicitly confirm remote schema push in this prompt.
- Update backend prompt status docs if schema readiness is complete or blocked.

Constraints:
- Do not implement WhatsApp, AI, commerce sync, permissions, audit logs, OCR, or payment verification.
- Do not replace fixture data.
- Do not deploy Edge Functions.
- Do not run remote database changes without explicit confirmation.
- Do not print or commit secrets.
- Do not commit `.env`.
- Keep the diff small and reviewable.

Validation:
- Local Supabase migration applies cleanly, or the exact local validation blocker is documented.
- npm run typecheck passes.
- npm run lint passes.
- Supabase local status is checked if the local stack is running.
- Remote schema push is either explicitly confirmed and completed, or explicitly deferred.

Stop when:
- Database schema readiness is complete or blocked with exact missing input.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`verify supabase schema readiness`
