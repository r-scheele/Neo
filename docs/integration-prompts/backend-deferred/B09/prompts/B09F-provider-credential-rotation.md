# B09F Provider Credential Rotation

## Purpose

Rotate shared OpenAI and Meta test credentials after live QA, without printing old or new values and without touching production credentials unless explicitly instructed.

## When To Run

Run only after:

- B09A-B09E are complete or explicitly waived.
- The user confirms test credential rotation should proceed.
- New provider credentials are available through dashboards or secure local environment variables.
- A rollback/contact plan exists.

## Required Test Data

- Secret names to rotate, not values.
- Confirmation that credentials are test credentials.
- Secure local environment variables or dashboard access for new values.
- Approved test flow to confirm new credentials work after rotation.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/env-vars.md
- docs/backend/supabase-secrets-setup.md
- docs/backend/provider-credential-rotation-plan.md
- docs/backend/provider-safety-checklist.md
- docs/backend/live-provider-qa-results.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- supabase/

Confirm the secret names planned for rotation by name only:
- OPENAI_API_KEY
- META_WHATSAPP_ACCESS_TOKEN
- META_APP_SECRET
- META_WHATSAPP_WEBHOOK_VERIFY_TOKEN, if it was shared during testing

Do not print old or new secret values.
If required new credentials are missing, stop and report missing secret names only.

Task:
Rotate shared OpenAI and Meta test credentials after live QA.

Scope:
- Confirm B09A-B09E are complete or explicitly waived.
- Confirm credentials are test credentials, not production credentials.
- Update Supabase secrets with new values from secure local env vars or provider dashboards.
- Confirm old credentials are invalidated, revoked, or marked deprecated in provider dashboards where possible.
- Confirm the app/backend still works with new credentials using approved test flows only.
- Document rotated secret names only.

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
- Do not rotate production credentials unless explicitly instructed.
- Do not commit `.env`.
- Keep the diff small and reviewable.
- If a safety issue is found, stop and document it.

Validation:
- New Supabase secret versions are set without printing values.
- Old test credentials are invalidated or documented as deprecated/pending manual revocation.
- Approved test webhook/send/draft checks still work with rotated credentials.
- Rotation report lists secret names only, not values.
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

- [ ] Confirm B09A-B09E status.
- [ ] Confirm rotation is for test credentials only.
- [ ] Prepare new credentials outside repo.
- [ ] Set Supabase secrets without printing values.
- [ ] Revoke or deprecate old provider credentials.
- [ ] Run approved smoke checks with new credentials.
- [ ] Document rotated secret names only.
- [ ] Confirm `.env` remains uncommitted.

## Expected Result

Pass if shared test credentials are rotated, old credentials are invalidated or tracked for revocation, and provider smoke checks still pass without exposing values.

## Failure Handling

If a new credential fails, restore only through secure secret handling and document the blocker by secret name. Do not paste credentials into chat, terminal output, or docs.

## Suggested Commit Message

`rotate shared provider test credentials`
