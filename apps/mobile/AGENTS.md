# Mobile App Instructions

This workspace contains the Expo iOS/Android app for Neo.

- Use Expo Router route files only in `apps/mobile/app/`.
- Keep the mobile app focused on the seller/operator WhatsApp commerce experience.
- Do not add marketing website pages here; use `apps/marketing`.
- Do not add future desktop dashboard routes here; use `apps/web`.
- Use NativeWind and the existing Neo tokens in `constants/` and `src/global.css`.
- Import runtime images through `constants/images.ts`.
- Do not import files from `design-assets/` into runtime code.
- Use only public `EXPO_PUBLIC_*` variables in mobile code.
- Never store or log private messages, receipt images, bank alerts, payment proof, auth tokens, provider credentials, or server secrets.
