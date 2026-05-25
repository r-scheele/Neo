# Auth Plan Template

Use this before integrating Clerk or any auth provider.

## Auth Requirement

- Is auth required for MVP? `[YES/NO]`
- Why is auth needed? `[REASON]`
- Can the first useful flow work without auth? `[YES/NO]`
- Required methods: `[EMAIL / MAGIC_LINK / GOOGLE / APPLE / PASSWORD / ORG]`

## User States

| State | User Experience | Route Group | Notes |
| --- | --- | --- | --- |
| Logged out | `[EXPERIENCE]` | `(auth)` | `[NOTES]` |
| Onboarding incomplete | `[EXPERIENCE]` | `[ROUTE]` | `[NOTES]` |
| Logged in | `[EXPERIENCE]` | `(tabs)` | `[NOTES]` |
| Session expired | `[EXPERIENCE]` | `[ROUTE]` | `[NOTES]` |

## Route Protection

- Public routes: `[ROUTES]`
- Auth routes: `[ROUTES]`
- Protected routes: `[ROUTES]`
- Redirect rules: `[RULES]`

## Data Ownership

- User profile source: `[CLERK / API / LOCAL]`
- App-specific user settings: `[WHERE_STORED]`
- Sign-out cleanup: `[WHAT_TO_CLEAR]`

## Security Rules

- Do not expose secret keys in client code.
- Use public publishable keys only where appropriate.
- Store environment values in `.env` and document in `.env.example`.
- Do not persist raw auth tokens manually unless provider docs require it.
- Clear user-specific local state on sign out where needed.

## Done Looks Like

Auth planning is done when a coding prompt can implement auth routes without deciding product access rules.
