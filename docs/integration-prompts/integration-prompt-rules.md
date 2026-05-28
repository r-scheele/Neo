# Integration Prompt Rules

- Never run multiple integration prompts at the same time.
- Never skip a dependency.
- Never run backend-deferred prompts from the active Phase A sequence.
- Never create `lib/api/` until backend decisions are approved and the Phase B API boundary prompt is active.
- Never install packages that are not listed in the prompt.
- Never add real secret values to git.
- Never remove local-only fallback until the real integration works.
- If something breaks, use a targeted bug-fix prompt.
- Commit after each working integration.
- Keep each diff small and reviewable.
- Preserve existing working flows.
- Do not implement unrelated integrations.
- Do not refactor unrelated files.
- Do not redesign screens unless the specific integration requires a tiny supporting UI state.
- Do not create fake behavior and call it real.
- Stop if required files or prerequisite integration results are missing.
- If a prompt depends on backend provider, database, deployment target, API URL, auth handoff, media storage, webhooks, or audit retention, it belongs in `backend-deferred/`.
