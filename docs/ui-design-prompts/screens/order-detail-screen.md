# Order Detail Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/order-detail.png`

Create a high-fidelity mobile app UI design for the Order Detail screen.

## 1. Screen Name

Order Detail.

## 2. Screen Purpose

Review an order's items, payment state, delivery state, customer context, and timeline.

## 3. User Goal

Understand the current order state and take the next safe action, such as send reminder or update status.

## 4. App Context

Neo turns chat intent into structured orders and keeps payment/delivery status clear without automating sensitive confirmations.

## 5. Target User

Owner, manager, or staff member checking an order created from a customer conversation.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep order information scannable, trustworthy, and practical.

## 7. UI Style Rules

Use compact summary cards, clear status badges with labels/icons, tabular currency, 8px radius, and subtle timeline dividers.

## 8. Layout Structure

Header, order summary, payment status block, delivery block, item list, timeline, bottom next-action area.

## 9. Header Area

Back arrow, title "Order detail", order ID/status chip, overflow menu if needed.

## 10. Main Content Area

Show customer name placeholder, total, item count, payment status, delivery zone/fee, and the latest timeline event.

## 11. Cards / Lists / Forms / Primary Content Sections

Use separate un-nested sections for order items, payment, delivery, and timeline. Payment card should distinguish pending, paid, and receipt review states.

## 12. Primary Action

Primary action depends on state: "Send payment reminder", "Review receipt", or "Update status".

## 13. Secondary Actions

Open conversation, edit order, view customer profile, mark delivery update, cancel order if appropriate.

## 14. Navigation Behavior

Detail route opened from Today, Conversation Detail, Follow-ups, or Customer Profile. Back returns to source. Receipt card opens Receipt Review.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton summary and rows. Missing order shows safe error with back action. Offline state shows cached order but disables risky payment/delivery changes. Long timeline scrolls cleanly.

## 16. Asset Usage Instructions

Use order, receipt, package, delivery, and timeline icons. Use `assets/images/success-order-created.png` only for later success reference, not as main screen art.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid accounting dashboard complexity, hidden payment warnings, tiny totals, fake bank details, auto-paid language, and nested cards.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/order-detail.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/order-detail.png`, `assets/images/`, and `constants/images.ts`.
