# B08 AI Draft Generation Backend Prompt

Status:
Complete for MVP wiring. B08 now generates drafts server-side, routes sensitive/low-confidence drafts to approvals, and keeps provider secrets out of the Expo app.

Do not run this prompt until:
- B03 database schema readiness is complete
- B04 server auth/profile bootstrap is complete
- AI provider secret is available in Supabase secrets
- server-side prompt and guardrail policy is approved
- AI draft endpoint contract is approved
- B07 WhatsApp workflow is complete if live WhatsApp conversation context is required

## When to run this prompt

Run after B04. If AI drafts depend on live WhatsApp conversation context, B07 should also be complete.

## What this prompt will do

Connect AI draft generation and approval routing to backend APIs while keeping AI provider keys, prompts, draft text, and sensitive commerce data out of client logs and analytics.

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
- docs/analytics-plan.md
- docs/state-management-plan.md
- features/conversation/ConversationDetailScreen.tsx
- features/approvals/ApprovalQueueScreen.tsx
- features/setup/AiPersonalityScreen.tsx
- lib/analytics/events.ts
- lib/api/

Also verify that backend decisions are approved and that `lib/api/` exists from B02.

If any required file or backend decision is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only AI draft generation through backend.

Scope:
- Request AI drafts from the backend API boundary.
- Use setup AI personality preferences as safe input only through the approved backend contract.
- Route low-confidence or sensitive drafts to approval queue according to backend response.
- Keep editing/review/takeover UI intact.
- Remove or isolate local-only AI draft fixture behavior once backend drafts work.
- Ensure analytics tracks only allowed bands/categories and never draft text, prompt text, private message text, or customer identifiers.

Constraints:
- Do not put AI provider keys in the client.
- Do not log AI prompts, draft text, private messages, receipt images, exact payment proof, or phone numbers.
- Do not auto-send sensitive AI drafts without human approval.
- Do not refactor unrelated files.
- Keep the diff small and reviewable.

Validation:
- Conversation Detail can request and display a backend-generated draft.
- Low-confidence/sensitive drafts route to approval instead of auto-send.
- Analytics payloads contain no prompt/draft/message text.
- npm run typecheck passes.
- npm run lint passes.
- App starts.

Stop when:
- AI draft backend integration is configured for MVP.
- Files changed, what changed, env vars added, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`connect ai draft workflow`

## Implementation Notes

- `ai-drafts` Edge Function calls the AI provider with server-owned `OPENAI_API_KEY`.
- Conversation Detail requests drafts through `lib/api/` using safe AI personality preferences only.
- Low-confidence, payment, refund, discount, and complaint drafts can route to backend approvals.
- Approval Queue loads backend approval records and records decisions through the server permission/audit path.
- Rotate the shared OpenAI test key after validation.
