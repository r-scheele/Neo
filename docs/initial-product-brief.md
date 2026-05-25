# Initial Product Brief

## App Name

Neo

## One-Line Description

Neo is an AI-powered WhatsApp commerce operating system for Nigerian SMEs that helps sellers reply customers, capture orders, verify payments, review receipts, manage follow-ups, coordinate delivery, remember customers, and grow sales from one mobile-first command center.

## Product Category

Mobile-first SaaS operating system and AI operations tool for WhatsApp-first commerce.

## Problem

### Main Pain

Nigerian SMEs often run the business from WhatsApp, but WhatsApp does not organize the business. Chats become the sales desk, order book, payment tracker, CRM, delivery board, and staff handoff tool at the same time.

### Why It Matters

Every missed reply, forgotten payment reminder, incorrect delivery fee, or unsafe receipt confirmation can cost money and trust. The business owner needs help, but they still need control over sensitive actions.

### Current Workaround

Sellers use WhatsApp search, pinned chats, notebooks, screenshots, phone galleries, spreadsheets, bank alerts, staff memory, and repeated manual messages.

### Why Existing Options Fail

Generic CRMs and dashboards are often too formal, too desktop-heavy, or not built around Nigerian WhatsApp selling behavior. Basic chatbots can reply, but they may not understand product availability, delivery fees, manual transfers, "ma/sir" language, receipts, or human approval needs.

## Audience

### Primary User

Nigerian WhatsApp-first SME owners who personally manage customer replies, orders, payments, and staff follow-up.

### Secondary Users

- Sales reps handling chats
- Fulfillment staff preparing orders
- Dispatch staff updating deliveries
- Accountants or managers reviewing payments

### Outside The First MVP Slice

These users and surfaces may still belong to Neo later; they are not separate products. They are outside the first mobile validation slice.

- Large enterprises needing custom procurement workflows
- Businesses that do not sell or coordinate through WhatsApp
- Fully autonomous AI commerce without human approval
- Public marketing site, admin console, billing portal, and advanced analytics dashboards

## Jobs To Be Done

- When a customer asks about a product, I want Neo to draft a correct, polite reply so I can respond quickly without inventing details.
- When a customer sends a receipt screenshot, I want Neo to extract the details and remind me to verify against my bank alert so I do not dispatch unpaid orders.
- When a customer asks for account details and disappears, I want Neo to create a respectful follow-up so I can recover the sale without spamming.
- When I open the app, I want to see what needs attention today so I can act before issues become complaints.
- When staff help me reply to customers, I want clear guardrails so sensitive actions remain under owner control.

## Core Features

Neo's features belong to one connected product system. MVP status describes release priority, not whether the feature is part of Neo.

| Feature | User Value | MVP? | Notes |
| --- | --- | --- | --- |
| Guided setup | Gets Neo enough context to be useful | Yes | Business type, tone, payments, delivery, WhatsApp status |
| Today command center | Shows urgent work in one place | Yes | Not a full analytics dashboard |
| WhatsApp inbox | Organizes customer conversations | Yes | Labels, unread state, AI handled, needs review |
| Conversation detail | Lets staff review and send AI drafts | Yes | Includes customer and order context |
| AI draft replies | Saves reply time while preserving human control | Yes | Draft-first for MVP |
| Order capture | Turns chat intent into a structured order | Yes | Product, variant, delivery fee, payment status |
| Receipt review | Reduces risky payment confirmation | Yes | AI extracts, human verifies |
| Follow-up queue | Helps recover unpaid/high-intent leads | Yes | Manual send or approve-first |
| Customer memory | Makes replies feel informed | Partial | Basic profile, order history, notes, preferences |
| AI guardrails | Prevents unsafe automation | Yes | Sensitive actions require approval |
| Product catalog | Gives AI reliable product context | Partial | MVP should support minimal products, not full inventory |
| Delivery management | Keeps delivery promises visible | Partial | Zones and delivery fees before full rider workflow |
| Analytics | Helps owners see performance | Later | MVP can show small summary metrics only |
| Team permissions | Controls staff access | Later/partial | Basic roles may be needed, custom matrix later |
| Workflow jobs | Organizes custom jobs and service pipelines | Later/partial | First release may capture only linked order/job notes |
| Broadcasts and templates | Supports compliant WhatsApp campaigns and utility updates | Later | Requires policy-aware template flow |
| Billing and usage | Supports monetization and plan limits | Later | Needed before paid launch |
| Admin monitoring | Lets Neo operators monitor tenants and integrations | Later/internal | Can start outside user-facing mobile MVP |

## MVP Non-Goals

These are same-product modules deferred from the first release, not different app ideas.

- Do not build the public marketing website.
- Do not build admin/internal console.
- Do not build full billing, invoices, plan management, or usage metering.
- Do not build full broadcasts and WhatsApp template management.
- Do not build advanced analytics reports.
- Do not automate manual bank transfer confirmation from screenshot alone.
- Do not support every workflow template in the first release.
- Do not choose the final technology stack in this phase.

## User Stories

- As a business owner, I want to open Neo and see today's urgent work so I know what to handle first.
- As a seller, I want AI draft replies that use my product and delivery rules so I can reply customers faster.
- As a staff member, I want to create an order from a chat so payment and delivery details do not get lost.
- As an owner, I want receipt screenshots to require review so staff do not dispatch based on edited images.
- As a seller, I want follow-up suggestions for unpaid customers so I can recover sales politely.

## Primary Screens

