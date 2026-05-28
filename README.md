<p align="center">
  <img src="assets/images/logo-mark-neo.png" alt="Neo logo" width="112" />
</p>

# Neo

Neo is an AI-powered WhatsApp commerce operating system for Nigerian SMEs. It helps sellers review conversations, set up business rules, keep payment decisions approval-first, and stay in control from a mobile-first command center.

Neo is built for WhatsApp-first sellers who manage chats, product questions, orders, bank-transfer receipts, delivery coordination, and follow-ups from their phones.

## Tags

`ai-commerce` `whatsapp-commerce` `nigerian-smes` `expo` `react-native` `typescript` `mobile-app` `commerce-operations` `receipt-review` `order-management`

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind v5 preview with Tailwind CSS v4 CSS-first tokens
- Zustand
- AsyncStorage
- PostHog React Native
- Supabase Postgres, Edge Functions, and Storage for the approved backend foundation

## Development

```bash
npm install
npm run typecheck
npm run lint
npm run web
```

There is no unit test script yet. The local MVP app scaffold and primary screens exist; production integrations are tracked in `docs/integration-prompts/` and should run one pass at a time.

Manual QA lives in `docs/manual-qa-baseline.md`; the latest partial local run is recorded in `docs/manual-qa-results-2026-05-27.md`. Local state and role preview controls are documented in `docs/local-preview-controls.md`. The current client release precheck is documented in `docs/client-release-readiness-precheck.md`. Maestro is not configured yet; do not install it without a written dependency decision.

## Environment

Use `.env.example` as the public client placeholder list only:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

Do not commit `.env` files or add private service secrets to the Expo client.

## Integration Order

Phase A client/local prompts are complete. Backend Phase B has started: B01 Supabase foundation and B02 API client/auth boundary are complete. Do not run WhatsApp, AI, commerce sync, permissions, or audit-log prompts until their required secrets/contracts are ready.

## Config Notes

NativeWind v5 uses Tailwind CSS v4's CSS-first setup in `src/global.css`. The current app uses `metro.config.js`, `postcss.config.mjs`, and the root CSS import in `app/_layout.tsx`; `babel.config.js`, `tailwind.config.js`, and `nativewind.config.js` are intentionally absent unless a future customization requires them.

## Safety Notes

- Do not store secrets, provider tokens, private WhatsApp messages, receipt images, or bank alerts in the client.
- Manual transfer screenshots are not proof of payment.
- Real WhatsApp sync, receipt extraction, payment verification, AI calls, and staff authorization must go through the Supabase backend boundary before production use.
