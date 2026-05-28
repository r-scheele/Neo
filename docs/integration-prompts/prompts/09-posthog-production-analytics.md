# PostHog Production Analytics Prompt

## When to run this prompt

Run after auth and client-side event surfaces are stable enough for event QA. This prompt does not require backend decisions.

## What this prompt will do

Finalize privacy-conscious PostHog configuration, public env placeholders, safe event QA, and auth identity reset behavior if approved by the analytics plan.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- .env.example
- app/_layout.tsx
- lib/analytics/AnalyticsProvider.tsx
- lib/analytics/events.ts
- lib/analytics/posthogClient.ts
- features/settings/SettingsScreen.tsx
- docs/analytics-plan.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only PostHog production analytics.

Scope:
- Verify `.env.example` includes `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`.
- Finalize PostHog client configuration for production-safe behavior.
- Add safe identify/reset behavior only if Clerk auth is available and the analytics plan permits it.
- Audit existing event names/properties against `docs/analytics-plan.md`.
- Ensure analytics failures never block app behavior.
- Add or adjust only analytics calls needed for approved MVP product questions.

Constraints:
- Do not implement backend/API work.
- Do not create `lib/api/`.
- Do not add API base URL usage.
- Do not install unrelated packages.
- Do not refactor unrelated files.
- Do not redesign UI.
- Keep the diff small.
- Preserve existing working flows.
- Do not track private commerce content, exact addresses, phone numbers, AI prompts, AI draft text, receipt images, bank details, exact payment references, tokens, or secrets.

Validation:
- App runs with PostHog env vars absent and analytics no-ops safely.
- App runs with local public PostHog env vars and events arrive, if keys are available.
- Sign-out resets analytics identity if identify is implemented.
- Event payloads contain only safe categories/bands.
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts.

Stop when:
- This one pass is complete.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`configure posthog analytics`
