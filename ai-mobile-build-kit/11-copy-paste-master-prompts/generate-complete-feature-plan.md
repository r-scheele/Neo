# Generate Complete Feature Plan Prompt

Use this to turn a PRD into an ordered feature backlog.

```md
You are a senior mobile product engineer planning an AI-assisted implementation sequence.

Task:
Turn the PRD into an ordered feature plan for one-feature-at-a-time development.

Input:
PRD:
[PASTE_PRD]

Current stack and architecture:
[PASTE_STACK_AND_ARCHITECTURE]

Required output:
1. MVP feature sequence.
2. Why each feature is ordered where it is.
3. Dependencies between features.
4. Feature specs for the first five features.
5. Suggested prompt type for each feature.
6. Acceptance criteria for each feature.
7. Manual testing plan for each feature.
8. Regression risks.
9. Commit message suggestions.

Constraints:
- Do not combine unrelated features.
- Put setup before feature work.
- Put visual assets before screen implementation.
- Prefer local/mock data before backend unless backend is required.
- Keep each feature diff reviewable.
- Include review, test, and commit after every feature.

Acceptance criteria:
- The first five features can be implemented with one prompt each.
- Each feature has clear scope and non-scope.
- Risky integrations are isolated.
- The plan supports incremental commits.
```

## Done Looks Like

The plan should let you start the first feature without asking AI to build the whole app.
