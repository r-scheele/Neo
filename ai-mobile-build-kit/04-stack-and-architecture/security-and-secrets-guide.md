# Security And Secrets Guide

Mobile apps are distributed to user devices. Anything bundled in the client can be inspected. Treat client-side secrets as public.

## Secret Rules

- Never put private API keys in app code.
- Never commit `.env`.
- Keep `.env.example` with variable names but no secret values.
- Use provider publishable keys only when docs say they are safe for clients.
- Put server-only secrets in a backend or build environment.
- Rotate keys if they are exposed.

## Environment Variables

Recommended pattern:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=
```

Only use `EXPO_PUBLIC_` for values safe to expose to the client.

## Sensitive Data

Avoid collecting or storing:

- Passwords.
- Tokens.
- Payment card details.
- Government IDs.
- Health details.
- Private messages.
- Precise location unless required and approved.

## API Safety

- Validate external responses.
- Handle network failures.
- Avoid logging secrets or personal data.
- Use HTTPS.
- Rate-limit server routes where relevant.
- Do not trust client-only authorization for sensitive operations.

## AsyncStorage Warning

AsyncStorage is not secure storage. Do not store secrets there.

## AI Prompt Rule

Add this to prompts involving APIs:

```md
Do not expose secrets in client code. If a server-side secret is required, stop and explain the required backend boundary before coding.
```

## Done Looks Like

Security is acceptable for MVP when secrets are not bundled, sensitive data is minimized, auth boundaries are clear, and privacy expectations are documented.
