# Feature Implementation Prompts

These prompts turn Neo's MVP backlog into focused Codex implementation tasks. Each prompt file is self-executing: providing the whole file to Codex is enough for Codex to read `AGENTS.md`, verify prerequisites, and implement only that feature.

## How To Use

1. Open `docs/feature-implementation-prompts/feature-prompt-index.md`.
2. Start with prompt 01 unless its dependencies are missing.
3. Open the matching prompt file in `docs/feature-implementation-prompts/prompts/`.
4. Provide the entire prompt file to Codex. No extra instruction should be needed.
5. Let Codex verify prerequisites and implement only that feature.
6. Review the diff before moving on.
7. Run lint and typecheck.
8. Run the app.
9. Test the new feature.
10. Test old related flows.
11. Commit with the suggested commit message or a clearer equivalent.
12. Update the feature prompt index status.
13. Move to the next prompt only after the current one is complete.

## Important Rules

- Run one prompt at a time.
- Do not combine prompts.
- Do not skip a dependency.
- Do not ask Codex to build the whole app.
- Do not provide extra scope outside the selected prompt file.
- Do not import UI reference screenshots into app code.
- Do not import runtime images directly inside screens or components; use `constants/images.ts`.
- If a prompt reports missing required files, stop and fix the prerequisite first.

## Current Starting Point

The app shell, route placeholders, design docs, generated UI references, runtime image assets, and `constants/images.ts` exist. The first recommended implementation prompt is:

`docs/feature-implementation-prompts/prompts/01-welcome-screen.md`
