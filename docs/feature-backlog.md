# Feature Backlog

Status: Draft canonical backlog recovered from `docs/initial-feature-backlog.md`, `docs/product-brief.md`, `docs/mvp-scope.md`, and `docs/screen-map.md`.

## Backlog Rules

- One row per feature.
- Neo is one consolidated product; backlog priorities describe build order, not separate product ideas.
- Product surfaces are separate: `apps/marketing` for public marketing, `apps/web` for future desktop dashboard, and `apps/mobile` for the current mobile MVP.
- MVP features must support review, reply, capture, verify, fulfill, remember, measure, delegate, or follow up.
- AI-sensitive actions stay draft-first or approval-first.
- Manual bank transfer screenshots never auto-confirm payment.
- Every selected feature needs its own feature spec before coding.

## Feature Backlog

| Priority | Feature | User Value | Screen(s) | Data Needed | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Guided setup checklist | Gets Neo enough context to be useful | Setup Checklist | Business, setup steps | Medium | Draft |
| P0 | Business profile | Names and localizes the business | Business Profile | Name, category, location, phone | Low | Draft |
| P0 | Business type selection | Enables relevant defaults | Business Type | Category choice | Low | Draft |
| P0 | WhatsApp connection status | Confirms message source | WhatsApp Setup, Today | Connection status, phone number | High | Draft |
| P0 | AI personality settings | Keeps replies aligned with brand | AI Personality, Settings | Tone, language, ma/sir preference | Medium | Draft |
| P0 | Payment and receipt rules | Protects trust around payments | Payment Rules, Settings | Bank/provider/manual rules | High | Draft |
| P0 | Today command center | Shows urgent work | Today | Conversations, receipts, orders, follow-ups | Medium | Draft |
| P0 | Inbox conversation list | Organizes customer chats | Inbox | Conversations, labels, assignments | High | Draft |
| P0 | Conversation detail | Lets staff act inside context | Conversation Detail | Messages, customer, AI draft, product/order context | High | Draft |
| P0 | AI draft reply review | Saves response time with human control | Conversation Detail, Approvals | Draft, confidence, sources, guardrails | High | Draft |
| P0 | Order capture from chat | Turns interest into structured commerce records | Conversation Detail, Create Order | Customer, products, delivery, totals | High | Draft |
| P0 | Receipt review | Prevents unsafe payment confirmation | Receipt Review, Approvals | Receipt image, extracted details, payment/order | High | Draft |
| P0 | Follow-up queue | Recovers unpaid orders and silent leads | Follow-ups, Today | Customer, reason, due date, message | Medium | Draft |
| P1 | Customer profile summary | Improves context and repeat sales | Customer Profile, Conversation Detail | Customer, orders, notes, preferences | Medium | Draft |
| P1 | Product basics | Gives AI reliable product context | Product Basics, Create Order | Product name, price, variants | Medium | Draft |
| P1 | Delivery zones and fees | Prevents vague delivery promises | Delivery Zones, Order Detail | Zone, fee, notes | Medium | Draft |
| P1 | Notifications | Helps users act on urgent items | App-level, Today | Alert type, linked item | Medium | Draft |
| P1 | Basic staff roles | Limits sensitive actions | Auth, Settings, Permission Denied | Role, permissions | Medium | Draft |
| P2 | Voice note transcription | Captures requests from voice notes | Conversation Detail | Audio, transcript, summary | High | Draft |
| P2 | WhatsApp catalog sync | Reduces product setup work | Product Basics, Settings | Catalog items, sync status | High | Draft |
| P2 | Analytics overview | Shows business performance | Today, Analytics | Revenue, orders, AI metrics | Medium | Draft |
| P2 | Workflow job cards | Supports tailoring/custom/service jobs | Workflows | Template, stages, fields | High | Draft |
| P2 | Broadcast templates | Supports campaigns and utility messages | Broadcasts | Template, audience, approvals | High | Draft |
| P2 | Billing and usage | Supports SaaS monetization | Billing | Plan, usage, invoices | Medium | Draft |
| P2 | Public marketing and demo | Explains the unified Neo promise | Landing, Pricing, Demo, Use Cases | Content, plans, demo data | Medium | Draft |
| P2 | Web dashboard shell | Reserves app.neo.com for future desktop operations | Web Dashboard | Auth, API contracts, dashboard IA | Medium | Scaffolded only |
| P2 | Help, legal, and trust pages | Supports adoption and compliance | Help, Legal, Trust | Articles, policies | Medium | Draft |
| P2 | Internal admin monitoring | Lets Neo team operate the platform | Admin Console | Tenants, webhooks, AI runs, payments | High | Draft |

## P0 Feature Notes

### Guided Setup Checklist

- Target user: First-time business owner.
- Problem solved: Neo cannot reply or recommend safely without business context.
- Core action: Complete minimum setup tasks.
- Dependencies: Auth and business record.
- Edge cases: User skips WhatsApp connection, low signal, incomplete product data.
- Not included: Full onboarding education course.

### Today Command Center

- Target user: Returning owner or manager.
- Problem solved: The seller needs to know what needs attention now.
- Core action: Open an urgent item.
- Dependencies: Conversations, orders, receipts, follow-ups.
- Edge cases: No data yet, all clear, offline, long queues.
- Not included: Full analytics dashboard.

### Inbox Conversation List

- Target user: Owner or sales staff.
- Problem solved: WhatsApp chats are hard to prioritize.
- Core action: Open the right conversation.
- Dependencies: WhatsApp connection, customer records, labels.
- Edge cases: Unassigned chats, complaints, voice notes, unread floods.
- Not included: Broadcast campaign management.

### Conversation Detail

- Target user: Sales staff reviewing customer messages.
- Problem solved: Replies need context from products, delivery rules, payments, and customer history.
- Core action: Send/edit AI draft or create order.
- Dependencies: Messages, AI draft, customer profile, product basics.
- Edge cases: Low-confidence draft, complaint, refund request, missing product price, offline.
- Not included: Fully autonomous replies for sensitive decisions.

### Receipt Review

- Target user: Owner, accountant, or manager.
- Problem solved: Bank transfer screenshots can be fake or misread.
- Core action: Confirm, reject, ask customer, or escalate.
- Dependencies: Receipt media, AI extraction, order/payment record.
- Edge cases: Blurry receipt, amount mismatch, wrong sender, duplicate receipt, no bank alert.
- Not included: Auto-confirming manual transfers from screenshots.

### Follow-up Queue

- Target user: Owner or sales staff.
- Problem solved: Unpaid and silent leads get forgotten.
- Core action: Send or edit respectful follow-up.
- Dependencies: Orders, conversations, customer status.
- Edge cases: Customer declined, complaint, outside WhatsApp service window, too many reminders.
- Not included: Spammy bulk marketing.

## Prioritization Questions

- Does this feature help the seller review, reply, capture, verify, or follow up?
- Can it be tested as part of the same Neo product without requiring every module at once?
- Does it require sensitive permissions, payment state, or AI guardrails?
- Can the user understand the state in one mobile glance?
- What can go wrong if staff use this under pressure?
