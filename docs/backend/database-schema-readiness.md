# Database Schema Readiness

Date: 2026-05-28

Status: B03 complete locally; remote schema push deferred until explicit confirmation.

## Local Validation

Validated against the local Supabase stack for project ref `xtalfjnmxnwtogxgtlxn`.

Commands used:

```bash
npx --yes supabase@latest db reset
docker exec supabase_db_neo psql -U postgres -d postgres -Atc "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by table_name;"
docker exec supabase_db_neo psql -U postgres -d postgres -Atc "select relname || ':' || relrowsecurity from pg_class join pg_namespace on pg_namespace.oid=pg_class.relnamespace where nspname='public' and relkind='r' order by relname;"
```

Result:

- Migration `supabase/migrations/20260527173000_initial_mvp_schema.sql` applies cleanly.
- Seed file runs and remains intentionally empty.
- All 15 planned MVP tables exist locally.
- RLS is enabled on all planned application tables.
- The expected local index set is present.
- Local Supabase API endpoints are available.

## Tables Verified

- `profiles`
- `businesses`
- `business_members`
- `customers`
- `orders`
- `order_items`
- `receipts`
- `follow_ups`
- `approvals`
- `whatsapp_conversations`
- `whatsapp_messages`
- `ai_drafts`
- `media_assets`
- `audit_logs`
- `raw_webhook_events`

## Known Gaps Before Feature Work

- RLS policies are not implemented yet. B04 must add the server auth/profile bootstrap before production feature endpoints rely on the schema.
- Remote schema push has not been run.
- Storage buckets and storage policies are documented but not created remotely.
- Feature-specific endpoint contracts for B05-B08 still need implementation-level review.
- `ai_drafts.draft_text`, WhatsApp message previews, and raw webhook payload storage need privacy review during their feature prompts before real customer data is stored.

## Remote Push Decision

Remote push is explicitly deferred in this pass.

When the remote push is approved, use:

```bash
export SUPABASE_DB_PASSWORD="..."
npx --yes supabase@latest db push
```

Risk note:

- This changes the linked remote Supabase database for project `xtalfjnmxnwtogxgtlxn`.
- Review the migration before pushing.
- Confirm there is no production data that needs backup or migration handling.
- Do not print or commit `SUPABASE_DB_PASSWORD`.

## Next Backend Prompt

Run `docs/integration-prompts/backend-deferred/prompts/B04-server-auth-profile-bootstrap.md` next if Clerk server verification inputs are ready.
