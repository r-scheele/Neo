# Mascot Generation Prompt

Use only if a mascot supports the product. Do not add a mascot to a serious workflow app unless it improves clarity or warmth.

```md
Create the primary mascot for [APP_NAME].

App context:
[APP_NAME] is a [TYPE_OF_APP] for [TARGET_USER] that helps them [CORE_OUTCOME].

Style reference:
Use the approved style anchor for palette, lighting, proportions, line weight, and material style.

Mascot concept:
[SPECIES_OR_OBJECT], with [PERSONALITY], [ACCESSORY_DETAILS], and [BODY_PROPORTIONS].

Requirements:
- Friendly but not childish unless the app is for children.
- Clear full-body silhouette.
- Expressive face.
- Simple enough to reuse in empty, success, and error states.
- No text.
- Transparent background if possible.
- Leave comfortable padding around the mascot.
- Use the approved palette.

Avoid:
- No inconsistent extra limbs or distorted anatomy.
- No busy backgrounds.
- No realistic fur, skin, or texture unless that is part of the approved style.
- No brand logos.
- No props that will not make sense across app states.

Output:
High-resolution square image, transparent background if possible.

Acceptance check:
The mascot should be reusable as a character reference for multiple states and should still read clearly at small mobile sizes.
```
