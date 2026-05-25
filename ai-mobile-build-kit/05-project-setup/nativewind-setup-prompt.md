# NativeWind Setup Prompt

Copy, fill, and send this to a coding agent when setting up NativeWind.

```md
Anchor:
Read AGENTS.md first if it exists and follow it strictly.

Task:
Set up NativeWind for this Expo React Native TypeScript project.

Constraints:
- Keep changes focused on NativeWind setup.
- Do not install unrelated libraries.
- Do not change app features or visual design.
- Do not refactor existing screens.
- If required packages are missing, list the exact install command and wait for approval before assuming they are installed.
- Preserve existing routing and app entry files unless NativeWind setup requires a small documented change.

Reference:
- Current NativeWind documentation: [PASTE_DOCS_OR_LINK]
- Existing files: [LIST_FILES]
- Desired styling approach from AGENTS.md or visual direction: [SUMMARY]

Acceptance criteria:
- NativeWind configuration files are created or updated.
- TypeScript recognizes `className` usage where required.
- A minimal existing screen or test component can render NativeWind classes.
- No unrelated UI changes are made.
- Explain files changed and how to test.
```

## Done Looks Like

NativeWind is ready when a simple class such as `className="flex-1 bg-white"` affects the UI on device or simulator.
