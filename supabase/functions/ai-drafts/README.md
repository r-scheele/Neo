# ai-drafts

Status: B08 implemented for MVP AI draft generation.

Implemented:
- Generate and store AI draft replies through server-side provider calls.
- Use safe setup preferences and minimized WhatsApp message previews.
- Apply guardrails, confidence bands, and approval routing.
- Write `ai_draft.created` audit rows with safe metadata only.

Do not log prompts, draft text, raw private messages, phone numbers, or provider secrets.
