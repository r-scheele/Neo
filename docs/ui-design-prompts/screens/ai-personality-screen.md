# AI Personality Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/ai-personality.png`

Create a high-fidelity mobile app UI design for the AI Personality screen.

## 1. Screen Name

AI Personality.

## 2. Screen Purpose

Let the user set Neo's reply tone, language style, reply length, ma/sir preference, and approval preferences.

## 3. User Goal

Tune AI draft replies so they sound like the business while keeping human approval for sensitive actions.

## 4. App Context

Neo is assist-first and approval-first for sensitive actions. AI drafts should help sellers respond faster without implying full autonomy.

## 5. Target User

Owner or manager responsible for customer communication tone and safety guardrails.

## 6. Visual Direction

Use the attached master UI style reference if provided. The screen should feel wise and human-first, not magical or robot-like.

## 7. UI Style Rules

Use segmented controls, chips, toggles, and short preview cards. Keep forms readable, with deep forest green selected states and warning copy for sensitive approval rules.

## 8. Layout Structure

Header, tone selector, language/local politeness controls, reply length selector, approval guardrail toggles, AI draft preview, bottom save button.

## 9. Header Area

Back arrow, title "AI personality", short subtitle about matching the business voice.

## 10. Main Content Area

Show tone options such as Warm, Professional, Direct, and Friendly; a ma/sir toggle; reply length chips; approval preference toggles for receipts, refunds, discounts, and complaints.

## 11. Cards / Lists / Forms / Primary Content Sections

Include a bordered AI draft preview card clearly labeled as a draft. Include a guardrail section with warning/status chips.

## 12. Primary Action

Deep forest green button labeled "Save AI rules".

## 13. Secondary Actions

Secondary action for "Preview reply" or "Back to checklist". Keep reset defaults as a low-priority text action if shown.

## 14. Navigation Behavior

No bottom tabs during setup. Saving returns to Setup Checklist or advances to Payment Rules.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton controls and preview placeholder. Error preserves selections. Offline state permits local edits but disables final save if necessary.

## 16. Asset Usage Instructions

Use simple rounded outline icons for tone, shield/guardrail, and message draft. Avoid robot heads, AI brains, sparkles, magic wands, or holograms.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid implying autonomous AI sending, overly technical prompt settings, flashy AI effects, long generated sample copy, and hidden approval controls.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/ai-personality.png`

## 22. Later Codex Implementation Reference

After generating this image, attach it to the Codex implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/ai-personality.png`, `assets/images/`, and `constants/images.ts`.
