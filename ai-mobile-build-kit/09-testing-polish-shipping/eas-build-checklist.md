# EAS Build Checklist

Use this when preparing Expo production or preview builds.

## Before Build

- [ ] Expo account is configured.
- [ ] `eas.json` exists if using EAS.
- [ ] Bundle identifier/package name is set.
- [ ] App version and build number are set.
- [ ] Environment variables are configured.
- [ ] Native permissions are configured.
- [ ] App icon and splash are configured.

## Build Profiles

Define profiles intentionally:

- Development: for local native debugging.
- Preview: for internal testing.
- Production: for store submission.

## Build Command Notes

Document exact commands in the project:

```text
eas build --profile preview --platform ios
eas build --profile preview --platform android
eas build --profile production --platform all
```

## After Build

- [ ] Install build on device.
- [ ] Test app launch.
- [ ] Test core flows.
- [ ] Test auth if relevant.
- [ ] Test analytics if relevant.
- [ ] Record build ID.

## Done Looks Like

EAS is ready when preview and production profiles are understood and at least one installable build has been tested.
