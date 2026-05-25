# AI Approval Queue Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/ai-approval-queue.png`

Create a high-fidelity mobile app UI design for the AI Approval Queue screen.

## 1. Screen Name

AI Approval Queue.

## 2. Screen Purpose

Let owners or managers review sensitive AI actions before they are approved, edited, or rejected.

## 3. User Goal

Scan pending approvals, understand the risk and recommendation, then approve, edit, reject, or open details.

## 4. App Context

Neo is assist-first and approval-first for receipts, complaints, refunds, discounts, large orders, and low-confidence replies.

## 5. Target User

Owner or manager responsible for sensitive customer, payment, and AI decisions.

## 6. Visual Direction

Use the attached master UI style reference if provided. The screen should feel safe, deliberate, and operationally dense without being stressful.

## 7. UI Style Rules

Use approval cards with risk reason, AI recommendation, source context, confidence/status badge, and distinct decision buttons. Avoid flashy AI treatment.

## 8. Layout Structure

Header, filter chips, approval queue list, individual approval cards, bottom tab navigation.

## 9. Header Area

Title "Approvals", count badge, filter/search controls, optional safety rule link.

## 10. Main Content Area

Show approval cards for receipt review, complaint reply, refund request, discount request, or low-confidence draft. Sort by payment, complaint, and low confidence risk.

## 11. Cards / Lists / Forms / Primary Content Sections

Each card should show customer/order context, risk label, AI suggestion summary, confidence badge, source chip, and decision button row.

## 12. Primary Action

Primary action on each card is state-specific: "Review", "Approve", or "Edit first". Use deep forest green only when the action is safe.

## 13. Secondary Actions

Reject, ask customer, escalate, open conversation, open receipt detail, filter approvals.

## 14. Navigation Behavior

Main tab screen with bottom tabs: Today, Inbox, Approvals active, Follow-ups, Settings. Cards open Receipt Review, Conversation Detail, or focused decision modal.

## 15. Empty / Loading / Error State Notes

Loading uses approval card skeletons. Empty state says no approvals waiting and can show safety rules link. Offline state shows cached approvals but disables decisions. Permission denied shows owner/manager requirement.

## 16. Asset Usage Instructions

Use `assets/images/empty-approvals.png` only for empty-state variant. Use shield, receipt, message, warning, and check icons in Neo rounded outline style.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid robot/AI magic visuals, one-tap risky confirmations, hidden risk reasons, unreadable summaries, generic task-manager UI, and green-only statuses.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/ai-approval-queue.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/ai-approval-queue.png`, `assets/images/`, and `constants/images.ts`.
