# Initial Git Setup

Use Git before AI starts changing files. Small commits make AI work reversible and reviewable.

## Checklist

- [ ] Run `git status`.
- [ ] Initialize Git if needed.
- [ ] Confirm `.gitignore` excludes `.env`, build output, dependencies, and local files.
- [ ] Commit the clean starter app.
- [ ] Push to GitHub.

## Suggested Commit Messages

```text
chore: initialize expo project
chore: add project setup docs
chore: configure routing and styling
```

## Git Rules For AI Work

- One feature per commit.
- Do not mix refactors and feature work.
- Do not commit generated secrets.
- Review every diff before commit.
- Use clear commit messages.

## Done Looks Like

Git is ready when there is a clean baseline commit and every future AI change can be reviewed as a focused diff.
