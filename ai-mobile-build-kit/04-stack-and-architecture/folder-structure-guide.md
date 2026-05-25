# Folder Structure Guide

Use this as a starting structure for Expo Router apps.

## Recommended Structure

```text
app/
  _layout.tsx
  (auth)/
  (tabs)/
  modals/
components/
  ui/
  forms/
  feedback/
features/
  [feature-name]/
    components/
    hooks/
    types.ts
stores/
lib/
  analytics/
  auth/
  storage/
constants/
  images.ts
assets/
  images/
types/
```

## Folder Rules

### `app/`

- Route files belong here.
- Keep route files readable.
- Move repeated UI to components.
- Keep route params typed.

### `components/`

- Use for reusable UI.
- Keep components focused.
- Do not put feature data fetching in generic UI components.
- Prefer named exports.

### `features/`

- Use when a feature has multiple components, hooks, or types.
- Keep feature-specific code inside the feature folder.
- Do not prematurely create feature folders for one tiny component.

### `stores/`

- Use for Zustand stores.
- One store per domain when practical.
- Include types and action names.
- Avoid storing derived values that can be computed.

### `lib/`

- Use for clients and service helpers.
- Keep secrets out of client code.
- Keep analytics calls typed.

### `constants/`

- Use for stable constants and centralized image imports.
- Do not put temporary feature state here.

## Anti-Patterns

- `utils/` filled with unrelated code.
- One giant `components/` folder with unclear ownership.
- Screens importing from each other.
- Stores importing UI.
- Duplicate image imports across screens.

## Done Looks Like

The folder structure works when a new feature can be added without asking "where should this go?"
