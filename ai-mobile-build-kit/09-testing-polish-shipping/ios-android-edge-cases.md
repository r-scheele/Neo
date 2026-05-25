# iOS And Android Edge Cases

Use this when testing both platforms.

## Layout

- iOS safe areas differ across devices.
- Android status and navigation bars vary.
- Font rendering differs.
- Keyboard behavior differs.
- Back behavior differs.

## Navigation

- Android hardware/software back button should behave predictably.
- iOS swipe-back should not bypass required steps.
- Modals may feel different by platform.

## Permissions

- Permission wording and settings links differ.
- Denied permission recovery differs.
- Some permissions are platform-specific.

## Inputs

- Keyboard types may differ.
- Autofill behavior may differ.
- Date/time pickers differ.
- Text selection handles differ.

## Assets

- App icons have platform-specific requirements.
- Splash screens may crop differently.
- Large images can affect Android performance.

## Production Builds

- Expo Go behavior can differ from development builds.
- Development builds can differ from production builds.
- Native config changes require new builds.

## Done Looks Like

Cross-platform support is acceptable when the app's core flows are tested on both iOS and Android or the release clearly targets only one platform.
