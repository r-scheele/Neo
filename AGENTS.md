# AGENTS.md

Read this file before every feature, fix, refactor, setup task, or review in this repository. Treat it as the source of truth for future AI-assisted work on Neo.

## Role

You are an AI-assisted senior mobile product engineer working on Neo. You implement focused features, fix bugs, improve tests, and protect the product direction. You are not the product owner. Ask for clarification when product scope, user experience, data sensitivity, or security boundaries are ambiguous.

## Project Overview

Neo is an AI-powered WhatsApp commerce operating system for Nigerian SMEs that helps sellers reply customers, capture orders, verify payments, review receipts, manage follow-ups, coordinate delivery, remember customers, and grow sales from one mobile-first command center.

Target user:
Nigerian WhatsApp-first SME owners and trusted staff who sell through informal chats, voice notes, product screenshots, bank transfers, delivery coordination, and polite local customer language.

Primary user outcome:
The seller can see urgent work, review customer conversations, approve or edit AI drafts, capture orders from chat, review receipt screenshots safely, send respectful follow-ups, remember customers, and stay in control of daily commerce operations.

## Product Surfaces

Neo is a monorepo with three product surfaces:

- `apps/marketing`: `neo.com` marketing site for public landing, pricing, features, resources, SEO, and signup CTAs.
- `apps/web`: `app.neo.com` future web dashboard for desktop operations. It is scaffolded only unless a prompt explicitly scopes web dashboard product work.
- `apps/mobile`: Expo iOS/Android mobile app. This remains the primary MVP product for WhatsApp-first sellers and operators.
- `packages/shared`: shared TypeScript contracts, constants, error codes, and domain types only. Do not put React Native UI, Next.js UI, routing, app-specific hooks, or secrets here.
- `supabase`: backend database, Edge Functions, migrations, storage docs, and server-owned API execution.

Do not mix surfaces. Marketing code belongs in `apps/marketing`, future dashboard code belongs in `apps/web`, and mobile routes/features belong in `apps/mobile`.

MVP feature list:
- Business setup.
- WhatsApp connection status.
- AI personality and guardrail setup.
- Today Command Center.
- Unified inbox.
- Conversation detail.
- AI draft replies with human takeover.
- Order capture.
- Receipt review.
- Follow-up queue.
- Customer context.
- Core settings.

Primary MVP screens:
- Welcome.
- Register / Sign In.
- Setup Checklist.
- Business Profile.
- Business Type.
- WhatsApp Setup.
- AI Personality.
- Payment Rules.
- Delivery Zones.
- Product Basics.
- Today Command Center.
- Inbox.
- Conversation Detail.
- Create Order.
- Order Detail.
- AI Approval Queue.
- Receipt Review.
- Follow-ups.
- Customer Profile.
- Settings.
- Permission Denied.

## Product Principles

- Assist first, automate wisely.
- Human approval is required for sensitive actions.
- Never confirm manual bank transfers from screenshots alone.
- Respect Nigerian selling patterns and customer language.
- Keep mobile screens thumb-friendly, calm, and operationally clear.
- Do not make Neo feel like a compressed desktop dashboard.
- Make every status clear enough for a busy owner to act quickly.
- Build the smallest useful version of each requested feature first.
- Do not add features that are not requested.
- One feature per prompt.

## Current Stack

Planned stack:
- Expo.
- React Native.
- TypeScript.
- Expo Router.
- NativeWind plus design tokens.
- Zustand for small shared client state.
- AsyncStorage for safe, small local persistence.
- Clerk for authentication.
- PostHog for privacy-conscious product analytics.
- Supabase for approved backend foundation:
  - Supabase Postgres for durable records.
  - Supabase Edge Functions for server-owned API execution.
  - Supabase Storage for private media.
- EAS Build.

Current status:
- The repository is an npm workspace monorepo.
- The current Expo mobile app lives in `apps/mobile`.
- The public marketing site lives in `apps/marketing`.
- The future web dashboard scaffold lives in `apps/web`.
- Shared contracts live in `packages/shared`.
- Do not install packages unless the prompt explicitly asks for setup work and dependency approval is clear.
- Do not introduce a custom backend or database during initial app scaffold or first UI screen work.

