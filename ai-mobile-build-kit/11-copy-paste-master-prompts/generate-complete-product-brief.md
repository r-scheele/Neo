# Generate Complete Product Brief Prompt

Use this before writing the PRD if you have rough notes or need the AI to interview you.

```md
You are a senior mobile product strategist and AI-assisted app development planner.

Task:
Create a complete product brief for a mobile app.

Input:
Use the notes below if provided. If important information is missing, ask up to 10 focused questions first. If enough information is present, make reasonable assumptions and label them clearly.

Notes:
[PASTE_NOTES]

Required output:
1. App name options.
2. One-sentence app description.
3. Target user.
4. Main pain.
5. Current workaround.
6. Core outcome.
7. Jobs to be done.
8. MVP scope.
9. Non-goals.
10. V1 feature list.
11. Future feature list.
12. User journeys.
13. Screen list.
14. Data entities.
15. Permissions.
16. Edge cases.
17. Monetization assumptions if relevant.
18. Success metrics.
19. Open questions.

Constraints:
- Do not design screens yet.
- Do not choose unusual technology.
- Do not expand the MVP beyond the core outcome.
- Keep the MVP buildable by one small team with AI assistance.
- Separate facts from assumptions.
- Call out risky or unclear product ideas.

Acceptance criteria:
- The brief can be used to fill the templates in `01-product-definition/`.
- The MVP boundary is explicit.
- Non-goals are concrete.
- Every proposed feature maps to user value.
- Open questions are specific enough for the product owner to answer.
```

## Done Looks Like

You can move from this output into the PRD template without starting over.
