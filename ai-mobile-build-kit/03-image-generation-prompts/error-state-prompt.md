# Error State Prompt

Use for recoverable error states such as network failures, failed saves, or unavailable content.

```md
Create an error-state illustration for [ERROR_CONTEXT] in [APP_NAME].

App context:
[APP_NAME] is a [TYPE_OF_APP] for [TARGET_USER] that helps them [CORE_OUTCOME].

Error context:
The user sees this when [WHAT_FAILED]. The app should help them [RECOVERY_ACTION].

Style reference:
Use the approved style anchor. If using a mascot, keep the same mascot identity, proportions, colors, face style, and accessory details. Change only the expression and pose.

Concept:
[VISUAL_CONCEPT_THAT_IS_HELPFUL_NOT_ALARMING]

Requirements:
- Clear and calm.
- No text.
- Transparent background if possible.
- Uses error color subtly, not aggressively.
- Works with retry copy and a button in the app UI.
- Does not blame the user.
- Consistent with the app's visual system.

Avoid:
- No scary warning imagery unless the app is safety-critical.
- No broken device clichés if they feel generic.
- No fake text or fake buttons.
- No overly detailed background.

Output:
High-resolution image named `[error-state-file-name].png`.

Acceptance check:
The image should make the error understandable and recoverable.
```
