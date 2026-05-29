# B09 Live Provider QA And Credential Rotation Prompt

Status:
Planned. Split into B09A-B09G. Do not run all B09 work at once.

## Purpose

B09 verifies Neo's completed backend integrations against live provider test systems and rotates shared test credentials after QA. It does not build new features.

## When To Run

Use this parent prompt only to orient the operator and choose the next B09 sub-prompt. Do not use it to run live QA.

Prerequisites:

- B07 and B08 are complete for MVP wiring.
- `docs/integration-prompts/backend-deferred/B09/B09-prompt-index.md` exists.
- `docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md` exists.
- The user explicitly chooses a single B09 sub-prompt before live work begins.

## Required Test Data

No live test data is required for this parent prompt.

The individual B09A-B09F prompts define their own approved test numbers, accounts, and provider prerequisites.

## Important

Do not run this parent prompt as one large task. Run the individual B09 prompts in `docs/integration-prompts/backend-deferred/B09/prompts/` in order.

## B09 Prompt Sequence

1. `B09A-whatsapp-webhook-live-qa.md`
2. `B09B-whatsapp-send-message-live-qa.md`
3. `B09C-openai-draft-generation-live-qa.md`
4. `B09D-sensitive-draft-approval-routing-qa.md`
5. `B09E-log-analytics-privacy-audit.md`
6. `B09F-provider-credential-rotation.md`
7. `B09G-final-live-provider-qa-report.md`

## Global Safety Rules

- Use only approved test numbers/accounts.
- Never message real customers during QA.
- Never test with live customer data.
- Never print secrets.
- Never commit `.env`.
- Never expose Supabase service role keys, Meta tokens, OpenAI keys, or Clerk secret keys.
- Never log raw WhatsApp message text, raw AI prompts, or raw AI draft bodies.
- Never send sensitive drafts automatically.
- Sensitive drafts must route to Approvals.
- Test data must be clearly marked as test data.
- If provider credentials are missing, stop and report missing secret names only.
- If live provider behavior is unsafe, stop and document the blocker.

## Parent Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Task:
Prepare to run B09 live provider QA by reviewing the B09 prompt index and choosing exactly one B09 sub-prompt to run next.

Scope:
- Review docs/integration-prompts/backend-deferred/B09/B09-prompt-index.md.
- Confirm B09 must be run one subtask at a time.
- Do not run live provider checks from this parent prompt.
- Do not rotate credentials from this parent prompt.

Constraints:
- Do not call WhatsApp, OpenAI, Clerk, Supabase provider APIs, or dashboards.
- Do not change secrets.
- Do not deploy functions.
- Do not modify production data.
- Do not implement web dashboard, marketing site, deployment config, or waitlist/signup integrations.

Validation:
- B09 prompt index exists.
- B09 QA rules exist.
- No live provider calls are made.
- No secrets are printed.
- The recommended next prompt is one B09 subtask only.

Stop when:
- You recommend the next single B09 prompt to run and list prerequisites.
```

## Manual Test Checklist

- [ ] Read B09 prompt index.
- [ ] Read B09 QA rules.
- [ ] Confirm no live provider calls are needed from this parent prompt.
- [ ] Choose one B09 sub-prompt.
- [ ] List prerequisites for that one prompt.

## Expected Result

The next operator chooses one B09 prompt and runs only that task. The recommended first prompt is `B09A-whatsapp-webhook-live-qa.md`.

## Failure Handling

If the B09 index or QA rules are missing, stop and create or restore those docs first. If the user asks to run all B09 prompts at once, decline and recommend running B09A first.

## Suggested Commit Message

`add B09 live provider qa prompts`
