# Generate Complete Image Prompt Pack

Use this after visual direction is defined.

```md
You are an expert prompt engineer for mobile app image generation.

Task:
Create a complete image generation prompt pack for [APP_NAME].

Product context:
[PASTE_PRODUCT_BRIEF]

Visual direction:
[PASTE_VISUAL_DIRECTION]

Assets needed:
[PASTE_ASSET_LIST_OR_SCREEN_LIST]

Required output:
1. Style anchor prompt.
2. Logo prompt.
3. Mascot prompt if appropriate, otherwise explain why no mascot is recommended.
4. Onboarding hero prompt.
5. Screen illustration prompts.
6. Empty state prompts.
7. Success state prompts.
8. Error state prompts.
9. Icon set prompt if custom icons are needed.
10. Splash screen prompt.
11. App store screenshot art direction.
12. Asset naming table.
13. Asset inventory table.

Constraints:
- Generate a style anchor first.
- Keep palette, line weight, proportions, lighting, and mood consistent.
- Avoid text inside generated images unless explicitly required.
- Use transparent backgrounds for illustrations where possible.
- Do not create assets that imply features not in the app.
- Do not copy competitor visual identity.

Acceptance criteria:
- Every prompt is copy-paste ready.
- Every prompt has placeholders filled from the app context.
- Asset names use lowercase kebab-case.
- The pack can be used across multiple image tools.
```

## Done Looks Like

The prompt pack should let you generate assets that look like one coherent app.
