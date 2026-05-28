# Media Storage Strategy

Date: 2026-05-27

Status: approved direction, bucket creation deferred.

## Decision

Use Supabase Storage for backend-owned media.

## Rules

- Private by default.
- Use signed URLs for sensitive files.
- Never make receipt/payment proof files public.
- Never make customer or WhatsApp attachments public.
- Store object references in `media_assets`, not raw files in app state.
- Keep upload/signing behavior behind Edge Functions.

## MVP Buckets

- `receipt-images`
- `product-images`
- `customer-attachments`
- `whatsapp-media`
- `business-assets`

See `docs/backend/storage-buckets.md` for bucket setup notes.
