# Clerk Authentication Prompt

## When to run this prompt

Run after prompt 01 is complete and committed. `.env.example` must contain `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, and the auth screens must still render in their local-only state.

## What this prompt will do

Install and configure Clerk for Expo auth, replace local-only sign-in navigation with real Clerk session behavior, and connect sign-out to safe local state clearing.

## Required references

- `AGENTS.md`
- `package.json`
- `.env.example`
- `app/_layout.tsx`
- `app/(auth)/sign-in.tsx`
- `features/auth/RegisterSignInScreen.tsx`
- `features/settings/SettingsScreen.tsx`
- `stores/localStateReset.ts`
- `docs/auth-plan.md`
- `docs/security-and-secrets-plan.md`
- Audit and integration docs

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- .env.example
- app/_layout.tsx
- app/(auth)/sign-in.tsx
- app/(auth)/welcome.tsx
- features/auth/RegisterSignInScreen.tsx
- features/settings/SettingsScreen.tsx
- stores/localStateReset.ts
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/stack-decision.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Context:
The audit found that Clerk is required for MVP but `@clerk/clerk-expo` and `expo-secure-store` are not installed. `app/_layout.tsx` has no `ClerkProvider`. `RegisterSignInScreen` validates a credential locally and pushes to setup without creating a session. Settings has local-only sign-out/clear-state behavior.

Task:
Implement only Clerk authentication.

Use:
- AGENTS.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/stack-decision.md

Scope:
- Install only Clerk packages listed in this prompt if they are not already installed: `@clerk/clerk-expo` and `expo-secure-store`.
- Configure `ClerkProvider` in the root layout according to current official Clerk Expo documentation.
- Add a Clerk token cache using `expo-secure-store` if required by current Clerk Expo docs.
- Replace local-only sign-in/registration submission with real Clerk auth behavior while preserving existing visual design as much as possible.
- Connect sign-out to Clerk and `clearUserLocalState` without manually persisting or clearing Clerk-managed tokens unless Clerk docs require it.
- Keep auth public env usage limited to `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.

Allowed changes:
- package.json
- package-lock.json
- .env.example
- app/_layout.tsx
- app/(auth)/
- features/auth/
- features/settings/SettingsScreen.tsx
- lib/auth/ if needed
- stores/localStateReset.ts only if needed to support sign-out clearing
- docs only if needed to note setup details

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
- Use Clerk only according to current official Expo documentation.
- Do not expose Clerk secret keys in the client.
- Do not manually persist Clerk auth tokens.

Environment variables:
- Add required keys to .env.example only.
- Do not create real secret values.
- Do not commit .env.
- Do not expose private keys in client code.
- Required public key: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=`.

Validation:
- ClerkProvider is configured and fails safely if the publishable key is missing.
- Sign-in/sign-up flow creates a real Clerk session with configured test credentials.
- Sign-out clears safe local user state and signs out through Clerk.
- No Clerk secret key appears in the repo.
- App starts.
- TypeScript passes.
- Lint passes.
- Existing implemented screens still render.
- Related auth flow works end to end.
- No unrelated behavior changed.

Manual test checklist:
- Launch app with a valid local Clerk publishable key.
- Sign up or sign in using the supported configured method.
- Restart the app and confirm the session is restored.
- Sign out from Settings and confirm safe local state is cleared.
- Remove the local key and confirm the app fails safely without exposing secrets.

Stop when:
- Clerk authentication is fully configured for MVP.
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

- Sign in with a valid test account.
- Restart and confirm the session persists through Clerk.
- Sign out and confirm setup/preferences clear as intended.
- Confirm no protected route work was added in this prompt beyond auth wiring.

## Regression checklist

- Welcome route still renders.
- Sign-in screen keeps Neo visual styling.
- Setup screen still renders after auth.
- Settings still renders and sign-out is deliberate.

## Suggested commit message

`configure clerk authentication`

