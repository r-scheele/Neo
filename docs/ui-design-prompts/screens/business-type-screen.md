# Business Type Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/business-type.png`

Create a high-fidelity mobile app UI design for the Business Type screen.

## 1. Screen Name

Business Type.

## 2. Screen Purpose

Let the user select the business category so Neo can apply relevant setup defaults and language.

## 3. User Goal

Choose the category that best matches the business and continue setup.

## 4. App Context

Neo supports WhatsApp-first sellers across fashion, tailoring, food, logistics, real estate, beauty/hair, service bookings, and other SME workflows.

## 5. Target User

Owner or manager configuring the business for more accurate AI drafts, payment rules, delivery expectations, and product setup.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep category selection polished, scannable, and professional with simple icon tiles.

## 7. UI Style Rules

Use a warm ivory background, soft white category rows or compact tiles, 8px radius, sand border, forest green selected state, and rounded outline category icons.

## 8. Layout Structure

Header, brief instruction, selectable category list/grid, optional "Other" field or tile, bottom continue button.

## 9. Header Area

Back arrow, title "Business type", setup progress chip, and short practical subtitle.

## 10. Main Content Area

Show business type options: Fashion, Tailor, Food, Logistics, Real Estate, Beauty/Hair, Services, Other. Selected option should be obvious.

## 11. Cards / Lists / Forms / Primary Content Sections

Use touch-friendly rows or two-column compact tiles with icon, label, and optional one-line hint. Keep minimum touch target 44px.

## 12. Primary Action

Deep forest green button labeled "Choose type" or "Continue".

## 13. Secondary Actions

Text action "Back to checklist". Optional small helper link for "Not sure?".

## 14. Navigation Behavior

No bottom tabs. Saving returns to Setup Checklist or advances to the next setup task.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton category rows. Error state preserves selection and shows a calm retry. Long content must scroll without hiding the primary action.

## 16. Asset Usage Instructions

Use simple business category icons from Neo's rounded outline style. Do not use detailed photos, country flags, stereotypes, or fake marketplace imagery.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid playful quiz styling, too many categories, tiny icons, neon selected states, and crowded chips that are hard to tap.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/business-type.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/business-type.png`, `assets/images/`, and `constants/images.ts`.
