# GitHub Setup Checklist

Use this after the local starter app is stable.

## Repository

- [ ] Create GitHub repository.
- [ ] Push main branch.
- [ ] Add project description.
- [ ] Confirm `.env` is not committed.
- [ ] Confirm README is useful.

## Branching

- [ ] Use one branch per meaningful feature if working with PRs.
- [ ] Keep commits small.
- [ ] Do not merge unreviewed AI diffs.

## Review Tools

- [ ] Enable CodeRabbit or preferred review tool if desired.
- [ ] Add review expectations to `AGENTS.md`.
- [ ] Decide whether PRs are required before main.

## Secrets

- [ ] Add repository secrets only for CI/build when required.
- [ ] Do not store mobile client secrets that should be server-side.
- [ ] Rotate accidentally committed keys.

## Done Looks Like

GitHub is ready when the repository is a clean source of truth and AI-generated changes can be reviewed through diffs or pull requests.
