# Navigation App Shell Protection Prompt

## When to run this prompt

Run after prompt 02 is complete and Clerk auth works. The app must have real signed-in/signed-out state available.

## What this prompt will do

Add auth-aware and setup-aware route protection for public auth routes, setup routes, tabs, and detail screens.

## Required references

- `AGENTS.md`
- `app/_layout.tsx`
- `app/index.tsx`
- `app/(auth)/_layout.tsx`
- `app/(setup)/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `constants/routes.ts`
- `stores/useSetupStore.ts`
- `docs/auth-plan.md`
- `docs/screen-map.md`
- Audit and integration docs

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- app/_layout.tsx
- app/index.tsx
- app/(auth)/_layout.tsx
- app/(setup)/_layout.tsx
- app/(tabs)/_layout.tsx
- constants/routes.ts
- stores/useSetupStore.ts
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/screen-map.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Context:
The audit found that setup, tabs, and detail routes are unprotected. `app/index.tsx` always redirects to Welcome. Signed-out users can directly access setup, tabs, conversation, order, receipt, customer, and permission routes. Signed-in/setup-complete routing is not real.

Task:
Implement only Navigation/app shell protection.

Use:
- AGENTS.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/screen-map.md
- docs/architecture-plan.md

Scope:
- Add auth-aware route guards using the Clerk integration from prompt 02.
- Add setup-completion-aware routing using the existing setup store or a small selector/helper.
- Make Welcome and Sign In public while redirecting already signed-in users appropriately.
- Require auth for setup routes.
- Require auth and setup completion for tabs and detail routes.
- Make root redirect session/setup aware instead of always redirecting to Welcome.

Allowed changes:
- app/_layout.tsx
- app/index.tsx
- app/(auth)/_layout.tsx
- app/(setup)/_layout.tsx
- app/(tabs)/_layout.tsx
- app/conversation/[id].tsx
- app/order/
- app/receipt/[id].tsx
- app/customer/[id].tsx
- app/modals/permission.tsx
- constants/routes.ts
- lib/auth/ if needed
- stores/useSetupStore.ts only for setup completion selectors/helpers
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
- Do not implement backend roles or permissions here.
- Do not remove mock data unless navigation requires isolating public access.

Environment variables:
- Add required keys to .env.example only.
- Do not create real secret values.
- Do not commit .env.
- Do not expose private keys in client code.
- This prompt should not add new env vars beyond existing Clerk public key.

Validation:
- Signed-out users can access only Welcome and Sign In.
- Signed-out direct visits to setup, tabs, and detail routes redirect safely to Sign In or Welcome.
- Signed-in setup-incomplete users land in setup.
- Signed-in setup-complete users land in Today.
- Signed-in users are not stuck on auth routes.
- App starts.
- TypeScript passes.
- Lint passes.
- Existing implemented screens still render.
- Related navigation flow works end to end.
- No unrelated behavior changed.

Manual test checklist:
- Sign out and try to open Today, Inbox, Conversation, Order, Receipt, Customer, and Settings directly.
- Sign in with incomplete setup and confirm setup routes are reachable but tabs/details redirect.
- Complete setup state and confirm root opens Today.
- Use back navigation from auth/setup/tabs and confirm no redirect loop.

Stop when:
- Navigation/app shell protection is fully configured for MVP.
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

- Signed-out direct protected route test.
- Signed-in incomplete-setup route test.
- Signed-in complete-setup route test.
- Auth route redirect test for already signed-in user.

## Regression checklist

- Welcome and Sign In remain public.
- Setup screens still route between steps.
- Main tabs still render after setup completion.
- Detail routes still accept typed params after auth/setup checks.

## Suggested commit message

`protect app navigation`

