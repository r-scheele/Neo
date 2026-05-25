# Neo

Neo is an AI-powered WhatsApp commerce operating system for Nigerian SMEs. It helps sellers review conversations, set up business rules, keep payment decisions approval-first, and stay in control from a mobile-first command center.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind

## Development

```bash
npm install
npm run typecheck
npm run lint
npm run web
```

There is no unit test script yet. Use the feature prompts in `docs/feature-implementation-prompts/prompts/` for the current MVP build sequence.

## Safety Notes

- Do not store secrets, provider tokens, private WhatsApp messages, receipt images, or bank alerts in the client.
- Manual transfer screenshots are not proof of payment.
- Real WhatsApp sync, receipt extraction, payment verification, AI calls, and staff authorization need a backend boundary before production use.
