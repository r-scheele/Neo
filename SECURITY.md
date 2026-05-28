# Security Policy

## Supported Scope

Security review is focused on the current `main` branch and active pull requests.
Neo is pre-release, so production incident handling and long-term version support
are not yet defined.

## Reporting a Vulnerability

Please do not open public issues for suspected vulnerabilities.

Use GitHub's private vulnerability reporting or contact the repository maintainer
directly with:

- a short description of the issue,
- affected files, routes, or workflows,
- reproduction steps when safe to share,
- any evidence that secrets, customer data, payment data, or private messages may
  be exposed.

Do not include real customer conversations, receipt images, bank alerts, access
tokens, private keys, payment proof, or provider credentials in a report unless a
private channel has been agreed.

## Security Expectations

- Private API keys, provider secrets, WhatsApp tokens, webhook secrets, database
  credentials, and service-role keys must stay out of the Expo app.
- Sensitive server work belongs behind Supabase Edge Functions.
- Manual bank transfer screenshots must never be treated as automatic proof of
  payment.
- Logs and analytics must avoid private customer content, receipt images, bank
  details, payment proof, exact addresses, prompts, draft text, and tokens.
