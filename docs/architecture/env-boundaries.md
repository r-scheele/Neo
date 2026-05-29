# Environment Boundaries

Neo is now a monorepo with separate client surfaces. Public client variables are allowed only when their prefix makes them safe to bundle. Server secrets must stay outside all client app code.

## Root Example

The root `.env.example` is a reference index for all public client placeholders. Real `.env` files are ignored and must stay uncommitted.

## Mobile App: `apps/mobile`

Allowed public Expo variables:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

These values are bundled into the Expo app and must be treated as public.

## Marketing Site: `apps/marketing`

Allowed public Next.js variables:

- `NEXT_PUBLIC_APP_URL=https://app.neo.com`
- `NEXT_PUBLIC_SITE_URL=https://neo.com`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

Marketing analytics must not include private commerce content, customer names, message text, payment details, receipt images, or exact addresses.

## Web Dashboard: `apps/web`

Allowed public Next.js variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

The web dashboard is only a scaffold today. Future authenticated routes must use Clerk and call Supabase Edge Functions through the approved API boundary.

## Server Secrets

Never put these in any client app, `NEXT_PUBLIC_*`, or `EXPO_PUBLIC_*` variable:

- Clerk secret keys.
- Supabase service role keys.
- Direct database URLs.
- WhatsApp access tokens.
- WhatsApp webhook verification or signing secrets.
- AI provider API keys.
- OCR provider keys.
- Payment provider secrets.
- Bank aggregation credentials.
- Admin credentials.

Supabase Edge Function secrets remain in Supabase secrets. Server-only website secrets, if introduced later, must live in the hosting provider's server environment and must not be referenced from client components.
