# Privacy And Security Checklist

Use this before release and whenever adding auth, analytics, APIs, storage, or permissions.

## Secrets

- [ ] No private keys in client code.
- [ ] `.env` is ignored.
- [ ] `.env.example` has no secrets.
- [ ] Server-only secrets live server-side.

## Data Collection

- [ ] Only necessary data is collected.
- [ ] Sensitive data is avoided or minimized.
- [ ] Analytics excludes sensitive content.
- [ ] Privacy policy matches implementation.

## Storage

- [ ] AsyncStorage contains no secrets.
- [ ] Persisted data has defaults.
- [ ] Invalid persisted data does not crash the app.
- [ ] User-specific data clears on sign out if required.

## Auth

- [ ] Protected routes are protected.
- [ ] Logged-out users cannot access private screens.
- [ ] Session loading state is handled.
- [ ] Sign-out works.

## Permissions

- [ ] Permissions are necessary.
- [ ] Permission copy is honest.
- [ ] Denied permissions have fallback behavior.

## Done Looks Like

Privacy and security are acceptable when the app collects less data than it could and protects what it must.
