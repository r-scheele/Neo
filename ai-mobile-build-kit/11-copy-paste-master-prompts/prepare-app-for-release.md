# Prepare App For Release Prompt

Use this when the app is nearly ready for TestFlight, internal testing, App Store, or Google Play.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Assess and prepare the app for [TESTFLIGHT / INTERNAL_TESTING / APP_STORE / GOOGLE_PLAY].

Release context:
[PASTE_RELEASE_SCOPE_AND_TARGET]

Required checks:
1. Product scope and MVP release criteria.
2. App config, name, bundle ID/package name, version, build number.
3. Icons, splash, and store assets.
4. Permissions and platform config.
5. Environment variables and secrets.
6. Auth flows.
7. Analytics events and privacy.
8. Loading, empty, error, offline, and permission states.
9. Real device testing gaps.
10. Lint, typecheck, and tests.
11. EAS build readiness.
12. App Store or Google Play checklist.

Constraints:
- Do not add new product features.
- Do not redesign UI.
- Do not install dependencies.
- Do not expose or print secret values.
- Do not submit anything to stores unless explicitly asked.
- Make safe small fixes only if they are clearly release-blocking and within scope.

Reference:
- AGENTS.md.
- Release checklist files.
- App config files.
- Store requirements.
- Existing test commands.

Acceptance criteria:
- Release blockers are identified.
- Safe fixes are listed separately from manual tasks.
- Commands to run are explicit.
- Store submission gaps are clear.
- Privacy/security concerns are called out.

Return:
1. Release readiness status: ready, ready with risks, or not ready.
2. Blockers.
3. Recommended fixes.
4. Manual checklist.
5. Commands to run.
6. Store submission notes.
```

## Done Looks Like

The output should make the release decision concrete instead of vibes-based.
