# Production Build Checklist

Use this before App Store or Google Play submission.

## Configuration

- [ ] App name is final.
- [ ] Bundle identifier/package name is final.
- [ ] Version and build number are correct.
- [ ] Icons are correct.
- [ ] Splash screen is correct.
- [ ] Permissions are declared accurately.
- [ ] Environment variables are configured.

## Code Quality

- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Tests pass if available.
- [ ] No obvious console noise.
- [ ] No dev-only screens accessible.
- [ ] No mock data in production flows unless intentional.

## Security

- [ ] No secrets in client bundle.
- [ ] `.env` not committed.
- [ ] Sensitive logs removed.
- [ ] API endpoints are production-safe.
- [ ] Analytics excludes sensitive data.

## Runtime

- [ ] App launches from fresh install.
- [ ] App works after restart.
- [ ] Auth works if in scope.
- [ ] Offline behavior is acceptable.
- [ ] Error states are user-friendly.

## Done Looks Like

Production build readiness means the release candidate behaves like the app you intend users to install.
