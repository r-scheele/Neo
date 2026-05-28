# Database Schema Plan

Date: 2026-05-27

Status: local migration validated; remote push deferred until explicit confirmation.

Migration:

- `supabase/migrations/20260527173000_initial_mvp_schema.sql`

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
- RLS enabled with policies deferred until B04 implements server auth/profile bootstrap.
- No raw receipt images, bank alerts, provider secrets, or webhook secrets in normal application tables.

## B03 Readiness Result

- Local Supabase reset applies the migration cleanly.
- All planned MVP tables exist locally.
- RLS is enabled on all planned application tables.
- The expected local index set is present.
- Details are recorded in `docs/backend/database-schema-readiness.md`.

## Push Policy

Do not run `supabase db push` until the migration is reviewed and explicitly approved. B03 defers remote push.
