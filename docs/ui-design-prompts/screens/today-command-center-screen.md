# Today Command Center Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/today-command-center.png`

Create a high-fidelity mobile app UI design for the Today Command Center screen.

## 1. Screen Name

Today Command Center.

## 2. Screen Purpose

Give returning users one calm daily home showing urgent operational work across chats, receipts, orders, follow-ups, and AI recommendations.

## 3. User Goal

Scan what needs attention now and open the highest-priority item.

## 4. App Context

Neo helps WhatsApp-first sellers review, reply, capture, verify, and follow up from one mobile command center without feeling like a compressed desktop dashboard.

## 5. Target User

Busy Nigerian SME owner, manager, or trusted staff member checking daily commerce work on mobile.

## 6. Visual Direction

Use the attached master UI style reference if provided. The screen should feel calm, premium, dense enough for operations, and easy to scan under pressure.

## 7. UI Style Rules

Use warm ivory background, compact screen title, border-first queue cards, status chips, tabular numbers, and bottom tab navigation. Do not use a generic analytics dashboard style.

## 8. Layout Structure

Header with greeting and connection status, compact metrics/summary row, priority queue sections, AI recommendation card, stable bottom tab navigation.

## 9. Header Area

Title such as "Today", short greeting, last synced/WhatsApp status chip, notification or refresh icon. Keep the header compact.

## 10. Main Content Area

Show urgent cards for pending receipts, unread or urgent chats, unpaid orders, due follow-ups, and one AI recommendation. Sort by risk and action urgency.

## 11. Cards / Lists / Forms / Primary Content Sections

Use scannable queue cards with icon, title, count or amount, status badge, short reason, and clear next action. Include a small all-clear/empty-state hint only if it fits.

## 12. Primary Action

Primary action should be opening the top urgent item, such as "Review receipt" or "Open urgent chat".

## 13. Secondary Actions

Secondary actions include "View inbox", "See follow-ups", refresh, and collapse/expand queue groups.

## 14. Navigation Behavior

Main tab screen with bottom tabs: Today active, Inbox, Approvals, Follow-ups, Settings. Queue cards open detail routes or focused review screens.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton cards. Empty state says no urgent work right now and offers a test inbox action. Offline state shows last synced time and disables risky actions. Permission-limited cards are hidden or locked.

## 16. Asset Usage Instructions

Use `assets/images/illustration-today-command-center.png` only for an empty or first-time state, not in a dense returning-user dashboard. Use rounded outline icons for receipts, messages, orders, and follow-ups.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid desktop widgets, revenue-heavy analytics, too many charts, nested cards, hero illustrations in returning mode, green-only styling, and generic CRM dashboard patterns.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/today-command-center.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/today-command-center.png`, `assets/images/`, and `constants/images.ts`.
