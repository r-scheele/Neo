# Register / Sign In Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/register-sign-in.png`

Create a high-fidelity mobile app UI design for the Register / Sign In screen.

## 1. Screen Name

Register / Sign In.

## 2. Screen Purpose

Identify an owner or staff user before showing protected business data.

## 3. User Goal

Enter an email or phone number, continue securely, and understand that account access protects chats, orders, receipts, and settings.

## 4. App Context

Neo handles private customer conversations, order context, receipt review, staff access, and payment-sensitive actions, so authentication is required for the real MVP.

## 5. Target User

Nigerian business owners, managers, or trusted staff members who need secure mobile access to Neo.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the screen calm, premium, trustworthy, and business-serious, with warm ivory background and deep forest green primary action.

## 7. UI Style Rules

Use soft white form surfaces with sand borders, 8px radius inputs/buttons, readable labels, short helper text, and no dark login panel. Avoid making auth feel like a fintech dashboard.

## 8. Layout Structure

Compact brand header, centered title/subtitle, simple credential form, primary continue button, alternate auth method row if needed, terms/privacy microcopy near bottom.

## 9. Header Area

Small Neo brand mark at top with a back arrow only if coming from Welcome. Keep the title compact.

## 10. Main Content Area

Use a focused form layout with one primary input for email or phone number, a secondary method toggle or segmented control only if visually needed, and a short security reassurance.

## 11. Cards / Lists / Forms / Primary Content Sections

Include one form field with label, placeholder, helper copy, and a possible OTP-style continuation hint. Use clean spacing and stable input height.

## 12. Primary Action

Deep forest green full-width button labeled "Continue" or "Send code".

## 13. Secondary Actions

Subtle text action to switch between sign in and create account, plus a small "Need help?" link if space allows.

## 14. Navigation Behavior

No bottom tabs. Successful auth leads to Setup Checklist if setup is incomplete or Today Command Center if setup is complete.

## 15. Empty / Loading / Error State Notes

Show button loading by preserving button width and adding a small spinner. Error state should be inline below the field with specific calm copy. Session expired copy may appear as a small warning chip.

## 16. Asset Usage Instructions

Use the logo mark only. Do not use customer photos, fake provider logos, fake WhatsApp logos, or illustrations that distract from secure sign-in.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid social login clutter, dark glass panels, overly playful auth copy, fake provider badges, tiny legal text blocks, and desktop-style split panels.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/register-sign-in.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/register-sign-in.png`, `assets/images/`, and `constants/images.ts`.
