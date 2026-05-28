# Next Required Steps

## Purpose

This document lists the immediate integration steps required after the local MVP prototype. It replaces the older pre-scaffold recovery checklist.

## Current Status

The app scaffold and primary MVP screens exist. Clerk wiring, commerce records, permissions/audit checks, and WhatsApp workflow wiring now have backend paths. AI generation, receipt OCR/media intake, payment verification, launch hardening, and full signed-in QA remain open.

Run only one integration pass at a time. Do not configure services, install service packages, or add backend behavior outside the selected prompt.

## Next 5 Integration Actions

1. Finish live QA and credential rotation.

   Verify Clerk and Meta WhatsApp flows with real test accounts/numbers, then rotate the Meta credentials shared during setup.

2. Complete AI draft generation backend.

   Run B08 only after AI provider secrets, prompt policy, and endpoint contracts are approved.

3. Harden WhatsApp launch behavior.

   Confirm Meta webhook callback, send flow, service-window policy, media handling, and production app publishing requirements.

4. Plan receipt/payment verification.

   Keep the current human review guardrails and add OCR/payment-provider work only through server-owned APIs.

5. Keep docs and verification aligned.

   Update readiness docs after each integration pass and keep `typecheck`, `lint`, and app-start verification green.

## Stop Conditions

- A required file from the selected integration prompt is missing.
- A service integration would require private secrets in the Expo app.
- A task needs a backend/security decision that does not exist yet.
- TypeScript, lint, or app-start verification fails and the failure is not clearly pre-existing.

## Do Not Do Yet

- Do not add new WhatsApp media/template/broadcast behavior outside an approved prompt.
- Do not implement real AI calls or receipt OCR in the Expo client.
- Do not verify payments from screenshots alone.
- Do not add private API keys, provider secrets, database URLs, webhook secrets, or admin credentials to client env files.
- Do not remove local-only warnings until the real integration works end to end.
