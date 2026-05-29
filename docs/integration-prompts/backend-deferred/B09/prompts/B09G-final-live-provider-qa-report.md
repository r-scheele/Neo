# B09G Final Live Provider QA Report

## Purpose

Summarize all B09 live provider QA results, blockers, credential rotation status, and recommended next track.

## When To Run

Run after:

- B09A-B09F are complete, blocked, or explicitly waived.
- All B09 evidence has been documented in `docs/backend/live-provider-qa-results.md`.
- The operator is ready to close or defer the B09 track.

## Required Test Data

- Completed B09A-B09F result notes.
- Provider credential rotation notes by secret name only.
- Any blocker notes.
- Current backend prompt index and integration status docs.

## Codex Prompt

```text
Read AGENTS.md first and follow it strictly.

Before running live checks, verify required files and env/secret names exist:
- AGENTS.md
- package.json
- docs/backend/live-provider-qa-plan.md
- docs/backend/live-provider-qa-results.md
- docs/backend/provider-credential-rotation-plan.md
- docs/backend/provider-safety-checklist.md
- docs/backend/live-qa-test-data-policy.md
- docs/integration-prompts/backend-deferred/B09/B09-prompt-index.md
- docs/integration-prompts/backend-deferred/B09/B09-qa-rules.md
- docs/integration-prompts/backend-deferred/backend-deferred-index.md
- docs/integration-completion-plan.md
- docs/missing-integrations.md

Do not print secret values.
If B09 result sections are missing, stop and report missing sections only.

Task:
Produce the final B09 live provider QA report.

Scope:
- Summarize all B09 QA results.
- List passes, failures, skipped checks, and blockers.
- List rotated credentials by secret name only.
- Confirm whether backend prompts B03-B06 remain complete and whether B07-B08 remain validated after live QA.
- Recommend the next track: production hardening, EAS/mobile QA, marketing/web work, or app store prep.
- Keep web/marketing/dashboard deferred work separate from B09.

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
- Do not rotate credentials in this final report prompt unless B09F was explicitly not run and the user redirects you.
- Keep the diff small and reviewable.
- If a safety issue is found, stop and document it.

Validation:
- Final report includes B09A-B09G status.
- Pass/fail/blocker summary is clear.
- Rotated credentials are listed by name only.
- Backend prompt status recommendations are evidence-based.
- Next track recommendation is explicit.
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

- [ ] Confirm B09A result is documented.
- [ ] Confirm B09B result is documented.
- [ ] Confirm B09C result is documented.
- [ ] Confirm B09D result is documented.
- [ ] Confirm B09E result is documented.
- [ ] Confirm B09F result or blocker is documented.
- [ ] Summarize pass/fail/blockers.
- [ ] List rotated credential names only.
- [ ] Recommend next track.

## Expected Result

Pass if the report gives a clear B09 closeout, names only the rotated secrets, and recommends the next work track without mixing in web/marketing deferred work.

## Failure Handling

If any B09 result is missing, stop and list the missing section. Do not infer live QA success without evidence.

## Suggested Commit Message

`add final live provider qa report`
