# B09 Live Provider QA And Credential Rotation

Status: Planned. Do not run all B09 prompts at once.

B09 verifies real provider behavior with approved test accounts and rotates shared test credentials after QA. It is a launch-hardening track for the completed backend work through B08.

## What B09 Does

- Verifies WhatsApp webhook behavior with a Meta/WhatsApp test number.
- Verifies WhatsApp send behavior to an approved test recipient only.
- Verifies OpenAI draft generation from test WhatsApp conversation context.
- Verifies sensitive drafts route to Approvals and are not auto-sent.
- Audits logs and analytics for secret/content leakage.
- Rotates shared OpenAI and Meta test credentials after live QA.
- Produces a final B09 QA report.

## What B09 Does Not Do

- Does not build new product features.
- Does not change production workflows unless a safety fix is explicitly required.
- Does not run web dashboard, marketing site, deployment, or signup/waitlist work.
- Does not send messages to real customers.
- Does not use live customer data.
- Does not print or commit secrets.

## Run Order

Use `B09-prompt-index.md` and run one prompt at a time:

1. B09A WhatsApp webhook live QA.
2. B09B WhatsApp send-message live QA.
3. B09C OpenAI draft generation live QA.
4. B09D sensitive draft approval routing QA.
5. B09E log and analytics privacy audit.
6. B09F provider credential rotation.
7. B09G final live provider QA report.

## Required Shared Docs

- `docs/backend/live-provider-qa-plan.md`
- `docs/backend/live-provider-qa-results.md`
- `docs/backend/provider-credential-rotation-plan.md`
- `docs/backend/provider-safety-checklist.md`
- `docs/backend/live-qa-test-data-policy.md`

## Stop Conditions

Stop and document the blocker if any prompt would require:

- A non-test phone number or customer.
- Printing or committing secrets.
- Logging raw WhatsApp message text, AI prompts, or draft bodies.
- Sending a sensitive draft automatically.
- Modifying production data.
- Changing provider credentials before B09F.
