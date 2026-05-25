# Dependency Decision Rules

Use this checklist before installing anything. AI often adds libraries because they are familiar, not because they are necessary.

## Dependency Checklist

- [ ] Does Expo already solve this?
- [ ] Does React Native already solve this?
- [ ] Is the package actively maintained?
- [ ] Does it have current documentation?
- [ ] Will AI likely know the current API if docs are provided?
- [ ] Does it work on iOS and Android?
- [ ] Does it work with Expo and EAS Build?
- [ ] Does it require custom native configuration?
- [ ] Can we remove it later without rewriting the app?
- [ ] Is it worth the complexity?
- [ ] Is there a smaller alternative?
- [ ] Is the feature valuable enough to justify this dependency now?

## Decision Record

| Package | Purpose | Install Now? | Reason | Docs Link | Removal Risk |
| --- | --- | --- | --- | --- | --- |
| `[PACKAGE]` | `[PURPOSE]` | `[YES/NO]` | `[REASON]` | `[URL]` | `[LOW/MED/HIGH]` |

## Prompt Rule

Every coding prompt should say:

```md
Do not install new libraries without asking first. If a library seems necessary, explain why, link current docs, and wait for approval.
```

## Reject A Dependency When

- It duplicates an existing capability.
- It solves a future problem, not today's feature.
- It is unmaintained.
- It complicates native builds.
- It is only needed for a small helper function.
- It increases bundle size for little user value.

## Done Looks Like

A dependency is approved when the product value, implementation cost, maintenance cost, and removal path are all understood.
