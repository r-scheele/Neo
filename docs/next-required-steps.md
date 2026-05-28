# Next Required Steps

## Purpose

This document lists the immediate integration steps required after the local MVP prototype. It replaces the older pre-scaffold recovery checklist.

## Current Status

The app scaffold and primary MVP screens exist. Current behavior is still local-only for auth, WhatsApp, AI, orders, receipts, payments, permissions, and sync.

Run only one integration pass at a time. Do not configure services, install service packages, or add backend behavior outside the selected prompt.

## Next 5 Integration Actions

1. Preserve the environment/config cleanup baseline.

   The integration order starts with environment/config cleanup. Keep `.env.example`, README, readiness docs, config assumptions, and integration order aligned after each future pass.

2. Configure Clerk authentication.

   Install only the approved Clerk dependencies for that pass, add `ClerkProvider`, implement real sign-in/sign-up, and keep private Clerk keys out of the Expo client.

3. Protect navigation and the app shell.

   Use real auth/setup state to protect setup, tabs, detail routes, and sensitive paths. Public routes should remain Welcome and Sign In.

4. Complete safe state and persistence ownership.

   Centralize only the shared state that is actually needed, keep sensitive data out of Zustand/AsyncStorage, and clear user-specific safe local data on sign-out.

5. Define the backend/API boundary.

   Decide where real WhatsApp sync, AI draft generation, receipt/payment workflows, customer/order records, server permissions, and audit logs live before implementing them.

## Stop Conditions

- A required file from the selected integration prompt is missing.
- A service integration would require private secrets in the Expo app.
- A task needs a backend/security decision that does not exist yet.
- TypeScript, lint, or app-start verification fails and the failure is not clearly pre-existing.

## Do Not Do Yet

- Do not implement real WhatsApp sync, webhooks, or send actions.
- Do not implement real AI calls or receipt OCR in the Expo client.
- Do not verify payments from screenshots alone.
- Do not add private API keys, provider secrets, database URLs, webhook secrets, or admin credentials to client env files.
- Do not remove local-only warnings until the real integration works end to end.
