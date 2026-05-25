# Follow-ups Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/follow-ups.png`

Create a high-fidelity mobile app UI design for the Follow-ups screen.

## 1. Screen Name

Follow-ups.

## 2. Screen Purpose

Help sellers recover unpaid orders and silent leads with respectful suggested follow-up messages.

## 3. User Goal

See due or overdue follow-ups, review/edit the suggested message, send it, or mark it done.

## 4. App Context

Neo helps sellers avoid forgetting interested customers while keeping follow-ups polite, local-aware, and not spammy.

## 5. Target User

Owner or staff member responsible for recovering leads, unpaid orders, and quiet customer conversations.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the screen encouraging, organized, and respectful.

## 7. UI Style Rules

Use due/overdue status badges, compact follow-up cards, clear message preview, deep forest green send actions, and bottom tab navigation.

## 8. Layout Structure

Header, filter chips, follow-up queue cards, suggested message preview/action area, bottom tab navigation.

## 9. Header Area

Title "Follow-ups", count badge, filter icon, optional tabs for Due, Overdue, Suggested, Done.

## 10. Main Content Area

Show follow-up cards with customer placeholder, reason, linked order/conversation, due time, suggested message snippet, and next action.

## 11. Cards / Lists / Forms / Primary Content Sections

Each card includes status chip, reason, message preview, edit icon, send button, and mark done action. Long suggested messages should expand without breaking layout.

## 12. Primary Action

Primary action is "Send follow-up" on the highest-priority due card.

## 13. Secondary Actions

Edit message, mark done, reschedule, open conversation, open order, filter queue.

## 14. Navigation Behavior

Main tab screen with bottom tabs: Today, Inbox, Approvals, Follow-ups active, Settings. Cards open Conversation Detail or Order Detail.

## 15. Empty / Loading / Error State Notes

Loading uses follow-up card skeletons. Empty state says no follow-ups due and can use a calm illustration. Offline state shows cached follow-ups but disables sending. Permission-limited staff may be unable to send templates.

## 16. Asset Usage Instructions

Use `assets/images/empty-follow-ups.png`, `assets/images/illustration-follow-up-recovery.png`, or `assets/images/success-follow-up-sent.png` only for relevant states. Use rounded outline clock, message, and check icons.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid spammy campaign UI, broadcast marketing tools, aggressive urgency styling, tiny message previews, future template management, and confetti success visuals.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/follow-ups.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/follow-ups.png`, `assets/images/`, and `constants/images.ts`.
