# Example 01: Simple Habit App

## App Idea

Tiny Wins is a habit tracking app for busy professionals who want small daily routines without complex productivity systems.

## Target User

- Busy professional.
- Opens the app quickly during the day.
- Wants encouragement, not shame.
- Does not want social pressure or complicated analytics.

## Visual Direction

- Mood: calm, optimistic, focused.
- Palette: off-white background, leaf green primary, warm yellow accent, charcoal text.
- Typography: system font, friendly weights, readable body.
- Cards: 8px radius, subtle border, minimal shadow.
- Illustration: flat friendly illustrations with simple shapes.
- Motion: small success feedback, no heavy celebration.

## Core Screens

- Onboarding intro.
- Habits tab.
- Create Habit modal.
- Habit Detail.
- Progress tab.
- Settings tab.

## Asset List

| Asset | Purpose | Prompt |
| --- | --- | --- |
| `logo-mark-primary.png` | App icon and header mark | Logo prompt |
| `onboarding-hero-tiny-wins.png` | Welcome screen | Onboarding hero prompt |
| `empty-habits.png` | No habits yet | Empty state prompt |
| `success-checkin.png` | Habit completed | Success state prompt |
| `error-storage.png` | Storage failure | Error state prompt |

## Stack Decisions

- Expo and Expo Router for standard mobile app structure.
- NativeWind for consistent styling.
- Zustand for habit and completion state.
- AsyncStorage for local MVP persistence.
- No auth for MVP.
- No backend until sync is validated as necessary.
- No analytics until first internal test build.

## Example AGENTS.md Values

- `[APP_NAME]`: Tiny Wins
- `[ONE_LINE_DESCRIPTION]`: Tiny Wins is a habit tracking app for busy professionals that helps them build consistency through small daily actions.
- `[TARGET_USER]`: Busy professionals with irregular schedules.
- `[FEATURE_LIST]`: onboarding, habit list, create habit, daily check-in, progress summary, settings.
- `[PRIMARY_SCREENS]`: Onboarding, Habits, Create Habit, Habit Detail, Progress, Settings.
- `[VISUAL_DIRECTION]`: Calm, optimistic, focused; off-white, leaf green, warm yellow, charcoal; subtle bordered cards; flat friendly illustrations.

## First Five Feature Prompts

### Prompt 1: Onboarding Screen

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the onboarding intro screen for Tiny Wins.

Constraints:
- Do not add auth.
- Do not add persistence yet.
- Do not change tab navigation.
- Use approved onboarding image only.
- Do not install libraries.

Reference:
- Visual direction from AGENTS.md.
- Asset: assets/images/onboarding-hero-tiny-wins.png.
- Screen route: app/onboarding.tsx.

Acceptance criteria:
- Screen explains the app in concise, encouraging copy.
- Primary action continues to the habits tab or placeholder next route.
- Layout works on small phones.
- TypeScript and lint pass.
```

### Prompt 2: Habit Store

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create the Zustand habit store for local habit state.

Constraints:
- Do not add AsyncStorage yet.
- Do not add UI.
- Do not use `any`.
- Do not install libraries.

Reference:
- Data entity: Habit { id, name, color, createdAt }.
- Store fields: habits, addHabit, deleteHabit.

Acceptance criteria:
- Store is typed.
- Actions are explicit.
- No derived state is stored.
- TypeScript and lint pass.
```

### Prompt 3: Habits Empty State

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the empty-state Habits screen.

Constraints:
- Do not implement create habit yet.
- Do not add persistence.
- Preserve visual direction.
- Use approved empty state asset.

Reference:
- assets/images/empty-habits.png.
- Route: app/(tabs)/habits.tsx.

Acceptance criteria:
- Empty state appears when no habits exist.
- Primary action opens or links to Create Habit placeholder.
- Text is encouraging and concise.
- TypeScript and lint pass.
```

### Prompt 4: Create Habit Modal

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the Create Habit modal with local validation.

Constraints:
- Keep form state local.
- Do not add persistence yet.
- Do not add extra fields beyond name and optional color.
- Do not install libraries.

Reference:
- Route: app/modals/create-habit.tsx.
- Store action: addHabit.

Acceptance criteria:
- Empty name shows inline error.
- Valid submit creates a habit and closes modal.
- Duplicate submit is prevented.
- Keyboard layout works.
- TypeScript and lint pass.
```

### Prompt 5: AsyncStorage Persistence

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Add AsyncStorage persistence for habits.

Constraints:
- Persist only habits.
- Use key @tiny-wins/habits-v1.
- Parse stored data before using it.
- Do not store secrets.
- Do not redesign UI.

Reference:
- Store: stores/habitStore.ts.
- AsyncStorage docs: [PASTE_CURRENT_DOCS].

Acceptance criteria:
- Habits survive app restart.
- Missing or corrupt storage uses safe default.
- Hydration loading is handled.
- TypeScript and lint pass.
```

## Testing Plan

- Create a habit.
- Restart app and confirm habit persists.
- Delete a habit.
- Test empty state after all habits are removed.
- Test long habit names.
- Test small screen keyboard behavior.
- Run lint and typecheck.
