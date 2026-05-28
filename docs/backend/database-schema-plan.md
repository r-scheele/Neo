# Database Schema Plan

Date: 2026-05-27

Status: local migration validated; remote push approved and applied.

Migrations:

- `supabase/migrations/20260527173000_initial_mvp_schema.sql`
- `supabase/migrations/20260528103000_initial_mvp_schema.sql`

## MVP Tables

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

## Schema Principles

- UUID primary keys.
- `created_at` and `updated_at` where useful.
- `business_id` on tenant-owned tables.
- Indexes for `business_id`, common foreign keys, status, due dates, and lookup fields.
- RLS enabled with policies deferred until B06 implements server-side permissions and audit logs.
- No raw receipt images, bank alerts, provider secrets, or webhook secrets in normal application tables.

## B03 Readiness Result

- Local Supabase reset applies the migration cleanly.
- All planned MVP tables exist locally.
- RLS is enabled on all planned application tables.
- The expected local index set is present.
- Details are recorded in `docs/backend/database-schema-readiness.md`.

## Push Result

Remote schema push was approved and completed on 2026-05-28. Both local migrations are present in the remote migration list for project ref `xtalfjnmxnwtogxgtlxn`.
