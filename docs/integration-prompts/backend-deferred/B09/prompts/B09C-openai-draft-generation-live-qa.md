# B09C OpenAI Draft Generation Live QA

## Purpose

Verify that Neo generates AI drafts from real test WhatsApp conversation context through the server-side AI draft function while keeping prompts, draft bodies, and provider secrets out of logs and analytics.

## When To Run

Run only after:

- B09A is complete or its blockers are explicitly waived.
- B08 AI draft generation backend is deployed.
- `OPENAI_API_KEY` exists in Supabase secrets by name.
- A safe test WhatsApp conversation exists.
- B09 QA rules have been read.

## Required Test Data

- Approved test WhatsApp conversation with non-sensitive test content.
- Test business/member account.
- Safe AI personality settings already available in the app or test request.
- Approved OpenAI test project/key stored only in Supabase secrets.

Do not use live customer conversation text.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/api-contracts.md
- docs/backend/env-vars.md
- docs/backend/live-provider-qa-plan.md
- docs/backend/live-provider-qa-results.md
- docs/backend/live-qa-test-data-policy.md
- docs/backend/provider-safety-checklist.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- supabase/functions/ai-drafts/index.ts
- supabase/functions/_shared/aiDraft.ts
- supabase/functions/_shared/permissions.ts
- apps/mobile/
- packages/shared/

Confirm this Supabase secret name is present by name only:
- OPENAI_API_KEY

Do not print secret values.
If required secrets are missing, stop and report names only.

Task:
Generate an AI draft from real test WhatsApp conversation context through the backend.

Scope:
- Confirm the OpenAI key is server-side only.
- Confirm prompt construction uses minimized WhatsApp context and safe setup preferences only.
- Generate one AI draft from an approved test conversation.
- Confirm generated draft storage follows current policy.
- Confirm no prompt or draft body leaks into analytics/logs/error output.
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
- One backend AI draft request is made for approved test data only.
- OpenAI key is absent from client/shared code and appears only as a server secret name.
- Prompt inputs are minimized and do not include unnecessary customer data.
- Draft record is created with status, confidence band, risk category/reasons, and approval metadata as applicable.
- Logs, analytics, audit logs, and errors do not expose prompt text or draft body.
- Provider errors, if any, use safe error envelopes.
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

- [ ] Confirm approved test conversation exists.
- [ ] Confirm `OPENAI_API_KEY` exists by name only.
- [ ] Search client/shared code for OpenAI key patterns.
- [ ] Generate one AI draft through the backend.
- [ ] Record only safe evidence: ids, status, confidence band, risk category, approval-required flag.
- [ ] Check logs, analytics, and audit metadata for prompt/draft leakage.
- [ ] Document result in `docs/backend/live-provider-qa-results.md`.

## Expected Result

Pass if a backend AI draft is generated from test context, the provider key remains server-side, and no prompt/draft body leaks into logs or analytics.

## Failure Handling

If the provider call fails, document the safe error category and stop. If any prompt, draft body, or key appears in logs/analytics, stop and document the blocker without copying the leaked content.

## Suggested Commit Message

`record openai draft live qa`
