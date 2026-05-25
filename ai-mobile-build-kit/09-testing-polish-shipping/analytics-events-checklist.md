# Analytics Events Checklist

Use this before release if analytics is included.

## Event Quality

- [ ] Events answer specific product questions.
- [ ] Event names use lowercase snake_case.
- [ ] Properties are typed.
- [ ] No sensitive free text is tracked.
- [ ] No secrets or tokens are tracked.
- [ ] Events are documented.

## Core Events

- [ ] App opened or session started if needed.
- [ ] Onboarding started.
- [ ] Onboarding completed.
- [ ] Core feature action completed.
- [ ] Error or failure events for critical flows.
- [ ] Paywall or subscription events if relevant.

## Verification

- [ ] Events fire in development or preview.
- [ ] Properties are correct.
- [ ] Duplicate events are not firing.
- [ ] Analytics failure does not break app behavior.

## Done Looks Like

Analytics is release-ready when events are intentional, privacy-safe, and verified in the analytics tool.
