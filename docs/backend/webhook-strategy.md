# Webhook Strategy

Date: 2026-05-27

Status: approved direction, implementation deferred.

## Decision

Use Supabase Edge Functions for server-owned webhooks.

## Planned Webhook Functions

- `whatsapp-webhook`
- `clerk-webhook`

## Rules

- Webhook verification secrets live in Supabase secrets.
- Verify provider signatures before trusting payloads.
- Store raw webhook events in `raw_webhook_events` with safe metadata and processing status.
- Normalize events into business tables only after verification.
- Do not expose webhook secrets or raw provider tokens in Expo.

## Deferred

Webhook verification and processing are not implemented in this foundation pass.
