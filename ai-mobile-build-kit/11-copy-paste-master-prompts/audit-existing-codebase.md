# Audit Existing Codebase Prompt

Use this when adopting or rescuing an existing mobile app. This prompt should inspect and recommend, not change code.

```md
Anchor:
Read AGENTS.md first if it exists. If it does not exist, infer current conventions from the codebase and say that AGENTS.md is missing.

Task:
Audit this existing mobile app codebase and recommend next steps. Do not modify files.

Review areas:
1. Stack and dependency health.
2. Folder structure.
3. Navigation.
4. State management.
5. Persistence.
6. Auth and secrets.
7. API boundaries.
8. UI consistency.
9. Loading, empty, error, offline, and permission states.
10. TypeScript quality.
11. Testing setup.
12. Release readiness.

Constraints:
- Do not rewrite code.
- Do not install packages.
- Do not run destructive commands.
- Do not judge style preferences without tying them to maintainability or user impact.
- Prioritize bugs, risks, and blockers over nice-to-have cleanup.

Reference:
- Current repo files.
- Existing docs.
- Package files.
- App config.

Acceptance criteria:
- Findings are categorized as critical, medium, and nice-to-have.
- Each finding mentions files or areas.
- Recommendations are ordered.
- The audit proposes the smallest safe next steps.
- Missing AGENTS.md or missing project rules are called out.

Return:
1. Executive summary.
2. Critical issues.
3. Medium issues.
4. Nice-to-have improvements.
5. Suggested first five fixes or features.
6. Suggested AGENTS.md additions.
```

## Done Looks Like

The audit should help you regain control of the app without triggering a rewrite.
