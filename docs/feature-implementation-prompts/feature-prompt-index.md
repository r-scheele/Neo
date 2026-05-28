# Feature Prompt Index

Status values: `Not started`, `In progress`, `Blocked`, `Complete`.

Note: `Complete` means the local MVP screen/feature implementation exists. Production service integration status is tracked separately in `docs/integration-prompts/integration-prompt-index.md`.

| Order | Feature | Prompt File | Depends On | UI Reference | Runtime Assets | Status | Suggested Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Welcome screen | `prompts/01-welcome-screen.md` | App shell, `AGENTS.md`, image constants | `design-assets/ui-screens/welcome.png` | `logoMarkNeo`, `onboardingHeroNeoOperatingSystem` | Complete | `add welcome screen` |
| 02 | Register / Sign In screen | `prompts/02-register-sign-in-screen.md` | Welcome screen, auth route placeholder | `design-assets/ui-screens/register-sign-in.png` | `logoMarkNeo` | Complete | `add sign in screen` |
| 03 | Setup checklist | `prompts/03-setup-checklist.md` | Auth/setup route group, setup image asset | `design-assets/ui-screens/setup-checklist.png` | `illustrationSetupChecklist`, `iconWarning` | Complete | `add setup checklist` |
| 04 | Business profile setup | `prompts/04-business-profile.md` | Setup checklist | `design-assets/ui-screens/business-profile.png` | `logoMarkNeo` | Complete | `add business profile setup` |
| 05 | Business type selection | `prompts/05-business-type-selection.md` | Setup checklist, business profile route | `design-assets/ui-screens/business-type.png` | `iconProduct`, `iconCustomer` | Complete | `add business type selection` |
| 06 | WhatsApp setup status | `prompts/06-whatsapp-setup-status.md` | Setup checklist, business type | `design-assets/ui-screens/whatsapp-setup.png` | `errorWhatsappDisconnected`, `iconWarning` | Complete | `add whatsapp setup status` |
| 07 | AI personality settings | `prompts/07-ai-personality-settings.md` | Setup checklist, business type | `design-assets/ui-screens/ai-personality.png` | `iconAiDraft` | Complete | `add ai personality settings` |
| 08 | Payment and receipt rules | `prompts/08-payment-receipt-rules.md` | Setup checklist, business profile | `design-assets/ui-screens/payment-rules.png` | `iconPaid`, `iconReceiptReview`, `iconWarning` | Complete | `add payment receipt rules` |
| 09 | Delivery zones and fees | `prompts/09-delivery-zones.md` | Setup checklist, business profile | `design-assets/ui-screens/delivery-zones.png` | `iconDelivery` | Complete | `add delivery zones` |
| 10 | Product basics | `prompts/10-product-basics.md` | Setup checklist, business type | `design-assets/ui-screens/product-basics.png` | `emptyProducts`, `iconProduct` | Complete | `add product basics` |
| 11 | Main tab navigation | `prompts/11-main-tab-navigation.md` | Auth/setup routes, placeholder tabs | None | `iconToday`, `iconInbox`, `iconApprovals`, `iconFollowUps`, `iconSettings` | Complete | `add main tab navigation` |
| 12 | Today Command Center | `prompts/12-today-command-center.md` | Main tab navigation, setup data shape | `design-assets/ui-screens/today-command-center.png` | `illustrationTodayCommandCenter`, `iconToday`, `iconWarning`, `iconPaid`, `iconReceiptReview`, `iconFollowUps` | Complete | `add home dashboard` |
| 13 | Inbox conversation list | `prompts/13-inbox-conversation-list.md` | Main tab navigation, mock conversation data | `design-assets/ui-screens/inbox.png` | `emptyInbox`, `illustrationInboxAiDraft`, `iconInbox`, `iconAiDraft` | Complete | `add inbox conversation list` |
| 14 | Conversation detail | `prompts/14-conversation-detail.md` | Inbox list, typed conversation route params | `design-assets/ui-screens/conversation-detail.png` | `illustrationInboxAiDraft`, `iconCustomer`, `iconOrder` | Complete | `add conversation detail` |
| 15 | AI draft reply review | `prompts/15-ai-draft-reply-review.md` | Conversation detail | `design-assets/ui-screens/conversation-detail.png` | `iconAiDraft`, `successReplySent` | Complete | `add ai draft review` |
| 16 | Create order flow | `prompts/16-create-order-flow.md` | Conversation detail, product basics data | `design-assets/ui-screens/create-order.png` | `iconOrder`, `iconProduct`, `iconDelivery`, `successOrderCreated` | Complete | `add create order flow` |
| 17 | Order detail | `prompts/17-order-detail.md` | Create order route/data shape | `design-assets/ui-screens/order-detail.png` | `iconOrder`, `iconPaid`, `successOrderCreated` | Complete | `add order detail` |
| 18 | AI approval queue | `prompts/18-ai-approval-queue.md` | Main tabs, AI draft review data shape | `design-assets/ui-screens/ai-approval-queue.png` | `emptyApprovals`, `iconApprovals`, `iconWarning`, `iconAiDraft` | Complete | `add approval queue` |
| 19 | Receipt review | `prompts/19-receipt-review.md` | Order detail, approval queue | `design-assets/ui-screens/receipt-review.png` | `illustrationReceiptReview`, `emptyReceipts`, `errorReceiptUnreadable`, `successPaymentVerified`, `iconReceiptReview` | Complete | `add receipt review` |
| 20 | Follow-up queue | `prompts/20-follow-up-queue.md` | Main tabs, order/conversation data shape | `design-assets/ui-screens/follow-ups.png` | `emptyFollowUps`, `illustrationFollowUpRecovery`, `successFollowUpSent`, `iconFollowUps` | Complete | `add follow up queue` |
| 21 | Customer profile summary | `prompts/21-customer-profile-summary.md` | Conversation detail, order detail | `design-assets/ui-screens/customer-profile.png` | `iconCustomer` | Complete | `add customer profile summary` |
| 22 | Core settings | `prompts/22-core-settings.md` | Main tabs, setup settings data | `design-assets/ui-screens/settings.png` | `iconSettings`, `iconWarning` | Complete | `add core settings` |
| 23 | Permission denied and staff role gates | `prompts/23-permission-denied-staff-roles.md` | Auth state shape or local role model, settings | `design-assets/ui-screens/permission-denied.png` | `errorPermissionDenied`, `iconPermission` | Complete | `add permission gates` |
| 24 | Notifications and attention badges | `prompts/24-notifications-attention-badges.md` | Today, tabs, operations data | None | `iconWarning` | Complete | `add attention badges` |
| 25 | Loading, empty, error, offline states | `prompts/25-loading-empty-error-offline-states.md` | Core screens implemented | Multiple existing screen references | `empty*`, `error*`, `success*` assets | Complete | `add screen states` |
| 26 | Local state and persistence refinements | `prompts/26-local-state-persistence-refinements.md` | Setup, drafts, settings screens | None | None | Complete | `add local persistence` |
| 27 | Analytics instrumentation | `prompts/27-analytics-instrumentation.md` | Core flows implemented, PostHog installed/configured | None | None | Complete | `add analytics instrumentation` |
| 28 | Final MVP polish pass | `prompts/28-final-mvp-polish.md` | Prompts 01-27 complete or intentionally skipped | All generated UI references | All runtime app assets | Complete | `polish mvp screens` |
