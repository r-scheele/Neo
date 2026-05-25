# MVP Scope

Status: Draft canonical MVP scope recovered from `docs/initial-mvp-scope.md`, `docs/product-brief.md`, `docs/screen-map.md`, `docs/visual-direction.md`, and `docs/ui-style-guide.md`.

## MVP Goal

The MVP proves that a WhatsApp-first Nigerian SME can use Neo to manage urgent customer conversations, AI reply drafts, order capture, receipt review, and follow-ups with less chaos and more trust than manual WhatsApp-only selling.

Neo remains one consolidated product. The MVP is the first mobile-first release slice of that product, not a separate simplified app.

## Must-Have Features

| Feature | Why It Must Exist | Simplest Acceptable Version |
| --- | --- | --- |
| Guided setup | Neo cannot reply safely without business context | Step checklist for profile, business type, WhatsApp status, AI tone, payment rules, delivery zones, and products |
| Today command center | The mobile app needs a clear daily home | Cards for pending receipts, unread or urgent chats, unpaid orders, due follow-ups, and AI recommendations |
| Unified inbox | Customer conversations are the core workflow | Conversation list with labels, unread count, AI status, and search or filter basics |
| Conversation detail | Users need to act inside the chat context | Chat thread, customer summary, AI draft, edit/send/takeover actions, and create order action |
| AI draft replies | This is the main speed benefit | Draft-only replies using product, delivery, payment, and tone context |
| AI approval queue | Sensitive actions need clear review | Cards for receipt review, complaints, refunds, discounts, large orders, and low-confidence replies |
| Order capture | Chats need to become structured commerce records | Create order from conversation with customer, product, variant, quantity, delivery fee, total, and payment status |
| Receipt review | Payment trust is central to Nigerian WhatsApp commerce | Receipt preview, extracted details, confidence, warning, confirm/reject/ask customer actions |
| Follow-up queue | Lost sales recovery is a visible value driver | Due, overdue, AI-suggested, and completed follow-ups with suggested message |
| Core settings | Users need control over tone and safety | AI tone, "ma/sir" usage, payment rules, delivery zones, and basic business profile |

## First Build Screens

| Order | Screen | MVP Role |
| --- | --- | --- |
| 1 | Setup Checklist | Gets the business ready for safe AI assistance |
| 2 | Today Command Center | Gives returning users one calm daily command center |
| 3 | Inbox | Lets the seller scan and prioritize customer conversations |
| 4 | Conversation Detail with AI Draft | Lets staff review context, edit/send drafts, and capture orders |
| 5 | AI Approval and Receipt Review | Keeps sensitive decisions human-approved and trust-first |

## V1 Feature List

- Setup checklist
- Today command center
- Inbox
- Conversation detail
- AI draft replies
- AI approval queue
- Order capture
- Order detail
- Receipt review
- Follow-ups
- Customer context
- Basic settings

## Explicit Non-Goals For MVP

- Public landing page, pricing page, blog, or help center.
- Full web dashboard parity.
- Autonomous customer replies without review for sensitive cases.
- Manual transfer auto-confirmation from screenshots.
- Refund automation.
- Broadcast marketing campaign tools.
- Advanced reports and downloadable exports.
- Multi-workflow builder for every business type.
- Billing portal and plan management.
- Internal admin console.

## Design Guardrails

- The app should feel calm, premium, wise, trustworthy, and warmly practical.
- Use the visual system in `docs/visual-direction.md` and `docs/ui-style-guide.md`.
- Keep mobile screens thumb-friendly and operationally dense without feeling like a compressed desktop dashboard.
- Human approval is required for sensitive actions.
- Never imply that manual bank transfer screenshots are enough to auto-confirm payment.
- Avoid neon AI visuals, robots, flashy gradients, and decorative dashboard styling.

## Cutline Rule

If a feature does not help the seller review, reply, capture, verify, or follow up from mobile, move it out of the MVP.

## Same-Product Roadmap After MVP

- Product import and WhatsApp catalog sync
- Voice note transcription
- Delivery rider assignment
- Customer segments
- Broadcasts and approved templates
- Workflow templates and job boards
- Analytics and daily summaries
- Team roles and activity logs
- Billing and usage plans
- Admin monitoring console

