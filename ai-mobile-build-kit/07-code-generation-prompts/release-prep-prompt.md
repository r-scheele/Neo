# Release Prep Prompt

Use this near the end of a release cycle. It should inspect and prepare, not rebuild the app.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Prepare [APP_NAME] for [TESTFLIGHT / INTERNAL_TESTING / APP_STORE / GOOGLE_PLAY] release.

Release scope:
[WHAT_IS_INCLUDED_IN_THIS_RELEASE]

Requirements:
- Check versioning.
- Check environment variables.
- Check app icons, splash, and store assets.
- Check permissions.
- Check analytics events.
- Check privacy/security issues.
- Check production build readiness.
- Identify release blockers.

Constraints:
- Do not implement new product features.
- Do not redesign UI.
- Do not add dependencies.
- Do not change secrets.
- Do not run destructive commands.
- Do not submit to stores unless explicitly requested.

Reference:
- Release checklist: [PASTE_OR_LINK]
- EAS docs: [PASTE_DOCS_OR_LINK]
- App config files: [FILES]
- Store requirements: [LINKS]

Acceptance criteria:
- Release blockers are listed.
- Safe fixes are made only if in scope.
- Remaining manual tasks are clear.
- Build/test commands are documented.
- TypeScript and lint status are reported.

After implementation or inspection, return files changed, release status, blockers, how to test, and next steps.
```
