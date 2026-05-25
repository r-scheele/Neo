# Environment Template Guide

Use this to create `.env` and `.env.example` safely.

## `.env.example`

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=
```

## Rules

- `.env.example` contains names only, not secrets.
- `.env` contains local values and must be ignored by Git.
- Only prefix values with `EXPO_PUBLIC_` if they are safe to expose in the mobile client.
- Never put private server keys in Expo client code.

## Setup Prompt

```md
Anchor:
Read AGENTS.md first if it exists and follow it strictly.

Task:
Create safe environment file templates for the Expo app.

Constraints:
- Do not add real secret values.
- Do not modify unrelated files.
- Do not install packages.
- Ensure `.env` is ignored by Git.
- Keep variable names aligned with the documented stack.

Reference:
- Current project files.
- Required services: [CLERK / POSTHOG / OTHER].

Acceptance criteria:
- `.env.example` exists with required variable names and empty values.
- `.env` exists only if appropriate for local setup and contains no real values from this prompt.
- `.gitignore` excludes `.env`.
- Explain files changed and how to verify.
```

## Done Looks Like

Environment setup is done when required variables are documented and no secrets are committed.
