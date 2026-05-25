# Generate Complete Mobile App Docs From Attached Idea Prompt

Use this as the first giant prompt when you have an app idea in an attached file and want the AI to create the complete pre-coding documentation set.

This prompt intentionally stops before coding. It should define the product, MVP, design direction, screen states, and image prompt pack from the attached idea file.

```md
You are a senior mobile product strategist, UX/product designer, and AI prompt engineer.

Goal:
Help me discover and define a mobile app before any coding starts, using the attached app idea file as the source of truth.

Input:
- I may attach a product idea file, handoff document, notes, PRD, strategy doc, pitch, transcript, screenshot list, or rough markdown file.
- Treat the attached file as the primary source of truth.
- If multiple files are attached, synthesize them into one coherent product unless I explicitly ask for separate products.
- If the attached idea describes many modules, consolidate them as one product with modules and phases. Do not split the idea into separate standalone apps unless the source clearly requires it.
- If important details are missing, make reasonable product assumptions and label them clearly. Ask questions only if the missing detail blocks all useful documentation.

Important constraints:
- Do not write app code.
- Do not set up the app.
- Do not generate images.
- Do not choose the final stack yet.
- Do not install dependencies.
- Do not create screens/components.
- Do not make the docs generic; reflect the attached app idea deeply.
- Update every existing file in `docs/` so stale product direction does not remain.
- Create missing required files if they do not exist.
- Preserve the product as one coherent app/product unless I explicitly ask for separate alternatives.

Use these kit folders:
- `ai-mobile-build-kit/01-product-definition`
- `ai-mobile-build-kit/10-example-workflows`
- `ai-mobile-build-kit/02-design-research`
- `ai-mobile-build-kit/03-image-generation-prompts`

Phase 1: Product Discovery And Definition

Use `ai-mobile-build-kit/01-product-definition` and `ai-mobile-build-kit/10-example-workflows` to define the app idea from the attached file.

Generate or update:
- `docs/idea-options.md`
- `docs/selected-app-idea.md`
- `docs/initial-product-brief.md`
- `docs/initial-mvp-scope.md`
- `docs/initial-screen-map.md`
- `docs/initial-feature-backlog.md`

Also create or update these canonical files if useful for later phases:
- `docs/product-brief.md`
- `docs/screen-map.md`

The product definition must include:
- One-line description
- Target user
- Problem solved
- MVP features
- First 5 screens
- Backend complexity
- AI complexity
- Build difficulty
- Monetization potential
- Why it may fail

Product definition rules:
- If the source file is broad, define one unified product with connected modules.
- Use MVP scope to identify the first build slice, not to reject the rest of the product.
- Make deferred features part of the same-product roadmap, not separate app ideas.
- Explain what belongs in MVP, what belongs after MVP, and why.
- Include realistic user context, data needs, risks, permissions, edge cases, and success metrics.
- Make the first 5 screens concrete enough that design work can begin.

Phase 2: Design Research And Visual Direction

Use `ai-mobile-build-kit/02-design-research` and the product docs in `docs/`.

Generate or update:
- `docs/visual-direction.md`
- `docs/ui-style-guide.md`
- `docs/reference-collection-plan.md`
- `docs/screen-state-inventory.md`
- `docs/design-quality-checklist.md`

The design direction must include:
- Mood
- Color palette
- Typography feel
- Card style
- Icon style
- Illustration style
- Spacing rules
- Border radius rules
- Shadow rules
- Motion style
- What to avoid

Also define screen states:
- Loading
- Empty
- Error
- Success
- Offline
- Permission denied
- Long content
- First-time user
- Returning user

Design rules:
- Tailor the visual direction to the attached app idea, user, market, and emotional promise.
- Be specific enough for image generation and UI implementation.
- Do not copy competitor references directly.
- Avoid one-note palettes.
- Keep operational/SaaS tools calm, scannable, and useful.
- Keep mobile screens thumb-friendly.
- Do not add visible instructional copy that describes UI features unless it belongs in product copy.
- Define concrete tokens or values where possible.
- Include what to reject during design review.

Phase 3: Complete Image Prompt Pack

Use `ai-mobile-build-kit/03-image-generation-prompts` plus:
- `docs/product-brief.md`
- `docs/screen-map.md`
- `docs/visual-direction.md`
- `docs/ui-style-guide.md`

Generate or update:
- `docs/asset-inventory.md`
- `docs/image-prompts/style-anchor.md`
- `docs/image-prompts/logo.md`
- `docs/image-prompts/mascot.md`
- `docs/image-prompts/onboarding-hero.md`
- `docs/image-prompts/screen-illustrations.md`
- `docs/image-prompts/empty-states.md`
- `docs/image-prompts/success-states.md`
- `docs/image-prompts/error-states.md`
- `docs/image-prompts/icon-set.md`
- `docs/image-prompts/splash-screen.md`
- `docs/image-prompts/app-store-screenshots.md`

Image prompt rules:
- Do not generate actual images.
- Every prompt must be copy-paste ready.
- Every prompt must include a file name.
- Prompts must preserve consistent style, color, lighting, proportions, and mood.
- Avoid text inside generated images unless required.
- Use transparent background where useful.
- Generate a style anchor prompt first.
- If a mascot is inappropriate for the product, say so and create a more appropriate brand companion prompt instead.
- Do not imply features that are not in the product.
- Do not copy competitor visual identity.
- Use lowercase kebab-case asset names.

Required output behavior:
- Create or update the files directly in `docs/`.
- If `docs/` already exists, update every file present so all docs reflect the attached product idea.
- If a file is not relevant anymore, rewrite it to explain the current product direction rather than leaving stale content.
- Keep the documentation internally consistent.
- Use clear markdown headings and tables where helpful.
- Do not leave unresolved placeholders like `[APP_NAME]`, `[SCREEN_NAME]`, `TBD`, or `TODO`.
- After writing, verify the required files exist and scan for unresolved placeholders or stale references to older product ideas.

Acceptance criteria:
- The docs folder reflects the attached app idea as one coherent mobile product.
- Product definition is strong enough to guide MVP planning.
- Visual direction is specific enough for UI implementation and image generation.
- Screen states are defined for the core screens.
- Every required asset has a prompt and file name.
- No code was written.
- No app was set up.
- No images were generated.
- No final stack was chosen.

Stop when:
- Every required product, design, screen-state, and image-prompt file has been created or updated.
- Every required asset has a prompt and file name.
- The docs are ready for a future stack/architecture decision phase.
```

## Done Looks Like

After running this prompt, the project should have a complete `docs/` folder that defines the attached app idea, its MVP, its first screens, its visual direction, its screen states, and its image prompt pack without starting implementation.

