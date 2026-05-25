# Screen Illustration Prompt

Use for feature-specific illustrations inside screens.

```md
Create a screen illustration for [SCREEN_NAME] in [APP_NAME].

App context:
[APP_NAME] is a [TYPE_OF_APP] for [TARGET_USER] that helps them [CORE_OUTCOME].

Screen context:
This illustration appears on [SCREEN_NAME], where the user is trying to [USER_GOAL].

Style reference:
Use the approved style anchor. If a mascot is provided, keep the same identity, proportions, colors, face style, and accessory details.

Illustration concept:
[DESCRIBE_THE_VISUAL_METAPHOR_OR_SCENE]

Requirements:
- Fits inside a mobile screen without dominating the primary action.
- No text.
- Transparent background if possible.
- Uses the approved color palette.
- Consistent line weight and lighting.
- Clear at small sizes.
- Does not imply functionality that the app does not have.

Avoid:
- No fake controls that look tappable.
- No complex background scenes.
- No inconsistent mascot details.
- No extra visual metaphors unrelated to the screen task.

Output:
High-resolution image suitable for `assets/images/[FILE_NAME].png`.

Acceptance check:
The illustration should support the screen goal and not distract from the primary action.
```
