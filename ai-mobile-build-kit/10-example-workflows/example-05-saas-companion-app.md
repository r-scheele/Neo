# Example 05: SaaS Companion App

## App Idea

DeskPulse Mobile is a companion app for a B2B support dashboard that lets managers review urgent tickets, acknowledge incidents, and receive key alerts away from their desk.

## Target User

- Support manager or operations lead.
- Already uses the desktop SaaS.
- Needs quick triage, not full desktop functionality.
- Cares about reliability, auth, permissions, and clear status.

## Visual Direction

- Mood: operational, calm, dense, reliable.
- Palette: white, cool gray, strong blue actions, status colors for severity.
- Typography: compact and readable.
- Cards: table-like list rows, restrained borders.
- Illustration: almost none except empty states.
- Motion: minimal.

## Core Screens

- Sign in.
- Alerts.
- Ticket detail.
- Incident detail.
- Acknowledge modal.
- Account/settings.

## Asset List

| Asset | Purpose | Prompt |
| --- | --- | --- |
| `logo-mark-deskpulse.png` | Brand mark | Logo prompt |
| `empty-alerts.png` | No urgent alerts | Empty state prompt |
| `success-acknowledged.png` | Acknowledged incident | Success state prompt |
| `error-api-unavailable.png` | API unavailable | Error state prompt |
| `splash-mark-deskpulse.png` | Splash | Splash prompt |

## Stack Decisions

- Expo, React Native, TypeScript, Expo Router.
- NativeWind for dense operational UI.
- Clerk for auth.
- Backend/API integration required.
- Zustand for UI filters and temporary selected IDs.
- AsyncStorage for safe preferences only.
- PostHog for operational usage events, not customer ticket content.
- EAS Build for internal distribution.

## Example AGENTS.md Values

- `[APP_NAME]`: DeskPulse Mobile
- `[ONE_LINE_DESCRIPTION]`: DeskPulse Mobile helps support managers review urgent tickets and acknowledge incidents from their phone.
- `[TARGET_USER]`: Support managers and operations leads.
- `[FEATURE_LIST]`: auth, alerts list, ticket detail, incident detail, acknowledge action, settings.
- `[PRIMARY_SCREENS]`: Sign In, Alerts, Ticket Detail, Incident Detail, Acknowledge Modal, Settings.
- `[VISUAL_DIRECTION]`: Operational, calm, dense; cool gray surfaces, blue actions, clear status colors, compact list rows.

## First Five Feature Prompts

### Prompt 1: Auth Shell

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the auth shell and route protection for DeskPulse Mobile.

Constraints:
- Use Clerk only with current docs.
- Do not implement ticket API yet.
- Do not expose secrets.
- Do not redesign protected screens.

Reference:
- Auth plan.
- Clerk Expo docs: [PASTE_CURRENT_DOCS].
- Routes: app/(auth), app/(tabs).

Acceptance criteria:
- Logged-out users see sign-in.
- Logged-in users reach Alerts.
- Session loading is handled.
- TypeScript and lint pass.
```

### Prompt 2: Alerts List With Mock Data

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the Alerts list screen with mock data.

Constraints:
- Do not call the API yet.
- Do not implement acknowledge action yet.
- Keep UI dense and operational.
- Do not install libraries.

Reference:
- Route: app/(tabs)/alerts.tsx.
- Alert fields: id, severity, title, customerName, age, status.

Acceptance criteria:
- Alerts display in scannable rows.
- Empty state appears when no alerts exist.
- Severity is visible without relying only on color.
- TypeScript and lint pass.
```

### Prompt 3: Alert Detail

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement alert detail navigation from the Alerts list.

Constraints:
- Use mock data.
- Do not add API calls.
- Do not add acknowledge yet.
- Keep route params typed.

Reference:
- Detail route: app/alerts/[alertId].tsx.
- Existing alert type.

Acceptance criteria:
- Tapping alert opens detail.
- Missing alert shows error state.
- Back navigation works.
- TypeScript and lint pass.
```

### Prompt 4: API Client Boundary

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create the typed API client boundary for fetching alerts.

Constraints:
- Do not wire into UI yet.
- Do not expose secrets.
- Validate or narrow API responses.
- Do not install libraries without approval.

Reference:
- API docs: [PASTE_CURRENT_DOCS].
- Endpoint: [ALERTS_ENDPOINT].
- Auth token source: Clerk session according to docs.

Acceptance criteria:
- Client function returns typed alerts.
- Error shape is documented.
- No UI changes.
- TypeScript and lint pass.
```

### Prompt 5: Wire Alerts To API

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Wire Alerts screen to the typed API client.

Constraints:
- Preserve existing list UI.
- Do not change auth behavior.
- Do not add acknowledge action.
- Handle loading, empty, error, and retry.

Reference:
- Alerts screen.
- API client.
- Error state asset: error-api-unavailable.png.

Acceptance criteria:
- Alerts load from API.
- Loading, empty, error, and retry states work.
- Existing mock data is removed or isolated from production path.
- TypeScript and lint pass.
```

## Testing Plan

- Logged-out route protection.
- Session loading.
- Alerts list with data, empty data, API error.
- Detail valid and invalid ID.
- Slow network.
- App background and resume.
- Verify no customer-sensitive data is sent to analytics.
