# Permission Denied Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/permission-denied.png`

Create a high-fidelity mobile app UI design for the Permission Denied screen.

## 1. Screen Name

Permission Denied.

## 2. Screen Purpose

Explain that a restricted staff role cannot perform a sensitive action and provide a safe way back or to ask an owner/admin.

## 3. User Goal

Understand why the action is locked and know what to do next.

## 4. App Context

Neo handles sensitive customer, payment, receipt, and AI approval actions. Client-side role gates are visual in V1, but sensitive production decisions require trusted authorization later.

## 5. Target User

Staff member, manager, or owner encountering a role-limited action in the MVP flow.

## 6. Visual Direction

Use the attached master UI style reference if provided. The screen should feel calm and respectful, not punitive.

## 7. UI Style Rules

Use a centered compact state block, lock/shield icon, readable explanation, soft white surface, sand border, and clear primary back/ask action.

## 8. Layout Structure

Compact header or modal top, centered permission message, allowed role/status details, primary action, secondary safe navigation.

## 9. Header Area

Back arrow or close icon, title "Access limited" or "Permission needed". No bottom tab required unless shown as a tab-contained empty state.

## 10. Main Content Area

Show a clear lock state explaining that owner or manager permission is required for actions such as confirming payments, approving sensitive AI actions, or changing safety rules.

## 11. Cards / Lists / Forms / Primary Content Sections

Use one calm message card with role badge, restricted action label, and what the user can still do, such as view cached info or return to inbox.

## 12. Primary Action

Primary action is "Ask owner/admin" or "Go back" depending on context.

## 13. Secondary Actions

Secondary actions include "Return to Today", "Open allowed view", or "Contact support" if appropriate.

## 14. Navigation Behavior

Focused screen or modal opened from a locked action. Closing returns to the previous screen without changing data.

## 15. Empty / Loading / Error State Notes

No loading state is normally needed. If role status is loading, use a small skeleton or spinner. Offline state should avoid permission changes and offer safe back navigation.

## 16. Asset Usage Instructions

Use `assets/images/error-permission-denied.png` if an illustration is useful. Otherwise use a simple rounded outline lock/shield icon. Do not show private customer or payment details.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid blameful copy, scary security graphics, dead-end screens, exposing hidden sensitive data, or suggesting client-only permissions are final production security.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/permission-denied.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/permission-denied.png`, `assets/images/`, and `constants/images.ts`.
