# Neo Icon System

Use vector icons for production UI. The generated PNG contact sheet in `assets/images/icon-set-neo-core.png` is a review artifact, not the source of truth for app implementation.

## Source Icons

Production-ready SVG sources live in `assets/icons`. Each icon uses:

- `24x24` viewBox.
- `currentColor` stroke.
- `fill="none"`.
- `stroke-width="1.8"`.
- Round line caps and joins.

Render these at `24px` for navigation and row actions. Use design tokens for color:

- Active/navigation: `#0E3B2E`.
- Muted/inactive: `#6F766F`.
- Primary text/icons: `#1F2522`.
- Success/paid: `#247A52`.
- Warning/attention: `#B7791F`.
- Error/destructive only when needed: `#B9473A`.

## Icon Files

| Purpose | SVG |
| --- | --- |
| Today | `assets/icons/icon-today.svg` |
| Inbox | `assets/icons/icon-inbox.svg` |
| Approvals | `assets/icons/icon-approvals.svg` |
| Follow-ups | `assets/icons/icon-follow-ups.svg` |
| Settings | `assets/icons/icon-settings.svg` |
| Receipt Review | `assets/icons/icon-receipt-review.svg` |
| Order | `assets/icons/icon-order.svg` |
| Customer | `assets/icons/icon-customer.svg` |
| Product | `assets/icons/icon-product.svg` |
| Delivery | `assets/icons/icon-delivery.svg` |
| AI Draft | `assets/icons/icon-ai-draft.svg` |
| Warning | `assets/icons/icon-warning.svg` |
| Paid | `assets/icons/icon-paid.svg` |
| Offline | `assets/icons/icon-offline.svg` |
| Permission | `assets/icons/icon-permission.svg` |

## Expo Implementation Note

For a future Expo app, prefer `lucide-react-native` for standard actions such as search, send, edit, filter, bell, check, and close. Use these SVG sources for Neo-specific navigation, categories, statuses, and branded workflow concepts.
