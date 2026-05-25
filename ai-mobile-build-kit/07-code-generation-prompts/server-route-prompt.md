# Server Route Prompt

Use this when a feature requires a backend boundary, such as a secret API key, webhook, or privileged operation.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the server route for [SERVER_FUNCTION].

Requirements:
- Route path: [PATH]
- Method: [GET/POST/etc.]
- Auth requirement: [NONE / USER / ADMIN]
- Request schema: [FIELDS]
- Response schema: [FIELDS]
- External services: [SERVICES]
- Error cases: [ERRORS]

Constraints:
- Do not expose server-only secrets to the mobile client.
- Validate input.
- Return safe error messages.
- Do not log sensitive data.
- Do not change unrelated client screens.
- Do not install libraries without approval.
- Keep the route small and testable.

Reference:
- API/secrets rules from AGENTS.md.
- Service docs: [PASTE_DOCS_OR_LINK]
- Existing server structure: [FILES]
- Client feature spec: [PASTE_OR_LINK]

Acceptance criteria:
- Route validates requests.
- Route handles success and failure responses.
- Secrets remain server-side.
- Client can call route using documented response shape if included.
- TypeScript passes.
- Lint passes.

After implementation, return files changed, what changed, how to test, and risks.
```
