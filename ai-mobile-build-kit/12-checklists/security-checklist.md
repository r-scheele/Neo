# Security Checklist

Use this before adding auth, APIs, analytics, storage, or release builds.

## Secrets

- [ ] No private API keys in client code.
- [ ] No secrets in Git history.
- [ ] `.env` ignored.
- [ ] `.env.example` safe.
- [ ] `EXPO_PUBLIC_` used only for public values.
- [ ] Exposed keys rotated if needed.

## Auth

- [ ] Auth provider docs followed.
- [ ] Protected routes protected.
- [ ] Session loading handled.
- [ ] Sign-out works.
- [ ] User-specific local state cleared if needed.

## Data

- [ ] Only necessary data collected.
- [ ] Sensitive data minimized.
- [ ] External responses validated or narrowed.
- [ ] No sensitive data in logs.
- [ ] No sensitive data in analytics.

## Storage

- [ ] AsyncStorage contains no secrets.
- [ ] Stored data uses namespaced keys.
- [ ] Corrupt storage is handled.
- [ ] Migration plan exists if schema can change.

## APIs

- [ ] Server-only secrets stay server-side.
- [ ] Inputs validated.
- [ ] Safe error messages returned.
- [ ] HTTPS used.
- [ ] Rate limits considered for server routes.

## Done Looks Like

Security is acceptable when the app exposes no secrets, collects only needed data, and handles auth/data boundaries deliberately.
