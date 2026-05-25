# Initial Screen Map

Neo is one consolidated product. This initial map identifies the first mobile routes for the unified product, not separate products.

## First Five Screens

| Order | Screen | Purpose | Primary Action |
| --- | --- | --- | --- |
| 1 | Setup Checklist | Get the business ready for safe AI assistance | Continue setup |
| 2 | Today Command Center | Show urgent work and recommended next actions | Open an urgent item |
| 3 | Inbox | Triage WhatsApp customer conversations | Open a conversation |
| 4 | Conversation Detail | Review chat, AI draft, customer context, and order actions | Send/edit draft or create order |
| 5 | AI Approval and Receipt Review | Approve sensitive AI actions and verify manual transfer receipts | Approve, reject, edit, or ask customer |

## Screen List

Routes are descriptive placeholders for product planning only. The final navigation stack is intentionally not chosen yet.

| Screen | Route Idea | Purpose | Primary Action | Data Needed | Auth Required |
| --- | --- | --- | --- | --- | --- |
| Welcome | `/welcome` | Explain Neo and start setup | Start setup | App copy | No |
| Register / Sign In | `/auth` | Identify owner or staff | Continue | User account | No |
| Setup Checklist | `/setup` | Show minimum setup progress | Open next setup task | Business, setup state | Yes |
| Business Profile | `/setup/business` | Capture business identity | Save profile | Business details | Yes |
| Business Type | `/setup/business-type` | Select recommended workflow context | Choose type | Business categories | Yes |
| WhatsApp Setup | `/setup/whatsapp` | Connect or check WhatsApp Business status | Connect/test | WhatsApp connection | Yes |
| AI Personality | `/setup/ai` | Configure Neo Assistant tone and language | Save rules | AI settings | Yes |
| Payment Rules | `/setup/payments` | Set bank/payment-link/manual receipt rules | Save payment setup | Bank/provider settings | Yes |
| Delivery Zones | `/setup/delivery` | Set locations and delivery fees | Add zone | Delivery zones | Yes |
| Product Basics | `/setup/products` | Add starter products for AI context | Add product | Product records | Yes |
| Today Command Center | `/tabs/today` | Show operational queue | Open task | Conversations, orders, receipts, follow-ups | Yes |
| Inbox | `/tabs/inbox` | List WhatsApp conversations | Open conversation | Conversations, customers, labels | Yes |
| Conversation Detail | `/conversation/:id` | Show messages, AI draft, and context | Send/edit/create order | Messages, customer, product/order context | Yes |
| Create Order | `/order/new` | Convert chat intent into structured order | Save order | Customer, products, delivery, payment | Yes |
| Order Detail | `/order/:id` | Review order, payment, delivery, and timeline | Send reminder or update status | Order, customer, payment, delivery | Yes |
| AI Approval Queue | `/tabs/approvals` | Review sensitive AI recommendations | Approve/edit/reject | AI draft actions, guardrails | Yes |
| Receipt Review | `/receipt/:id` | Verify uploaded bank transfer receipt | Confirm/reject/ask customer | Receipt, payment, order, image | Yes |
| Follow-ups | `/tabs/follow-ups` | Manage due, overdue, and suggested follow-ups | Send/edit/mark done | Follow-ups, customers, orders | Yes |
| Customer Profile | `/customer/:id` | See customer history and preferences | Add note/open order | Customer, orders, messages, follow-ups | Yes |
| Settings | `/tabs/settings` | Manage business, AI, payment, and delivery rules | Save setting | Business settings | Yes |
| Permission Denied | `/permission-denied` | Explain restricted role/action | Return or request access | User role | Yes |
| Offline State | App-level state | Explain connection limits | Retry or view cached | Cached data/network status | Yes |

## Navigation Groups

- Public routes: Welcome, Register / Sign In
- Setup routes: Setup Checklist, Business Profile, Business Type, WhatsApp Setup, AI Personality, Payment Rules, Delivery Zones, Product Basics
- Main tab routes: Today Command Center, Inbox, AI Approval Queue, Follow-ups, Settings
- Detail routes: Conversation Detail, Order Detail, Receipt Review, Customer Profile
- Modal or focused action routes: Create Order, Permission Denied, Offline State

## Screen Ownership

| Screen | Feature Owner | Shared Components | Notes |
| --- | --- | --- | --- |
| Setup Checklist | Onboarding | Progress list, status badges, task cards | Must not feel long or intimidating |
| Today Command Center | Operations | Metric cards, alert rows, queue cards | First returning-user screen |
| Inbox | Conversations | Chat rows, filters, labels, avatars | Prioritize scan speed |
| Conversation Detail | Conversations + AI | Chat bubbles, AI draft card, customer card | Most important interaction screen |
| AI Approval Queue | AI Safety | Approval card, confidence badge, decision buttons | Sensitive actions must be explicit |
| Receipt Review | Payments | Receipt preview, extraction rows, warning banner | Trust-first flow |
| Order Detail | Orders | Timeline, item rows, payment card, delivery card | Avoid dense desktop table feel |
| Follow-ups | Recovery | Follow-up cards, suggested message, due badges | Must feel helpful, not spammy |
| Customer Profile | CRM | Stats, tabs, memory card, notes | Keep summary concise on mobile |
| Settings | Controls | Form rows, toggles, segmented controls | Keep dangerous settings behind confirmation |

## Done Looks Like

This screen map is ready when a designer or future coding agent can create navigation without inventing the first product structure.