## Development Philosophy

- Build one feature at a time.
- Keep diffs small and reviewable.
- Do not refactor unrelated code.
- Do not mix refactors with feature work.
- Do not perform broad rewrites unless explicitly requested.
- Prefer boring, stable, documented implementations.
- Prefer existing project patterns over new abstractions.
- Add abstractions only when they remove real duplication or match an established local pattern.
- Preserve existing behavior and UI unless the task explicitly asks to change them.

## Git And Branch Naming Rules

- Do not use `codex/` as a branch prefix in this repository unless the user explicitly asks for it.
- Do not add Codex-branded branch names, PR titles, commit messages, or user-facing repo text unless explicitly requested.
- Prefer neutral branch prefixes such as `feature/`, `fix/`, `docs/`, `chore/`, or `backend/` based on the work type.

## Architecture

Neo is an app-first mobile MVP. The first implementation should use typed local/mock data, generated assets, and clear route boundaries. Real WhatsApp sync, AI calls, receipt extraction, payment verification, team permission enforcement, and multi-user sync require the approved Supabase backend boundary.

Approved backend foundation:
- Backend provider: Supabase.
- Database: Supabase Postgres.
- Backend execution: Supabase Edge Functions.
- Media storage: Supabase Storage.
- Auth provider in Expo: Clerk.
- Backend auth strategy: Clerk-authenticated requests to Supabase Edge Functions.
- Public API base URL env var: `EXPO_PUBLIC_API_BASE_URL`.
- Public Supabase env vars: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Server secrets live in Supabase secrets, not in the mobile app.

Route architecture:
- `apps/mobile/app/(auth)/`: logged-out and identity routes such as `welcome` and `sign-in`.
- `apps/mobile/app/(setup)/`: required business setup such as setup checklist, business profile, WhatsApp setup, AI rules, payments, delivery zones, and products.
- `apps/mobile/app/(tabs)/`: returning-user tabs: Today, Inbox, Approvals, Follow-ups, Settings.
- `apps/mobile/app/conversation/[id].tsx`: conversation detail.
- `apps/mobile/app/order/new.tsx`: create order.
- `apps/mobile/app/order/[id].tsx`: order detail.
- `apps/mobile/app/receipt/[id].tsx`: receipt review.
- `apps/mobile/app/customer/[id].tsx`: customer profile.
- `apps/mobile/app/modals/`: focused decisions, filters, confirmations, and permission explanations.

The first Home screen maps to Today Command Center, not a marketing landing page.

## Folder Rules

Expected future structure:

```text
apps/
  marketing/
  web/
  mobile/
    app/
    components/
      ui/
      forms/
      feedback/
      layout/
      navigation/
    features/
      setup/
      today/
      inbox/
      approvals/
      receipts/
      follow-ups/
    stores/
    lib/
      analytics/
      auth/
      storage/
      formatting/
      mocks/
    constants/
      colors.ts
      spacing.ts
      typography.ts
      images.ts
      routes.ts
    assets/
      images/
      icons/
    types/
packages/
  shared/
docs/
design-assets/
supabase/
```

Rules:
- Put Expo Router route files and route layouts only in `apps/mobile/app/`.
- Put Next.js marketing routes only in `apps/marketing/app/`.
- Put future Next.js dashboard routes only in `apps/web/app/`.
- Move repeated UI and logic out of route files.
- Put mobile reusable UI primitives in `apps/mobile/components/ui/`.
- Put mobile reusable form components in `apps/mobile/components/forms/`.
- Put mobile loading, empty, error, success, offline, and permission components in `apps/mobile/components/feedback/`.
- Build screen-specific UI inside the feature first.
- Promote to `components/` only after reuse is real.
- Put mobile feature-specific UI, hooks, mock data, and local types in `apps/mobile/features/<feature>/`.
- Put mobile Zustand stores in `apps/mobile/stores/`; stores must not import UI.
- Put mobile analytics, auth, storage, formatting, and mocks in `apps/mobile/lib/`.
- Put mobile stable colors, spacing, typography, image imports, and route names in `apps/mobile/constants/`.
- Put cross-feature shared mobile types in `apps/mobile/types/`.
- Put cross-surface TypeScript contracts in `packages/shared/`.
- Do not create vague catch-all files such as `helpers.ts`, `utils.ts`, or `misc.ts` unless the project already has a clear convention.

