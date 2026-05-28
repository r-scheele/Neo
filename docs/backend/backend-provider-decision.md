# Backend Provider Decision

Date: 2026-05-27

Status: complete for B01 foundation.

## Selected Provider

Supabase is selected for Neo's backend provider.

## Why Supabase Fits Neo

- Supabase Postgres gives Neo durable relational records for businesses, members, customers, orders, receipts, follow-ups, conversations, approvals, media references, and audit logs.
- Supabase Edge Functions provide a server-owned API boundary for Clerk-authenticated mobile requests.
- Supabase Storage supports private receipt, product, customer, WhatsApp, and business media buckets.
- Supabase secrets keep OpenAI, Meta, Clerk, webhook, service role, and other private credentials out of the Expo app.

## Project

- Project ref: `xtalfjnmxnwtogxgtlxn`
- Region: `eu-west-1`
- Linked locally through the Supabase CLI.

## Still Deferred

- Typed mobile API client in `lib/api/`.
- Clerk token verification inside Edge Functions.
- WhatsApp Cloud API integration.
- AI provider calls.
- Commerce record sync from fixture data.
- Server-side permissions and audit writes.
