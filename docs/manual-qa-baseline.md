# Manual QA Baseline

Date: 2026-05-27

This is the repeatable QA baseline for the current client/local MVP. Maestro is not installed in this repository and the `maestro` CLI was not available on this machine during Prompt 11, so no Maestro flows were added and no packages or external tools were installed.

Use this baseline until a separate dependency decision approves automated end-to-end tooling.

## Recorded Runs

- 2026-05-27: `docs/manual-qa-results-2026-05-27.md` records a local preflight and route-smoke pass. Full signed-in Clerk/manual QA remains open.

## Preflight

Run these checks before manual screen QA:

```bash
npm run typecheck
npm run lint
npm run web -- --host localhost --port 8102
```

Open `http://localhost:8102` after the web server starts.

## Environment Rules

- Use only public Expo env vars from `.env.example`.
- Do not commit `.env` or any real secret.
- If `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing, the app should show the safe Clerk setup screen.
- Authenticated route QA requires a real local Clerk test project and test account outside git.
- PostHog public values are optional for this baseline; analytics failure must not block app behavior.

## Baseline A: Public And Auth

| Area | Steps | Expected result |
| --- | --- | --- |
| Missing Clerk config | Start the app with no local Clerk publishable key. | The app shows "Clerk setup needed" and does not expose secrets. |
| Welcome | With Clerk configured, open the app signed out and go to Welcome. Tap the setup/sign-in entry action. | Welcome renders, uses approved runtime assets, and navigates to Register / Sign In. |
| Register / Sign In visibility | Open Register / Sign In signed out. | Email/password controls render, validation is visible, and submit states do not crash. |
| Protected route while signed out | Try a protected tab or detail route while signed out. | The app redirects to auth instead of showing protected data. |

## Baseline B: Setup Flow

Use a Clerk test account. Clear local app storage first when testing first-run behavior.

| Screen | Steps | Expected result |
| --- | --- | --- |
| Setup Checklist | Sign in with setup incomplete. | Checklist renders and shows the next required setup action. |
| Business Profile | Open from the checklist, try saving empty required fields, then save valid local data. | Inline validation appears; valid data saves locally without backend claims. |
| Business Type | Select a business type and save. | Selection persists locally and returns to setup flow. |
| WhatsApp Setup | Open the screen and use retry/test controls. | Copy stays local-only; no real WhatsApp connection or token is requested. |
| AI Personality | Adjust tone/language/approval preferences and save. | Preferences save locally; no AI provider call is made. |
| Payment Rules | Review manual transfer and receipt rules. | Copy never implies screenshots are automatic proof of payment. |
| Delivery Zones | Add or edit a local zone. | Local validation works; no backend delivery settings are implied. |
| Product Basics | Add or edit local product basics. | Local validation works; no product catalog backend is implied. |

## Baseline C: Tabs

Run with an authenticated test account and setup complete.

| Tab | Steps | Expected result |
| --- | --- | --- |
| Today | Open Today, expand/collapse queue content, and open a linked item. | Cards render with safe local fixture data and tab counts remain stable. |
| Inbox | Search, switch filters, and open conversation `aisha-order-review`. | Rows render, filters work, and conversation detail opens. |
| Approvals | Switch filters and test a local approve/reject/edit path. | Actions show local-only copy and do not claim backend, AI, payment, or audit writes. |
| Follow-ups | Search/filter, edit a suggested message, and test send/mark-done locally. | Actions remain local-only and do not send WhatsApp messages. |
| Settings | Toggle safe preferences and sign out. | Safe preferences persist; sign-out clears safe user-local state and resets analytics identity. |

## Baseline D: Detail Routes

Use in-app links where possible. Direct route IDs below are local fixture IDs only.

| Route | Fixture | Expected result |
| --- | --- | --- |
| Conversation Detail | `/conversation/aisha-order-review` | Messages, draft editor, order/customer links, and local send notices render. |
| Create Order | `/order/new?conversationId=aisha-order-review` | Form validation, totals, save draft, and local save states work. |
| Order Detail | `/order/ord-2025-0561` | Payment, delivery, timeline, customer, and receipt links render. |
| Receipt Review | `/receipt/aisha-receipt-18000` | Receipt warnings are calm and trust-first; decisions are local-only. |
| Customer Profile | `/customer/aisha-o` | Profile summary, orders, notes, activity, and safe local note behavior render. |
| Permission Denied | Trigger from a restricted action or open the permission modal path. | Role limitation copy is clear and gives a safe way back. |

## Baseline E: State Variants

For screens that support mock state params, test each state on at least one list screen and one detail screen in a development build:

```text
?state=loading
?state=empty
?state=error
?state=offline
?state=permission
```

Expected results:

- Loading uses skeletons without layout jumps.
- Empty explains what will appear and offers one safe next action.
- Error states use plain-language copy with retry when useful.
- Offline states keep review safe and disable risky actions.
- Permission states explain role limits and do not reveal sensitive details.

Also test role-gated local states where currently supported:

```text
/(tabs)/approvals?role=staff
/receipt/aisha-receipt-18000?role=staff
```

These role params are local/mock only and must not be treated as production authorization.

See `docs/local-preview-controls.md` for the local preview contract. Non-development builds ignore mock state params and do not grant owner/manager behavior from mock role params.

## Deferred Backend QA

These checks are blocked until Phase B backend/API decisions are approved:

| Area | Deferred until |
| --- | --- |
| WhatsApp connection, sync, webhooks, media, and send failures | Backend provider, API boundary, WhatsApp token/webhook/media strategy |
| AI draft generation and guardrail evaluation | Backend API plus server-side AI provider and prompt policy |
| Receipt OCR/extraction and payment verification | Media storage, OCR/extraction, payment verification, and audit strategy |
| Orders, customers, receipts, follow-ups, and Today counts across devices | Durable database/schema and API contracts |
| Staff role enforcement and denied writes | Clerk-to-backend auth handoff, trusted role source, server authorization |
| Audit log writes and retention | Audit retention decision and backend write contracts |

## Completion Notes

- Passing this manual baseline does not make Neo release-ready.
- Backend/API blockers remain tracked in `docs/release-blockers.md` and `docs/integration-prompts/backend-deferred/backend-deferred-index.md`.
- Add Maestro or another E2E tool only after a written dependency decision approves it.
