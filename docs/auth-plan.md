# Auth Plan

Status: Clerk auth wiring, route protection, and the B02 client API token handoff are implemented. Server-side token verification, staff roles, and authorization remain future work.

## Auth Requirement

| Question | Answer |
| --- | --- |
| Is auth required for MVP? | Yes |
| Why is auth needed? | Neo handles business settings, customer conversations, order context, receipt review, staff access, and payment-sensitive actions |
| Can a pure UI prototype work without auth? | Yes, but only as local/mock design work |
| Can the real MVP work without auth? | No |
| Default provider | Clerk |
| Initial methods | Email/password with email verification for sign-up in the current Clerk pass |
| Later methods | Google, Apple, organization/team flows |

## User States

| State | User Experience | Route Group | Notes |
| --- | --- | --- | --- |
| Logged out | See Welcome and Sign In/Register | `(auth)` | No protected business data shown |
| Authenticated, setup incomplete | Continue required setup | `(setup)` | Route guard sends user to next incomplete setup task |
| Authenticated, setup complete | Land on Today Command Center | `(tabs)` | Returning-user default |
| Session expired | Return to sign-in with calm copy | `(auth)` | Clear user-specific local state where required |
| Restricted staff role | Show allowed tabs/actions only | Protected routes | Sensitive actions show permission explanation |

## Route Protection

| Route Type | Routes | Rule |
| --- | --- | --- |
| Public | Welcome, sign-in/register | Available when logged out |
| Setup | Setup Checklist and setup task routes | Requires auth; may appear before main tabs |
| Protected tabs | Today, Inbox, Approvals, Follow-ups, Settings | Requires auth and setup completion |
| Protected details | Conversation, Order, Receipt, Customer | Requires auth; may require specific role permissions |
| Sensitive decisions | Receipt confirmation, approval decisions, payment-related actions | Requires owner/manager permission in production |

## Role Model

Initial roles:

- Owner: Full access.
- Manager: Can approve operational actions and review receipts if allowed.
- Staff: Can reply, draft, create orders, and follow up within assigned permissions.

V1 app UI may represent role gates locally for mocked flows. Production role enforcement must happen server-side or through a trusted authorization layer. Client-only role checks are not sufficient for sensitive actions.

## Data Ownership

| Data | Owner |
| --- | --- |
| Authentication session | Clerk |
| User identity | Clerk |
| Business profile | Local draft in V1; future backend source of truth |
| Staff role and permissions | Local/mock in V1; future backend or Clerk organization metadata |
| App preferences | Zustand plus AsyncStorage for safe values |
| Backend API auth header | Clerk `getToken()` through `lib/api/useApiClient.ts` |

## Sign-Out Rules

On sign-out, clear:

- Setup drafts tied to the user.
- Local operation mock data tied to the user.
- Draft replies or follow-ups tied to the user.
- Cached business settings if they contain business-specific information.

Do not manually clear provider-managed auth internals unless Clerk docs require it.

## Security Rules

- Do not store auth tokens in AsyncStorage manually.
- Do not expose private Clerk keys in the client.
- Retrieve backend request tokens only through Clerk client APIs.
- Use only publishable client keys in Expo public environment variables.
- Do not treat client-side role checks as final authorization for payment or receipt decisions.
- Do not show private customer content on public or logged-out routes.

## Future Auth Work

Future architecture may add:

- Clerk organizations for business/team membership.
- Server-side role validation.
- Staff invites.
- Audit logs for sensitive actions.
- Owner transfer and account recovery rules.

## Done Looks Like

Auth and route guard wiring are ready for the next persistence/state pass without inventing who can access what.
