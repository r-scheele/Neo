# B09 QA Rules

These rules apply to every B09 prompt.

## Test Number Policy

- Use only approved provider test numbers and approved test recipients.
- Never message real customers.
- Never use live customer data.
- Mark all message content as test data.
- Keep test text short and non-sensitive.
- Do not include real names, addresses, bank references, or order/payment proof.

## Safe Logging Policy

- Do not print or commit secrets.
- Do not print raw WhatsApp message text.
- Do not print AI prompts.
- Do not print AI draft bodies.
- Do not print phone numbers except approved last-four or redacted forms when required.
- Use record ids, timestamps, status labels, confidence bands, risk categories, and safe counts for evidence.
- If logs contain sensitive content, stop and document the exact class of leak without copying the leaked value.

## Analytics Privacy Policy

- Analytics may include only approved event names and safe metadata.
- Allowed AI draft metadata includes confidence bands, draft type/risk category, edited-before-send boolean, and safe state categories.
- Analytics must not include customer names, phone numbers, message text, prompt text, draft text, exact payment references, receipt images, or provider tokens.

## Provider Credential Handling Policy

- Store provider secrets only in Supabase secrets or provider dashboards.
- Use local shell variables for one-time secret updates.
- Do not commit `.env`.
- Do not print old or new values.
- Rotate only test credentials unless the user explicitly instructs production rotation.
- Document rotated secret names only.

## Stop Conditions

Stop immediately if:

- A provider credential is missing.
- A required test number/account is not approved.
- Any live step would message a non-test recipient.
- A provider response or app log exposes secrets or private content.
- A sensitive draft is auto-sent.
- A required safety check cannot be performed.

## Rollback Guidance

- If live provider behavior is unsafe, stop using the affected provider credential.
- Disable or pause the affected provider workflow through configuration only if necessary to prevent unsafe test sends.
- Do not delete evidence records unless a privacy/security owner explicitly approves redaction.
- Record blockers in `docs/backend/live-provider-qa-results.md`.
- Add a follow-up task for code fixes instead of broad refactors inside B09.
