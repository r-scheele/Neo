# Git Workflow

Neo uses three long-lived branches:

- `dev`: default branch for day-to-day feature work.
- `staging`: release-candidate branch for integrated QA.
- `main`: production-ready branch.

## Promotion Flow

1. Open feature, fix, docs, chore, or backend branches against `dev`.
2. Promote `dev` to `staging` with a pull request when a batch is ready for QA.
3. Promote `staging` to `main` with a pull request when the release candidate is ready.

Do not merge ordinary feature branches directly into `main` unless the user explicitly asks for an emergency or maintenance change.

## Branch Naming

Use neutral branch prefixes:

- `feature/`
- `fix/`
- `docs/`
- `chore/`
- `backend/`

Do not use assistant-branded branch names, PR titles, commit messages, or user-facing repository text.

## Required Checks

GitHub Actions runs the shared CI workflow for pull requests and pushes to
`dev`, `staging`, and `main`.

Protected branches require the `Typecheck and lint` check before merging.
