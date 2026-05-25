# Data Model Thinking Template

Use this before creating state stores, storage schemas, APIs, or database tables.

## Data Entities

| Entity | Description | Fields | Created By | Used On Screens |
| --- | --- | --- | --- | --- |
| `[ENTITY]` | `[DESCRIPTION]` | `[FIELDS]` | `[USER/API/SYSTEM]` | `[SCREENS]` |

## Field Detail

### `[ENTITY_NAME]`

| Field | Type | Required | Example | Notes |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | `habit_123` | Stable identifier |
| `[field]` | `[type]` | `[yes/no]` | `[example]` | `[notes]` |

## Persistence Decision

| Data | Local State | AsyncStorage | Backend | Reason |
| --- | --- | --- | --- | --- |
| `[DATA]` | `[YES/NO]` | `[YES/NO]` | `[YES/NO]` | `[REASON]` |

## Permissions

| Permission | Data Accessed | User Benefit | Fallback |
| --- | --- | --- | --- |
| `[PERMISSION]` | `[DATA]` | `[BENEFIT]` | `[FALLBACK]` |

## Edge Cases

- Missing entity.
- Deleted entity referenced by another screen.
- Duplicate entity.
- Invalid external response.
- App restarts during a write.
- User signs out.
- Storage migration needed.

## Data Rules

- Keep IDs stable.
- Do not store secrets in AsyncStorage.
- Keep persisted data minimal.
- Version persisted schemas if data shape may change.
- Parse external API data before trusting it.

## Done Looks Like

The data model is ready when state, persistence, and API prompts can reference the same entity names and fields.
