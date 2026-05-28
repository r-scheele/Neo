# Database Schema Readiness

Date: 2026-05-28

Status: B03 complete; remote schema push approved and applied.

## Local Validation

Validated against the local Supabase stack for project ref `xtalfjnmxnwtogxgtlxn`.

Commands used:

```bash
npx --yes supabase@latest db reset
docker exec supabase_db_neo psql -U postgres -d postgres -Atc "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by table_name;"
docker exec supabase_db_neo psql -U postgres -d postgres -Atc "select relname || ':' || relrowsecurity from pg_class join pg_namespace on pg_namespace.oid=pg_class.relnamespace where nspname='public' and relkind='r' order by relname;"
```

Result:

- Migrations `supabase/migrations/20260527173000_initial_mvp_schema.sql` and `supabase/migrations/20260528103000_initial_mvp_schema.sql` apply cleanly.
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

- RLS policies are not implemented yet. B04 added the server auth/profile bootstrap; B06 still needs authoritative permissions and audit enforcement before production feature endpoints rely on the schema.
- Storage buckets and storage policies are documented but not created remotely.
- B05 endpoint contracts are approved. B06-B08 still need implementation-level review.
- `ai_drafts.draft_text`, WhatsApp message previews, and raw webhook payload storage need privacy review during their feature prompts before real customer data is stored.

## Remote Push Result

Remote push was approved and completed on 2026-05-28 for project ref `xtalfjnmxnwtogxgtlxn`.

Verified migration list:

```text
Local          | Remote
20260527173000 | 20260527173000
20260528103000 | 20260528103000
```

Notes:

- The second migration produced expected already-exists notices because it is idempotent with the first local schema foundation.
- Do not commit or print `SUPABASE_DB_PASSWORD`.

## Next Backend Prompt

Run `docs/integration-prompts/backend-deferred/prompts/B05-commerce-records-backend-sync.md` next.
