# WhatsApp Setup Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
`design-assets/ui-screens/master-ui-style-reference.png`

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
`design-assets/ui-screens/whatsapp-setup.png`

Create a high-fidelity mobile app UI design for the WhatsApp Setup screen.

## 1. Screen Name

WhatsApp Setup.

## 2. Screen Purpose

Show WhatsApp Business connection or validation status and help the user test the message source.

## 3. User Goal

Confirm whether WhatsApp is connected, see the linked phone number/status, and tap connect or test.

## 4. App Context

Customer conversations are the core Neo workflow, but real WhatsApp sync and webhooks require a future backend boundary. This MVP screen can represent connection state safely.

## 5. Target User

Owner or manager setting up the WhatsApp-first commerce workflow.

## 6. Visual Direction

Use the attached master UI style reference if provided. Keep the screen trustworthy and practical. Status must be clear without imitating WhatsApp branding.

## 7. UI Style Rules

Use Neo colors, not WhatsApp green as the dominant palette. Use status chips with icons/labels, bordered setup cards, and 8px radius controls.

## 8. Layout Structure

Header, connection status card, phone/source details, setup checklist steps, test connection action, help/warning note.

## 9. Header Area

Back arrow, title "WhatsApp setup", setup progress chip, optional small connection badge.

## 10. Main Content Area

Show a prominent card with connected/disconnected/pending status, linked number placeholder, last checked time, and what Neo can currently do.

## 11. Cards / Lists / Forms / Primary Content Sections

Include rows for "Business number", "Message source", "Test message", and "Connection health". Use success, warning, or error badges with labels.

## 12. Primary Action

Deep forest green button labeled "Connect WhatsApp" or "Test connection" depending on state.

## 13. Secondary Actions

Secondary outline action for "Enter number manually" or "Troubleshoot". Text action back to checklist.

## 14. Navigation Behavior

No bottom tabs during setup. Successful connection/test returns to Setup Checklist or advances to AI Personality.

## 15. Empty / Loading / Error State Notes

Loading uses skeleton status rows. Disconnected error uses calm red status and retry. Offline state shows cached status and disables connection tests.

## 16. Asset Usage Instructions

Use rounded outline message/phone/status icons only. Do not copy the WhatsApp logo, use fake partner marks, or show private chat content.

## 17. Text / Copy Guidance

Use clear readable UI labels where possible. Avoid tiny paragraphs. Use realistic short text blocks and labels. Exact final copy will be implemented in code, so prioritize layout accuracy, hierarchy, and component structure over perfect text rendering.

## 18. Mobile Dimensions Guidance

Single full-screen mobile app UI mockup, portrait aspect ratio around 390x844 or 430x932, no phone frame, no browser frame, no desktop layout.

## 19. What To Avoid

Avoid fake live integration details, official WhatsApp branding imitation, complex webhook settings, QR-heavy desktop setup, and tiny provider error text.

## 20. Output Requirements

Create one clean production-ready mobile app screenshot-style mockup with high visual clarity, consistent Neo palette, consistent typography hierarchy, and no external device frame.

## 21. File Name To Save The Generated Image As

`design-assets/ui-screens/whatsapp-setup.png`

## 22. Later Implementation Reference

After generating this image, attach it to the implementation prompt with `AGENTS.md`, `docs/ui-style-guide.md`, `docs/visual-direction.md`, this prompt file, `design-assets/ui-screens/whatsapp-setup.png`, `assets/images/`, and `constants/images.ts`.
