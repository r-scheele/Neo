# Conversation Detail Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/conversation-detail.png`

Create a high-fidelity mobile app UI design for the Conversation Detail screen.

## 1. Screen Name

Conversation Detail.

## 2. Screen Purpose

Show customer messages, customer context, AI draft reply, and actions to edit/send/take over/create an order.

## 3. User Goal

Understand the customer context, review the AI draft, then send, edit, take over, or capture an order.

## 4. App Context

Neo drafts replies from business context, products, delivery rules, payment rules, and customer memory, but sensitive actions remain human-reviewed.

## 5. Target User

Sales staff, owner, or manager actively replying to a customer conversation.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the chat useful and dense without making it feel like a generic messaging clone.

## 7. UI Style Rules

Use warm neutral customer bubbles, forest-tinted staff replies, a distinct bordered AI draft card, clear status badges, and a thumb-friendly composer/action area.

## 8. Layout Structure

Compact conversation header, optional customer summary strip, scrollable chat thread, AI draft review card, composer/action bar at bottom.

## 9. Header Area

Back arrow, customer name, status/label chip, small customer/profile icon, optional overflow menu. Avoid showing private phone numbers prominently.

## 10. Main Content Area

Show a realistic chat thread with short customer and staff messages, a product/order context chip, and one visible receipt/media attachment or order cue if relevant.

## 11. Cards / Lists / Forms / Primary Content Sections

AI draft card should show draft label, confidence/status, source context chips, edit action, send action, and guardrail note when relevant. Customer summary should be compact.

## 12. Primary Action

Primary action is "Send draft" or "Review & send" on the AI draft card.

## 13. Secondary Actions

Edit draft, take over, create order, view customer profile, attach media/product/payment link, and open receipt/order detail.

## 14. Navigation Behavior

Detail route opened from Inbox or Today. Back returns to source. Create order opens Create Order. Customer link opens Customer Profile. No bottom tab bar required on the detail view.

## 15. Empty / Loading / Error State Notes

Loading uses message skeletons and draft placeholder. Empty message state shows customer context and a start note. Offline state allows cached reading but disables sending. Low-confidence drafts should show warning styling.

## 16. Asset Usage Instructions

Use simple chat, receipt, package, and user icons. Use `assets/images/success-reply-sent.png` only for later success modal reference, not as main screen art. Do not show real customer photos or long fake message text.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid tiny chat text, full-screen AI hype panels, robot icons, hidden edit/takeover controls, fake private PII, and any UI suggesting AI sends sensitive replies automatically.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/conversation-detail.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/conversation-detail.png`, `assets/images/`, and `constants/images.ts`.
