# W05 Marketing Site Deployment

Status: Deferred.

Do not run unless the user explicitly switches to `apps/marketing` deployment work.

## Purpose

Deploy the public `neo.com` marketing site after production deployment decisions are approved.

## Deferred Because

- B09 is backend live provider QA.
- Marketing deployment requires separate domain, hosting, env, analytics, and launch decisions.

## Not In Scope

- B09 live provider QA.
- Mobile app release work.
- Web dashboard deployment.
- Real signup/waitlist integration unless explicitly included.

## Future Prompt Requirements

When this becomes runnable, the prompt must specify:

- Hosting platform.
- Domain/DNS setup.
- Public env vars.
- Analytics config.
- Build command.
- Smoke checks.
- Rollback plan.

## Suggested Commit Message

`deploy marketing site`
