# Stack Decision Template

Use this whenever choosing or changing the app stack. Start with the default stack unless a specific product or platform requirement says otherwise.

## Default Stack

- Framework: Expo
- UI runtime: React Native
- Language: TypeScript
- Routing: Expo Router
- Styling: NativeWind
- Global state: Zustand
- Local persistence: AsyncStorage
- Auth: Clerk
- Analytics: PostHog
- Builds: EAS Build
- Review: CodeRabbit, Codex, Cursor, or another AI reviewer

## App Requirements

- Platforms: `[iOS / Android / both]`
- Offline needs: `[NONE / READ_ONLY / WRITE_QUEUE / FULL_OFFLINE]`
- Auth needs: `[NONE / EMAIL / SOCIAL / ORG / MAGIC_LINK]`
- Data sync needs: `[NONE / USER_ONLY / MULTI_DEVICE / COLLABORATIVE]`
- Media needs: `[IMAGES / VIDEO / AUDIO / CAMERA / FILES]`
- Notifications: `[NONE / LOCAL / PUSH]`
- Payments: `[NONE / APP_STORE / STRIPE / OTHER]`

## Stack Decisions

| Area | Choice | Why | Alternatives Rejected | Risk |
| --- | --- | --- | --- | --- |
| Framework | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |
| Routing | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |
| Styling | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |
| State | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |
| Persistence | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |
| Auth | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |
| Analytics | `[CHOICE]` | `[REASON]` | `[ALTERNATIVES]` | `[RISK]` |

## Decision Rules

- Prefer Expo-supported APIs before third-party packages.
- Prefer TypeScript for every app file.
- Prefer one state management approach.
- Prefer one styling approach.
- Avoid adding a backend until local or mocked flows prove product value.
- Add native dependencies only after checking EAS compatibility.

## Done Looks Like

The stack is decided when a coding agent can set up the project without choosing libraries on its own.
