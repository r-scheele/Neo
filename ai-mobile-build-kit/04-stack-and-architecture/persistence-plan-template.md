# Persistence Plan Template

Use this before writing AsyncStorage logic or introducing a database.

## Persistence Inventory

| Data | Persist? | Storage | Sensitive? | Clear On Sign-Out? | Notes |
| --- | --- | --- | --- | --- | --- |
| `[DATA]` | `[YES/NO]` | `[ASYNCSTORAGE/BACKEND/SECURE_STORE/NONE]` | `[YES/NO]` | `[YES/NO]` | `[NOTES]` |

## AsyncStorage Use Cases

Good candidates:

- Onboarding completed flag.
- Theme preference.
- Small local drafts.
- Local-only app settings.
- Small offline cache that can be recreated.

Poor candidates:

- Passwords.
- Secret tokens.
- Payment data.
- Large media.
- Complex relational data.
- Data requiring multi-device sync.

## Storage Key Plan

Use namespaced keys:

```text
@[APP_SLUG]/onboarding-completed
@[APP_SLUG]/settings
@[APP_SLUG]/drafts
```

## Migration Plan

If persisted data can change shape:

- Add a version field.
- Parse before using.
- Provide defaults for missing fields.
- Handle corrupt data gracefully.

## Done Looks Like

Persistence is ready when app restart behavior is predictable and no sensitive data is stored unsafely.
