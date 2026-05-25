# Product Basics Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/product-basics.png`

Create a high-fidelity mobile app UI design for the Product Basics screen.

## 1. Screen Name

Product Basics.

## 2. Screen Purpose

Let the user add starter products, prices, and variants so Neo can draft accurate replies and help capture orders.

## 3. User Goal

Add the first few products or review starter product rows, then save product basics.

## 4. App Context

Product basics give Neo reliable product context for conversation replies and order capture before full catalog sync exists.

## 5. Target User

Owner or staff member entering a small starter catalog for a WhatsApp-first SME.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep product setup efficient, clean, and not like a full inventory dashboard.

## 7. UI Style Rules

Use compact product rows, clear prices, 8px input/card radius, tabular numbers, subtle dividers, and forest green add/save actions.

## 8. Layout Structure

Header, add product form or action card, starter product list, optional empty state, bottom save action.

## 9. Header Area

Back arrow, title "Product basics", setup progress chip, short subtitle about helping Neo answer accurately.

## 10. Main Content Area

Show input fields for product name, price, optional variant, and a list of existing products with edit/delete icon actions.

## 11. Cards / Lists / Forms / Primary Content Sections

Product rows should show item name, price, variant/status chip, and concise metadata. Empty state can use `empty-products.png` style with a direct add action.

## 12. Primary Action

Deep forest green button labeled "Add product" or "Save products".

## 13. Secondary Actions

Secondary action for "Back to checklist"; small icon actions for edit/delete; optional "Skip for now" low priority if allowed.

## 14. Navigation Behavior

No bottom tabs during setup. Saving returns to Setup Checklist or completes setup when all required tasks are done.

## 15. Empty / Loading / Error State Notes

Empty state says no products added yet and prompts first product. Loading uses skeleton rows. Error preserves form values and shows retry. Long product names wrap or truncate gracefully.

## 16. Asset Usage Instructions

Use or reserve space for `assets/images/empty-products.png` only in empty-state version. Use simple package/tag icons. Do not use product photos unless explicitly provided later.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid full inventory management, stock charts, barcode features, tiny price text, photo-heavy catalog grids, and future WhatsApp catalog sync UI.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/product-basics.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/product-basics.png`, `assets/images/`, and `constants/images.ts`.
