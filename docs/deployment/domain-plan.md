# Domain And Deployment Plan

## `neo.com`

Purpose: public marketing website.

Owner: `apps/marketing`.

Likely deployment: Vercel, Netlify, or Cloudflare Pages.

Responsibilities:

- Public landing page.
- Features, pricing, resources, about, trust, and legal pages.
- SEO metadata and public content.
- CTA links to `app.neo.com`, a waitlist, or mobile app download links when available.

Non-responsibilities:

- Authenticated operations.
- Receipt/payment decisions.
- WhatsApp sync.
- Backend secrets.

## `app.neo.com`

Purpose: future desktop/web operations dashboard.

Owner: `apps/web`.

Likely deployment: Vercel.

Responsibilities:

- Future authenticated dashboard.
- Desktop-first order, approval, receipt, customer, and analytics workflows after product approval.
- Clerk-protected routes and Supabase Edge Function calls when real work begins.

Current status:

- Scaffold only.
- No real backend behavior.
- Not a replacement for the mobile MVP.

## Mobile App

Purpose: iOS and Android seller/operator app.

Owner: `apps/mobile`.

Deployment:

- Expo local development.
- EAS Build for iOS App Store and Google Play.

Responsibilities:

- Mobile-first seller workflows.
- Setup, Today Command Center, inbox, conversation detail, AI approvals, receipt review, follow-ups, customer context, and settings.
- Safe public Expo environment variables only.

## Supabase

Purpose: backend foundation.

Owner: `supabase/`.

Responsibilities:

- Supabase Postgres.
- Edge Functions.
- Storage.
- Webhooks.
- Server-owned API execution.
- Server secrets.

Supabase is shared by mobile and future web app clients through Edge Functions. Marketing should not call sensitive commerce APIs.
