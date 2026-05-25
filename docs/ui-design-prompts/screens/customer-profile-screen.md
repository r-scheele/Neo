# Customer Profile Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/customer-profile.png`

Create a high-fidelity mobile app UI design for the Customer Profile screen.

## 1. Screen Name

Customer Profile.

## 2. Screen Purpose

Show customer memory, order history, notes, preferences, and linked actions in one compact mobile profile.

## 3. User Goal

Understand the customer quickly, add a note if needed, and open the linked conversation/order/follow-up.

## 4. App Context

Neo remembers customer context so sellers can reply with continuity and make better sales decisions without exposing sensitive data unnecessarily.

## 5. Target User

Owner, manager, or staff member reviewing customer context while handling a conversation or order.

## 6. Visual Direction

Use the attached master UI style reference if provided. The profile should feel warm, respectful, and operational rather than social-media-like.

## 7. UI Style Rules

Use compact summary sections, status chips, readable history rows, 8px cards, subtle dividers, and clear permission-aware note areas.

## 8. Layout Structure

Header, customer summary, quick actions, tabs/sections for notes, orders, preferences, and activity history.

## 9. Header Area

Back arrow, customer name placeholder, customer status chip, optional edit/more icon. Avoid prominently displaying phone number.

## 10. Main Content Area

Show summary such as last order, preferred delivery area, outstanding balance/status, recent note, and next recommended action.

## 11. Cards / Lists / Forms / Primary Content Sections

Use simple rows for order history and activity, a note input or "Add note" card, and a customer preference summary. Tabs can be Summary, Orders, Notes.

## 12. Primary Action

Primary action is "Open conversation" or "Add note" depending on context.

## 13. Secondary Actions

Open latest order, create follow-up, edit note, view receipts, block customer if appropriate and low priority.

## 14. Navigation Behavior

Detail route opened from Conversation Detail, Order Detail, Inbox, or Follow-ups. Back returns to source. Linked rows open their respective detail screens.

## 15. Empty / Loading / Error State Notes

Loading uses profile skeleton. New customer empty state shows no orders yet and a direct action. Offline state shows cached profile and disables new notes. Restricted roles may hide sensitive notes.

## 16. Asset Usage Instructions

Use generic initials avatar and rounded outline user, note, order, and message icons. Do not use real customer photos, real phone numbers, or private addresses.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid social profile styling, contact-book clutter, raw private details, dense CRM tables, tiny timeline rows, and future segmentation tools.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/customer-profile.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/customer-profile.png`, `assets/images/`, and `constants/images.ts`.
