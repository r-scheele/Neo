# Architecture Plan Template

Use this before implementation so AI knows where code belongs.

## Architecture Summary

`[APP_NAME]` uses `[STACK]` with route-driven screens, small reusable components, feature-specific state, and minimal persistence.

## Folder Plan

| Folder | Purpose | Rules |
| --- | --- | --- |
| `app/` | Expo Router routes | Screens and route layouts only |
| `components/` | Reusable UI | Small presentational components |
| `features/` | Feature-specific logic | Use if feature grows beyond one screen |
| `stores/` | Zustand stores | Shared client state only |
| `lib/` | App services/helpers | API clients, analytics, auth helpers |
| `constants/` | Stable constants | Images, colors, config keys |
| `assets/images/` | Image assets | Generated and static images |
| `types/` | Shared types | Cross-feature TypeScript types |

## Data Flow

- Local UI state: `[WHERE]`
- Shared state: `[ZUSTAND_STORES]`
- Persisted local data: `[ASYNCSTORAGE_KEYS]`
- Remote data: `[API_OR_BACKEND_IF_ANY]`
- Auth state: `[CLERK_OR_OTHER]`

## Screen Ownership

| Screen | Route | Owns | Uses |
| --- | --- | --- | --- |
| `[SCREEN]` | `[ROUTE]` | `[STATE/ACTIONS]` | `[COMPONENTS/STORES]` |

## Shared Components

Only create shared components when:

- Used in at least two places now.
- Clearly part of the design system.
- Easier to test and maintain than duplicate code.

## Boundaries

- Screens should not contain large business logic.
- Components should not fetch data unless explicitly designed as containers.
- Stores should not import screens.
- API clients should not import UI.
- Analytics helpers should avoid sensitive data.

## Done Looks Like

Architecture is ready when each feature prompt can name exactly where new code should go.
