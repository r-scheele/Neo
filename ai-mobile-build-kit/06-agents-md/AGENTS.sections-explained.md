# AGENTS.md Sections Explained

Use this when customizing the template. Each section exists to prevent a common AI failure.

## Role

Tells AI how to behave. It reinforces that AI implements and advises, but the human owns product decisions.

## Project Overview

Prevents AI from building generic screens. It should know the app, user, outcome, feature list, and screens.

## Product Principles

Keeps feature decisions aligned with product values. This is where you say what the app should never become.

## Tech Stack

Prevents AI from choosing new libraries or patterns. Stable stack decisions belong here.

## Development Philosophy

Protects against huge diffs, clever rewrites, and premature abstractions.

## Architecture

Explains where code belongs. This prevents duplicated folders, circular imports, and screen files that own everything.

## Folder Rules

Turns architecture into practical file placement rules.

## UI Rules

Keeps screens consistent with the visual direction and product tone.

## Styling Rules

Prevents one-off styling and theme drift.

## NativeWind Rules

Clarifies when to use utility classes and when a small exception is acceptable.

## Style Exception List

Prevents every unusual style from becoming a precedent. Exceptions must be explicit.

## Image Rules

Keeps assets centralized and consistent. Prevents random image generation during coding.

## State Rules

Prevents every value from becoming global state. Defines when Zustand is appropriate.

## AsyncStorage Rules

Prevents unsafe persistence, broken app restart behavior, and secret leakage.

## Auth Rules

Keeps route protection, session handling, and provider usage clear.

## API And Secrets Rules

Protects secrets and defines backend boundaries.

## TypeScript Rules

Prevents weak typing and `any` from spreading through the app.

## Navigation Rules

Keeps Expo Router structure stable and prevents unplanned routes.

## Form Rules

Ensures forms handle validation, loading, duplicate submission, and errors.

## Loading, Empty, Error Rules

Forces non-happy-path UI into every relevant feature.

## Accessibility Rules

Keeps mobile UI usable for more users and avoids common failures with icon buttons and touch targets.

## Testing Rules

Defines the verification bar for every feature.

## Feature Implementation Rules

Defines how AI should work: focused diffs, no extra dependencies, no unrelated refactors, clear handoff.

## Refactor Rules

Keeps refactors from changing behavior or visuals by accident.

## Dependency Rules

Prevents package sprawl and native build surprises.

## Forbidden Actions

Makes hard boundaries explicit. This is one of the most important sections.

## Communication Rules

Ensures every AI response gives the human what they need to review and test.

## Final Reminder

Repeats the core operating principle in plain language.
