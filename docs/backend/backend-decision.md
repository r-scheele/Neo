# Backend Decision

Date: 2026-05-27

Status: approved foundation, not feature-complete.

## Decision

Neo will use Supabase for the backend foundation:

- Backend provider: Supabase
- Database: Supabase Postgres
- Backend execution: Supabase Edge Functions
- Media storage: Supabase Storage
- Auth provider in the Expo app: Clerk
- Backend auth strategy: Clerk-authenticated requests to Supabase Edge Functions
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`
- Public Supabase env vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Existing Supabase project:

- Project name: Neo
- Project ref: `xtalfjnmxnwtogxgtlxn`
- Region: `eu-west-1`
- Supabase URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co`
- Edge Functions API base URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`

## Boundary

This decision creates the backend foundation only. It does not complete WhatsApp sync, AI draft generation, commerce sync, payment verification, permissions, or audit logs.

Do not put server secrets in the Expo app. Server secrets belong in Supabase secrets.
