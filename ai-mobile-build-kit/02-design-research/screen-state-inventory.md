# Screen State Inventory

Every production screen needs more than a happy path. Use this inventory before implementation.

## State Checklist

For each screen, define the states below.

| Screen | Loading | Empty | Error | Success | Offline | Permission Denied | Long Content | First-Time | Returning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `[SCREEN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` | `[PLAN]` |

## Loading State

Define:

- What is loading?
- Can the user cancel?
- Is skeleton UI needed or is a spinner enough?
- What happens if loading takes more than 5 seconds?

## Empty State

Define:

- Why is it empty?
- What action should the user take?
- Is an illustration needed?
- What copy reassures the user?

## Error State

Define:

- What failed?
- Can the user retry?
- Is the error user-fixable?
- Should the app log analytics?

## Success State

Define:

- Does success need confirmation?
- Should the user stay, navigate, or continue?
- Is a toast, inline message, or full screen state best?

## Offline State

Define:

- Can the user still view cached data?
- Can they queue actions?
- What copy explains the limitation?

## Permission Denied

Define:

- Why is the permission useful?
- What works without it?
- Does the user need a settings link?

## Long Content

Define:

- Does content wrap or truncate?
- Are list items stable height?
- Does layout survive large font sizes?

## First-Time User

Define:

- What does the user see before any data exists?
- What is the first meaningful action?
- Is onboarding needed?

## Returning User

Define:

- What is the default view after data exists?
- What information should be prioritized?
- What stale data handling is needed?

## Done Looks Like

A screen is ready to build when the prompt can specify all states that matter for that screen.
