# Product Surface Separation

## Purpose

Neo now needs three distinct product surfaces:

- `neo.com`: public marketing website for business-facing education, SEO, pricing, features, and signup CTAs.
- `app.neo.com`: future web dashboard for desktop operations when Neo expands beyond the mobile-first MVP.
- Expo mobile app: iOS and Android seller/operator experience for daily WhatsApp commerce work.

This separation keeps marketing iteration, future desktop operations, and the core mobile MVP from pulling against each other in one runtime.

## Product Surfaces

### neo.com Marketing Site

The marketing site belongs in `apps/marketing`.

It owns:

- Landing page and future public pages.
- Pricing, features, resources, company/about, legal, and SEO content.
- Public analytics that never include private commerce content.
- CTA links to `app.neo.com`, a waitlist, or app download destinations.

It must not own:

- Mobile app routes.
- Authenticated seller workflows.
- Supabase Edge Function implementation.
- Private customer, receipt, order, payment, or WhatsApp data.

### app.neo.com Web Dashboard

The future web dashboard belongs in `apps/web`.

It owns:

- Future desktop operations dashboard shell.
- Future authenticated web-only workflows if product scope expands.
- Future business analytics and admin-friendly operations views after a product decision.

It must not own yet:

- A duplicate implementation of mobile MVP flows.
- Fake backend-backed workflows.
- Receipt/payment confirmation behavior.
- Staff permission enforcement beyond placeholder architecture notes.

### Expo Mobile App

The current Expo app belongs in `apps/mobile`.

It owns:

- Expo Router mobile routes.
- Auth, setup, Today Command Center, inbox, approvals, follow-ups, receipts, orders, customers, and settings.
- Runtime mobile assets.
- NativeWind and React Native styling.
- Mobile-specific local stores and safe local persistence.

It must not own:

- Public marketing site pages.
- Future desktop dashboard code.
- Next.js-specific UI.
- Server secrets or backend implementation details.

## Shared Code

Shared TypeScript contracts belong in `packages/shared`.

Allowed shared code:

- API response envelopes.
- Error codes.
- Backend route constants.
- Business/domain types.
- Non-UI product constants.

Not allowed in shared code:

- React Native UI components.
- Next.js UI components.
- Hooks tied to one runtime.
- App-specific routing.
- Secrets, private API clients, or environment-specific behavior.

## Deployment Plan

- `neo.com`: deploy `apps/marketing` to a public web hosting platform such as Vercel, Netlify, or Cloudflare Pages.
- `app.neo.com`: deploy `apps/web` separately, likely Vercel, and keep it auth protected when real dashboard work begins.
- Mobile app: build `apps/mobile` with Expo and EAS for iOS App Store and Google Play.
- Supabase: keep backend database, Edge Functions, Storage, and secrets in `supabase/`.

## Environment Boundaries

Client apps may only read public environment variables:

- Mobile: `EXPO_PUBLIC_*` values.
- Marketing and web: `NEXT_PUBLIC_*` values.

Server secrets must never be committed, bundled into mobile code, or exposed through `NEXT_PUBLIC_*` or `EXPO_PUBLIC_*`.

Supabase service keys, WhatsApp tokens, AI provider keys, webhook secrets, Clerk secret keys, payment secrets, and admin credentials remain in Supabase secrets or server-only hosting environments.

## Current Migration Steps

1. Convert the repository to npm workspaces.
2. Move the existing Expo app from the repo root into `apps/mobile`.
3. Keep `docs/`, `design-assets/`, `supabase/`, and root `AGENTS.md` at the repo root.
4. Create `apps/marketing` as the `neo.com` Next.js marketing app and move the landing page concern out of the mobile app.
5. Create `apps/web` as a minimal future `app.neo.com` scaffold.
6. Create `packages/shared` for TypeScript contracts only.
7. Document environment boundaries and domain deployment ownership.
8. Update root and app-specific instructions so future work lands in the right surface.

## Risks

- Moving the Expo app changes working directories and may break path assumptions in Expo, TypeScript, NativeWind, or ESLint.
- Npm workspace dependency hoisting can expose missing package boundaries.
- Existing scripts, CI, or local habits may still call root `npm start`.
- Supabase function tooling should remain rooted at `supabase/` and not be pulled into a client workspace.
- The existing mobile landing route is temporary marketing code and should be removed from mobile after `apps/marketing` owns the landing page.

## Rollback Notes

If the migration needs to be rolled back:

1. Move `apps/mobile/*` back to the repository root.
2. Restore the pre-workspace root `package.json`, `tsconfig.json`, `eslint.config.js`, `metro.config.js`, `postcss.config.mjs`, and `app.json`.
3. Remove `apps/marketing`, `apps/web`, and `packages/shared` if they were not already depended on.
4. Run `npm install`, `npm run typecheck`, and `npm run lint`.
5. Keep docs created during the migration if they remain useful, or revert them with the same branch.
