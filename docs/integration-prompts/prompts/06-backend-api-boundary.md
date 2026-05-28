# Backend API Boundary Prompt

## When to run this prompt

Run after auth, navigation guards, shared state, and safe persistence are complete. This pass defines the secure backend/API boundary before real WhatsApp, AI, payment, receipt, customer, order, role, or audit integrations.

## What this prompt will do

Create a backend/API architecture boundary and typed client contract layer without putting private secrets in the Expo app or pretending unavailable services are live.

## Required references

- `AGENTS.md`
- `docs/architecture-plan.md`
- `docs/security-and-secrets-plan.md`
- `docs/missing-integrations.md`
- `docs/release-blockers.md`
- `docs/feature-backlog.md`
- `docs/screen-map.md`
- Source feature folders that currently use fixtures

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/release-blockers.md
- docs/integration-priority-order.md
- docs/security-and-secrets-plan.md
- docs/architecture-plan.md
- docs/stack-decision.md
- docs/feature-backlog.md
- docs/screen-map.md
- features/today/todayCommandData.ts
- features/inbox/inboxConversationData.ts
- features/order/orderDetailData.ts
- features/receipts/receiptReviewData.ts
- features/follow-ups/followUpQueueData.ts
- features/customer/customerProfileData.ts
- features/approvals/approvalQueueData.ts

If any required file is missing, stop and report exactly what is missing. Do not guess.

Context:
The audit found that all real commerce workflows need a backend boundary. WhatsApp sync/webhooks, AI draft generation, receipt OCR/extraction, payment verification, customer/order persistence, staff role enforcement, audit logs, and cross-device sync cannot safely live only in the mobile client. This prompt originally documented the boundary before provider selection; B01 has since selected and linked Supabase.

Task:
Implement only Backend/API boundary and production data contracts.

Use:
- AGENTS.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/architecture-plan.md
- docs/stack-decision.md
- docs/feature-backlog.md
- docs/screen-map.md

Scope:
- Create or update a backend/API architecture decision document that defines the MVP server boundary, secrets boundary, API ownership, error categories, and data contracts.
- Add a typed client-side API boundary only if the backend decision is explicit enough to do so safely.
- Keep fixture/local data clearly marked as mock/dev until real endpoints exist.
- Define contracts for auth-linked business setup, WhatsApp status/conversations/send, AI drafts, orders, receipts, customers, follow-ups, permissions, and audit logs at the boundary level.
- Do not implement real WhatsApp, AI, OCR, payment verification, webhook handling, or database code in the Expo app.

Allowed changes:
- docs/
- lib/api/ if a typed no-secret client boundary is safe and explicitly described
- types/ if shared API types are needed
- feature data files only to add clear mock/dev labels or adapter boundaries, not to remove working fixtures prematurely
- .env.example only if the backend decision explicitly approves a public Expo variable

Constraints:
- Do not implement unrelated integrations.
- Do not refactor unrelated files.
- Do not redesign screens.
- Do not change visual design unless required.
- Do not install unrelated packages.
- Do not hardcode secrets.
- Do not create fake behavior and call it real.
- Keep the diff small and reviewable.
- Preserve existing working flows.
- Do not add private API keys, WhatsApp tokens, AI provider keys, payment secrets, webhook secrets, database URLs, or admin credentials to the Expo app.
- If backend provider, API base URL, auth strategy, or deployment target is ambiguous, stop and document the exact decision needed instead of guessing.

Environment variables:
- Add required keys to .env.example only.
- Do not create real secret values.
- Do not commit .env.
- Do not expose private keys in client code.
- Do not add a public API URL unless the backend decision explicitly approves the variable name and why it is safe.

Validation:
- Backend/API boundary document exists and names what must stay server-side.
- Typed client contracts, if added, parse unknown responses safely.
- Existing fixture/local flows remain usable and clearly labeled.
- No client secrets are introduced.
- App starts.
- TypeScript passes.
- Lint passes.
- Existing implemented screens still render.
- Related boundary flow works end to end where possible.
- No unrelated behavior changed.

Manual test checklist:
- Review the backend boundary doc and confirm every P0 workflow has a server-owned data path.
- Search the repo for forbidden secrets and private env names.
- Confirm current screens still render using mock/local data.
- Confirm API errors, if client boundary was added, use safe categories.

Stop when:
- Backend/API boundary is fully configured for MVP.
- Local-only fallback for this integration is removed or clearly isolated as dev-only.
- The integration works end to end where possible.
- You provide:
  1. Files changed
  2. What changed
  3. Packages installed, if any
  4. Env vars added to .env.example
  5. How to test
  6. Any risks
  7. Suggested commit message
```

## Manual test checklist

- Backend boundary doc covers WhatsApp, AI, orders, receipts, payments, customers, permissions, and audit logs.
- No client secrets exist.
- Fixture screens still render.
- Typecheck/lint pass.

## Regression checklist

- Existing local-only MVP flows still work.
- No real provider calls were added without a backend decision.
- No private env vars were added to the Expo client.

## Suggested commit message

`define backend api boundary`
