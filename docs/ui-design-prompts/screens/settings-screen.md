# Settings Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/settings.png`

Create a high-fidelity mobile app UI design for the Settings screen.

## 1. Screen Name

Settings.

## 2. Screen Purpose

Let users manage business settings, safety rules, connection status, AI tone, payment rules, delivery defaults, and account actions.

## 3. User Goal

Review current configuration and open the setting that needs adjustment.

## 4. App Context

Neo settings keep the seller in control of AI behavior, payment safety, delivery expectations, business profile, and staff access.

## 5. Target User

Owner, manager, or staff member with role-dependent access to business and safety settings.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the screen quiet, organized, and clear enough for repeated operational use.

## 7. UI Style Rules

Use grouped settings rows, icons, status chips, sand dividers, 8px surfaces, and bottom tab navigation. Lock role-restricted items visibly but calmly.

## 8. Layout Structure

Header, business/account summary, grouped settings list, connection/safety status, sign-out area, bottom tab navigation.

## 9. Header Area

Title "Settings", account/business chip, optional profile/avatar initials. Keep actions compact.

## 10. Main Content Area

Show groups: Business profile, WhatsApp connection, AI personality, Payment rules, Delivery zones, Products, Team/permissions, Notifications, Privacy/security, Sign out.

## 11. Cards / Lists / Forms / Primary Content Sections

Use list rows with icon, label, short current value/status, chevron, and lock icon where restricted. Include connection and guardrail status badges.

## 12. Primary Action

Primary action is opening a selected settings row. If a specific settings edit is shown, use "Save setting".

## 13. Secondary Actions

Sign out, ask owner/admin, help, retry connection status, view setup checklist if incomplete.

## 14. Navigation Behavior

Main tab screen with bottom tabs: Today, Inbox, Approvals, Follow-ups, Settings active. Rows open setup/edit screens or focused modals.

## 15. Empty / Loading / Error State Notes

Loading uses settings row skeletons. Missing settings show recommended defaults. Offline state shows cached settings and disables save. Permission-denied rows show locked state with explanation.

## 16. Asset Usage Instructions

Use rounded outline icons for business, message, shield, receipt, delivery, products, team, bell, lock, and log out. Do not use decorative illustrations unless an empty/error state requires one.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid dumping every future module, desktop admin console settings, tiny legal copy, hidden safety controls, and destructive sign-out/remove actions as primary visual elements.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/settings.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/settings.png`, `assets/images/`, and `constants/images.ts`.
