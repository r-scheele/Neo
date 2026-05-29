# B09E Log Analytics Privacy Audit

## Purpose

Audit code, logs, analytics, error handling, and audit metadata for accidental leakage of provider secrets or sensitive customer/AI content.

## When To Run

Run after B09A-B09D have produced evidence, or after any blocker is documented and this audit is still useful.

## Required Test Data

- B09A-B09D QA result notes.
- Access to local logs and any approved provider/Supabase/PostHog test logs.
- Approved safe search patterns for secret names and redacted token fragments.

Do not copy leaked values into reports.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/api-contracts.md
- docs/backend/audit-log-retention.md
- docs/backend/permissions-audit-contract.md
- docs/backend/live-provider-qa-results.md
- docs/backend/live-qa-test-data-policy.md
- docs/backend/provider-safety-checklist.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- apps/mobile/
- packages/shared/
- supabase/

Confirm expected secret names by name only where needed:
- OPENAI_API_KEY
- META_WHATSAPP_ACCESS_TOKEN
- META_APP_SECRET
- META_WHATSAPP_WEBHOOK_VERIFY_TOKEN
- CLERK_SECRET_KEY
- SUPABASE_SERVICE_ROLE_KEY

Do not print secret values.
If required evidence or logs are missing, document the missing source and continue only with available safe sources.

Task:
Audit logs, analytics, code, and audit metadata for sensitive content or secret leakage.

Scope:
- Search code and approved logs for accidental leakage of WhatsApp message text, AI prompts, AI draft bodies, unnecessary customer phone numbers, provider tokens, Clerk secrets, and Supabase service role keys.
- Check PostHog/analytics calls use only safe event names and non-sensitive metadata.
- Check console logs and error logs for unsafe content.
- Check audit log metadata rules and B09 evidence.
- Create or update a privacy audit report in the B09 QA results.

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
- Keep the diff small and reviewable.
- If a safety issue is found, stop and document it.

Validation:
- Code search covers `apps/mobile`, `apps/web`, `apps/marketing`, `packages/shared`, `supabase`, and docs where relevant.
- Approved logs are checked without copying sensitive values into output.
- Analytics event names and properties are reviewed against privacy rules.
- Console/error logs are reviewed for unsafe content.
- Audit metadata fields are reviewed for safe categories only.
- Privacy audit result is documented.
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

- [ ] Search source for provider token/key patterns.
- [ ] Search source for console logging of message/draft/prompt bodies.
- [ ] Inspect analytics event definitions and call sites.
- [ ] Inspect safe audit metadata allowlists.
- [ ] Review approved Supabase function logs without copying sensitive values.
- [ ] Review approved PostHog/debug event payloads if available.
- [ ] Document pass/fail/blockers in `docs/backend/live-provider-qa-results.md`.

## Expected Result

Pass if no secrets, raw WhatsApp messages, AI prompts, AI draft bodies, or unnecessary phone numbers appear in code, logs, analytics, or audit metadata.

## Failure Handling

If leakage is found, stop and document the source, class of data, and recommended fix without copying the leaked value. Do not proceed to B09F until risk is accepted or remediated.

## Suggested Commit Message

`record provider privacy audit`
