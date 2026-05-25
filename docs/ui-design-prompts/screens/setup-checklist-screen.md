# Setup Checklist Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/setup-checklist.png`

Create a high-fidelity mobile app UI design for the Setup Checklist screen.

## 1. Screen Name

Setup Checklist.

## 2. Screen Purpose

Help a new business complete the minimum setup Neo needs before AI assistance can be safe and useful.

## 3. User Goal

See setup progress, understand the next required step, and open the next setup task.

## 4. App Context

Neo cannot safely draft replies or make recommendations without business profile, business type, WhatsApp status, AI tone, payment rules, delivery zones, and product basics.

## 5. Target User

First-time Nigerian SME owner or manager setting up Neo for daily WhatsApp commerce work.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the setup flow calm, structured, encouraging, and operational rather than playful onboarding.

## 7. UI Style Rules

Use medium-density cards, clear progress, status chips, 8px radius, soft white surfaces, sand borders, and deep forest green action states. Do not use a giant marketing hero.

## 8. Layout Structure

Compact header, progress summary, next step card, checklist of setup tasks, bottom primary action. Allow vertical scrolling with progress visible near the top.

## 9. Header Area

Title "Setup Neo" or similar, small subtitle about getting ready to reply safely, optional connected/account chip.

## 10. Main Content Area

Show a progress indicator such as "3 of 7 done", then a highlighted next required task. Below it, show checklist rows for profile, type, WhatsApp, AI personality, payment rules, delivery zones, and products.

## 11. Cards / Lists / Forms / Primary Content Sections

Checklist rows should include icon, task title, short status, and right chevron/status badge. Completed rows use success state, current row uses primary or warning accent, locked/optional rows remain muted.

## 12. Primary Action

Deep forest green button labeled "Continue setup" or "Open next task".

## 13. Secondary Actions

Secondary text action for "Finish later" only if the visual hierarchy remains clear. Small help link for setup questions is acceptable.

## 14. Navigation Behavior

No bottom tabs during required setup. Rows open individual setup task screens. Completing all required steps leads to Today Command Center.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton checklist rows. Error state shows "Could not load setup status" with retry. Offline state shows cached progress and disables WhatsApp connection tests. Permission-limited staff cannot change owner setup.

## 16. Asset Usage Instructions

Use or reserve a small area for `assets/images/illustration-setup-checklist.png` in first-time or top summary context. Do not overuse illustration in the checklist.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid showing all future modules, progress gamification, confetti, oversized cards, nested cards, tiny setup explanations, and a desktop task table.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/setup-checklist.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/setup-checklist.png`, `assets/images/`, and `constants/images.ts`.
