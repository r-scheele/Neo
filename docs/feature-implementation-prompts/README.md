# Feature Implementation Prompts

These prompts turn Neo's MVP backlog into focused AI-assisted implementation tasks. Each prompt file is self-executing: providing the whole file to an AI coding assistant is enough for the assistant to read `AGENTS.md`, verify prerequisites, and implement only that feature.

## How To Use

1. Open `docs/feature-implementation-prompts/feature-prompt-index.md`.
2. Start with prompt 01 unless its dependencies are missing.
3. Open the matching prompt file in `docs/feature-implementation-prompts/prompts/`.
4. Provide the entire prompt file to the coding assistant. No extra instruction should be needed.
5. Let the coding assistant verify prerequisites and implement only that feature.
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
- Do not ask the coding assistant to build the whole app.
- Do not provide extra scope outside the selected prompt file.
- Do not import UI reference screenshots into app code.
- Do not import runtime images directly inside screens or components; use `constants/images.ts`.
- If a prompt reports missing required files, stop and fix the prerequisite first.

## Current Starting Point

The local MVP feature prompts have been implemented. Keep these prompts as historical implementation specs and use `feature-prompt-index.md` to understand which local screens exist.

New work should now use the integration prompts in `docs/integration-prompts/`, starting with environment/config cleanup and then moving one pass at a time toward real services.
