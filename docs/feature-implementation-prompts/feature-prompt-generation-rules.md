# Feature Prompt Generation Rules

These rules govern all prompts in `docs/feature-implementation-prompts/prompts/`.

## Core Rules

- Every prompt must tell the coding assistant to read `AGENTS.md` first.
- Every prompt must include a direct execution block near the top that says the whole file is the active coding task.
- Every prompt must be scoped to one feature, flow, screen, integration, or state change.
- Every prompt must include required references and required app files.
- Every prompt must tell the coding assistant to stop if required files are missing.
- Every prompt must include constraints, state rules, UI rules, validation, and stop conditions.
- Every prompt must tell the coding assistant not to import design reference screenshots into app code.
- Every prompt must tell the coding assistant to return files changed, what changed, how to test, risks, and a suggested commit message.

## Sequencing Rules

- Never run multiple feature prompts at the same time if they touch the same files.
- Never skip ahead if a dependency is missing.
- Never ask the coding assistant to build multiple backlog items in one prompt.
- Never require an extra user instruction beyond providing the chosen prompt file.
- If a feature fails, use a targeted bug-fix prompt, not a rewrite prompt.
- Update `feature-prompt-index.md` after each completed feature.

## Dependency Rules

- If a prompt requires an app file, UI reference image, runtime asset, or package that is missing, the coding assistant must stop and report the missing prerequisite.
- Do not ask the coding assistant to install libraries inside feature prompts.
- If a feature requires a missing library, create or run an approved setup task separately before running the feature prompt.
- Keep each prompt aligned with `docs/architecture-plan.md`, `docs/stack-decision.md`, and `AGENTS.md`.

## Design And Asset Rules

- Use UI reference images from `design-assets/ui-screens/` only as visual references.
- Do not import UI reference images into runtime app code.
- Use runtime assets from `assets/images/` through `constants/images.ts`.
- Preserve the visual direction in `docs/visual-direction.md` and `docs/ui-style-guide.md`.

## Completion Rules

A feature prompt is complete only when:

- The requested feature works end to end within its scope.
- TypeScript and lint pass, or the coding assistant clearly reports why they could not run.
- Navigation and existing related flows still work.
- The diff is small and reviewable.
- The feature index can be updated from `Not started` to `Complete`.
