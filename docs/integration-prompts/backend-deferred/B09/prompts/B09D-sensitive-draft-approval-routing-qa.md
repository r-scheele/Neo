# B09D Sensitive Draft Approval Routing QA

## Purpose

Verify that sensitive AI drafts route to Approvals instead of being sent automatically, and that approval decisions work safely on test data.

## When To Run

Run only after:

- B09C is complete or its blockers are explicitly waived.
- The `ai-drafts` and `approvals` functions are deployed.
- Approved test conversations exist for sensitive scenarios.
- B09 QA rules have been read.

## Required Test Data

Approved test-only conversation cases for:

- Refunds.
- Discounts.
- Complaints.
- Receipt/payment proof.
- Unclear order changes.
- Angry customer language.

Use non-sensitive artificial test messages only.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/api-contracts.md
- docs/backend/permissions-audit-contract.md
- docs/backend/live-provider-qa-plan.md
- docs/backend/live-provider-qa-results.md
- docs/backend/live-qa-test-data-policy.md
- docs/backend/provider-safety-checklist.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- supabase/functions/ai-drafts/index.ts
- supabase/functions/approvals/index.ts
- supabase/functions/_shared/aiDraft.ts
- apps/mobile/features/approvals/
- apps/mobile/features/conversation/
- packages/shared/

Confirm this Supabase secret name is present by name only:
- OPENAI_API_KEY

Do not print secret values.
If required secrets are missing, stop and report names only.

Task:
Verify sensitive AI draft approval routing using approved test data only.

Scope:
- Generate or inspect test drafts for refunds, discounts, complaints, receipt/payment proof, unclear order changes, and angry customer cases.
- Confirm sensitive drafts route to Approvals.
- Confirm none of these drafts are auto-sent.
- Confirm Approval Queue displays the draft safely for human review.
- Confirm approve/reject actions work on test data through the backend decision path.

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
- Each sensitive test scenario is documented as pass, fail, or blocked.
- Sensitive drafts create or link to approval records.
- Conversation Detail does not auto-send approval-required drafts.
- Approval Queue displays only safe review context and necessary draft text for authenticated human review.
- Approve/reject actions update test approval/draft status and write safe audit metadata.
- No customer-facing message is sent automatically.
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

- [ ] Confirm all sensitive test cases use artificial test data.
- [ ] Generate or inspect a refund draft.
- [ ] Generate or inspect a discount draft.
- [ ] Generate or inspect a complaint draft.
- [ ] Generate or inspect a receipt/payment proof draft.
- [ ] Generate or inspect an unclear order-change draft.
- [ ] Generate or inspect an angry-customer draft.
- [ ] Confirm each routes to Approvals or document why not.
- [ ] Confirm none are auto-sent.
- [ ] Confirm approve/reject works on test data.
- [ ] Confirm audit metadata is safe.
- [ ] Document result in `docs/backend/live-provider-qa-results.md`.

## Expected Result

Pass if every sensitive test case routes to Approvals, no sensitive draft is auto-sent, and approval decisions work with safe audit metadata.

## Failure Handling

If any sensitive draft can be sent automatically, stop immediately. Document the blocker and do not continue to credential rotation until fixed or explicitly accepted.

## Suggested Commit Message

`record sensitive draft approval qa`
