# AsyncStorage Persistence Completion Prompt

## When to run this prompt

Run after Clerk auth, navigation guards, and shared state completion. Sign-out must be real so user-specific local data can clear correctly.

## What this prompt will do

Complete safe AsyncStorage persistence for setup, preferences, and approved local-safe state. Normalize prototype defaults and connect clearing to sign-out.

## Required references

- `AGENTS.md`
- `lib/storage/*`
- `stores/useSetupStore.ts`
- `stores/useUserPreferencesStore.ts`
- `stores/localStateReset.ts`
- `features/settings/SettingsScreen.tsx`
- `docs/persistence-plan.md`
- `docs/state-management-plan.md`
- `docs/auth-plan.md`
- Audit and integration docs

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- lib/storage/index.ts
- lib/storage/safeAsyncStorage.ts
- lib/storage/storageKeys.ts
- lib/storage/zustandStorage.ts
- stores/useSetupStore.ts
- stores/useUserPreferencesStore.ts
- stores/localStateReset.ts
- features/settings/SettingsScreen.tsx
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/persistence-plan.md
- docs/state-management-plan.md
- docs/auth-plan.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Context:
The audit found that AsyncStorage is installed and safe storage helpers exist, but sign-out clearing was not connected to real auth before the Clerk pass. The setup store default starts with most steps complete, which is useful for prototype demos but wrong for first-run MVP behavior. Persistence must never store secrets, auth tokens, raw customer conversations, receipt images, bank alerts, exact payment proof, or sensitive personal data.

Task:
Implement only AsyncStorage persistence completion.

Use:
- AGENTS.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/persistence-plan.md
- docs/state-management-plan.md
- docs/auth-plan.md

Scope:
- Normalize first-run setup defaults so setup is not mostly complete by default unless persisted data says so.
- Ensure persisted setup and preference shapes are versioned and parsed defensively.
- Connect `clearUserLocalState` to real sign-out behavior from the Clerk pass if not already connected.
- Add safe persistence only for approved low/medium sensitivity data.
- Keep draft persistence disabled unless product-approved and safe.
- Ensure corrupt or missing AsyncStorage data falls back without crashing.

Allowed changes:
- lib/storage/
- stores/
- features/settings/SettingsScreen.tsx
- features/auth/ only if needed to invoke local-state clearing during sign-out
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
- Do not store passwords, auth tokens, private keys, provider secrets, raw customer messages, receipt images, bank alerts, exact payment proof, or sensitive personal data in AsyncStorage.
- Do not introduce offline action queues.

Environment variables:
- Add required keys to .env.example only.
- Do not create real secret values.
- Do not commit .env.
- Do not expose private keys in client code.
- This prompt should not add new env vars.

Validation:
- Setup progress and preferences rehydrate after app restart.
- First-run setup starts incomplete unless valid persisted data exists.
- Corrupt persisted data falls back safely.
- Sign-out clears user-specific local data.
- Sensitive data is not persisted.
- App starts.
- TypeScript passes.
- Lint passes.
- Existing implemented screens still render.
- Related persistence flow works end to end.
- No unrelated behavior changed.

Manual test checklist:
- Complete one setup step, restart, and confirm it persists.
- Toggle a safe setting, restart, and confirm it persists.
- Sign out and confirm user-specific setup/preferences clear.
- Manually corrupt a safe storage key and confirm app recovers.

Stop when:
- AsyncStorage persistence completion is fully configured for MVP.
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

- Restart persistence for setup and settings.
- Sign-out clearing.
- Corrupt storage recovery.
- Sensitive-data storage review.

## Regression checklist

- Auth sign-out still works.
- Setup Checklist still renders.
- Settings toggles still render.
- No private customer/payment content is persisted.

## Suggested commit message

`complete safe local persistence`

