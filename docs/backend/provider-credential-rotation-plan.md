# Provider Credential Rotation Plan

Date: 2026-05-29

Status: Planned. Do not rotate credentials until B09F.

## Purpose

Rotate shared provider test credentials after live QA without printing or committing old or new values.

## Credentials In Scope For B09F

Test credentials only:

- `OPENAI_API_KEY`
- `META_WHATSAPP_ACCESS_TOKEN`
- `META_APP_SECRET`
- `META_WHATSAPP_WEBHOOK_VERIFY_TOKEN` if it was shared during testing

Not automatically in scope:

- Production credentials.
- Supabase service role key.
- Clerk secret key.
- Database passwords.
- Public Expo or Next.js env values.

## Rotation Rules

- Rotate only after B09A-B09E are complete or explicitly waived.
- Confirm the credentials are test credentials.
- Use provider dashboards or secure local environment variables for new values.
- Set Supabase secrets without printing values.
- Revoke old credentials in provider dashboards where possible.
- Document secret names only.
- Run approved test smoke checks after rotation.

## Safe Commands Pattern

Use shell variables that are already set locally and do not echo them:

```bash
supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
supabase secrets set META_WHATSAPP_ACCESS_TOKEN="$META_WHATSAPP_ACCESS_TOKEN"
supabase secrets set META_APP_SECRET="$META_APP_SECRET"
supabase secrets set META_WHATSAPP_WEBHOOK_VERIFY_TOKEN="$META_WHATSAPP_WEBHOOK_VERIFY_TOKEN"
```

Do not paste the values into terminal commands, docs, commits, or chat.

## Rotation Record Template

| Secret Name | Provider | Environment | Rotated? | Old Credential Revoked? | Verification |
| --- | --- | --- | --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI | Test | Pending | Pending | Pending |
| `META_WHATSAPP_ACCESS_TOKEN` | Meta | Test | Pending | Pending | Pending |
| `META_APP_SECRET` | Meta | Test | Pending | Pending | Pending |
| `META_WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Meta/Supabase | Test | Pending | Pending | Pending |

## Failure Handling

If new credentials fail:

- Do not print values.
- Stop provider QA.
- Document the failing secret name and safe error category.
- Restore only through secure secret handling if explicitly approved.
