# Live QA Test Data Policy

Date: 2026-05-29

Status: Applies to B09 live provider QA.

## Purpose

Ensure B09 live provider QA uses only artificial, approved test data and does not touch real customers or private commerce records.

## Allowed Test Data

- Approved provider test phone numbers.
- Approved test Clerk users.
- Approved test business records.
- Artificial test customer names such as `Neo Test Customer`.
- Artificial test messages clearly marked as test data.
- Artificial order/payment scenarios without real bank details.
- Redacted ids, timestamps, counts, and status labels.

## Disallowed Test Data

- Real customer names.
- Real customer phone numbers.
- Real customer WhatsApp messages.
- Real receipt screenshots.
- Real bank alerts or payment proof.
- Exact addresses.
- Real order references.
- Real provider tokens or API keys.
- AI prompt text or AI draft body text in reports.

## Test Message Guidance

Use short, artificial messages such as:

- `TEST ONLY: hello from Neo QA.`
- `TEST ONLY: please confirm delivery option.`
- `TEST ONLY: refund scenario for approval routing.`

Do not include real products, prices, addresses, bank names, transaction refs, or customer details.

## Reporting Guidance

Record:

- Safe ids.
- Status labels.
- Confidence bands.
- Risk categories.
- Approval-required flags.
- Counts and timestamps.
- Secret names only.

Do not record:

- Message bodies.
- Draft bodies.
- Prompt text.
- Secret values.
- Full phone numbers.

## Cleanup Guidance

Do not delete QA evidence by default. If test data cleanup is required, document:

- What record category was cleaned.
- Why cleanup was safe.
- Who approved cleanup.
- Which ids were affected, using redacted identifiers where appropriate.
