# Product Requirements Document Template

Use this as the main product document before implementation. Keep it concise but specific. Update it when product direction changes.

## App Name

`[APP_NAME]`

## One-Line Description

`[APP_NAME] is a [TYPE_OF_APP] for [TARGET_USER] that helps them [CORE_OUTCOME].`

## Problem

- Main pain: `[PAIN]`
- Why it matters: `[IMPACT]`
- Current workaround: `[WORKAROUND]`
- Why existing options fail: `[GAP]`

## Audience

- Primary user: `[TARGET_USER]`
- Secondary user if any: `[SECONDARY_USER]`
- Excluded users for MVP: `[WHO_THIS_IS_NOT_FOR_YET]`

## Jobs To Be Done

When `[SITUATION]`, I want to `[MOTIVATION]`, so I can `[OUTCOME]`.

Jobs:

- `[JOB_1]`
- `[JOB_2]`
- `[JOB_3]`

## Core Features

| Feature | User Value | MVP? | Notes |
| --- | --- | --- | --- |
| `[FEATURE]` | `[VALUE]` | `[YES/NO]` | `[NOTES]` |

## Non-Goals

The MVP will not include:

- `[NON_GOAL_1]`
- `[NON_GOAL_2]`
- `[NON_GOAL_3]`

## User Stories

- As a `[USER]`, I want `[ACTION]` so that `[OUTCOME]`.
- As a `[USER]`, I want `[ACTION]` so that `[OUTCOME]`.
- As a `[USER]`, I want `[ACTION]` so that `[OUTCOME]`.

## Screens

| Screen | Purpose | Primary Action | States Needed |
| --- | --- | --- | --- |
| `[SCREEN]` | `[PURPOSE]` | `[ACTION]` | `[LOADING/EMPTY/ERROR/etc.]` |

## Data Model

| Entity | Fields | Source | Persistence | Notes |
| --- | --- | --- | --- | --- |
| `[ENTITY]` | `[FIELDS]` | `[LOCAL/API/AUTH]` | `[NONE/ASYNCSTORAGE/DB]` | `[NOTES]` |

## Permissions

| Permission | Why Needed | Required For MVP? | Fallback If Denied |
| --- | --- | --- | --- |
| `[PERMISSION]` | `[REASON]` | `[YES/NO]` | `[FALLBACK]` |

## Analytics Events

| Event | Trigger | Properties | Why It Matters |
| --- | --- | --- | --- |
| `[event_name]` | `[WHEN]` | `[PROPS]` | `[QUESTION_ANSWERED]` |

## Risks

- Product risk: `[RISK_AND_VALIDATION_PLAN]`
- Technical risk: `[RISK_AND_MITIGATION]`
- Design risk: `[RISK_AND_MITIGATION]`
- Privacy/security risk: `[RISK_AND_MITIGATION]`

## Success Metrics

- Activation: `[METRIC]`
- Engagement: `[METRIC]`
- Retention: `[METRIC]`
- Quality: `[CRASH_FREE / ERROR_RATE / SUPPORT_TICKETS]`
- Business if relevant: `[CONVERSION / REVENUE / LEADS]`

## MVP Release Criteria

The MVP can ship when:

- `[CORE_FLOW]` works end to end.
- Required screens have loading, empty, error, and permission states.
- Auth works if in scope.
- Analytics events are tracked.
- Privacy and secrets have been reviewed.
- Production build passes.
- Real device testing is complete.

## Open Questions

- `[QUESTION_1]`
- `[QUESTION_2]`
- `[QUESTION_3]`
