# Provider Safety Checklist

Date: 2026-05-29

Status: Baseline checklist for B09. No live QA has been run from this file.

## Before Live QA

- [ ] Read `AGENTS.md`.
- [ ] Read `docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md`.
- [ ] Confirm the exact B09 sub-prompt being run.
- [ ] Confirm all test phone numbers/accounts are approved.
- [ ] Confirm no live customer data will be used.
- [ ] Confirm required secret names exist without printing values.
- [ ] Confirm `.env` is not modified or committed.

## WhatsApp Safety

- [ ] Use only approved test recipient/sender numbers.
- [ ] Never send to real customers.
- [ ] Keep message bodies short, artificial, and marked as test data.
- [ ] Do not print full phone numbers.
- [ ] Do not print provider tokens.
- [ ] Confirm webhook payload redaction.
- [ ] Confirm send errors use safe envelopes.

## OpenAI Safety

- [ ] Use only approved test conversation context.
- [ ] Confirm `OPENAI_API_KEY` is server-side only.
- [ ] Confirm prompts are minimized.
- [ ] Do not print prompt text.
- [ ] Do not print draft bodies.
- [ ] Record only confidence band, risk category, ids, and status.
- [ ] Confirm sensitive drafts route to Approvals.

## Logging And Analytics

- [ ] No secrets in source, logs, docs, or analytics.
- [ ] No raw WhatsApp message text in logs or analytics.
- [ ] No AI prompt text in logs or analytics.
- [ ] No AI draft body in logs or analytics.
- [ ] No customer phone numbers unless redacted and necessary.
- [ ] Audit metadata uses safe categories only.

## Credential Rotation

- [ ] Rotate only in B09F.
- [ ] Rotate test credentials only unless explicitly instructed otherwise.
- [ ] Use local secure env vars or provider dashboards.
- [ ] Do not print old or new values.
- [ ] Revoke or deprecate old credentials where possible.
- [ ] Confirm post-rotation smoke checks.

## Stop Immediately If

- A message would go to a non-test number.
- A provider secret is missing or exposed.
- A prompt, draft body, message body, or token appears in logs.
- A sensitive draft is auto-sent.
- Provider behavior cannot be verified safely.