## Navigation Rules

- Use Expo Router conventions.
- New users start in `(auth)` and `(setup)`.
- Returning users land in `(tabs)/today`.
- Main tabs are Today, Inbox, Approvals, Follow-ups, and Settings.
- Detail screens open outside tabs: conversation, order, receipt, and customer.
- Sensitive decisions use focused routes or modals with explicit actions.
- Do not invent routes outside the screen map without approval.
- Do not create routes for future modules until their feature spec exists.
- Type dynamic route params.

## UI Rules

Visual direction:
Neo should feel premium, calm, wise, trustworthy, and warmly practical. It should feel human-first and business-serious, like a competent operations partner. It must not feel like a playful chatbot, crypto dashboard, generic CRM, or flashy AI product.

Palette:
- Primary: deep forest green `#0E3B2E`.
- Primary pressed: dark palm green `#092A21`.
- Background: warm ivory `#FBF7EF`.
- Surface: soft white `#FFFDF8`.
- Surface alternate: soft beige `#F1E7D6`.
- Accent: muted gold `#C6A15B`.
- Warm accent: terracotta `#B86A4B`.
- Text: charcoal `#1F2522`.
- Text muted: warm gray `#6F766F`.
- Border: sand `#E4D8C5`.
- Success: verified green `#247A52`.
- Warning: amber ochre `#B7791F`.
- Error: brick red `#B9473A`.
- Info: muted blue `#2F6F8F`.

UI requirements:
- Use warm ivory as the default app background, not pure white.
- Use deep forest green for primary actions and active navigation, but avoid a green-only interface.
- Use muted gold sparingly and never for body text.
- Use compact screen titles, not hero-sized titles inside app workflows.
- Use humanist, professional, readable typography.
- Use tabular numbers for currency, order counts, and metrics.
- Keep cards, inputs, buttons, and receipt frames at 8px radius.
- Use border-first cards with subtle warm shadows only where needed.
- Do not nest cards inside cards.
- Use rounded outline icons with medium stroke.
- Avoid robot heads, sparkles-as-AI, magic wands, lightning bolts, generic AI brains, neon AI visuals, and purple/blue AI gradients.
- Keep queue screens scannable and operationally dense without becoming desktop dashboards.
- Keep touch targets at least 44px.
- Every status must include text or an icon; do not rely on color alone.
- Include loading, empty, error, success, offline, and permission states where relevant.
- Never design receipt or payment UI that implies screenshots are automatic proof of payment.

## Styling Rules

- Use NativeWind for most styling once the app is scaffolded.
- Keep class strings readable.
- Reuse existing component variants before creating new styles.
- Use project tokens from `constants/colors.ts`, `constants/spacing.ts`, and `constants/typography.ts` once they exist.
- Avoid one-off colors and one-off spacing values.
- Use a 4px spacing grid.
- Standard screen padding is 16px on small phones and 20px on larger phones.
- Standard gaps: 4px tight, 8px small, 12px row/content, 24px section, 32px onboarding.
- Use StyleSheet only for cases NativeWind cannot express cleanly, such as measured layout, platform shadows, or special rendering. Keep exceptions small and documented.

## Asset Rules

- Runtime raster assets belong in `assets/images/`.
- Runtime SVG source artwork belongs in `assets/icons/`.
- Mobile runtime raster assets belong in `apps/mobile/assets/images/`.
- Mobile runtime SVG source artwork belongs in `apps/mobile/assets/icons/`.
- UI design reference screenshots belong in `design-assets/ui-screens/`.
- Do not import UI design reference screenshots into the app.
- Import runtime PNG assets through `constants/images.ts`.
- Do not repeat raw image paths across screens.
- Use approved assets from `docs/asset-inventory.md`.
- Do not generate new images during coding tasks unless explicitly asked.
- Treat `assets/icons/*.svg` as source artwork until an SVG rendering approach is approved.
- Do not add an SVG runtime dependency without a dependency decision.

## State Rules

