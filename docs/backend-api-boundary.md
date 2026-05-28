# Backend API Boundary

Date: 2026-05-27

## Decision Summary

Neo needs a server-owned API boundary before any real WhatsApp, AI, receipt, payment, order, customer, role, audit, or cross-device sync work is implemented.

The current Expo app remains a local MVP prototype. It can keep using typed dev fixtures for screens, but it must not call WhatsApp, AI providers, payment providers, OCR services, databases, or webhook handlers directly from the mobile client.

The backend foundation is now selected and linked:

- Backend provider: Supabase
- Database: Supabase Postgres
- Backend execution: Supabase Edge Functions
- Media storage: Supabase Storage
- Mobile auth provider: Clerk
- Backend auth strategy: Clerk-authenticated requests to Supabase Edge Functions
- Project ref: `xtalfjnmxnwtogxgtlxn`
- Supabase URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co`
- Edge Functions API base URL pattern: `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`

B01 linked and scaffolded Supabase. B02 added the typed client API boundary. B03 validated the local schema. These foundation passes do not replace fixture data or implement backend feature workflows.

## Non-Goals For This Pass

- No real WhatsApp sync or send calls.
- No WhatsApp webhook handling in the Expo app.
- No AI draft generation calls from the client.
- No receipt OCR or extraction calls from the client.
- No payment verification or bank lookup from the client.
- No completed server-side role enforcement implementation.
- No completed audit log write implementation.
- No new packages.

## Decisions Now Approved

These decisions are approved for the B01 foundation:

| Decision | Approved answer | Notes |
| --- | --- | --- |
| Backend provider | Supabase | Existing project linked locally. |
| Database | Supabase Postgres | Initial migration scaffold exists locally. |
| Backend execution | Supabase Edge Functions | Function folders are scaffolded. |
| Backend auth strategy | Clerk-authenticated requests to Edge Functions | Client token handoff exists from B02; server verification helper is deferred to B04. |
| API base URL variable | `EXPO_PUBLIC_API_BASE_URL` | Points at Supabase Edge Functions base URL. |
| Public Supabase variables | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Empty placeholders only in `.env.example`. |
| Media storage | Supabase Storage | Buckets are documented, not created remotely. |
| Webhook strategy | Supabase Edge Functions | WhatsApp and Clerk webhook stubs exist. |
| Audit retention | 180-day MVP planning target | Final policy can be reviewed before launch. |

## Decisions Still Needed

These implementation decisions remain before feature-complete backend work:

- Server-side Clerk token verification implementation in Edge Functions.
- Remote database migration approval and push timing. B03 validated the migration locally and deferred remote push.
- Storage bucket creation and policies.
- Supabase secrets values for Clerk, OpenAI, Meta WhatsApp, and PostHog.
- Feature endpoint contracts for B05-B08.

## Secrets Boundary

The Expo app may only contain public values approved for mobile distribution:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

The Expo app must never contain:

- Clerk secret keys.
- WhatsApp access tokens.
- WhatsApp webhook verification or signing secrets.
- AI provider API keys.
- OCR provider keys.
- Payment provider secrets.
- Bank aggregation credentials.
- Database URLs.
- Admin credentials.
- Private backend service tokens.

## Ownership Boundary

| Capability | Expo client may own | Backend must own |
| --- | --- | --- |
| Auth display | Signed-in UI state from Clerk SDK | Session verification, business membership, staff role, permission checks. |
| Business setup | Local form state and safe draft UI | Business record, setup completion per business, server defaults. |
| WhatsApp status | Display status and retry action | Token storage, status checks, webhook processing, phone/account linkage. |
| Conversations | Read-only rendering, filters, local search UI | Message sync, message storage, assignments, media references, send execution. |
| AI drafts | Draft review UI and local edit state | Prompt construction, provider keys, policy checks, confidence, approval routing. |
| Orders | Forms and deliberate user actions | Durable order records, status changes, totals, linked customer/conversation data. |
| Receipts | Review UI and human decision controls | Media intake, extraction, payment matching, review records, final state changes. |
| Payments | Trust-first warnings and disabled offline actions | Provider/bank reconciliation, manual review records, paid state mutation. |
| Customers | Profile rendering and note form UI | Customer memory, notes, preferences, history, deduplication. |
| Follow-ups | Queue UI, edit/send confirmation | Scheduling, send execution, completion state, WhatsApp service-window logic. |
| Permissions | Visual gates and permission-denied route | Authoritative authorization and denied-write prevention. |
| Audit logs | Read-only audit summaries when approved | Append-only audit writes and retention policy. |

## API Contract Principles

- All server responses are treated as `unknown` by the client until parsed.
- Every response includes a request id for support/debugging.
- Error payloads use safe categories and do not include private message text, receipt images, bank details, prompt text, draft text, tokens, or exact addresses.
- All sensitive writes are idempotent or protected against duplicate submissions.
- Risky actions are disabled while offline.
- Manual bank transfer screenshots are never automatic proof of payment.
- Human approval remains required for sensitive payment, discount, refund, complaint, and low-confidence AI actions.
- The server owns timestamps and actor identity for sensitive decisions.

## Common Response Shapes

Supabase Edge Functions should use this response envelope:

```ts
type ApiSuccess<TData> = {
  data: TData;
  error: null;
};

