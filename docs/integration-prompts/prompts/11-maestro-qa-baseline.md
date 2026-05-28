# Maestro QA Baseline Prompt

## When to run this prompt

Run after local state and screen-state client passes are stable.

## What this prompt will do

Create a client-side QA baseline for the current MVP. If Maestro is already available, add or update lightweight smoke flows. If Maestro is not available, do not install it; document a manual QA baseline instead.

## Codex prompt

```text
Read AGENTS.md first and follow it strictly.

Before coding/configuring, verify that these required files exist:
- AGENTS.md
- package.json
- README.md
- docs/screen-map.md
- docs/mvp-implementation-audit.md
- docs/local-only-placeholder-report.md
- docs/release-blockers.md
- app/
- features/

If any required file is missing, stop and report exactly what is missing. Do not guess.

Task:
Implement only the Maestro/QA baseline.

Scope:
- Check whether a Maestro setup already exists.
- Check whether the `maestro` CLI is available locally.
- If Maestro already exists or the CLI is already available, add minimal smoke flows for Welcome, Sign In route visibility, setup checklist, tabs, and key detail routes.
- If Maestro is not available, do not install it; create or update a docs-based manual QA baseline instead.
- Keep QA coverage focused on current client/local behavior.
- Document backend-required QA as deferred.

Constraints:
- Do not implement backend/API work.
- Do not create `lib/api/`.
- Do not add API base URL usage.
- Do not install packages or external tools.
- Do not refactor unrelated files.
- Do not redesign UI.
- Keep the diff small.
- Preserve existing working flows.

Validation:
- `npm run typecheck` passes.
- `npm run lint` passes.
- App starts.
- Maestro smoke passes if Maestro is already available and flows are added.
- If Maestro is unavailable, the manual QA baseline is complete and explicit.

Stop when:
- This one pass is complete.
- Files changed, what changed, how to test, risks, and suggested commit message are provided.
```

## Suggested commit message

`add qa baseline`
