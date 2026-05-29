# Live Provider QA Plan

Date: 2026-05-29

Status: Planned. No live provider QA has been run from this document.

## Purpose

Verify that Neo works safely with live provider test credentials and approved real test data after backend implementation through B08.

## Scope

B09 covers:

- WhatsApp webhook live QA.
- WhatsApp send-message live QA.
- OpenAI draft generation live QA.
- Sensitive draft approval routing QA.
- Log and analytics privacy audit.
- Shared test provider credential rotation.
- Final B09 QA report.

## Out Of Scope

- New backend features.
- Web dashboard workflows.
- Auth enforcement in web apps.
- Production deployment config.
- Real signup/waitlist integrations.
- Marketing site deployment.
- App dashboard deployment.
- Production credential rotation unless explicitly requested.

## Required Test Accounts And Data

- Approved Meta/WhatsApp test business account.
- Approved WhatsApp test phone number.
- Approved test sender and recipient numbers.
- Approved OpenAI test project/key stored in Supabase secrets.
- Test Clerk user and test business/member context.
- Clearly marked artificial test message content.

Never use live customer data.

## Safety Gates Before Any Live Step

- Confirm `AGENTS.md` has been read.
- Confirm B09 QA rules have been read.
- Confirm required provider secret names exist without printing values.
- Confirm all phone numbers are approved test numbers.
- Confirm no `.env` file is modified or committed.
- Confirm the task is a single B09 sub-prompt.

## Evidence Rules

Allowed evidence:

- Function names.
- Request ids.
- Provider event ids if not sensitive.
- Redacted record ids.
- Status labels.
- Confidence bands.
- Risk categories.
- Approval-required flags.
- Counts and timestamps.
- Secret names only.

Disallowed evidence:

- Secret values.
- Raw WhatsApp message text.
- AI prompt text.
- AI draft body text.
- Full customer phone numbers unless explicitly approved and redacted.
- Receipt images, bank alerts, or payment proof.

## B09 Run Order

| Order | Prompt | Status |
| --- | --- | --- |
| B09A | WhatsApp webhook live QA | Planned |
| B09B | WhatsApp send-message live QA | Planned |
| B09C | OpenAI draft generation live QA | Planned |
| B09D | Sensitive draft approval routing QA | Planned |
| B09E | Log and analytics privacy audit | Planned |
| B09F | Provider credential rotation | Planned |
| B09G | Final live provider QA report | Planned |

## Stop Conditions

Stop and document a blocker if:

- A required provider secret is missing.
- A required test account/number is not approved.
- A live step would touch customer data.
- A message would send to a non-test number.
- A prompt, draft, message body, token, or secret appears in logs or analytics.
- A sensitive draft is auto-sent.
- Provider behavior cannot be verified safely.

## Completion Criteria

B09 is complete only when:

- B09A-B09G are documented as passed, failed, blocked, or explicitly waived.
- Shared test credentials have been rotated or a blocker is documented.
- `docs/backend/live-provider-qa-results.md` contains final results.
- No live customer data was used.
- No secrets were printed or committed.
