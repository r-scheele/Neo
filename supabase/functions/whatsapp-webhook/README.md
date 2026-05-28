# whatsapp-webhook

Status: implemented in B07.

Scope:
- Verifies Meta callback challenges with `META_WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
- Verifies `x-hub-signature-256` with `META_APP_SECRET`.
- Stores redacted raw webhook envelopes in `raw_webhook_events`.
- Normalizes inbound WhatsApp messages into customers, conversations, and message previews.
- Updates message delivery status from Meta status webhooks.

Callback URL:

`https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1/whatsapp-webhook`

Do not log raw message text, phone numbers, profile names, access tokens, or webhook secrets.
