# API Contracts

Date: 2026-05-27

Status: approved response envelope; B02 client parser exists; endpoint behavior deferred.

Base URL env var:

- `EXPO_PUBLIC_API_BASE_URL`

Project API base URL pattern:

- `https://xtalfjnmxnwtogxgtlxn.supabase.co/functions/v1`

## Response Envelope

Success:

```json
{
  "data": {},
  "error": null
}
```

Failure:

```json
{
  "data": null,
  "error": {
    "code": "STRING_CODE",
    "message": "Safe user-facing message",
    "details": {}
  }
}
```

## Scaffolded Endpoints

- `health`
- `me-bootstrap`
- `setup-business`
- `customers`
- `orders`
- `receipts`
- `follow-ups`
- `approvals`
- `whatsapp-send-message`
- `whatsapp-webhook`
- `ai-drafts`
- `media-sign-upload`
- `clerk-webhook`

Only `health` returns a positive foundation response. Other functions return a safe deferred error until their matching Phase B prompt is implemented.

## B02 Client Boundary

Client files:

- `lib/api/config.ts`
- `lib/api/response.ts`
- `lib/api/client.ts`
- `lib/api/endpoints.ts`
- `lib/api/health.ts`
- `lib/api/useApiClient.ts`

Rules:

- Parse all response bodies from `unknown`.
- Return typed `ApiResult<T>` values instead of throwing for expected request failures.
- Fail safely for missing or invalid `EXPO_PUBLIC_API_BASE_URL`.
- Use only safe error categories.
- Retrieve auth tokens through Clerk client APIs only.
- Do not log tokens or private commerce payloads.
