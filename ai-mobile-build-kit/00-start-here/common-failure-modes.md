# Common Failure Modes

Use this file as a pre-flight warning system. If the project starts drifting, return here and tighten the workflow.

## Asking For The Whole App

Bad prompt:

```md
Build me a habit tracking app with auth, analytics, payments, onboarding, and reminders.
```

Why it fails:

- Diff is too large to review.
- AI invents architecture.
- Screens become inconsistent.
- Edge cases are skipped.
- Bugs hide across many files.

Better:

```md
Implement the empty-state version of the Habits screen only. Use the existing tab route and design reference. Do not add persistence yet.
```

## Adding Too Many Dependencies

Symptoms:

- Every feature adds a new package.
- Native build issues appear.
- AI knows old APIs but the installed package is different.
- App becomes harder to upgrade.

Prevention:

- Use `04-stack-and-architecture/dependency-decision-rules.md`.
- Ask whether Expo already solves the problem.
- Require current docs before adding a package.

## Allowing AI To Refactor Working Code

Symptoms:

- A small feature changes many unrelated files.
- Existing UI shifts.
- Tests fail in unrelated areas.
- The app feels less predictable after each prompt.

Prevention:

- Include "Do not refactor existing code" in feature prompts.
- Use the refactor prompt only when refactor is the task.
- Reject diffs that mix feature work and cleanup.

## Skipping Visual Direction

Symptoms:

- Each screen has different spacing, colors, shadows, or illustration style.
- Assets feel unrelated.
- AI uses generic UI patterns.
- App feels like a prototype instead of a product.

Prevention:

- Complete `02-design-research/visual-direction-template.md`.
- Generate a style anchor first.
- Add visual direction to `AGENTS.md`.

## Starting With Backend Too Early

Symptoms:

- Backend design blocks learning.
- Product scope expands.
- Data models harden before flows are validated.
- Time goes into infrastructure instead of user value.

Prevention:

- Start with mock data or local state when possible.
- Use AsyncStorage for small local persistence.
- Add Supabase, Postgres, or a custom backend only when sharing, sync, admin, or multi-device access is required.

## Not Testing On Device

Symptoms:

- Keyboard covers inputs.
- Safe areas break.
- Touch targets feel small.
- Offline behavior fails.
- Performance differs from simulator.

Prevention:

- Test on at least one real iOS or Android device before release.
- Use `09-testing-polish-shipping/real-device-testing-checklist.md`.

## Not Checking Production Build

Symptoms:

- Works in Expo Go but fails in EAS.
- Environment variables are missing.
- Native permissions are wrong.
- Assets are missing or oversized.

Prevention:

- Run production build checks before store submission.
- Use EAS Build early enough to catch native issues.

## Repeating Context Instead Of Updating AGENTS.md

Symptoms:

- Prompts become long and inconsistent.
- AI forgets conventions.
- Decisions are scattered across chats.

Prevention:

- Put stable decisions in `AGENTS.md`.
- Keep prompts focused on the current task.

## Huge Components

Symptoms:

- Screen files contain state, forms, data mapping, and UI atoms.
- Components are hard to test.
- Small visual changes risk behavior regressions.

Prevention:

- Extract repeated UI into components.
- Keep business logic out of presentational components.
- Create feature-specific components before global components.

## Accepting Code With `any`

Symptoms:

- Runtime errors appear later.
- API responses are unclear.
- Refactors are unsafe.

Prevention:

- Require TypeScript types in prompts.
- Reject `any` unless it is a documented temporary boundary.
- Prefer `unknown` plus parsing when external data is unclear.

## Emergency Reset

If several failure modes appear at once:

1. Stop feature work.
2. Review the latest diff.
3. Revert only with explicit human approval.
4. Write a narrow bug-fix or cleanup prompt.
5. Re-run the app and tests.
6. Update `AGENTS.md` with any missing stable rule.
