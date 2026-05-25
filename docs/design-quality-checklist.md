# Design Quality Checklist

Use this checklist before generating images, prompting UI implementation, or approving screen designs.

## Product Fit

- [ ] The screen clearly supports review, reply, capture, verify, or follow up.
- [ ] The mobile view does not feel like a compressed desktop dashboard.
- [ ] The most urgent action is obvious within a few seconds.
- [ ] Sensitive actions show enough context before confirmation.
- [ ] Manual receipt screenshots are never framed as automatically trustworthy.

## Visual Direction

- [ ] The screen feels premium, calm, wise, trustworthy, and warmly practical.
- [ ] The palette uses forest green, warm ivory, beige, muted gold, terracotta, and charcoal without becoming green-only.
- [ ] Cards use 8px radius or less and avoid nested-card layouts.
- [ ] Shadows are subtle and border-first.
- [ ] Typography is compact, readable, and professional.
- [ ] Icons are rounded outline icons with consistent stroke weight.
- [ ] Illustrations use the approved editorial flat style and avoid fake text.

## Mobile Usability

- [ ] Primary controls are thumb-friendly.
- [ ] Touch targets are at least 44px.
- [ ] Long names, messages, locations, and amounts do not break layout.
- [ ] Button text fits without crowding.
- [ ] Dense lists remain scannable.
- [ ] Critical actions are not hidden behind decorative UI.

## State Coverage

- [ ] Loading state is defined.
- [ ] Empty state is defined.
- [ ] Error state is defined.
- [ ] Success state is defined.
- [ ] Offline state is defined.
- [ ] Permission denied state is defined.
- [ ] Long content behavior is defined.
- [ ] First-time user state is defined.
- [ ] Returning user state is defined.

## AI Safety

- [ ] AI draft replies are visibly drafts until sent.
- [ ] AI confidence and reason are shown where useful.
- [ ] Low-confidence replies require review.
- [ ] Discounts above allowed threshold require approval.
- [ ] Refunds require approval.
- [ ] Angry or complaint messages escalate to human.
- [ ] Large orders can require owner review.
- [ ] AI does not invent prices, stock, delivery promises, or policies.

## Payment Trust

- [ ] Provider-confirmed payments and manual receipt screenshots are visually distinct.
- [ ] Receipt review includes extracted amount, sender, bank, time, confidence, and linked order.
- [ ] Receipt review warns that screenshots can be edited.
- [ ] Confirm Payment is deliberate and role-protected.
- [ ] Reject and Ask Customer actions are available.
- [ ] Dispatch is blocked or warned until payment is verified.

## Accessibility

- [ ] Status is not communicated by color alone.
- [ ] Icon-only controls have accessible names.
- [ ] Text remains readable at larger font sizes.
- [ ] Error messages are specific and actionable.
- [ ] Motion is not required to understand state changes.
- [ ] Contrast is sufficient for body text, buttons, and warnings.

## What To Reject

- [ ] Neon AI visuals, robot mascots, sparkles-as-AI, or holograms.
- [ ] Purple/blue gradient AI branding.
- [ ] Loud decorative cultural stereotypes.
- [ ] Fake unreadable UI inside generated images.
- [ ] Overly playful mascot-driven UX.
- [ ] Cards inside cards.
- [ ] Overcrowded dashboard grids.
- [ ] Payment confirmation flows that look casual or automatic.

