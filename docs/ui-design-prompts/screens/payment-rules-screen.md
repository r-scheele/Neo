# Payment Rules Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/payment-rules.png`

Create a high-fidelity mobile app UI design for the Payment Rules screen.

## 1. Screen Name

Payment Rules.

## 2. Screen Purpose

Configure payment methods and manual receipt review rules without implying screenshots are automatic proof of payment.

## 3. User Goal

Set how customers pay, define receipt review expectations, and save trust-first payment rules.

## 4. App Context

Payment trust is central to Nigerian WhatsApp commerce. Neo must never confirm manual transfers from screenshots alone; users should verify against a bank alert before confirming.

## 5. Target User

Owner, accountant, or manager responsible for payment rules and receipt review.

## 6. Visual Direction

Use the attached master UI style reference if provided. The design should feel serious, calm, and confidence-building.

## 7. UI Style Rules

Use clear form sections, warning chips, deliberate toggles, sand borders, and visible trust copy. Avoid alarming payment visuals.

## 8. Layout Structure

Header, payment method section, receipt review rule section, bank alert reminder, approval requirement toggles, bottom save action.

## 9. Header Area

Back arrow, title "Payment rules", compact setup progress chip, short subtitle about safe review.

## 10. Main Content Area

Show payment method rows such as Bank transfer and Payment link. Include manual receipt review settings and a visible note: verify against bank alert before confirming.

## 11. Cards / Lists / Forms / Primary Content Sections

Use bordered cards or grouped form rows for payment method, required checks, and who can confirm payment. Show warning/status badges with labels.

## 12. Primary Action

Deep forest green button labeled "Save payment rules".

## 13. Secondary Actions

Secondary action for "Add method" or "Back to checklist". Use destructive actions only for removing a method.

## 14. Navigation Behavior

No bottom tabs during setup. Saving returns to Setup Checklist or advances to Delivery Zones.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton form rows. Error preserves fields and shows inline retry. Permission-denied state should lock confirmation settings for restricted staff.

## 16. Asset Usage Instructions

Use receipt, shield, bank, and check icons in Neo's rounded outline style. Do not use fake bank logos, real account numbers, or receipt screenshots as decorative proof.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid auto-verify language, one-tap risky confirmation, fake bank data, cluttered compliance text, scary fraud graphics, and fintech dashboard styling.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/payment-rules.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/payment-rules.png`, `assets/images/`, and `constants/images.ts`.
