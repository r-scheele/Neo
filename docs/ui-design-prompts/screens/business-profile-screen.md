# Business Profile Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/business-profile.png`

Create a high-fidelity mobile app UI design for the Business Profile screen.

## 1. Screen Name

Business Profile.

## 2. Screen Purpose

Capture the business identity Neo uses for customer-facing context and setup defaults.

## 3. User Goal

Enter business name, category hint, city/location, and contact phone, then save the profile.

## 4. App Context

Business profile data helps Neo localize replies and organize operations without exposing private customer content on logged-out routes.

## 5. Target User

Owner or manager setting up a Nigerian SME that sells primarily through WhatsApp.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the form calm, trustworthy, and practical, with clear fields and enough spacing for mobile typing.

## 7. UI Style Rules

Use soft white input surfaces, sand borders, 8px radius, short helper text, and a sticky or bottom-positioned primary save action. Avoid tiny form labels.

## 8. Layout Structure

Setup header with progress context, form section, optional business preview card, primary save button near bottom.

## 9. Header Area

Back arrow to Setup Checklist, compact title "Business profile", short subtitle such as "Tell Neo who you are replying for."

## 10. Main Content Area

Show fields for business name, business category label, city/area, business phone, and optional WhatsApp display name preview.

## 11. Cards / Lists / Forms / Primary Content Sections

Use a single form section with stacked fields. Include one small preview block showing how the business name may appear in AI context.

## 12. Primary Action

Deep forest green full-width button labeled "Save profile".

## 13. Secondary Actions

Secondary outline or text action for "Back to checklist". Keep skip optional and visually low priority if shown.

## 14. Navigation Behavior

No bottom tabs. Saving returns to Setup Checklist and marks Business Profile complete.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton form rows. Error state preserves entered values and shows inline field errors. Offline state can allow draft editing but disables final save.

## 16. Asset Usage Instructions

Use only simple rounded outline icons for business, location, and phone if helpful. Do not add photos, map screenshots, or fake official business documents.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid long onboarding explanations, crowded multi-column forms, fake legal verification badges, tiny helper text, and decorative illustrations that push the form below the fold.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/business-profile.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/business-profile.png`, `assets/images/`, and `constants/images.ts`.
