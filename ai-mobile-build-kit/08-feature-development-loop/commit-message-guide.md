# Commit Message Guide

Use clear commit messages so AI-assisted changes remain understandable.

## Format

```text
type: short description
```

Common types:

- `feat`: user-facing feature.
- `fix`: bug fix.
- `chore`: tooling, setup, config.
- `docs`: documentation.
- `refactor`: behavior-preserving code structure change.
- `test`: tests only.
- `style`: visual styling only.

## Examples

```text
feat: add create habit modal
fix: handle missing habit detail route
chore: configure nativewind
docs: add release checklist
refactor: split habit card component
test: cover habit store actions
style: polish empty habit state
```

## Rules

- One feature per commit.
- Do not hide unrelated changes.
- Mention user-facing behavior when possible.
- Use `fix` only when a bug was actually fixed.
- Use `refactor` only when behavior and visuals are unchanged.

## Commit Body Template

```text
What changed:
- [CHANGE_1]
- [CHANGE_2]

Verification:
- [COMMAND_OR_MANUAL_TEST]
- [COMMAND_OR_MANUAL_TEST]

Risks:
- [RISK_OR_NONE]
```

## Done Looks Like

A commit is good when future you can understand why it exists from the message and diff.
