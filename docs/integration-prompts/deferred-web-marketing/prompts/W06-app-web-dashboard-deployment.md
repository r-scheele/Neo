# W06 App Web Dashboard Deployment

Status: Deferred.

Do not run unless the user explicitly switches to future `app.neo.com` dashboard deployment work.

## Purpose

Deploy the future authenticated web dashboard after dashboard workflows and auth enforcement exist.

## Deferred Because

- `apps/web` is scaffolded only.
- Dashboard workflows and web auth enforcement are not approved yet.
- Deployment before auth enforcement would be unsafe.

## Not In Scope

- B09 live provider QA.
- Marketing site deployment.
- Mobile app release work.
- Signup/waitlist integrations.

## Future Prompt Requirements

When this becomes runnable, the prompt must specify:

- Dashboard auth status.
- Hosting platform.
- Domain/DNS setup for `app.neo.com`.
- Public env vars and secret boundaries.
- Build command.
- Protected-route smoke tests.
- Rollback plan.

## Suggested Commit Message

`deploy web dashboard`