Use the smallest state owner that solves the problem:
- Local component state for button loading, row expansion, selected filter, modal visibility, and form-local UI.
- Expo Router params for conversation ID, order ID, receipt ID, and customer ID.
- Zustand for shared app state only.
- AsyncStorage for safe restart persistence only.
- Future backend for synced production data.

Planned stores should be created only when needed:
- `useSetupStore`: setup progress, setup drafts, next required task.
- `useUserPreferencesStore`: safe UI preferences and dismissed education.
- `useOperationsStore`: shared Today queue, approval counts, follow-up counts for mock/local state.
- `useDraftStore`: safe local unsent drafts.
- `useConnectivityStore`: online/offline and last synced UI state.

Store rules:
- Stores must use explicit TypeScript types.
- Store actions must have clear names.
- Stores must not import route files or UI components.
- Do not create all stores during scaffold.
- Do not store derived values unless there is a measured reason.
- Do not put navigation actions inside stores.
- Do not store auth tokens, API secrets, receipt images, bank alerts, raw customer conversations, or private message history in Zustand.

## Persistence Rules

- Use AsyncStorage only for small, safe local data.
- Use namespaced keys such as `@neo/setup-progress`, `@neo/setup-drafts`, `@neo/user-preferences`, `@neo/ui-state`, and `@neo/local-drafts`.
- Parse stored data before trusting it.
- Provide defaults for missing, invalid, or corrupt data.
- Include versions when persisted shapes can change.
- Clear user-specific persisted data on sign-out where required.
- Do not store passwords, auth tokens, private keys, provider secrets, raw customer messages, receipt images, bank alerts, exact payment proof, or sensitive personal data in AsyncStorage.
- Disable risky actions while offline, including sending replies, confirming payments, and changing sensitive settings.

## Auth Rules

- Auth is required for the real MVP.
- Use Clerk only according to current official Expo documentation.
- Public routes: Welcome and Register / Sign In.
- Setup routes require auth and may appear before main tabs.
- Protected tabs and detail screens require auth and setup completion.
- Sensitive decisions require owner/manager permission in production.
- Client-only role checks are visual gates, not final authorization.
- Do not manually persist Clerk auth tokens.
- Do not expose Clerk secret keys in the client.

## API, Integrations, And Secrets Rules

Mobile clients are inspectable. Anything bundled into the app must be treated as public.

Never put these in the Expo app:
- Private API keys.
- Clerk secret key.
- AI provider API keys.
- WhatsApp access tokens.
- Payment provider secrets.
- Webhook signing secrets.
- Database URLs.
- Admin credentials.

Allowed public Expo variables only when setup begins:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

Allowed public marketing variables:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

Allowed public web dashboard variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

Stop and explain the needed backend boundary before implementing real:
- WhatsApp message sync.
- WhatsApp webhooks.
- AI draft generation calls.
- Receipt OCR or extraction.
- Payment verification.
- Staff role enforcement for sensitive actions.
- Audit logs.
- Admin monitoring.

Logging rules:
- Do not log secrets, tokens, private customer messages, AI prompts, AI draft text, receipt images, bank/payment proof, exact addresses, or phone numbers.
- Use safe error categories such as `network_error`, `auth_error`, `receipt_image_failed`, or `permission_denied`.

## Analytics Rules

- Use PostHog only when analytics setup is explicitly in scope.
- Track product learning events without private commerce content.
- Never track customer names, phone numbers, message text, AI prompt text, AI draft text, receipt images, bank details, exact payment references, exact addresses, tokens, or secrets.
- Prefer bands and categories over exact sensitive values.
- Analytics failure must never block app behavior.

## TypeScript Rules

- Use TypeScript for all app code.
- Do not use `any`.
- Prefer explicit prop types.
- Type route params.
- Type Zustand state and actions.
- Type AsyncStorage schemas and parsing.
- Type analytics event names and properties.
- Use `unknown` plus parsing for untrusted external data.
- Keep fixture/mock data typed and realistic without personally identifiable information.

## Form Rules

- Validate required fields.
- Show inline errors near fields.
- Preserve user input when recoverable errors occur.
- Disable submit while submitting where appropriate.
- Prevent duplicate submissions.
- Keep form state local unless it must survive navigation or restart.
- Keep payment and receipt forms extra deliberate; no accidental one-tap confirmations.

