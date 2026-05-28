# Stack Decision

Status: Current stack decision. The app scaffold and approved local-MVP packages are installed; service integrations remain pending.

## App Requirements

| Requirement | Decision |
| --- | --- |
| Platforms | iOS and Android |
| App type | Mobile-first operations app |
| Offline needs | Read-only cached state and safe local drafts in V1; no risky offline sending or payment confirmation |
| Auth needs | Required for MVP because the app handles business data, staff access, payment review, and settings |
| Data sync needs | Deferred; first app build uses typed local/mock data, future production pilot needs backend sync |
| Media needs | Images for generated assets and receipt previews; camera/file upload later |
| Notifications | Deferred until core flows work |
| Payments | No in-app payments in V1; manual receipt review UI only |
| Analytics | Required for activation and MVP learning, with strict privacy rules |
| Builds | EAS Build |

## Decisions

| Area | Choice | Why | Alternatives Rejected | Risk |
| --- | --- | --- | --- | --- |
| Framework | Expo | Stable, documented, supports iOS/Android, development builds, and EAS | Bare React Native | Low; custom native needs may appear later |
| UI runtime | React Native | Native mobile UI from one codebase | Web-first wrapper | Low |
| Language | TypeScript | Safer props, route params, stores, persistence, and analytics contracts | JavaScript | Low |
| Routing | Expo Router | File-based stacks, tabs, modals, auth groups, and dynamic routes fit the screen map | React Navigation configured manually | Low |
| Styling | NativeWind | Keeps utility styling close to markup and can map cleanly to the style guide | Large StyleSheet-only system, UI kit | Medium; exact visual matching still requires discipline |
| State | Zustand | Small, direct shared state for setup, queues, drafts, and preferences | Redux, Context for everything | Low |
| Persistence | AsyncStorage | Simple local persistence for safe small data | SQLite, database-first architecture | Medium; not suitable for sensitive or relational production data |
| Auth | Clerk | Managed auth is appropriate for business accounts and staff access | Custom auth | Medium; provider setup must follow current docs later |
| Analytics | PostHog | Product analytics for activation and funnel learning | No analytics, ad-hoc logs | Low if privacy rules are followed |
| Builds | EAS Build | Standard Expo production build pipeline | Local-only builds | Low |
| Backend | Deferred | First UI/app build does not need live integrations | Selecting backend now | Medium; real pilot will need a server decision |
| Database | Deferred | MVP app shell can start without one | Adding database now | Medium; must revisit before real sync |
| Icons | Use existing image assets first; approve SVG runtime later | Avoids adding libraries during early screen work | Installing icon/SVG libraries immediately | Low for planning, medium for production icon quality |

## Dependency Policy

Approved default stack for later setup:

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- Zustand
- AsyncStorage
- Clerk
- PostHog
- EAS Build

Do not add any library outside this list without a written dependency decision that explains product value, maintenance cost, Expo/EAS support, security impact, and removal risk. Service packages should be installed only in the integration pass that needs them.

## Current Installed Stack

- Expo / React Native / TypeScript.
- Expo Router.
- NativeWind v5 preview with Tailwind CSS v4 and `react-native-css`.
- Zustand.
- AsyncStorage.
- PostHog React Native.

Clerk is still selected but not installed or configured. EAS Build is planned but not configured in this cleanup pass.

## NativeWind And Tailwind Config Decision

The current app uses NativeWind v5 preview and Tailwind CSS v4's CSS-first configuration model.

Required current config:

- `metro.config.js` with `withNativewind`.
- `postcss.config.mjs` with `@tailwindcss/postcss`.
- `src/global.css` with Tailwind imports, `nativewind/theme`, and Neo tokens.
- Root CSS import in `app/_layout.tsx`.

Intentionally absent config:

- `babel.config.js`: NativeWind v5 does not require app-level Babel config for this setup.
- `tailwind.config.js`: Tailwind v4 supports CSS-first `@theme`; a JavaScript config is optional only for advanced customizations.
- `nativewind.config.js`: Not used by the current NativeWind setup.

Do not add these files unless a future customization, package upgrade, or official NativeWind guidance requires them. NativeWind v5 is still a preview dependency, so revalidate this choice before production release.

## V1 Stack Boundary

V1 should prove that Neo can be built screen by screen with:

- Typed routes.
- Centralized design tokens.
- Generated assets wired through constants.
- Local/mock data for screen implementation.
- Clerk-ready auth route structure.
- PostHog-ready analytics boundaries.
- AsyncStorage only for safe local data.

## Future Stack Boundary

Future architecture may add:

- Backend API.
- Database.
- Webhook handling.
- Server-side AI orchestration.
- Server-side receipt extraction.
- Payment provider integrations.
- Push notifications.
- Admin console.

These are not selected yet because the MVP should first stabilize the app shell, navigation, design system, and core mobile workflows.
