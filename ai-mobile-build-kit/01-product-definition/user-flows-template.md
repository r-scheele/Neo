# User Flows Template

Use this to map what users actually do before designing screens.

## Flow Inventory

| Flow | User Goal | Entry Point | Exit Point | MVP? |
| --- | --- | --- | --- | --- |
| `[FLOW_NAME]` | `[GOAL]` | `[START]` | `[END]` | `[YES/NO]` |

## Flow: `[FLOW_NAME]`

### User Goal

`[USER] wants to [ACTION] so they can [OUTCOME].`

### Happy Path

1. `[STEP_1]`
2. `[STEP_2]`
3. `[STEP_3]`
4. `[SUCCESS_END_STATE]`

### Alternate Paths

- If `[CONDITION]`, then `[FALLBACK]`.
- If `[CONDITION]`, then `[FALLBACK]`.

### Failure States

- Loading takes too long.
- User is offline.
- Required permission is denied.
- API request fails.
- User has no data yet.
- User enters invalid input.

### Screens Involved

- `[SCREEN_1]`
- `[SCREEN_2]`
- `[SCREEN_3]`

### Analytics Events

- `[event_started]`
- `[event_completed]`
- `[event_failed]`

## Done Looks Like

A flow is ready for implementation when every step maps to a screen, state, or action.
