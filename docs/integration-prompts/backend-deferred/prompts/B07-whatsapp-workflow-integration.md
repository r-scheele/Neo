# B07 WhatsApp Workflow Integration Prompt

Status:
Deferred until B03-B04 are complete and WhatsApp provider secrets/contracts are approved.

Do not run this prompt until:
- B03 database schema readiness is complete
- B04 server auth/profile bootstrap is complete
- Meta WhatsApp access token is available in Supabase secrets
- Meta phone number ID and business account ID are available in Supabase secrets
- WhatsApp webhook verify token and app secret are available in Supabase secrets
- WhatsApp media storage rules are approved
- WhatsApp endpoint contracts are approved

## When to run this prompt

Run after B04 and only when WhatsApp secrets/contracts are ready. If commerce records must be created from live WhatsApp conversations, run after B05 as well.

## What this prompt will do

Connect WhatsApp setup status, inbox, conversation read/send behavior, follow-up send behavior, and Today counts to backend APIs without exposing WhatsApp secrets in the client.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/backend-api-boundary.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/architecture-plan.md
- features/setup/WhatsAppSetupScreen.tsx
- features/inbox/InboxConversationListScreen.tsx
- features/conversation/ConversationDetailScreen.tsx
- features/follow-ups/FollowUpsScreen.tsx
- features/today/TodayCommandCenterScreen.tsx
- lib/api/

Also verify that backend decisions are approved and that `lib/api/` exists from B02.

If any required file or backend decision is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only WhatsApp workflow integration through the backend.

Scope:
- Replace mock WhatsApp connection status with backend-provided status.
- Load Inbox and Conversation data from the backend API boundary.
- Route approved send/follow-up actions through backend send endpoints.
- Keep local fixture fallback only as clearly isolated dev/demo behavior until real endpoints work.
- Handle disconnected, loading, empty, error, offline, and permission states from API responses.
- Ensure no WhatsApp access token, webhook secret, customer phone number logs, or private messages are exposed in client logs or analytics.

Constraints:
- Do not implement AI draft generation in this prompt.
- Do not implement payment verification in this prompt.
- Do not put WhatsApp tokens or webhook secrets in the client.
- Do not log private message content.
- Do not refactor unrelated files.
- Keep the diff small and reviewable.

Validation:
- WhatsApp setup status is backend-backed.
- Inbox loads backend conversations.
- Conversation Detail loads backend thread data.
- Send and follow-up actions call backend endpoints and fail safely.
- npm run typecheck passes.
- npm run lint passes.
- App starts.

Stop when:
- WhatsApp workflow integration is configured for MVP.
- Files changed, what changed, env vars added, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`connect whatsapp workflow`
