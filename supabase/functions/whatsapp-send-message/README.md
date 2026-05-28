# whatsapp-send-message

Status: implemented in B07.

Scope:
- Returns safe WhatsApp setup status from server-side Meta configuration.
- Lists and loads backend WhatsApp conversations for the active business.
- Sends approved/manual WhatsApp messages through server-owned Meta credentials.
- Stores only safe message previews and delivery status metadata.
- Enforces `whatsapp.send` through trusted server-side membership roles.
- Writes safe `whatsapp.send_attempted` audit events.

Still deferred:
- Media download/upload and private media storage.
- Message templates/broadcasts.
- Multi-number business mapping beyond the current MVP default business selection.

Safety rules:
- Send approved WhatsApp messages through server-owned Meta credentials.
- Store send attempts, outcomes, and safe audit metadata.
- Do not return provider tokens, app secrets, full customer phone numbers, or raw private message logs to the client.
