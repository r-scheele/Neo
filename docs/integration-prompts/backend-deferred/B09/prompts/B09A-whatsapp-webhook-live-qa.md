# B09A WhatsApp Webhook Live QA

## Purpose

Verify that the live Meta/WhatsApp webhook setup works with an approved test number and that inbound test messages create or update Neo conversation/message records safely.

## When To Run

Run only after:

- B07 WhatsApp workflow integration is complete and deployed.
- `META_WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `META_APP_SECRET`, `META_WHATSAPP_PHONE_NUMBER_ID`, `META_WHATSAPP_BUSINESS_ACCOUNT_ID`, and `META_WHATSAPP_ACCESS_TOKEN` exist in Supabase secrets.
- The Meta dashboard callback URL points to the deployed `whatsapp-webhook` function.
- An approved Meta/WhatsApp test sender and recipient are available.
- B09 QA rules have been read.

## Required Test Data

- Approved WhatsApp test business/account.
- Approved Meta/WhatsApp test phone number.
- Approved test sender number.
- Short non-sensitive inbound test message, clearly marked as test data.
- Expected Supabase project ref and Edge Function URL.

Do not put secret values in this prompt or in committed files.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/api-contracts.md
- docs/backend/webhook-strategy.md
- docs/backend/audit-log-retention.md
- docs/backend/live-provider-qa-plan.md
- docs/backend/live-provider-qa-results.md
- docs/backend/live-qa-test-data-policy.md
- docs/backend/provider-safety-checklist.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- supabase/functions/whatsapp-webhook/index.ts
- supabase/functions/_shared/whatsapp.ts
- supabase/migrations/

Confirm these Supabase secret names are present by name only:
- META_WHATSAPP_WEBHOOK_VERIFY_TOKEN
- META_APP_SECRET
- META_WHATSAPP_PHONE_NUMBER_ID
- META_WHATSAPP_BUSINESS_ACCOUNT_ID
- META_WHATSAPP_ACCESS_TOKEN

Do not print secret values.
If required secrets are missing, stop and report names only.

Task:
Verify live WhatsApp webhook behavior using only approved provider test numbers.

Scope:
- Verify Meta webhook challenge succeeds against the deployed callback URL.
- Send or receive one approved inbound WhatsApp test message and confirm Neo creates or updates expected conversation/message records.
- Confirm duplicate webhook events are idempotent if a safe duplicate test is available.
- Confirm raw provider payload retention follows docs/backend/audit-log-retention.md and redaction rules.
- Confirm no raw message text leaks into analytics/logs beyond approved database storage policy.

Allowed changes:
- docs/backend/live-provider-qa-results.md
- docs/backend/provider-safety-checklist.md
- docs/backend/provider-credential-rotation-plan.md
- docs/testing/ if needed
- tiny test-only scripts if absolutely needed and safe

Constraints:
- Do not implement unrelated backend features.
- Do not modify production workflows unless required for a safety fix.
- Do not send messages to non-test numbers.
- Do not print secrets.
- Do not log message/draft/prompt bodies.
- Do not rotate credentials until the credential-rotation prompt.
- Do not deploy functions.
- Do not modify production data except the approved test records created by this live QA.
- Keep the diff small and reviewable.
- If a safety issue is found, stop and document it.

Validation:
- Webhook challenge returns the expected challenge without printing the verify token.
- Inbound test message creates or updates expected test customer/conversation/message records.
- Raw webhook event exists with redaction policy applied.
- Duplicate webhook handling is documented as pass, fail, or not testable.
- Logs and analytics evidence do not contain raw message text, phone numbers, secrets, or provider tokens.
- TypeScript passes if code changed.
- Lint passes if code changed.
- No secrets printed.
- No sensitive content logged.
- QA result documented.

Stop when:
- This one QA task is complete.
- Result is documented.
- You provide files changed, commands run, what was verified, blockers, and suggested commit message.
```

## Manual Test Checklist

- [ ] Confirm approved test numbers/accounts before starting.
- [ ] Confirm required secret names exist without printing values.
- [ ] Confirm Meta dashboard callback URL targets `whatsapp-webhook`.
- [ ] Verify webhook challenge succeeds.
- [ ] Send or receive one safe inbound test message.
- [ ] Confirm a test conversation/message record exists.
- [ ] Confirm raw webhook payload is redacted according to policy.
- [ ] Confirm duplicate event behavior if safely testable.
- [ ] Check logs and analytics for unsafe content.
- [ ] Document result in `docs/backend/live-provider-qa-results.md`.

## Expected Result

Pass if webhook challenge works, inbound test message records are created or updated safely, raw payload storage is redacted, and no secrets or raw message text leak into logs or analytics.

## Failure Handling

If the webhook challenge, signature verification, redaction, idempotency, or logging safety fails, stop. Document the blocker without copying sensitive values. Do not continue to B09B until the issue is resolved or explicitly accepted.

## Suggested Commit Message

`record whatsapp webhook live qa`
