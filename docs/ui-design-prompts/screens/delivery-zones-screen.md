# Delivery Zones Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/delivery-zones.png`

Create a high-fidelity mobile app UI design for the Delivery Zones screen.

## 1. Screen Name

Delivery Zones.

## 2. Screen Purpose

Let the user add common delivery locations and fees so replies and orders can include accurate delivery expectations.

## 3. User Goal

Add or review common zones, fees, and notes, then save delivery defaults.

## 4. App Context

Neo helps WhatsApp sellers avoid vague delivery promises by using configured zones and fees during AI drafts and order capture.

## 5. Target User

Owner or staff member setting up local delivery expectations for customers.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the screen practical, organized, and easy to scan.

## 7. UI Style Rules

Use list rows with clear fees, 8px radius inputs, sand dividers, muted badges, and tabular numbers for prices. Avoid map-heavy UI.

## 8. Layout Structure

Header, quick add form or add zone card, list of delivery zones, notes section, bottom save/add action.

## 9. Header Area

Back arrow, title "Delivery zones", setup progress chip, short subtitle about common locations and fees.

## 10. Main Content Area

Show an add zone form with location name, fee, optional note, and a compact list of existing zones such as Lekki, Yaba, Ikeja, Abuja, or custom examples.

## 11. Cards / Lists / Forms / Primary Content Sections

Use rows with location, fee, delivery note, edit/delete icon buttons, and status such as active/default. Keep row heights stable.

## 12. Primary Action

Deep forest green button labeled "Add zone" or "Save zones".

## 13. Secondary Actions

Secondary action for "Back to checklist"; small icon buttons for edit/remove rows.

## 14. Navigation Behavior

No bottom tabs during setup. Saving returns to Setup Checklist or advances to Product Basics.

## 15. Empty / Loading / Error State Notes

Empty state prompts the user to add the first delivery zone. Loading uses skeleton rows. Offline state permits local draft view but disables final save if needed.

## 16. Asset Usage Instructions

Use simple location pin, package, and currency icons. Do not use detailed map screenshots, real addresses, or logistics provider logos.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid map-first layouts, desktop tables, hidden fee inputs, tiny currency text, too many zones on screen, and decorative delivery scenes.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/delivery-zones.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/delivery-zones.png`, `assets/images/`, and `constants/images.ts`.