| Screen | Purpose | Primary Action | States Needed |
| --- | --- | --- | --- |
| Setup Checklist | Complete minimum business setup | Continue setup task | Loading, empty, error, offline, first-time, returning |
| Today Command Center | Review urgent operational queue | Open urgent item | Loading, empty, error, offline, long content, returning |
| Inbox | Triage WhatsApp conversations | Open conversation | Loading, empty, error, offline, permission denied, long content |
| Conversation Detail | Review chat and AI draft | Send/edit AI reply | Loading, error, offline, permission denied, long content, success |
| AI Approval Queue | Review sensitive AI actions | Approve/edit/reject | Loading, empty, error, offline, permission denied, success |
| Receipt Review | Verify bank transfer screenshot | Confirm/reject/ask customer | Loading, error, offline, permission denied, long content, success |
| Order Detail | Review structured order | Send reminder/mark stage | Loading, error, offline, permission denied, long content, success |
| Follow-ups | Recover unpaid or silent leads | Send/edit reminder | Loading, empty, error, offline, success |
| Customer Profile | Understand customer history | Add note/open order | Loading, empty, error, offline, long content |
| Settings | Manage business and AI rules | Save setting | Loading, error, offline, permission denied, success |

## Data Model Thinking

| Entity | Key Fields | Source | Persistence | Notes |
| --- | --- | --- | --- | --- |
| Business | name, category, location, phone, WhatsApp status, settings | User setup/API | Backend | Multi-tenant from the start |
| User | name, email, phone, role, permissions | Auth/API | Backend | Owner and staff |
| Customer | name, phone, location, tags, notes, order history | WhatsApp/API/user edits | Backend | Phone number is primary identity |
| Conversation | customer, messages, labels, assignment, AI state | WhatsApp API | Backend | Must preserve history and review state |
| Message | sender, body, media, timestamp, status, transcription | WhatsApp/API/AI | Backend | Media and voice notes need handling |
| Product | name, price, variants, stock, images, AI notes | User/API/import | Backend | MVP can start simple |
| Order | items, totals, delivery fee, payment status, timeline | App/AI draft | Backend | Created from chat or manually |
| Payment | method, amount, provider, status, receipt, verification | Provider/app | Backend | Provider-confirmed and manual receipt states differ |
| Receipt | image, extracted details, confidence, review decision | WhatsApp/media/AI/user | Backend | Human approval is required |
| Follow-up | customer, reason, linked order, due time, suggested message, status | AI/app | Backend | Must avoid spam |
| Audit Log | actor, action, resource, timestamp | App/backend | Backend | Needed for trust-sensitive actions |

## Permissions

| Permission | Why Needed | Required For MVP? | Fallback If Denied |
| --- | --- | --- | --- |
| WhatsApp Business connection | Receive and send customer messages | Yes | Demo/mock mode or setup-blocked state |
| Media access/upload | Review receipts and product images | Yes | Manual text-only entry |
| Notifications | Alert staff about approvals, receipts, and follow-ups | Strongly recommended | In-app alerts only |
| Camera | Capture products or receipt evidence if needed | Later | File picker/manual entry |
| Contacts | Match customer names if owner opts in | No | Use WhatsApp/customer records only |

## Analytics Events

| Event | Trigger | Why It Matters |
| --- | --- | --- |
| setup_step_completed | User completes setup step | Measures activation friction |
| inbox_conversation_opened | User opens a chat | Shows core engagement |
| ai_draft_approved | User sends an AI draft | Measures AI trust |
| ai_draft_edited | User edits AI draft | Reveals quality gaps |
| receipt_review_completed | User confirms/rejects/asks customer | Tracks trust workflow usage |
| followup_sent | User sends recovery message | Measures sales recovery |
| order_created_from_chat | Chat becomes order | Measures commerce conversion |
| permission_denied_seen | User hits restricted action | Reveals role/setup issues |

Analytics must not store raw customer message content, receipt images, bank details, or private customer data.

## Risks

- Product risk: Sellers may want help but resist setup. Validate with a guided setup prototype and a demo workspace.
- Technical risk: WhatsApp, payment, media, AI, and webhooks create many failure points. Start with narrow flows and clear degraded states.
- Design risk: The app may feel like a cramped desktop dashboard. Prioritize mobile command decisions, not full management screens.
- AI risk: Wrong replies or unsafe confirmations could harm trust. Keep AI draft-first and approval-first.
- Privacy/security risk: Customer chats and payment evidence are sensitive. Avoid content analytics, expose role-based permissions, and keep audit trails.

## Success Metrics

- Activation: Business completes setup checklist and receives first WhatsApp conversation in Neo.
- Engagement: Owner or staff reviews the command center and opens inbox on active selling days.
- AI quality: Meaningful share of AI drafts are approved or lightly edited.
- Trust: Manual receipt confirmations always pass through review flow.
- Commerce: Orders are created from conversations and unpaid customers receive follow-ups.
- Retention: Businesses return weekly because Neo helps prevent missed sales and risky dispatches.

## MVP Release Criteria

The MVP is ready to build when:

- Product scope is consolidated, and MVP build scope is limited to setup, command center, inbox, AI drafts, orders, receipt review, follow-ups, customer context, and core settings.
- Sensitive AI actions are approval-first.
- Manual receipt screenshots cannot auto-confirm payment.
- First-time, loading, empty, error, offline, permission denied, success, and long-content states are defined.
- The visual direction is specific enough for UI and image generation.
- The image prompt pack has named assets and copy-paste-ready prompts.

## Open Questions

- Should MVP support direct WhatsApp sending immediately, or start with an approval workflow that prepares replies?
- Which business type should the first demo workspace optimize for: fashion vendor, tailor, food vendor, or general SME?
- What minimum setup must be completed before users can reach the command center?
- How much customer history should be visible on mobile before the UI feels crowded?
- Should the first paid plan limit by AI replies, conversations, team members, or connected WhatsApp numbers?
