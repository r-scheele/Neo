# Default Expo Stack

This is the recommended starting stack for most AI-assisted mobile app builds.

## Why Expo

Expo is the default because it provides a stable, documented path for:

- iOS and Android development from one codebase.
- Fast local iteration.
- Device testing through Expo Go or development builds.
- Native APIs through Expo modules.
- OTA updates when appropriate.
- EAS Build for production.
- Strong documentation that AI tools can follow when provided current references.

Expo is usually the safest choice until the app has a clear need for custom native code.

## Why TypeScript Is Required

TypeScript protects AI-generated code by making assumptions visible.

Require TypeScript for:

- Props.
- State.
- API responses.
- Storage schemas.
- Navigation params.
- Form values.
- Analytics event properties.

Avoid `any`. Use explicit types or `unknown` plus parsing for external data.

## Why Expo Router

Expo Router is a file-based routing system that fits mobile app workflows well.

Use it for:

- Tabs.
- Stacks.
- Modals.
- Dynamic routes.
- Auth route grouping.

Keep navigation decisions in the screen map and `AGENTS.md` so AI does not invent route structure during feature work.

## Why NativeWind

NativeWind is useful because it:

- Keeps styling close to markup.
- Uses familiar utility classes.
- Reduces ad hoc StyleSheet sprawl.
- Is easy for AI to use with clear class constraints.

Rules:

- Keep class names readable.
- Do not encode complex design systems in one-off class strings.
- Extract repeated variants into components.
- Use style exceptions only when NativeWind cannot express the requirement cleanly.

## Why Zustand

Zustand is preferred for simple shared app state because it is small and direct.

Use Zustand for:

- Auth-adjacent app state not owned by Clerk.
- User preferences.
- Shared feature state.
- Small client-side collections.

Do not use Zustand for:

- Local form fields that belong in one component.
- Server cache if a data-fetching library is later introduced.
- Everything by default.

## Why AsyncStorage

AsyncStorage is useful for small local persistence:

- Onboarding completion.
- User preferences.
- Drafts.
- Small local-only feature data.

Do not store:

- Secrets.
- Tokens unless the auth provider explicitly supports the pattern.
- Large media.
- Complex relational data that needs sync.

## Why Clerk

Clerk is a practical default for auth because it provides managed authentication flows and Expo support. Use current Clerk Expo docs when implementing.

## Why PostHog

PostHog is a practical default for product analytics because it supports event tracking, funnels, and feature analysis. Keep event names intentional and avoid tracking sensitive data.

## Why EAS Build

EAS Build is the production path for Expo apps. Test EAS builds before store submission, not the night before launch.

## Done Looks Like

The default stack is working when the app can run locally, navigate, style screens, manage small shared state, persist safe local values, authenticate if required, track approved events, and build with EAS.
