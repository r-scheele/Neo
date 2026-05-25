# App Store Screenshot Prompt

Use after real screens exist. Store screenshots should usually be composed from actual app screenshots, not imagined UI.

```md
Create app store screenshot artwork for [APP_NAME] using the provided real app screenshots.

App context:
[APP_NAME] is a [TYPE_OF_APP] for [TARGET_USER] that helps them [CORE_OUTCOME].

Screenshots provided:
- `[SCREENSHOT_1_DESCRIPTION]`
- `[SCREENSHOT_2_DESCRIPTION]`
- `[SCREENSHOT_3_DESCRIPTION]`

Visual direction:
[APPROVED_VISUAL_DIRECTION]

Requirements:
- Use the real app screenshots as the central content.
- Do not alter the UI inside screenshots except for safe cropping or device framing.
- Add background, device frame, and supporting visual elements consistent with the style anchor.
- Keep composition readable at store preview size.
- Use text only if requested and provided exactly.
- Respect App Store and Google Play screenshot rules.

Avoid:
- No fake app UI.
- No inaccurate feature claims.
- No tiny unreadable text.
- No competitor references.
- No cluttered backgrounds.

Output:
Platform-specific screenshot layouts for [iPhone/Android/tablet] sizes: [LIST_REQUIRED_SIZES].

Acceptance check:
Screenshots should honestly show the app, communicate value quickly, and remain readable in the store gallery.
```
