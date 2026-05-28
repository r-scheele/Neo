# Supabase Secrets Setup

Date: 2026-05-27

Status: documented, not all secrets set.

Server secrets must live in Supabase secrets, not in the Expo app.

## Required Secrets

```text
CLERK_SECRET_KEY=
CLERK_JWKS_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
META_WHATSAPP_ACCESS_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
META_WHATSAPP_BUSINESS_ACCOUNT_ID=
META_WHATSAPP_WEBHOOK_VERIFY_TOKEN=
META_APP_SECRET=
POSTHOG_PROJECT_API_KEY=
```

## Safe Setup Examples

Run only after the corresponding local shell variables are set:

```bash
supabase secrets set CLERK_SECRET_KEY="$CLERK_SECRET_KEY"
supabase secrets set CLERK_JWKS_URL="$CLERK_JWKS_URL"
supabase secrets set SUPABASE_URL="$SUPABASE_URL"
supabase secrets set SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
supabase secrets set META_WHATSAPP_ACCESS_TOKEN="$META_WHATSAPP_ACCESS_TOKEN"
supabase secrets set META_WHATSAPP_PHONE_NUMBER_ID="$META_WHATSAPP_PHONE_NUMBER_ID"
supabase secrets set META_WHATSAPP_BUSINESS_ACCOUNT_ID="$META_WHATSAPP_BUSINESS_ACCOUNT_ID"
supabase secrets set META_WHATSAPP_WEBHOOK_VERIFY_TOKEN="$META_WHATSAPP_WEBHOOK_VERIFY_TOKEN"
supabase secrets set META_APP_SECRET="$META_APP_SECRET"
supabase secrets set POSTHOG_PROJECT_API_KEY="$POSTHOG_PROJECT_API_KEY"
```

Do not print secret values. Do not commit `.env`.

## Not Set In This Pass

This foundation pass did not set provider secrets because the required local environment variables were not all present.
