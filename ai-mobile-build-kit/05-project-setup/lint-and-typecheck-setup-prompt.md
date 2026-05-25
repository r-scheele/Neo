# Lint And Typecheck Setup Prompt

Copy, fill, and send this to a coding agent when adding quality commands.

```md
Anchor:
Read AGENTS.md first if it exists and follow it strictly.

Task:
Set up lint and TypeScript typecheck commands for this Expo project.

Constraints:
- Keep changes focused on quality tooling.
- Do not change app behavior.
- Do not refactor existing files unless required to make the initial checks pass, and ask before doing broad fixes.
- Do not install unrelated libraries.
- If a package is required, list the exact install command and wait for approval.

Reference:
- Existing `package.json`.
- Existing TypeScript config.
- Expo documentation: [PASTE_DOCS_OR_LINK]

Acceptance criteria:
- `npm run lint` or equivalent exists.
- `npm run typecheck` or equivalent exists.
- Commands are documented in AGENTS.md or setup notes.
- Initial command output is reported.
- Explain files changed and how to run checks.
```

## Done Looks Like

Quality setup is done when every feature can end with lint and typecheck verification.
