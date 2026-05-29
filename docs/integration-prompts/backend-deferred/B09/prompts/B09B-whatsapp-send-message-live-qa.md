# B09B WhatsApp Send Message Live QA

## Purpose

Verify that Neo can send one safe WhatsApp message through the server-side Meta integration to an approved test recipient only.

## When To Run

Run only after:

- B09A is complete or its blockers are explicitly waived.
- The approved test recipient is confirmed.
- `whatsapp-send-message` is deployed.
- Meta WhatsApp test credentials are present in Supabase secrets by name.
- B09 QA rules have been read.

## Required Test Data

- Approved test recipient phone number.
- Approved test business/conversation record.
- One short safe test message, clearly marked as test data.
- Test Clerk account with owner or manager permissions, if exercising the authenticated client path.

Do not use real customer numbers.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/api-contracts.md
- docs/backend/auth-strategy.md
- docs/backend/env-vars.md
- docs/backend/live-provider-qa-plan.md
- docs/backend/live-provider-qa-results.md
- docs/backend/live-qa-test-data-policy.md
- docs/backend/provider-safety-checklist.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- supabase/functions/whatsapp-send-message/index.ts
- supabase/functions/_shared/permissions.ts
- apps/mobile/
- packages/shared/

Confirm these Supabase secret names are present by name only:
- META_WHATSAPP_ACCESS_TOKEN
- META_WHATSAPP_PHONE_NUMBER_ID
- META_WHATSAPP_BUSINESS_ACCOUNT_ID

Do not print secret values.
If required secrets are missing, stop and report names only.

Task:
Send one safe WhatsApp test message to an approved test recipient only.

Scope:
- Confirm the send endpoint/function uses the server-side Meta token only.
- Confirm no Meta token exists in client code, mobile env placeholders, or shared packages.
- Send one safe test message to the approved test recipient through the authenticated backend path.
- Confirm the send result is recorded safely.
- Confirm provider errors use safe response envelopes if an error occurs.

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
- Keep the diff small and reviewable.
- If a safety issue is found, stop and document it.

Validation:
- Exactly one WhatsApp send attempt is made to an approved test recipient.
- The Meta token is only used server-side through Supabase secrets.
- No Meta token appears in `apps/mobile`, `apps/web`, `apps/marketing`, or `packages/shared`.
- The send result is stored with safe previews/status metadata only.
- Provider errors, if any, return the approved safe envelope and do not leak provider tokens or message body.
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

- [ ] Confirm test recipient is approved.
- [ ] Confirm required secret names exist without printing values.
- [ ] Search client/shared code for Meta token patterns.
- [ ] Send exactly one safe test message through the backend path.
- [ ] Confirm Meta accepts the send or returns a safe provider error.
- [ ] Confirm Neo stores safe status/preview metadata only.
- [ ] Check logs for token/body leakage.
- [ ] Document result in `docs/backend/live-provider-qa-results.md`.

## Expected Result

Pass if one test message sends to an approved recipient, no token is exposed to client code, and send records/logs remain safe.

## Failure Handling

If the message would send to a non-test number, stop before sending. If provider or app logs expose unsafe content, stop and document the blocker without copying sensitive values.

## Suggested Commit Message

`record whatsapp send live qa`
