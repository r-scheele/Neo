# Auth Integration Prompt

Use this for Clerk or another auth provider after auth planning is complete.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Integrate [AUTH_PROVIDER] authentication for [AUTH_SCOPE].

Requirements:
- Auth methods: [EMAIL / MAGIC_LINK / GOOGLE / APPLE / OTHER]
- Public routes: [ROUTES]
- Auth routes: [ROUTES]
- Protected routes: [ROUTES]
- Redirect behavior: [RULES]
- Sign-out behavior: [CLEAR_LOCAL_STATE?]

Constraints:
- Use current official docs for [AUTH_PROVIDER].
- Do not expose secret keys in client code.
- Do not manually persist tokens unless docs require it.
- Do not add unrelated user profile features.
- Do not redesign screens unless requested.
- Do not install libraries without approval.
- Keep logged-out, loading-session, logged-in, and error states clear.

Reference:
- Auth plan: [PASTE_OR_LINK]
- Current docs: [PASTE_DOCS_OR_LINK]
- Existing routes: [FILES]
- Environment variables: [VARIABLE_NAMES_ONLY]

Acceptance criteria:
- User can sign in and sign out with requested methods.
- Protected routes are inaccessible when logged out.
- Logged-in users are routed correctly.
- Session loading does not flash protected UI.
- No secrets are committed or exposed beyond approved publishable keys.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
