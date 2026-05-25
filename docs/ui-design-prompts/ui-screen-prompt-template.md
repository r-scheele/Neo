# UI Screen Prompt Template

Use this template when adding future screen prompts. Replace every bracketed placeholder before generating an image.

```md
# [SCREEN_NAME] Screen UI Design Prompt

IMAGE GENERATION REQUEST:
Generate this screen now as a single high-fidelity mobile app UI mockup. Do not write app code. Do not explain the design. Create only the image described in this prompt.

Use the attached master UI style reference if provided:
design-assets/ui-screens/master-ui-style-reference.png

If no reference image is attached, follow the Neo visual system described below.

Save generated image as:
design-assets/ui-screens/[SCREEN_FILE_NAME].png

Create a high-fidelity mobile app UI design for the [SCREEN_NAME] screen.

App:
Neo

App context:
[ONE_LINE_DESCRIPTION]

Target user:
[TARGET_USER]

Screen purpose:
[SCREEN_PURPOSE]

User goal:
[USER_GOAL]

Visual style:
[VISUAL_DIRECTION]

Use the attached master UI style reference if provided.
Match its color palette, spacing, typography hierarchy, border radius, shadows, card style, icon style, and overall mood.

UI style rules:
- Warm ivory app background.
- Soft white cards with sand borders and 8px radius.
- Deep forest green primary actions.
- Humanist, readable, professional typography.
- Rounded outline icons with medium stroke.
- Status badges with labels/icons, never color alone.
- Calm, premium, trustworthy, warmly practical mood.

Layout requirements:
- [HEADER REQUIREMENTS]
- [MAIN CONTENT REQUIREMENTS]
- [CARDS / LISTS / FORMS / PRIMARY CONTENT REQUIREMENTS]
- [PRIMARY ACTION REQUIREMENTS]
- [SECONDARY ACTION REQUIREMENTS]
- [NAVIGATION REQUIREMENTS]
- [STATE REQUIREMENTS]

Content guidance:
- Use realistic but simple UI text.
- Avoid tiny unreadable paragraphs.
- Use clear readable UI labels where possible.
- Prioritize clear layout and component hierarchy.
- Exact final text will be implemented in code.

Assets:
- Use or reserve space for [ASSET_NAMES] where relevant.
- Do not invent unrelated mascots, photos, fake partner logos, or icons.
- Keep illustration/icon treatment consistent with the visual style.

Mobile dimensions guidance:
- Single full-screen mobile app UI mockup.
- Portrait aspect ratio, around 390x844 or 430x932.
- No phone frame.
- No browser frame.
- No desktop layout.
- Clean app screenshot style.

Avoid:
- Random gradients.
- Inconsistent colors.
- Overcrowded layout.
- Fake unreadable UI.
- Different style from other screens.
- Extra features not in the MVP.
- Any implication that AI replaces human approval or receipt screenshots auto-confirm payments.

Output requirements:
- Single full-screen mobile app UI mockup.
- Portrait aspect ratio, around 390x844 or 430x932.
- No phone frame.
- No browser frame.
- No desktop layout.
- Clean app screenshot style.
- Production-ready mobile UI.
- High visual clarity.

Save generated image as:
design-assets/ui-screens/[SCREEN_FILE_NAME].png

Later Codex implementation reference:
After this image is generated, attach it to a Codex implementation prompt and ask Codex to implement the screen exactly. Codex should use:
- AGENTS.md
- docs/ui-style-guide.md
- docs/visual-direction.md
- docs/ui-design-prompts/screens/[SCREEN_PROMPT_FILE].md
- design-assets/ui-screens/[SCREEN_FILE_NAME].png
- assets/images/
- constants/images.ts
```
