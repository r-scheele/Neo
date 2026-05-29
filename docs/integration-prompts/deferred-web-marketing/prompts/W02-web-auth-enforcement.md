# W02 Web Auth Enforcement

Status: Deferred.

Do not run unless the user explicitly switches to web dashboard auth work.

## Purpose

Protect future `apps/web` authenticated dashboard routes and enforce auth boundaries for browser users.

## Deferred Because

- `apps/web` has no approved real dashboard workflows yet.
- Clerk/dashboard auth behavior needs a separate web-specific product and security decision.

## Not In Scope

- B09 live provider QA.
- Mobile auth changes.
- Marketing site signup forms.
- Production deployment.

## Future Prompt Requirements

When this becomes runnable, the prompt must specify:

- Public and protected web routes.
- Clerk web configuration.
- Server/client auth handoff.
- Role and permission boundaries.
- Safe redirect behavior.
- Verification commands.

## Suggested Commit Message

`enforce web dashboard auth`
