# Folder Structure

Status: Implemented baseline structure for the local MVP prototype. Continue using this structure for integration work.

## Recommended Structure

```text
app/
  _layout.tsx
  (auth)/
    welcome.tsx
    sign-in.tsx
  (setup)/
    _layout.tsx
    index.tsx
    business-profile.tsx
    business-type.tsx
    whatsapp-setup.tsx
    ai-personality.tsx
    payment-rules.tsx
    delivery-zones.tsx
    product-basics.tsx
  (tabs)/
    _layout.tsx
    today.tsx
    inbox.tsx
    approvals.tsx
    follow-ups.tsx
    settings.tsx
  conversation/
    [id].tsx
  order/
    new.tsx
    [id].tsx
  receipt/
    [id].tsx
  customer/
    [id].tsx
  modals/
    permission.tsx
components/
  ui/
  forms/
  feedback/
  layout/
  navigation/
features/
  setup/
    components/
    data/
    hooks/
    types.ts
  today/
    components/
    data/
    hooks/
    types.ts
  inbox/
    components/
    data/
    hooks/
    types.ts
  approvals/
    components/
    data/
    hooks/
    types.ts
  receipts/
    components/
    data/
    hooks/
    types.ts
  follow-ups/
    components/
    data/
    hooks/
    types.ts
  settings/
  operations/
  permissions/
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
docs/
```

## Folder Rules

| Folder | Purpose | Rules |
| --- | --- | --- |
| `app/` | Expo Router route files | Routes and route layouts only; move repeated UI and logic out |
| `components/` | Reusable UI | Only shared components used by more than one screen or clearly part of the design system |
| `features/` | Feature-specific UI, hooks, mock data, and types | Create a feature folder when a feature grows beyond one route file |
| `stores/` | Zustand stores | Shared client state only; no UI imports |
| `lib/` | Service helpers | Analytics, auth helpers, storage helpers, formatting, mocks |
| `constants/` | Stable app constants | Colors, spacing, typography, route names, image imports |
| `assets/images/` | Raster assets | Generated PNG assets and app artwork |
| `assets/icons/` | Icon source artwork | SVG source files; runtime strategy must be approved later |
| `types/` | Cross-feature types | Only types shared across multiple features |

## Route Rules

- New users start in `(auth)` and `(setup)`.
- Returning users land in `(tabs)/today`.
- Main tabs are Today, Inbox, Approvals, Follow-ups, and Settings.
- Details open outside tabs: conversation, order, receipt, and customer.
- Sensitive decisions use focused routes or modals with explicit actions.
- Do not create routes for future modules until their feature spec exists.

## Component Rules

- Build screen-specific UI inside the feature first.
- Promote to `components/` only after reuse is real.
- Keep generic UI presentational.
- Do not fetch data or mutate stores inside generic UI components unless the component is explicitly a container.
- Keep touch targets at least 44px.
- Keep cards at 8px radius unless the style guide says otherwise.

## Asset Rules

- `constants/images.ts` should be the only place screens import generated PNG assets from.
- Screen code should use named image constants, not repeated raw paths.
- Do not import SVG files directly until the project approves an SVG runtime setup.
- Use existing generated raster assets for early UI work.

## Feature Ownership

| Feature | Primary Folder | Main Routes |
| --- | --- | --- |
| Setup | `features/setup/` | `(setup)/*` |
| Today Command Center | `features/today/` | `(tabs)/today` |
| Inbox | `features/inbox/` | `(tabs)/inbox`, `conversation/[id]` |
| Approvals | `features/approvals/` | `(tabs)/approvals` |
| Receipts | `features/receipts/` | `receipt/[id]` |
| Follow-ups | `features/follow-ups/` | `(tabs)/follow-ups` |
| Settings | `features/settings/` later | `(tabs)/settings` |

## Done Looks Like

The folder structure is ready when each integration prompt can say exactly which route, feature folder, component folder, store, and constants file to touch.
