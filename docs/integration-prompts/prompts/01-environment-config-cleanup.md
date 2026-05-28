# Environment Config Cleanup Prompt

## When to run this prompt

Run this first, before any service integration. The audit docs must exist and the current app should still pass typecheck/lint.

## What this prompt will do

Align project docs, env placeholders, config assumptions, and release-readiness notes with the actual implemented app. This pass should not install packages or wire services.

## Required references

- `AGENTS.md`
- `package.json`
- `.env.example`
- `README.md`
- `app.json`
- `tsconfig.json`
- `metro.config.js`
- `eslint.config.js`
- `postcss.config.mjs`
- `src/global.css`
- `docs/mvp-implementation-audit.md`
- `docs/local-only-placeholder-report.md`
- `docs/missing-integrations.md`
- `docs/integration-completion-plan.md`
- `docs/release-blockers.md`
- `docs/integration-priority-order.md`
- `docs/architecture-plan.md`
- `docs/stack-decision.md`
- `docs/security-and-secrets-plan.md`

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- .env.example
- README.md
- app.json
- tsconfig.json
- metro.config.js
- eslint.config.js
- postcss.config.mjs
- src/global.css
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/release-blockers.md
- docs/integration-priority-order.md
- docs/architecture-plan.md
- docs/stack-decision.md
- docs/security-and-secrets-plan.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Context:
Before this cleanup pass, the audit found that the app shell and MVP screens existed, but some readiness docs still said no app scaffold existed and feature prompts were "Not started". `.env.example` contains public Clerk and PostHog placeholders, but Clerk is not installed/configured. Tailwind v4 tokens live in `src/global.css`; `babel.config.js`, `tailwind.config.js`, and `nativewind.config.js` are absent and must be clarified before service work begins.

Task:
Implement only Environment/config cleanup.

Use:
- AGENTS.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- docs/security-and-secrets-plan.md
- docs/integration-priority-order.md
- docs/architecture-plan.md
- docs/stack-decision.md

Scope:
- Update stale planning/readiness docs so they match the current app reality: app scaffold exists, MVP screens exist, integrations remain pending.
- Verify `.env.example` contains only approved public client placeholders and no real values.
- Clarify whether missing `babel.config.js`, `tailwind.config.js`, and `nativewind.config.js` are required for this Tailwind v4/NativeWind setup; add config files only if the current stack actually requires them.
- Update README or docs with the current verification commands and integration order if needed.
- Do not install packages or configure Clerk/PostHog/backend services.

Allowed changes:
- README.md
- .env.example
- docs/
- Config files only if they are required by the existing Expo/NativeWind/Tailwind setup: app.json, tsconfig.json, metro.config.js, eslint.config.js, postcss.config.mjs, babel.config.js, tailwind.config.js, nativewind.config.js

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
- Do not modify app feature/source files for this pass unless a tiny config-related correction is necessary.

Environment variables:
- Add required keys to .env.example only.
- Do not create real secret values.
- Do not commit .env.
- Do not expose private keys in client code.
- Keep only approved public Expo variables unless a later backend decision explicitly adds another public value.

Validation:
- Confirm stale docs now match project reality.
- Confirm `.env.example` has only public placeholders.
- Confirm no service integration was configured.
- App starts.
- TypeScript passes.
- Lint passes.
- Existing implemented screens still render.
- No unrelated behavior changed.

Manual test checklist:
- Open README/readiness docs and confirm they no longer say the app scaffold is missing.
- Confirm the integration order starts with environment/config cleanup.
- Confirm `.env.example` has placeholders only.
- Start the app and open Welcome, Setup, and Today.

Stop when:
- Environment/config cleanup is fully configured for MVP.
- Local-only fallback for this integration is removed or clearly isolated as dev-only where applicable.
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

- README and readiness docs describe the current app correctly.
- `.env.example` contains no real values.
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts and primary routes still render.

## Regression checklist

- Welcome still opens.
- Sign In still opens in its current local-only state.
- Setup Checklist still opens.
- Main tabs still render.
- No app source behavior changes unless a config correction was required.

## Suggested commit message

`align integration config docs`
