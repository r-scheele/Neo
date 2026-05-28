# B02 API Client And Auth Boundary Prompt

Status:
Complete. `lib/api/` contains the typed client boundary, safe response parser, env validation, endpoint constants, health request helper, and Clerk-backed `useApiClient()` token handoff.

Do not run this prompt until:
- B01 Supabase foundation is complete
- public API base URL placeholders exist
- Clerk-to-backend auth strategy is documented
- MVP API response envelope is approved

## What this prompt will do

Create the typed client API boundary after backend decisions are approved. This is the prompt that may create `lib/api/`.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- docs/backend-api-boundary.md
- docs/security-and-secrets-plan.md
- docs/auth-plan.md
- docs/missing-integrations.md
- docs/integration-completion-plan.md
- .env.example

Also verify that docs/backend-api-boundary.md contains approved backend provider, database/schema, deployment target, public API base URL env var name, Clerk-to-backend auth strategy, media storage, webhook strategy, and audit retention decisions.

If any required file or backend decision is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only the API client and auth boundary.

Scope:
- Add `lib/api/` with a small typed API client.
- Configure the approved public API base URL env var in `.env.example` only.
- Retrieve Clerk session tokens only through approved Clerk client APIs.
- Parse unknown response bodies into typed success/error results.
- Expose safe error categories only.
- Add endpoint groups only for approved MVP contracts.

Constraints:
- Do not implement WhatsApp, AI, commerce sync, permissions, or audit workflows in this prompt.
- Do not add private keys or service tokens to the Expo app.
- Do not create real `.env` values.
- Do not install packages unless the approved backend decision requires and documents them.
- Do not log tokens, private messages, prompts, draft text, receipt images, payment proof, phone numbers, or exact addresses.
- Keep the diff small and reviewable.

Validation:
- API client compiles.
- Missing/invalid public API URL fails safely.
- Safe error parsing works for network, auth, permission, validation, and not-found cases.
- npm run typecheck passes.
- npm run lint passes.
- App starts.

Stop when:
- The typed API/auth boundary is ready for B03.
- Files changed, what changed, env vars added, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`add api client boundary`
