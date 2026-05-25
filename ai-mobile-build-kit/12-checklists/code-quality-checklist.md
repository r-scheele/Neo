# Code Quality Checklist

Use this before committing AI-generated code.

## Scope

- [ ] No unrelated rewrites.
- [ ] No unrequested features.
- [ ] No unnecessary libraries.
- [ ] Diff matches the prompt.
- [ ] Files changed are expected.

## TypeScript

- [ ] No `any`.
- [ ] Simple types.
- [ ] Props typed.
- [ ] State typed.
- [ ] Route params typed.
- [ ] API responses typed or parsed.
- [ ] AsyncStorage data parsed.

## Architecture

- [ ] Clear component boundaries.
- [ ] Screens are not huge.
- [ ] Stores do not import UI.
- [ ] Generic components do not import feature logic.
- [ ] Image imports are centralized.
- [ ] State owner is clear.

## UX

- [ ] Loading states included where relevant.
- [ ] Error states included where relevant.
- [ ] Empty states included where relevant.
- [ ] Permission states included where relevant.
- [ ] Long content handled.
- [ ] Accessibility labels included for icon buttons.

## Security

- [ ] Secrets not exposed.
- [ ] Sensitive data not logged.
- [ ] AsyncStorage does not store secrets.
- [ ] Client/server boundaries respected.

## Verification

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] App run manually.
- [ ] Tested on device or simulator.
- [ ] Related old features tested.

## Done Looks Like

Code is commit-ready when it is scoped, typed, tested, and understandable.
