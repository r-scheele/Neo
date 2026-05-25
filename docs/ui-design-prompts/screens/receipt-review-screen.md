# Receipt Review Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/receipt-review.png`

Create a high-fidelity mobile app UI design for the Receipt Review screen.

## 1. Screen Name

Receipt Review.

## 2. Screen Purpose

Help a user inspect a manual bank transfer receipt screenshot, review extracted details, and make a deliberate human decision.

## 3. User Goal

Compare receipt details with order/payment context and choose confirm, reject, ask customer, or escalate.

## 4. App Context

Neo must never treat manual transfer screenshots as automatic proof of payment. The user should verify against a bank alert before confirming payment.

## 5. Target User

Owner, accountant, or manager reviewing payment-sensitive evidence.

## 6. Visual Direction

Use the attached master UI style reference if provided. The screen should feel trust-first, careful, and clear, not alarming.

## 7. UI Style Rules

Receipt preview must be prominent. Extraction rows must be readable. Warning copy must be visible before confirmation. Decision buttons must be visually distinct.

## 8. Layout Structure

Header, order/customer summary, receipt image preview, extracted detail rows, warning block, decision action area.

## 9. Header Area

Back arrow, title "Receipt review", risk/status chip, optional more menu.

## 10. Main Content Area

Show a large framed receipt preview with zoom affordance, then extracted rows for amount, sender, date/time, reference, confidence, and mismatch warnings.

## 11. Cards / Lists / Forms / Primary Content Sections

Use a payment comparison block showing expected amount versus extracted amount. Include a warning block: verify against bank alert before confirming.

## 12. Primary Action

Primary action may be "Confirm payment" only after warning context is visible. It should feel deliberate, not casual.

## 13. Secondary Actions

Reject receipt, ask customer, escalate, open order, view conversation, zoom receipt.

## 14. Navigation Behavior

Focused detail route opened from Approvals, Today, Order Detail, or Conversation Detail. Back returns to source. Decision success updates order/payment state.

## 15. Empty / Loading / Error State Notes

Loading uses receipt preview skeleton and extraction row skeletons. Image/extraction failure shows retry. Offline state can inspect cached image but cannot confirm. Permission denied disables confirm.

## 16. Asset Usage Instructions

Use a generic receipt preview placeholder or reserve space for a receipt image. Use `assets/images/illustration-receipt-review.png`, `assets/images/empty-receipts.png`, `assets/images/error-receipt-unreadable.png`, or `assets/images/success-payment-verified.png` only for relevant states, not the default populated screen.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid auto-confirmed payment language, green checkmark as proof before review, fake bank logos, exact account numbers, unreadable receipt details, and accidental one-tap confirmation.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/receipt-review.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/receipt-review.png`, `assets/images/`, and `constants/images.ts`.
