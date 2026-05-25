# Analytics Plan Template

Use this before integrating PostHog or any analytics tool.

## Analytics Goal

Analytics should answer product questions, not collect data by habit.

Primary questions:

- Are users activating?
- Which features are used?
- Where do users drop off?
- Are errors blocking core flows?
- Do users return?

## Event Naming Rules

- Use lowercase snake_case.
- Name events as past-tense actions where possible.
- Keep names stable.
- Do not include personal data in event names or properties.

Examples:

- `onboarding_completed`
- `habit_created`
- `habit_checked_in`
- `paywall_viewed`
- `network_error_seen`

## Event Plan

| Event | Trigger | Properties | Sensitive? | Product Question |
| --- | --- | --- | --- | --- |
| `[event_name]` | `[WHEN]` | `[PROPERTIES]` | `[YES/NO]` | `[QUESTION]` |

## Privacy Rules

- Do not track passwords, tokens, private messages, health details, or sensitive free text.
- Avoid sending exact user-entered content.
- Prefer counts, categories, and booleans.
- Document analytics in the privacy policy.
- Respect opt-out requirements if applicable.

## Implementation Rules

- Centralize analytics helper functions.
- Type event names and properties.
- Keep analytics calls close to user actions.
- Do not let analytics failures break app flows.

## Done Looks Like

Analytics is ready when every tracked event has a product reason and sensitive data is excluded.
