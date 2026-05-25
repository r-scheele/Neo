# AI Personality Settings Implementation Prompt

## Direct Codex Execution

This file is the complete implementation request. If this file is provided to Codex by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the setup route group exists and the Business Type screen is implemented.

## Codex prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/ai-personality-screen.md
- design-assets/ui-screens/ai-personality.png
- assets/images/icon-ai-draft.png
- constants/images.ts
- app/(setup)/

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only AI Personality settings.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/ai-personality-screen.md
- design-assets/ui-screens/ai-personality.png

Scope:
- Add or replace only the AI Personality setup route.
- Implement tone, language, reply length, approval preference, and guardrail controls shown in the reference.
- Save only local/setup-state preferences.

Constraints:
- Do not implement real AI calls.
- Do not create prompts that send data to an AI provider.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local state for controls.
- Use Zustand only if setup progress or later screens need the values now.
- Use AsyncStorage only if already available and approved for setup preferences.
- Do not store private customer examples or AI prompts.

UI rules:
- Match `design-assets/ui-screens/ai-personality.png` exactly.
- Use segmented controls, toggles, and form controls consistent with the style guide.
- Make sure the screen works on small and large phones.

Validation:
- Controls can be changed and validated.
- Guardrail copy preserves human approval principles.
- No real AI integration is added.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- AI Personality settings work end to end within local setup scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open AI Personality from setup.
- [ ] Compare the screen to `design-assets/ui-screens/ai-personality.png`.
- [ ] Change each control.
- [ ] Save or continue and confirm expected local behavior.
- [ ] Confirm no AI provider calls are made.

## Regression checklist

- [ ] Setup Checklist still loads.
- [ ] Business Type still works.
- [ ] App startup still works.

## Suggested commit message

add ai personality settings