type ApiFailure = {
  data: null;
  error: ApiError;
};

type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

type ApiError = {
  code: string;
  message: string;
  details: Record<string, unknown>;
};
```

## MVP Data Contracts

### Auth-Linked Business Setup

Server-owned record:

- `businessId`
- `ownerUserId`
- `setupStatus`
- `businessProfile`
- `businessType`
- `aiPersonality`
- `paymentRules`
- `deliveryZones`
- `productBasics`
- `updatedAt`

Required server behavior:

- Link setup to an authenticated business, not only a device.
- Enforce who can edit setup.
- Reject setup updates from users outside the business.
- Return setup completion without exposing private tokens.

### WhatsApp Status, Conversations, And Send

Server-owned records:

- WhatsApp connection status and account metadata.
- Conversation list and thread messages.
- Assignment, labels, unread counts, and media references.
- Send attempts and delivery results.

Required server behavior:

- Store WhatsApp access tokens only on the server.
- Verify and process webhooks only on the server.
- Return media references, not raw private storage credentials.
- Reject sends when disconnected, offline, outside permission, or outside approved policy.
- Record send/audit metadata for sensitive messages.

### AI Drafts

Server-owned records:

- Draft request context.
- Draft response.
- Confidence band.
- Guardrail reasons.
- Approval requirement.
- Source references safe for display.

Required server behavior:

- Keep AI provider keys server-side.
- Minimize prompt data.
- Avoid analytics payloads containing prompts or draft text.
- Route low-confidence, payment, refund, complaint, discount, and sensitive drafts to approval.
- Return draft text only to authorized business members.

### Orders

Server-owned records:

- `orderId`
- `businessId`
- `customerId`
- `conversationId`
- Line items, quantities, prices, delivery fee, total.
- Payment state.
- Delivery state.
- Timeline.
- Created/updated actor metadata.

Required server behavior:

- Persist orders across devices and sessions.
- Prevent unauthorized updates.
- Keep totals server-validated.
- Link order mutations to audit events when payment, delivery, or cancellation changes.

### Receipts And Payment Review

Server-owned records:

- Receipt media reference.
- Extraction status and extracted fields.
- Expected order/payment amount.
- Risk flags.
- Review decision.
- Payment state transition.
- Audit entry.

Required server behavior:

- Store receipt images outside unsafe client persistence.
- Run OCR/extraction only server-side or through a server-mediated provider.
- Require human review for manual transfer screenshots.
- Never mark paid from screenshot extraction alone.
- Require bank alert/provider reconciliation or explicit manual-review decision according to approved business rules.
- Deny payment confirmation for unauthorized roles.

### Customers

Server-owned records:

- Customer profile.
- Conversation links.
- Order history.
- Notes.
- Preferences.
- Follow-up history.

Required server behavior:

- Avoid storing customer memory in client-only state.
- Enforce business membership for reads and writes.
- Keep notes and preferences auditable where they affect service or payment decisions.

### Follow-Ups

Server-owned records:

- Follow-up target.
- Due time.
- Reason.
- Suggested message.
- Status.
- Send result.
- Completion actor.

Required server behavior:

- Persist due/completed state.
- Enforce WhatsApp sending rules and role permissions.
- Avoid spammy or unsafe retry loops.
- Link sent follow-ups to conversation/order history.

### Permissions

Server-owned records:

- Business membership.
- Role.
- Permission set.
- Sensitive action policy.

Required server behavior:

- Reject unauthorized sensitive writes regardless of client UI.
- Return safe denial categories for UI display.
- Do not trust route params, local role toggles, or Zustand state.

### Audit Logs

Server-owned records:

- Actor.
- Business.
- Entity type and entity id.
- Action.
- Before/after state categories where safe.
- Timestamp.
- Request id.
- Source surface.

Required server behavior:

- Write audit entries for AI approvals, receipt decisions, payment state changes, role/permission changes, order cancellations, and sensitive settings.
- Avoid storing raw private messages, AI prompts, receipt images, bank alerts, or exact addresses in audit payloads unless a later privacy/security decision explicitly permits it.
- Make audit writes part of the same trusted server flow as the sensitive mutation.

## P0 Workflow Server Paths

| Workflow | Future server path | Required before release |
| --- | --- | --- |
| Business setup | Clerk-authenticated setup API writes business profile, type, AI rules, payment rules, delivery zones, and products. | Yes |
| WhatsApp setup | Server checks account status and stores connection metadata. | Yes |
| Today command center | Server returns attention queues from conversations, orders, receipts, approvals, and follow-ups. | Yes |
| Inbox | Server returns conversation summaries from WhatsApp sync. | Yes |
| Conversation detail | Server returns thread, customer context, draft status, and linked orders/receipts. | Yes |
| AI draft review | Server generates drafts, classifies risk, and routes approval decisions. | Yes |
| Order capture | Server creates and updates durable order records. | Yes |
| Receipt review | Server stores receipt intake, extraction, review, payment transition, and audit. | Yes |
| Follow-ups | Server schedules, sends, and completes follow-ups. | Yes |
| Customer profile | Server returns customer memory and accepts authorized notes. | Yes |
| Permission denied | Server is the source of truth for permission failures. | Yes |

## Current Fixture Boundary

These files remain dev-only data sources until backend endpoints exist:

- `features/today/todayCommandData.ts`
- `features/inbox/inboxConversationData.ts`
- `features/order/orderDetailData.ts`
- `features/receipts/receiptReviewData.ts`
- `features/follow-ups/followUpQueueData.ts`
- `features/customer/customerProfileData.ts`
- `features/approvals/approvalQueueData.ts`

They may support local screen rendering, manual UI QA, and design iteration. They must not be described as production data and must be replaced or isolated behind explicit dev/demo mode during integration passes.

## Future Client API Boundary

`lib/api/` now exists from B02 and owns the typed mobile API boundary. Do not use it to replace fixture data until the matching backend feature prompt is implemented.

The future client boundary should include:

- A single API client configured from an approved public API base URL.
- Clerk session token retrieval through approved Clerk client APIs.
- Request helpers that parse `unknown` response bodies.
- Typed endpoint functions grouped by domain.
- Safe error categories only.
- No provider tokens or private service keys.
- Unit or integration tests if a test setup is approved.

## Environment Variable Decision

`.env.example` now includes empty public placeholders only:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

Do not commit `.env`. Do not put private Supabase service role keys, database passwords, Clerk secrets, OpenAI keys, Meta tokens, webhook secrets, or provider secrets in the Expo app.

## Validation Checklist

- Backend/server ownership is defined for every P0 workflow.
- Client-secret boundaries are explicit.
- Current local fixtures are marked dev-only.
- No real provider calls are added.
- Public env placeholders are empty.
- No new packages are added.
- TypeScript and lint remain green.
