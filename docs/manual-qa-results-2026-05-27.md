# Manual QA Results

Date: 2026-05-27

Baseline: `docs/manual-qa-baseline.md`

Verdict: partial pass for local/client-safe checks. Full signed-in manual QA is still blocked until a real Clerk test project and test account are available outside git.

## Environment

- App started with `npm run web -- --host localhost --port 8105`.
- Expo loaded local public env names for Clerk and PostHog.
- No `.env` values were printed or changed.
- No packages were installed.
- No app code, backend code, `lib/api/`, or public API base URL usage was added.

## Passed Checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| No `lib/api/` directory | Passed |
| No public API URL/API client patterns in app source | Passed |
| Expo web start | Passed on `http://localhost:8105` |
| Route HTTP smoke | Passed for all routes listed below |

## Route HTTP Smoke

All routes returned HTTP 200 from the local Expo web server:

```text
/
/(auth)/welcome
/(auth)/sign-in
/(setup)
/(setup)/business-profile
/(setup)/business-type
/(setup)/whatsapp
/(setup)/ai-personality
/(setup)/payment-rules
/(setup)/delivery-zones
/(setup)/products
/(tabs)/today
/(tabs)/inbox
/(tabs)/approvals
/(tabs)/follow-ups
/(tabs)/settings
/conversation/aisha-order-review
/order/new?conversationId=aisha-order-review
/order/ord-2025-0561
/receipt/aisha-receipt-18000
/customer/aisha-o
/modals/permission?action=approval-decision&role=staff
/(tabs)/today?state=loading
/(tabs)/today?state=empty
/(tabs)/today?state=error
/(tabs)/today?state=offline
/(tabs)/today?state=permission
/conversation/aisha-order-review?state=loading
/conversation/aisha-order-review?state=empty
/conversation/aisha-order-review?state=error
/conversation/aisha-order-review?state=offline
/conversation/aisha-order-review?state=permission
/(tabs)/approvals?role=staff
/receipt/aisha-receipt-18000?role=staff
```

## Baseline Coverage

| Baseline area | Status | Notes |
| --- | --- | --- |
| Preflight | Passed | Typecheck, lint, app start, and route smoke passed. |
| Environment rules | Partially verified | Public env names loaded locally. Missing-Clerk behavior was not run because the local `.env` was not changed. |
| Public and auth | Partially verified | Public/auth routes returned HTTP 200. Click-level welcome/sign-in validation and protected redirects need a controlled signed-out/signed-in Clerk session. |
| Setup flow | Blocked | Requires a real Clerk test account and cleared local app storage. |
| Tabs | Partially verified | Tab routes returned HTTP 200. Authenticated tab interactions need a Clerk test account with setup complete. |
| Detail routes | Partially verified | Detail routes returned HTTP 200. In-app linked navigation and form interactions still need browser/manual QA in an authenticated session. |
| State variants | Partially verified | Development mock state and role routes returned HTTP 200. Visual review of skeleton/empty/error/offline/permission behavior still needs manual browser QA. |
| Deferred backend QA | Blocked | Backend/API decisions remain deferred. |

## Still Required Before Release Candidate Work

- Run the full baseline with a real Clerk test account.
- Verify signed-out protected redirects.
- Verify first-run setup flow with cleared local app storage.
- Verify setup-complete tabs and detail interactions with a signed-in account.
- Verify sign-out clears safe user-local state and resets analytics identity.
- Verify PostHog event arrival with public production values, without private commerce payloads.
- Record visual pass/fail notes for loading, empty, error, offline, permission, and role-gated local states.

## Risks

- HTTP 200 smoke confirms routes are served, but it does not prove screen content, redirects, click behavior, form validation, local persistence, or visual states are correct.
- Current route and state data remain local/mock until Phase B backend/API work is approved and implemented.
- Passing this partial run does not make Neo release-ready.
