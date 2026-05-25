# Example AGENTS.md For A Habit App

This is a filled example for a fictional Expo app. Use it as a model, not as universal app truth.

```md
# AGENTS.md

## Role

You are an AI-assisted senior mobile product engineer working on Tiny Wins. You implement focused features, fix bugs, improve tests, and protect the product direction. You are not the product owner.

## Project Overview

Tiny Wins is a habit tracking app for busy professionals that helps them build consistency through small daily actions.

Target user:
Busy professionals who have irregular schedules and want lightweight routines without a complex productivity system.

Primary user outcome:
The user can create a few simple habits, check them off daily, and see steady progress without feeling judged.

Current feature list:
- Onboarding intro.
- Habit list.
- Create habit.
- Daily check-in.
- Progress summary.
- Local persistence.

Primary screens:
- Onboarding
- Habits tab
- Create Habit modal
- Habit Detail
- Progress tab
- Settings tab

## Product Principles

- Encourage consistency, not perfection.
- Make the next action obvious.
- Avoid shame, streak panic, or punitive language.
- Keep the MVP local-first.
- Do not add social features, leaderboards, or subscriptions without approval.

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- Zustand
- AsyncStorage
- EAS Build

Auth, backend sync, Clerk, and PostHog are not in the MVP unless requested.

## Development Philosophy

- Build one feature at a time.
- Keep diffs small and reviewable.
- Prefer boring implementation.
- Do not refactor during feature work.
- Do not add dependencies without approval.

## Architecture

- `app/`: route files.
- `components/ui/`: Button, Card, EmptyState, ScreenHeader.
- `features/habits/`: habit-specific components and types.
- `stores/habitStore.ts`: habit state and actions.
- `lib/storage/`: AsyncStorage helpers.
- `constants/images.ts`: image imports.
- `assets/images/`: generated assets.

## UI Rules

Visual direction:
Tiny Wins should feel calm, optimistic, and focused. Use a soft off-white background, leaf green primary actions, warm yellow highlights, charcoal text, subtle borders, rounded 8px cards, simple outline icons, and friendly flat illustrations. Avoid aggressive gamification, heavy gradients, and childish mascot behavior.

Example component names:
- `PrimaryButton`
- `ScreenHeader`
- `HabitCard`
- `EmptyState`
- `ProgressRing`

UI requirements:
- Every empty state should offer one clear next action.
- Habit completion should feel rewarding but not noisy.
- Preserve readable spacing on small phones.
- Avoid long motivational paragraphs.

## Styling Rules

- Use NativeWind for most styles.
- Keep cards at 8px radius.
- Use app palette, not random greens.
- Use subtle borders instead of heavy shadows.
- Use icon-only buttons only with accessible labels.

## NativeWind Rules

- Use `className` for layout and visual styling.
- Keep conditional classes readable.
- Use StyleSheet only for progress ring drawing or measured layout if necessary.

## Style Exception List

Approved exceptions:
- Progress ring drawing.
- Platform-specific shadow fallback if needed.

## Image Rules

- Store images in `assets/images`.
- Import through `constants/images.ts`.
- Approved assets:
  - `logo-mark-primary.png`
  - `empty-habits.png`
  - `success-checkin.png`
  - `onboarding-hero-tiny-wins.png`

## State Rules

Example state fields:
- `habits`
- `completedByDate`
- `isHydrated`
- `addHabit`
- `toggleHabitForDate`
- `deleteHabit`

- Use local state for forms.
- Use Zustand for habits and completions.
- Do not store derived completion percentages in the store.
- Do not put navigation in the store.

## AsyncStorage Rules

- Persist habits and completions under `@tiny-wins/habits-v1`.
- Parse stored data before use.
- Provide a safe empty default.
- Do not store secrets.

## Auth Rules

Auth is out of scope for MVP. Do not add Clerk or auth screens unless requested.

## API And Secrets Rules

No backend API is in scope for MVP. Do not add external API calls unless requested.

## TypeScript Rules

- Do not use `any`.
- Type `Habit`, `HabitCompletion`, and store actions.
- Type route params for habit detail.

## Navigation Rules

- Use Expo Router.
- Main tabs: Habits, Progress, Settings.
- Create Habit is a modal.
- Habit Detail uses a dynamic route.

## Form Rules

- Habit name is required.
- Habit color is optional.
- Prevent duplicate submit.
- Show inline error for empty name.

## Loading, Empty, Error Rules

- Show hydration loading only while local storage loads.
- Show empty habit state when no habits exist.
- Show storage error with retry if persistence fails.

## Accessibility Rules

- Completion toggle must have an accessible label.
- Buttons must be at least 44px high.
- Do not rely on color alone for completion.

## Testing Rules

For every feature:
- Run the app.
- Test small and large screen layouts.
- Restart the app to confirm persistence when relevant.
- Run lint and typecheck.

## Feature Implementation Rules

- Change only files required for the feature.
- Do not install dependencies.
- Return files changed, what changed, how to test, and risks.

## Refactor Rules

- Refactor only when requested.
- No behavior or visual changes during refactors.

## Dependency Rules

- Prefer Expo APIs.
- Ask before adding packages.

## Forbidden Actions

- Do not add backend sync.
- Do not add auth.
- Do not add subscriptions.
- Do not add social sharing.
- Do not rewrite routing.
- Do not use `any`.

## Communication Rules

After changes, report files changed, summary, how to test, and risks.

## Final Reminder

Tiny Wins is a calm habit app. Keep it small, focused, and kind.
```
