# Acceptance Criteria Template

Acceptance criteria define what done means. Write them before implementation.

## Criteria Format

Use concrete, testable statements:

- Given `[STATE]`, when `[ACTION]`, then `[RESULT]`.
- The screen shows `[CONTENT]` when `[CONDITION]`.
- The app prevents `[BAD_BEHAVIOR]`.
- The user can recover from `[ERROR]` by `[ACTION]`.

## Template

### Functional

- [ ] `[USER_CAN_DO_ACTION]`
- [ ] `[DATA_UPDATES_CORRECTLY]`
- [ ] `[NAVIGATION_BEHAVES_CORRECTLY]`

### States

- [ ] Loading state appears when `[CONDITION]`.
- [ ] Empty state appears when `[CONDITION]`.
- [ ] Error state appears when `[CONDITION]`.
- [ ] Success state appears when `[CONDITION]`.
- [ ] Offline state appears when `[CONDITION]`.

### UI

- [ ] Screen matches approved visual direction.
- [ ] Text does not overlap or clip.
- [ ] Layout works on small and large screens.
- [ ] Touch targets are at least 44px.

### Data And Security

- [ ] No secrets are exposed.
- [ ] Invalid data is handled.
- [ ] Persisted data survives restart if required.
- [ ] User-specific data clears on sign out if required.

### Quality

- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Related old features still work.

## Bad Acceptance Criteria

- "Looks good."
- "Works properly."
- "Make it polished."
- "Should be intuitive."

## Done Looks Like

Criteria are ready when a tester can check each item without reading the implementer's mind.
