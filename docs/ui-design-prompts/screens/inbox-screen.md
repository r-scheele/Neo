# Inbox Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/inbox.png`

Create a high-fidelity mobile app UI design for the Inbox screen.

## 1. Screen Name

Inbox.

## 2. Screen Purpose

Let the seller scan, filter, and prioritize customer conversations.

## 3. User Goal

Find the right customer conversation quickly and open it for reply, AI draft review, or order capture.

## 4. App Context

Neo organizes messy WhatsApp selling conversations with labels, unread counts, AI status, assignment status, and safe review cues.

## 5. Target User

Owner, manager, or staff member handling customer WhatsApp conversations throughout the day.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the list practical, thumb-friendly, and calm while showing urgency clearly.

## 7. UI Style Rules

Use compact list rows, warm dividers, readable snippets, status badges with labels/icons, rounded outline icons, and bottom tab navigation. Avoid tiny gray text.

## 8. Layout Structure

Header, search/filter row, segmented tabs or chips, conversation list, stable bottom tab navigation.

## 9. Header Area

Title "Inbox", unread count badge, search icon or search field, filter icon. Optional connection status chip.

## 10. Main Content Area

Show conversation rows with customer name, latest message snippet, unread count, timestamp, AI draft/needs review status, order/payment label, and assignment indicator.

## 11. Cards / Lists / Forms / Primary Content Sections

Use rows rather than heavy cards. Group filters such as All, Mine, Unread, Needs review, Orders. Keep customer names and snippets wrapping/truncating safely.

## 12. Primary Action

Tap the highest-priority conversation row to open Conversation Detail.

## 13. Secondary Actions

Search, filter, mark read/archive if visually appropriate, and quick assignment status where safe.

## 14. Navigation Behavior

Main tab screen with bottom tabs: Today, Inbox active, Approvals, Follow-ups, Settings. Conversation rows open `Conversation Detail`.

## 15. Empty / Loading / Error State Notes

Loading uses conversation row skeletons. Empty state says no conversations yet and offers WhatsApp setup/test message. Error state shows retry. Offline state shows cached conversations read-only where needed.

## 16. Asset Usage Instructions

Use or reserve `assets/images/empty-inbox.png` or `assets/images/illustration-inbox-ai-draft.png` only for empty/first-time variants. Do not show private real customer photos or fake WhatsApp logo marks.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid desktop email inbox density, chat bubbles in the list, unreadable snippets, too many filters, fake customer PII, and green-only status design.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/inbox.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/inbox.png`, `assets/images/`, and `constants/images.ts`.
