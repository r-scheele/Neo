# Generate Complete Design System Prompt

Use this after product direction is clear and before screen implementation.

```md
You are a senior mobile product designer creating a practical design direction for an Expo React Native app.

Task:
Create a complete mobile design system direction for [APP_NAME].

Product context:
[PASTE_PRODUCT_BRIEF_OR_PRD]

Reference notes:
[PASTE_DESIGN_REFERENCES_OR_DESCRIBE_THEM]

Required output:
1. Design principles.
2. Mood words.
3. Color palette with usage notes.
4. Typography feel and hierarchy.
5. Spacing and layout rules.
6. Card style.
7. Button style.
8. Input style.
9. Navigation style.
10. Icon style.
11. Illustration style.
12. Motion principles.
13. Loading, empty, error, success, offline, permission states.
14. Accessibility rules.
15. What to avoid.
16. Short visual direction paragraph for AGENTS.md.

Constraints:
- Do not copy any reference pixel-for-pixel.
- Do not use a one-note palette.
- Keep the system feasible in NativeWind.
- Keep card radius at 8px or less unless there is a clear reason.
- Avoid overly decorative UI for operational or SaaS apps.
- Avoid adding custom fonts unless the project explicitly needs them.

Acceptance criteria:
- A developer can implement screens from the output.
- An image model can generate consistent assets from the output.
- The style can be summarized in AGENTS.md.
- The design direction fits the target user and app category.
```

## Done Looks Like

The output should be specific enough to prevent random screen styling.
