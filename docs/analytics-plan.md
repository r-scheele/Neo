# Analytics Plan

Status: Complete for Phase A production-safe wiring. PostHog is installed with typed helper boundaries, public env placeholders, no-key no-op behavior, safe event property filtering, and sign-out identity reset. Live event QA still requires real public PostHog values in an uncommitted local environment.

## Analytics Goal

Analytics should answer whether Neo helps sellers activate, return, and complete the core commerce loop: setup, review, reply, capture, verify, and follow up.

Analytics must not collect private customer content, message text, receipt images, exact payment proof, bank details, phone numbers, or secrets.

## Provider Decision

Use PostHog for product analytics.

Reason:

- It is appropriate for activation and funnel analysis.
- Event names and properties can be typed.
- It supports product learning without requiring a custom analytics backend.

## Product Questions

- Do users complete setup?
- Which setup steps cause drop-off?
- Do returning users open urgent Today items?
- Do users review AI drafts before sending?
- Do users create orders from conversations?
- Do users open and complete receipt review safely?
- Do users send follow-ups?
- Which errors or offline states block the core loop?

## Event Naming Rules

- Use lowercase snake_case.
- Prefer past-tense action names.
- Keep event names stable.
- Do not include personal data in event names.
- Do not send private free text as a property.

## Event Plan

| Event | Trigger | Allowed Properties | Sensitive? | Product Question |
| --- | --- | --- | --- | --- |
| `app_opened` | App launches | `platform`, `is_first_open` | No | Do users return? |
| `onboarding_started` | User starts setup | `entry_point` | No | Do users begin activation? |
| `setup_step_completed` | Setup step is saved | `step_id`, `business_type` | No | Which steps complete or stall? |
| `onboarding_completed` | Required setup is complete | `business_type`, `step_count` | No | Do users activate? |
| `today_viewed` | Today tab is viewed | `queue_count_band`, `has_urgent_items` | No | Do users reach the daily command center? |
| `today_item_opened` | User opens a Today item | `item_type`, `priority` | No | What work draws action? |
| `inbox_conversation_opened` | User opens a conversation | `source_tab`, `has_unread`, `has_ai_draft` | No | Do users move from inbox to action? |
| `ai_draft_reviewed` | User views a draft | `confidence_band`, `draft_type` | No | Are drafts being reviewed? |
| `ai_draft_sent` | User sends or approves a draft | `edited_before_send`, `draft_type` | No | Do drafts help replies? |
| `order_created` | User saves an order | `source`, `item_count_band` | No | Are chats becoming orders? |
| `receipt_review_opened` | User opens receipt review | `source`, `confidence_band` | No | Are receipt risks reviewed? |
| `receipt_decision_recorded` | User confirms/rejects/asks/escalates | `decision_type`, `confidence_band`, `amount_band` | Medium | Are payment decisions completed safely? |
| `follow_up_sent` | User sends a follow-up | `reason`, `edited_before_send` | No | Are users recovering leads? |
| `permission_denied_seen` | User hits a locked action | `action_type`, `role_type` | No | Are roles blocking expected work? |
| `offline_state_seen` | Offline state appears | `screen`, `has_cached_data` | No | Does connectivity block workflows? |
| `error_seen` | Recoverable error appears | `screen`, `error_category` | No | Which failures need priority fixes? |

## Privacy Rules

Never track:

- Customer names.
- Phone numbers.
- Message text.
- AI prompt text.
- AI draft text.
- Receipt images.
- Bank account numbers.
- Exact payment references.
- Exact addresses.
- Access tokens or provider identifiers.

Use bands or categories instead of exact values for sensitive operational data. For example, use `amount_band` rather than an exact transfer amount.

## Implementation Rules

- Keep analytics centralized in `lib/analytics/`.
- Type event names and event properties.
- Keep analytics calls near user actions.
- Ensure analytics failure never blocks app behavior.
- Keep no-op behavior for local development when keys are missing.
- Configure production public PostHog env values only in the PostHog integration pass.
- Do not identify users with Clerk or other provider IDs in the client; the current Phase A decision is anonymous analytics plus reset on sign-out.
- Document analytics in privacy-facing materials before launch.

## Future Analytics

Future analytics may include:

- Funnel dashboards.
- Feature flags.
- Retention cohorts.
- Error trend dashboards.
- Support correlation using non-sensitive IDs.

These should wait until the MVP flows exist and event quality is reliable.

## Done Looks Like

Analytics is ready when every tracked event answers a product question and excludes private commerce content.
