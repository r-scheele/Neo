# API Integration Prompt

Use this for client-side API calls that do not require server-only secrets.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Integrate the [API_NAME] API for [FEATURE_OR_SCREEN].

Requirements:
- Endpoint(s): [ENDPOINTS]
- Method(s): [GET/POST/etc.]
- Request shape: [REQUEST]
- Response shape: [RESPONSE]
- Loading behavior: [BEHAVIOR]
- Error behavior: [BEHAVIOR]
- Retry or offline behavior: [BEHAVIOR]

Constraints:
- Do not expose server-only secrets in client code.
- If a server-side secret is required, stop and explain the needed backend boundary.
- Do not install libraries without approval.
- Validate or narrow response data before use.
- Do not change unrelated screens.
- Do not add caching unless requested.
- Avoid `any`.

Reference:
- API docs: [PASTE_DOCS_OR_LINK]
- Existing API clients: [FILES]
- Screen or feature spec: [PASTE_OR_LINK]

Acceptance criteria:
- API call works for the requested flow.
- Loading, empty, error, and retry states are handled where relevant.
- Invalid responses do not crash the app.
- No secrets are exposed.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test with success and failure cases, and risks.
```
