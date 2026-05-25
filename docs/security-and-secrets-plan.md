# Security And Secrets Plan

Status: Draft security and secrets plan. No environment files or app code have been created.

## Core Rule

Mobile clients are inspectable. Anything bundled into the app must be treated as public.

Do not put private API keys, provider secrets, WhatsApp tokens, AI provider keys, payment secrets, webhook secrets, or admin credentials in the Expo app.

## Secret Handling

| Secret Type | Client Allowed? | Notes |
| --- | --- | --- |
| Clerk publishable key | Yes, as public env | Must use provider-approved public key only |
| Clerk secret key | No | Server/build environment only |
| PostHog project key | Yes, as public env if approved | Still avoid sensitive event properties |
| AI provider API key | No | Requires backend boundary |
| WhatsApp access token | No | Requires backend boundary |
| Payment provider secret | No | Requires backend boundary |
| Webhook signing secret | No | Requires backend boundary |
| Database URL | No | Requires backend boundary |
| Admin credentials | No | Never in client |

## Environment Variables

When the app is scaffolded, use public Expo variables only for values safe to expose:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=
```

Do not create `.env` in this planning step. When setup begins, create `.env.example` with variable names only and keep real `.env` files uncommitted.

## Data Classification

| Data | Classification | V1 Rule |
| --- | --- | --- |
| UI preferences | Low sensitivity | Can use AsyncStorage |
| Setup progress | Low/Medium sensitivity | Can use AsyncStorage if clearable |
| Business profile | Medium sensitivity | Draft locally only; backend later |
| Product and delivery drafts | Medium sensitivity | Draft locally only; clear on sign-out |
| Customer messages | High sensitivity | Do not persist locally for production |
| AI prompt/draft content | High sensitivity | Do not log or track; local draft only if approved |
| Receipt images | High sensitivity | Backend/media storage later |
| Payment proof and bank alerts | High sensitivity | Backend later; never auto-confirm from screenshot alone |
| Auth tokens | High sensitivity | Provider-managed only |

## Backend Boundary Required

The app must stop and introduce a backend plan before implementing real:

- WhatsApp message sync.
- WhatsApp webhooks.
- AI draft generation.
- Receipt OCR/extraction.
- Payment verification.
- Staff role enforcement for sensitive actions.
- Audit logs.
- Admin monitoring.

This boundary protects secrets and prevents sensitive decisions from relying on client-only logic.

## Payment And Receipt Safety

- Manual bank transfer screenshots must never be treated as automatic proof of payment.
- Receipt review UI must instruct users to verify against a bank alert before confirming.
- Payment confirmation must be deliberate.
- Payment-related actions need role checks.
- Future production confirmation must be recorded through a trusted backend.

## Logging Rules

Do not log:

- Secrets.
- Tokens.
- Private customer messages.
- AI prompts or draft text.
- Receipt images.
- Bank/payment proof.
- Exact addresses.
- Phone numbers.

Errors should use safe categories such as `network_error`, `auth_error`, `receipt_image_failed`, or `permission_denied`.

## Client Security Rules

- Use HTTPS for network requests.
- Validate external responses before rendering.
- Handle failed network calls calmly.
- Do not trust client-only authorization for sensitive actions.
- Disable risky actions while offline.
- Clear user-specific persisted data on sign-out where required.
- Avoid storing large media locally.

## Future Security Work

Before production pilot:

- Create backend architecture and threat model.
- Define server-side role enforcement.
- Define audit logging for receipt and approval decisions.
- Define data retention for messages, receipts, and analytics.
- Define privacy policy language for analytics and AI usage.
- Define incident response and key rotation process.

## Done Looks Like

Security is acceptable for the next phase when `AGENTS.md` can clearly tell future coding agents where secrets may live, what must remain server-side, and what data must never be stored or tracked in the client.

