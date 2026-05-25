# Real Device Testing Checklist

Simulators are useful. Real devices reveal the painful details.

## Device Basics

- [ ] Install the app on a real iPhone if iOS is in scope.
- [ ] Install the app on a real Android device if Android is in scope.
- [ ] Test a small screen.
- [ ] Test a large screen.
- [ ] Test with larger text size if possible.

## Interaction

- [ ] Buttons are easy to tap.
- [ ] Inputs are not covered by keyboard.
- [ ] Scroll works naturally.
- [ ] Modals can be dismissed.
- [ ] Back gestures behave correctly.
- [ ] Haptics or sounds, if any, are appropriate.

## Device Conditions

- [ ] Fast internet.
- [ ] Slow internet.
- [ ] No internet.
- [ ] App background and foreground.
- [ ] App killed and reopened.
- [ ] Low battery mode if relevant.

## Permissions

- [ ] Permission accepted.
- [ ] Permission denied.
- [ ] Permission changed in settings.
- [ ] Fallback works when denied.

## Done Looks Like

Real device testing is complete when the app feels usable in hand, not just correct in the simulator.
