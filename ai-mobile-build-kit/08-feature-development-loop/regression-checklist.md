# Regression Checklist

Use this after testing the new feature. Nearby old behavior is where AI changes often break things.

## Navigation

- [ ] Existing tabs still open.
- [ ] Back behavior still works.
- [ ] Modals open and close correctly.
- [ ] Dynamic routes still handle valid and invalid IDs.

## UI

- [ ] Existing screens did not visually shift unexpectedly.
- [ ] Shared components still look correct.
- [ ] Buttons and inputs still fit text.
- [ ] Empty and error states still render.

## State

- [ ] Existing shared state still updates.
- [ ] App restart behavior still works.
- [ ] Sign-out cleanup still works if relevant.
- [ ] No duplicate or stale data appears.

## Auth

- [ ] Logged-out flow still works.
- [ ] Logged-in flow still works.
- [ ] Protected routes are still protected.
- [ ] Session loading does not flash private content.

## Data And API

- [ ] Existing API calls still work.
- [ ] Existing offline behavior still works.
- [ ] Existing error handling still works.

## Done Looks Like

Regression testing is complete when the old flows most likely affected by the diff have been checked.
