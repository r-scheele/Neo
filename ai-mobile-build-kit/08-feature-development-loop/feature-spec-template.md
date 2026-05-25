# Feature Spec Template

Write this before prompting AI to implement a feature.

## Feature Name

`[FEATURE_NAME]`

## Summary

`[ONE_OR_TWO_SENTENCES_DESCRIBING_THE_FEATURE]`

## User Value

- Target user: `[USER]`
- Problem solved: `[PROBLEM]`
- Desired outcome: `[OUTCOME]`

## Scope

In scope:

- `[SCOPE_ITEM_1]`
- `[SCOPE_ITEM_2]`
- `[SCOPE_ITEM_3]`

Out of scope:

- `[OUT_OF_SCOPE_1]`
- `[OUT_OF_SCOPE_2]`
- `[OUT_OF_SCOPE_3]`

## Screens And Routes

| Screen | Route | Change Needed |
| --- | --- | --- |
| `[SCREEN]` | `[ROUTE]` | `[CHANGE]` |

## Data

- Data needed: `[DATA]`
- Source: `[LOCAL_STATE / ZUSTAND / ASYNCSTORAGE / API / AUTH]`
- Persistence: `[NONE / ASYNCSTORAGE / BACKEND]`
- New types needed: `[TYPES]`

## States

- Loading: `[PLAN]`
- Empty: `[PLAN]`
- Error: `[PLAN]`
- Success: `[PLAN]`
- Offline: `[PLAN]`
- Permission denied: `[PLAN]`
- Long content: `[PLAN]`

## Analytics

- Events: `[EVENTS_OR_NONE]`
- Properties: `[PROPERTIES]`
- Sensitive data excluded: `[YES/NO]`

## Constraints

- `[CONSTRAINT_1]`
- `[CONSTRAINT_2]`
- `[CONSTRAINT_3]`

## Acceptance Criteria

- `[CRITERIA_1]`
- `[CRITERIA_2]`
- `[CRITERIA_3]`
- TypeScript passes.
- Lint passes.
- Manual testing completed.

## Done Looks Like

This spec is ready when it can be pasted into a single feature prompt without the coding agent inventing product requirements.
