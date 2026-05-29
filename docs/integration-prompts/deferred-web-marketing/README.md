# Deferred Web And Marketing Prompts

Status: Deferred. Not part of B09.

This folder separates future web dashboard, marketing, deployment, and signup/waitlist work from the mobile/backend B09 live provider QA track.

Do not run these prompts unless the user explicitly switches to web/marketing/deployment work.

## Product Surface Boundaries

- `apps/mobile`: current mobile MVP and backend integration target.
- `apps/marketing`: public `neo.com` marketing site.
- `apps/web`: future `app.neo.com` dashboard scaffold.
- `supabase`: backend database and Edge Functions.
- `packages/shared`: shared contracts only.

## Deferred Tracks

- Full web dashboard workflows.
- Auth enforcement in web apps.
- Production deployment config.
- Real signup/waitlist integrations.
- Marketing site deployment.
- `app.neo.com` dashboard deployment.

## Safety Notes

- Do not move mobile workflows into the marketing site.
- Do not embed server secrets in web apps.
- Do not implement authenticated dashboard workflows without a specific product prompt.
- Do not mix these prompts with B09 live provider QA.
