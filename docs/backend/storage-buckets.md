# Supabase Storage Buckets

Date: 2026-05-27

Status: documented, not created remotely.

## MVP Buckets

| Bucket | Public? | Purpose |
| --- | --- | --- |
| `receipt-images` | No | Receipt screenshots and proof-review media. |
| `product-images` | No by default | Product setup/reference images. |
| `customer-attachments` | No | Customer-provided attachments that are not WhatsApp media. |
| `whatsapp-media` | No | WhatsApp images, audio, documents, and other synced media. |
| `business-assets` | No by default | Business logo and approved setup assets. |

## Rules

- Private by default.
- Signed URLs for sensitive files.
- No public receipt/payment proof files.
- No public customer/WhatsApp attachments.
- Edge Functions should issue signed upload/read URLs after authorization.

## Prepared Commands

Review before running:

```bash
supabase storage create receipt-images --public false
supabase storage create product-images --public false
supabase storage create customer-attachments --public false
supabase storage create whatsapp-media --public false
supabase storage create business-assets --public false
```

These commands were not run during the foundation pass.
