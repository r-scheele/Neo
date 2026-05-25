# Diff Review Checklist

Use this before accepting AI-generated code.

## Scope

- [ ] Diff matches the prompt.
- [ ] No unrelated files changed.
- [ ] No unrelated refactor.
- [ ] No unrequested features added.
- [ ] No architecture changes unless requested.

## Dependencies

- [ ] No new libraries added without approval.
- [ ] No native config changes unless requested.
- [ ] No package lock churn unrelated to the task.

## TypeScript

- [ ] No `any`.
- [ ] Props are typed.
- [ ] Route params are typed.
- [ ] API responses are typed or parsed.
- [ ] Store actions are typed.

## UI

- [ ] Matches visual direction.
- [ ] Uses approved components and assets.
- [ ] Handles required states.
- [ ] Text fits.
- [ ] Touch targets are usable.

## Security

- [ ] No secrets committed.
- [ ] No sensitive data logged.
- [ ] No unsafe AsyncStorage usage.
- [ ] Client/server boundary is respected.

## Tests And Verification

- [ ] Manual test steps are provided.
- [ ] Automated tests added where appropriate.
- [ ] Lint/typecheck instructions are clear.

## Done Looks Like

The diff is acceptable when every change can be explained by the prompt.
