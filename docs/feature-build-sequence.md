# Feature Build Sequence

This sequence turns Neo's MVP backlog into small, reviewable implementation steps. Run only one prompt at a time.

| Order | Feature | Why This Comes Here | Depends On | Required UI Images | Required Runtime Assets | Expected Commit |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | Welcome screen | First public screen and safest first visual implementation | App shell, `AGENTS.md`, constants | `welcome.png` | `logoMarkNeo`, `onboardingHeroNeoOperatingSystem` | `add welcome screen` |
| 02 | Register / Sign In screen | Auth is required before protected setup and tabs | Welcome screen, auth route | `register-sign-in.png` | `logoMarkNeo` | `add sign in screen` |
| 03 | Setup checklist | Establishes setup workflow and task order | Auth/setup route group | `setup-checklist.png` | `illustrationSetupChecklist`, `iconWarning` | `add setup checklist` |
| 04 | Business profile setup | Provides business identity needed by later flows | Setup checklist | `business-profile.png` | `logoMarkNeo` | `add business profile setup` |
| 05 | Business type selection | Drives defaults for setup, products, and AI tone | Setup checklist | `business-type.png` | `iconProduct`, `iconCustomer` | `add business type selection` |
| 06 | WhatsApp setup status | Needed before inbox or Today can show connection state | Business type | `whatsapp-setup.png` | `errorWhatsappDisconnected`, `iconWarning` | `add whatsapp setup status` |
| 07 | AI personality settings | Required before AI draft UX can feel safe and on-brand | Business type | `ai-personality.png` | `iconAiDraft` | `add ai personality settings` |
| 08 | Payment and receipt rules | Required before receipt review/payment-sensitive flows | Business profile | `payment-rules.png` | `iconPaid`, `iconReceiptReview`, `iconWarning` | `add payment receipt rules` |
| 09 | Delivery zones and fees | Needed by order capture and delivery context | Business profile | `delivery-zones.png` | `iconDelivery` | `add delivery zones` |
| 10 | Product basics | Gives orders and AI drafts product context | Business type | `product-basics.png` | `emptyProducts`, `iconProduct` | `add product basics` |
| 11 | Main tab navigation | Creates the returning-user route structure before tab screens | Setup/auth routes | None | `iconToday`, `iconInbox`, `iconApprovals`, `iconFollowUps`, `iconSettings` | `add main tab navigation` |
| 12 | Today Command Center | Home dashboard depends on setup, status, and tab structure | Main tabs, setup data | `today-command-center.png` | `illustrationTodayCommandCenter`, queue icons | `add home dashboard` |
| 13 | Inbox conversation list | Primary customer triage list follows Home | Main tabs, mock conversation data | `inbox.png` | `emptyInbox`, `illustrationInboxAiDraft`, `iconInbox` | `add inbox conversation list` |
| 14 | Conversation detail | Detail route depends on inbox list and route params | Inbox list | `conversation-detail.png` | `illustrationInboxAiDraft`, `iconCustomer`, `iconOrder` | `add conversation detail` |
| 15 | AI draft reply review | Builds the main speed benefit inside conversation context | Conversation detail | `conversation-detail.png` | `iconAiDraft`, `successReplySent` | `add ai draft review` |
| 16 | Create order flow | Converts chat intent into structured order data | Conversation detail, product basics | `create-order.png` | `iconOrder`, `iconProduct`, `successOrderCreated` | `add create order flow` |
| 17 | Order detail | Reviews saved order, payment, delivery, and timeline | Create order | `order-detail.png` | `iconOrder`, `iconPaid`, `successOrderCreated` | `add order detail` |
| 18 | AI approval queue | Sensitive review queue depends on AI draft concepts | Tabs, AI draft data | `ai-approval-queue.png` | `emptyApprovals`, `iconApprovals`, `iconWarning` | `add approval queue` |
| 19 | Receipt review | Payment-sensitive flow depends on order and approval context | Order detail, approvals | `receipt-review.png` | receipt review, empty, error, success assets | `add receipt review` |
| 20 | Follow-up queue | Recovery workflow uses orders and conversations | Tabs, order/conversation data | `follow-ups.png` | `emptyFollowUps`, `illustrationFollowUpRecovery`, `successFollowUpSent` | `add follow up queue` |
| 21 | Customer profile summary | Customer memory is useful after conversations and orders exist | Conversation/order data | `customer-profile.png` | `iconCustomer` | `add customer profile summary` |
| 22 | Core settings | Settings consolidates setup and safety controls | Setup data, tabs | `settings.png` | `iconSettings`, `iconWarning` | `add core settings` |
| 23 | Permission denied and staff role gates | Role limits need target screens and sensitive actions first | Settings, auth/local role shape | `permission-denied.png` | `errorPermissionDenied`, `iconPermission` | `add permission gates` |
| 24 | Notifications and attention badges | Attention indicators depend on Today and tab counts | Today, operations data | None | `iconWarning` | `add attention badges` |
| 25 | Loading, empty, error, offline states | State coverage should wrap implemented screens, not placeholders | Core screens | Multiple screen references | `empty*`, `error*`, `success*` | `add screen states` |
| 26 | Local state and persistence refinements | Persistence is safer after screens reveal actual state needs | Setup, drafts, settings | None | None | `add local persistence` |
| 27 | Analytics instrumentation | Events should attach to completed user actions | Core flows, PostHog setup | None | None | `add analytics instrumentation` |
| 28 | Final MVP polish pass | Final visual and regression pass after features are complete | Prompts 01-27 | All screen references | All runtime app assets | `polish mvp screens` |

## Notes

- Prompt 01 is the next recommended action.
- If a later prompt stops because a package is missing, complete an approved setup task first.
- Do not run prompt 28 until the earlier feature prompts are complete or intentionally deferred.

