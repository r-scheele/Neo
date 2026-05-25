# Create Order Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/create-order.png`

Create a high-fidelity mobile app UI design for the Create Order screen.

## 1. Screen Name

Create Order.

## 2. Screen Purpose

Turn customer intent from a conversation into a structured order record.

## 3. User Goal

Confirm customer, product, quantity, delivery fee, total, and payment status, then save the order.

## 4. App Context

Neo helps sellers convert WhatsApp chats into structured commerce records without needing full backend sync in the first UI build.

## 5. Target User

Owner or sales staff creating an order from an active customer conversation.

## 6. Visual Direction

Use the attached master UI style reference if provided. The form should feel efficient, clear, and mobile-native.

## 7. UI Style Rules

Use grouped form sections, 8px inputs/cards, tabular currency numbers, clear required fields, and a sticky total/primary save area if needed.

## 8. Layout Structure

Header, source conversation/customer summary, item form, delivery/payment form, total summary, bottom save button.

## 9. Header Area

Back arrow, title "Create order", source label such as "From conversation", optional customer chip.

## 10. Main Content Area

Show prefilled customer, product selector, variant/quantity controls, delivery zone and fee, payment status selector, and notes field.

## 11. Cards / Lists / Forms / Primary Content Sections

Use order item rows with product, quantity stepper, price, remove icon, and add item action. Totals card shows subtotal, delivery, total, and payment state.

## 12. Primary Action

Deep forest green button labeled "Save order".

## 13. Secondary Actions

Secondary action for "Add item", "Save draft", or "Cancel". Use icon buttons for item edit/remove.

## 14. Navigation Behavior

Focused flow opened from Conversation Detail. Saving opens Order Detail or returns to the conversation with confirmation.

## 15. Empty / Loading / Error State Notes

Loading uses form skeletons. If no product data exists, prompt manual item entry. Save error preserves fields. Offline state can keep local draft but disables final submit.

## 16. Asset Usage Instructions

Use product/package, delivery pin, receipt, and currency icons. Do not use product photos unless provided. Do not include real names, phone numbers, or exact addresses.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid desktop order tables, too many accounting fields, hidden totals, tiny numeric inputs, accidental payment confirmation language, and full inventory features.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/create-order.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/create-order.png`, `assets/images/`, and `constants/images.ts`.
