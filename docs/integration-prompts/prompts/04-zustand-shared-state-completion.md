# Zustand Shared State Completion Prompt

## When to run this prompt

Run after Clerk auth and navigation guards are complete. Setup and preference stores must still pass typecheck/lint.

## What this prompt will do

Complete safe shared app state ownership for operations counts, draft-safe state, and connectivity state where the audit found static fixtures or scattered local state crossing screens.

## Required references

- `AGENTS.md`
- `stores/useSetupStore.ts`
- `stores/useUserPreferencesStore.ts`
- `features/operations/attentionBadges.ts`
- `features/today/TodayCommandCenterScreen.tsx`
- `features/approvals/ApprovalQueueScreen.tsx`
- `features/follow-ups/FollowUpsScreen.tsx`
- `features/inbox/InboxConversationListScreen.tsx`
- `features/conversation/ConversationDetailScreen.tsx`
- `docs/state-management-plan.md`
- Audit and integration docs

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- stores/useSetupStore.ts
- stores/useUserPreferencesStore.ts
- features/operations/attentionBadges.ts
- features/today/TodayCommandCenterScreen.tsx
- features/approvals/ApprovalQueueScreen.tsx
- features/follow-ups/FollowUpsScreen.tsx
- features/inbox/InboxConversationListScreen.tsx
- features/conversation/ConversationDetailScreen.tsx
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md
- docs/persistence-plan.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Context:
The audit found that Zustand is installed and setup/preferences stores exist, but planned shared stores for operations, safe drafts, and connectivity are missing. Tab badges and queue counts are static fixtures. Many screen actions mutate local component state only. Sensitive messages, receipt images, payment proof, tokens, and secrets must not be stored in Zustand.

Task:
Implement only Zustand shared state completion.

Use:
- AGENTS.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md
- docs/persistence-plan.md

Scope:
- Add or refine only the shared Zustand stores that are needed now, such as `useOperationsStore`, `useDraftStore`, and `useConnectivityStore`.
- Move only safe cross-screen state into stores: counts, safe status metadata, safe draft UI state if product-approved, online/offline metadata, and last synced labels.
- Connect tab attention badges to the safe shared operations state where appropriate.
- Keep screen-local state local when it belongs to one component.
- Do not move private customer messages, receipt images, bank alerts, payment proof, auth tokens, provider credentials, or raw AI prompt/draft text into Zustand.

Allowed changes:
- stores/
- lib/storage/ only if needed for typed store helpers without persistence behavior changes
- features/operations/attentionBadges.ts
- features/today/
- features/approvals/
- features/follow-ups/
- features/inbox/
- features/conversation/ only for safe store reads/writes
- docs only if needed

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
- Do not introduce backend/API calls.
- Do not persist sensitive data.
- Do not create every planned store unless it is actually needed by current flows.

Environment variables:
- Add required keys to .env.example only.
- Do not create real secret values.
- Do not commit .env.
- Do not expose private keys in client code.
- This prompt should not add new env vars.

Validation:
- Stores have explicit TypeScript types and clear action names.
- Stores do not import route files or UI components.
- Safe shared counts update consistently across tabs/screens.
- Sensitive data is not stored in Zustand.
- App starts.
- TypeScript passes.
- Lint passes.
- Existing implemented screens still render.
- Related feature flow works end to end.
- No unrelated behavior changed.

Manual test checklist:
- Open tabs and confirm attention badges derive from shared safe state.
- Trigger a safe local operation state change and confirm linked counts update.
- Toggle offline/connectivity demo state only if implemented safely.
- Confirm private message text and receipt/payment proof are not stored.

Stop when:
- Zustand shared state completion is fully configured for MVP.
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

- Badge/count state updates consistently.
- Setup/preferences stores still rehydrate.
- No sensitive content appears in Zustand state.
- Offline/connectivity state, if added, disables risky actions only where already supported.

## Regression checklist

- Setup Checklist still uses `useSetupStore`.
- Settings toggles still use `useUserPreferencesStore`.
- Today, Inbox, Approvals, Follow-ups, and Conversation still render.
- No backend behavior is implied.

## Suggested commit message

`complete shared app state`

