# Next Required Steps

## Purpose

This document lists the immediate recovery steps required before Neo enters app implementation. It is intentionally limited to workflow repair and project setup readiness.

## Current Status

Planning and generated assets exist. The app codebase does not exist yet.

Do not implement the Home screen or any app feature until the architecture plan, `AGENTS.md`, app scaffold, asset constants, and Home screen spec/reference are in place.

## Next 5 Actions

1. Create `docs/architecture-plan.md`.

   Use `ai-mobile-build-kit/04-stack-and-architecture/architecture-plan-template.md`, `default-expo-stack.md`, `folder-structure-guide.md`, `dependency-decision-rules.md`, `state-management-guide.md`, and the existing Neo docs. The plan should define routing, folder structure, styling, image assets, state/data approach, TypeScript, linting, and testing.

2. Create `AGENTS.md`.

   Only do this after `docs/architecture-plan.md` exists. It should capture the project rules, product guardrails, design system, implementation constraints, commands to run, and the rule that sensitive payment actions require human review.

3. Scaffold the Expo/React Native app shell.

   Create the actual app workspace with `package.json`, TypeScript, lint scripts, Expo Router structure, and empty route placeholders only as required by the architecture plan. Do not build feature screens during scaffolding.

4. Wire generated assets.

   Create `constants/images.ts`, confirm the app can import assets from `assets/images/`, and decide how SVG icons in `assets/icons/` will be consumed without installing new libraries unless the architecture plan explicitly approves them.

5. Prepare the Home screen implementation package.

   Create `docs/ui-design-prompts/screens/home-screen.md`, create or place `design-assets/ui-screens/home.png`, and define the exact acceptance criteria for the Home/Today Command Center before coding starts.

## Stop Conditions Before Coding

- Product docs are present and approved enough for implementation.
- Architecture plan exists.
- `AGENTS.md` exists and matches the architecture plan.
- App scaffold exists and passes baseline TypeScript/lint.
- Home screen spec and reference image exist.

## Do Not Do Yet

- Do not implement the Home screen.
- Do not create unrelated screens.
- Do not install packages.
- Do not delete generated assets or planning docs.
- Do not invent navigation beyond the architecture plan.
- Do not imply payment confirmation can happen automatically from receipt screenshots.

