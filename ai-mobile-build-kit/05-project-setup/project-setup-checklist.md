# Project Setup Checklist

Use this before feature work begins.

## Expo App

- [ ] Create Expo app.
- [ ] Use TypeScript.
- [ ] Confirm app runs on iOS simulator if available.
- [ ] Confirm app runs on Android emulator or device if available.
- [ ] Confirm app runs on a real device before release.

## Git

- [ ] Initialize Git.
- [ ] Add `.gitignore`.
- [ ] Make initial commit.
- [ ] Create GitHub repository.
- [ ] Push main branch.

## Environment

- [ ] Create `.env`.
- [ ] Create `.env.example`.
- [ ] Document required variables.
- [ ] Confirm `.env` is ignored.
- [ ] Do not commit secrets.

## Routing

- [ ] Set up Expo Router.
- [ ] Create route groups.
- [ ] Confirm navigation works.
- [ ] Document primary routes in `AGENTS.md`.

## Styling

- [ ] Set up NativeWind.
- [ ] Confirm classes render.
- [ ] Add design tokens or theme notes.
- [ ] Document styling rules in `AGENTS.md`.

## Assets

- [ ] Create `assets/images`.
- [ ] Add approved images.
- [ ] Create `constants/images.ts`.
- [ ] Confirm images render on device.

## Quality

- [ ] Add lint command.
- [ ] Add typecheck command.
- [ ] Run lint.
- [ ] Run typecheck.
- [ ] Document commands in `AGENTS.md`.

## Done Looks Like

Setup is complete when a fresh coding agent can read `AGENTS.md`, run the app, and implement the first feature without inventing project structure.
