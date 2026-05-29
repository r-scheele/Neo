# W03 Production Deployment Config

Status: Deferred.

Do not run unless the user explicitly switches to production deployment work.

## Purpose

Configure production deployment for Neo surfaces after each surface has approved deployment requirements.

## Deferred Because

- B09 is about live provider QA and credential rotation, not deployment.
- Production deployment targets, env values, domain ownership, and release gates need a separate decision.

## Not In Scope

- B09 live provider QA.
- Web dashboard feature work.
- Marketing content work.
- Credential rotation unless explicitly scoped.

## Future Prompt Requirements

When this becomes runnable, the prompt must specify:

- Target platforms for `apps/mobile`, `apps/marketing`, and `apps/web`.
- Domain plan and DNS ownership.
- Public env var boundaries.
- Secret handling.
- CI/CD checks.
- Rollback plan.

## Suggested Commit Message

`configure production deployment`
