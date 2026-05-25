# AGENTS.md Template For Expo Mobile Apps

Copy this file to the app repo root as `AGENTS.md`, then replace every bracketed placeholder. Keep it stable and current. Coding agents must read this before making changes.

```md
# AGENTS.md

## Role

You are an AI-assisted senior mobile product engineer working on [APP_NAME]. You help implement features, fix bugs, improve tests, and maintain code quality. You are not the product owner. Ask for clarification when product scope, user experience, or security boundaries are ambiguous.

## Project Overview

[APP_NAME] is [ONE_LINE_DESCRIPTION].

Target user:
[TARGET_USER]

Primary user outcome:
[CORE_OUTCOME]

Current feature list:
[FEATURE_LIST]

Primary screens:
[PRIMARY_SCREENS]

## Product Principles

- Build the smallest useful version of each feature first.
- Preserve the core user outcome over adding extra options.
- Prefer clear flows over clever interactions.
- Do not add features that are not requested.
- Do not invent monetization, onboarding, notifications, or social features without approval.
- Every new user-facing behavior must support the target user.

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- Zustand for simple shared state
- AsyncStorage for safe small local persistence
- Clerk for authentication if auth is in scope
- PostHog for analytics if analytics is in scope
- EAS Build for production builds

If a different tool is needed, explain why and wait for approval before adding dependencies.

## Development Philosophy

- Build one feature at a time.
- Keep diffs small and reviewable.
- Prefer boring, stable, documented implementations.
- Do not perform large rewrites unless the task explicitly asks for one.
- Do not mix refactors with feature work.
- Avoid premature abstractions.
- Add abstractions only when they remove real duplication or match an existing pattern.

## Architecture

Expected structure:

- `app/`: Expo Router route files and route layouts.
- `components/`: reusable UI components.
- `components/ui/`: app-level primitives such as buttons, cards, inputs, and badges.
- `components/forms/`: reusable form components.
- `components/feedback/`: loading, empty, error, success, and offline components.
- `features/`: feature-specific components, hooks, and types when a feature grows beyond one screen.
- `stores/`: Zustand stores.
- `lib/`: service helpers such as analytics, storage, API clients, and auth helpers.
- `constants/`: stable constants and image imports.
- `assets/images/`: static and generated images.
- `types/`: shared TypeScript types.

Architecture rules:

- Screens may compose components and call feature hooks.
- Screens should not contain large business logic.
- Generic components must not import feature-specific stores.
- Stores must not import UI components.
- API clients must not import UI.
- Analytics helpers must avoid sensitive data.

## Folder Rules

- Put route screens under `app/`.
- Put reusable visual primitives under `components/ui/`.
- Put feature-only components near the feature.
- Put shared type definitions in `types/` only when used across features.
- Put local feature types in the feature folder.
- Put centralized image imports in `constants/images.ts`.
- Do not create vague catch-all files such as `helpers.ts` or `misc.ts`.

## UI Rules

Visual direction:
[VISUAL_DIRECTION]

Example component names:
[EXAMPLE_COMPONENT_NAMES]

UI requirements:

- Match the approved visual direction.
- Use consistent spacing, typography, color, border radius, and icon treatment.
- Include loading, empty, error, success, offline, and permission states where relevant.
- Keep touch targets at least 44px.
- Support small phones and large phones.
- Avoid text overlap and clipped buttons.
- Do not add visible instructional text about app mechanics unless the screen genuinely needs it.
- Preserve existing UI unless the task explicitly asks to change it.

## Styling Rules

- Use NativeWind for most styling.
- Keep class strings readable.
- Reuse existing component variants before creating new styles.
- Avoid one-off colors when a token or existing pattern exists.
- Do not introduce a new visual style for one screen.
- Keep card radius at 8px or less unless the existing design system says otherwise.
- Use stable dimensions for repeated cells, icon buttons, counters, boards, and fixed-format UI.

## NativeWind Rules

- Prefer `className` for layout, spacing, color, typography, and common states.
- Use arrays or helper functions only when conditional classes become hard to read.
- Do not hide complex logic inside class string construction.
- If NativeWind cannot express a needed style cleanly, use a small StyleSheet exception and document why.

## Style Exception List

Approved non-NativeWind styling exceptions:

- `[EXCEPTION_1]`
- `[EXCEPTION_2]`

If a new exception is needed, explain why before adding it.

## Image Rules

- Store generated images in `assets/images`.
- Import images through `constants/images.ts`.
- Do not import the same image path directly in multiple screens.
- Use approved assets from the asset inventory.
- Do not generate new images during coding tasks unless asked.
- Do not use competitor screenshots as app assets.
- Ensure images have accessible labels when they convey meaning.

## State Rules

Example state fields:
[EXAMPLE_STATE_FIELDS]

- Use local component state for local UI behavior.
- Use Zustand for shared client state only.
- Keep stores small and domain-specific.
- Keep actions explicit.
- Do not store derived values unless there is a measured reason.
- Do not put navigation actions inside stores.
- Do not store secrets in Zustand.

## AsyncStorage Rules

- Use AsyncStorage only for safe, small local persistence.
- Use namespaced keys such as `@[APP_SLUG]/setting-name`.
- Parse stored data before trusting it.
- Provide defaults for missing or invalid data.
- Do not store passwords, private tokens, payment data, or sensitive personal data.
- Clear user-specific local data on sign out when appropriate.

## Auth Rules

- Use Clerk only according to current official Expo documentation.
- Keep auth route protection explicit.
- Do not manually persist auth tokens unless provider docs require it.
- Do not expose secret keys in client code.
- Keep logged-out, loading-session, logged-in, and session-expired states clear.

## API And Secrets Rules

- Never expose server-only secrets in the mobile client.
- Only use `EXPO_PUBLIC_` for values safe to ship to user devices.
- Validate or narrow external API responses before using them.
- Handle network loading, retry, offline, and error states.
- Do not log secrets, tokens, or sensitive user data.
- If a task requires a server-side secret, stop and explain the needed backend boundary.

## TypeScript Rules

- Use TypeScript for all app code.
- Do not use `any`.
- Prefer explicit props types.
- Type route params.
- Type Zustand state and actions.
- Type AsyncStorage schemas.
- Type analytics events and properties.
- Use `unknown` plus parsing for untrusted external data.

## Navigation Rules

- Use Expo Router conventions.
- Keep route files focused.
- Use route groups intentionally.
- Do not invent new routes without checking the screen map or prompt.
- Keep auth redirects simple and documented.
- Type dynamic route params.

## Form Rules

- Validate required fields.
- Show inline errors near fields.
- Disable submit while submitting when appropriate.
- Prevent duplicate submissions.
- Preserve user input when recoverable errors occur.
- Keep form state local unless shared state is required.

## Loading, Empty, Error Rules

- Loading states should be clear and not shift layout unnecessarily.
- Empty states should explain the first useful action.
- Error states should explain what happened and offer recovery when possible.
- Offline states should say what still works.
- Permission-denied states should explain why permission helps and provide fallback behavior.

## Accessibility Rules

- Provide accessible labels for icon-only buttons.
- Keep touch targets at least 44px.
- Do not rely on color alone.
- Support larger font sizes where practical.
- Use readable contrast.
- Keep focus and screen reader order logical.

## Testing Rules

For every feature:

- Run the app.
- Manually test the new behavior.
- Test related old behavior.
- Run lint.
- Run TypeScript typecheck.
- Add or update tests when the project has a test setup and the behavior is risky.

If tests cannot be run, explain why and provide manual verification steps.

## Feature Implementation Rules

Every implementation prompt must have:

- Anchor.
- Task.
- Constraints.
- Reference.
- Acceptance criteria.

During implementation:

- Change only files required for the task.
- Do not install new dependencies without approval.
- Do not refactor unrelated code.
- Do not change public APIs unless requested.
- Do not add unrequested features.
- Return files changed, what changed, how to test, and risks.

## Refactor Rules

- Refactor only when requested.
- Preserve behavior.
- Preserve visuals.
- Preserve public APIs unless the prompt explicitly allows changes.
- Keep the diff small.
- Run the same checks as a feature.

## Dependency Rules

- Prefer Expo and React Native built-ins.
- Add dependencies only after approval.
- Use actively maintained packages with current docs.
- Confirm iOS, Android, Expo, and EAS compatibility.
- Explain removal risk for new dependencies.

## Forbidden Actions

- Do not rewrite the app from scratch.
- Do not delete user work.
- Do not run destructive Git commands.
- Do not commit secrets.
- Do not add unrelated dependencies.
- Do not silently change architecture.
- Do not silently change visual direction.
- Do not accept or introduce `any`.
- Do not modify generated native folders unless the task explicitly requires it.
- Do not implement future backlog items during current feature work.

## Communication Rules

When responding after code changes, include:

1. Files changed.
2. What changed.
3. How to test.
4. Risks or follow-up tasks.

When blocked:

- Explain the blocker.
- Show the relevant evidence.
- Suggest the smallest next decision.

## Final Reminder

This project is built one feature at a time. Follow this file strictly, keep diffs focused, and preserve the app's product direction, visual direction, and architecture.
```