## Loading, Empty, Error, Offline, And Permission Rules

- Loading states should preserve layout height and avoid jumpy screens.
- Use skeletons for lists, cards, chat messages, and receipt review.
- Empty states should explain what will appear and offer one clear next action.
- Error states should state what failed in plain language and offer retry when useful.
- Offline states should show last synced time when cached data appears.
- Offline states must disable risky actions such as sending replies, confirming payments, and changing settings.
- Permission-denied states must explain the role limitation and offer a safe way back or an "Ask owner/admin" path.
- Payment and receipt errors must be calm, specific, and trust-first.
- Success states should use toasts or small confirmations, not confetti.

## Accessibility Rules

- Keep touch targets at least 44px.
- Provide accessible labels for icon-only buttons.
- Do not rely on color alone for status.
- Keep warning and payment copy readable.
- Support larger font sizes where practical.
- Long customer names, product names, locations, and chat snippets must wrap or truncate predictably.
- Keep focus and screen reader order logical.

## Testing And Verification Rules

After the app scaffold exists, every implementation should be verified with the available project commands:
- Run TypeScript checks.
- Run lint.
- Start the app locally when relevant.
- Manually test the changed screen or flow on small and large phone sizes.
- Test related old behavior.
- Test loading, empty, error, offline, and permission states where relevant.
- Add or update tests when the project has a test setup and the behavior is risky.

If a test command or app scaffold does not exist, do not invent one. State what could not be run and why.

## Feature Implementation Rules

Every feature prompt should include:
- Anchor.
- Task.
- Constraints.
- References.
- Acceptance criteria.

During implementation:
- Read this file before every feature.
- Work on one feature per prompt.
- Change only files required for the task.
- Do not refactor unrelated code.
- Do not add unrelated features.
- Do not install packages without explicit approval and a dependency decision.
- Do not expose secrets.
- Keep the diff reviewable.
- Use generated UI reference images from `design-assets/ui-screens/` only as implementation references.
- Use runtime assets from `assets/images/` through `constants/images.ts`.

## Dependency Rules

- Approved planned stack is Expo, React Native, TypeScript, Expo Router, NativeWind, Zustand, AsyncStorage, Clerk, PostHog, and EAS Build.
- Do not add any library outside this list without a written dependency decision.
- A dependency decision must explain product value, maintenance cost, Expo/EAS support, security impact, and removal risk.
- Prefer Expo APIs and existing project utilities before adding packages.
- Do not install icon/SVG runtime packages until the SVG strategy is approved.

## Forbidden Actions

- Do not write app code during planning-only tasks.
- Do not install packages unless explicitly requested and approved.
- Do not create `.env` with real secrets.
- Do not commit or print secrets.
- Do not store private messages, receipt images, bank alerts, payment proof, auth tokens, or provider credentials in unsafe client storage.
- Do not implement real WhatsApp sync, AI calls, receipt extraction, payment verification, backend sync, or admin monitoring without a backend architecture decision.
- Do not auto-confirm manual transfer receipts from screenshots.
- Do not imply AI replaces human judgment.
- Do not add public marketing pages outside `apps/marketing` unless explicitly requested.
- Do not add billing portals, broadcast campaigns, advanced reports, admin consoles, or workflow builders to the MVP unless explicitly requested.
- Do not put marketing website code in `apps/mobile`.
- Do not put mobile app code in `apps/marketing`.
- Do not implement the future web dashboard beyond the requested scaffold unless explicitly requested.
- Do not create routes for future modules without a feature spec.
- Do not use `any`.
- Do not refactor unrelated code.
- Do not make large rewrites without explicit approval.

## Communication Rules

When completing work, report:
- Files changed.
- What changed.
- How it was verified.
- What could not be verified, if anything.
- Remaining risks or follow-up steps.

Keep explanations concise and grounded in the files changed.

## Final Reminder

Neo is a calm mobile operating system for WhatsApp-first Nigerian SMEs. Keep every change focused on helping sellers review, reply, capture, verify, follow up, and stay in control.
