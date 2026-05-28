# Backend Environment Variables

Date: 2026-05-27

Status: placeholders documented; real values stay outside git.

## Public Expo Env Vars

These may appear in `.env.example` with empty values:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=
```

Use these value shapes locally:

```text
EXPO_PUBLIC_SUPABASE_URL=https://xtalfjnmxnwtogxgtlxn.supabase.co
EXPO_PUBLIC_API_BASE_URL=https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1
```

Do not commit `.env`.

## Local CLI-Only Env Vars

Use local shell exports or a secure local secret manager for CLI-only values:

```bash
export SUPABASE_DB_PASSWORD="..."
export SUPABASE_ACCESS_TOKEN="..."
```

Do not put database passwords or access tokens in Expo client code.

## Supabase Edge Function Secrets

Store server secrets with `supabase secrets set`, not in the Expo app. See `docs/backend/supabase-secrets-setup.md`.
