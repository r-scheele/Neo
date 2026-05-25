# Testing Strategy

Testing should scale with risk. The goal is to prove the app works for real users, not to collect ceremonial checks.

## Layers

### Manual Testing

Use for:

- New feature flows.
- Visual behavior.
- Navigation.
- Keyboard handling.
- Device-specific issues.

### Automated Tests

Use for:

- State stores.
- Utility functions.
- Validation logic.
- Data parsing.
- Bug regressions.

### Device Testing

Use for:

- Safe areas.
- Touch targets.
- Performance.
- Permissions.
- Offline behavior.
- App restart behavior.

### Production Build Testing

Use for:

- EAS Build issues.
- Missing environment values.
- Native permission config.
- Asset bundling.
- Release-only crashes.

## Minimum Per Feature

- Review diff.
- Run app.
- Test new feature.
- Test related old features.
- Run lint.
- Run typecheck.

## Before Release

- Test on at least one real device.
- Test production or preview build.
- Test logged in and logged out states.
- Test no internet and slow internet.
- Test empty data.
- Test long text.
- Test denied permissions.
- Check console logs.
- Check analytics events.

## Done Looks Like

Testing is credible when it includes real device behavior and evidence for the release-critical flows.
