# Asset Inventory

Core visual assets and production SVG icons have been generated. Raster icon PNGs are review artifacts unless marked otherwise.

## Core Visual System

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Global | Style anchor | Defines palette, lighting, proportions, and visual mood | `docs/image-prompts/style-anchor.md` | `style-anchor-neo-commerce-system.png` | Generated | Transparent PNG saved at `assets/images/style-anchor-neo-commerce-system.png`; use as reference for future assets |
| Global | Logo mark | Brand mark for header, splash, app icon source | `docs/image-prompts/logo.md` | `logo-mark-neo.png` | Generated | Transparent background; saved at `assets/images/logo-mark-neo.png` |
| Global | App icon source | Solid-background square app icon source | `docs/image-prompts/logo.md` | `app-icon-source-neo.png` | Generated | Opaque iOS/store icon source saved at `assets/images/app-icon-source-neo.png`; transparent adaptive foreground saved at `assets/images/app-icon-foreground-neo.png` |
| Global | Brand companion object | Optional non-character mascot-like object for state art | `docs/image-prompts/mascot.md` | `mascot-neo-guide-object.png` | Generated | Transparent non-character companion object; saved at `assets/images/mascot-neo-guide-object.png` |
| Launch | Splash screen | Branded launch visual | `docs/image-prompts/splash-screen.md` | `splash-screen-neo.png` | Generated | Warm ivory background `#FBF7EF`; saved at `assets/images/splash-screen-neo.png` |

## Onboarding And Screen Illustrations

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Welcome / Setup | Onboarding hero | Communicates the full operating-system promise | `docs/image-prompts/onboarding-hero.md` | `onboarding-hero-neo-operating-system.png` | Generated | Transparent portrait PNG saved at `assets/images/onboarding-hero-neo-operating-system.png`; portrait-friendly, no text |
| Setup Checklist | Setup illustration | Supports first-time setup | `docs/image-prompts/screen-illustrations.md` | `illustration-setup-checklist.png` | Generated | Transparent PNG saved at `assets/images/illustration-setup-checklist.png` |
| Today Command Center | Command center illustration | Shows organized daily operations | `docs/image-prompts/screen-illustrations.md` | `illustration-today-command-center.png` | Generated | Transparent PNG saved at `assets/images/illustration-today-command-center.png`; use lightly, not in dense returning view |
| Inbox | Inbox AI draft illustration | Supports inbox intro or empty context | `docs/image-prompts/screen-illustrations.md` | `illustration-inbox-ai-draft.png` | Generated | Transparent PNG saved at `assets/images/illustration-inbox-ai-draft.png`; no fake readable chat text |
| Receipt Review | Receipt review illustration | Reinforces trust-first payment review | `docs/image-prompts/screen-illustrations.md` | `illustration-receipt-review.png` | Generated | Transparent PNG saved at `assets/images/illustration-receipt-review.png`; avoids automatic-payment implication |
| Follow-ups | Follow-up recovery illustration | Supports recovery workflow | `docs/image-prompts/screen-illustrations.md` | `illustration-follow-up-recovery.png` | Generated | Transparent PNG saved at `assets/images/illustration-follow-up-recovery.png`; calm, not spammy |

## Empty States

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Inbox | Empty inbox | No conversations yet | `docs/image-prompts/empty-states.md` | `empty-inbox.png` | Generated | Transparent PNG saved at `assets/images/empty-inbox.png`; encourages WhatsApp test message |
| AI Approval Queue | Empty approvals | No sensitive actions waiting | `docs/image-prompts/empty-states.md` | `empty-approvals.png` | Generated | Transparent PNG saved at `assets/images/empty-approvals.png`; calm all-clear |
| Follow-ups | Empty follow-ups | No due follow-ups | `docs/image-prompts/empty-states.md` | `empty-follow-ups.png` | Generated | Transparent PNG saved at `assets/images/empty-follow-ups.png`; encouraging, not celebratory |
| Product Basics | Empty products | No products added | `docs/image-prompts/empty-states.md` | `empty-products.png` | Generated | Transparent PNG saved at `assets/images/empty-products.png`; prompts first product |
| Receipt Review | Empty receipts | No pending receipts | `docs/image-prompts/empty-states.md` | `empty-receipts.png` | Generated | Transparent PNG saved at `assets/images/empty-receipts.png`; trust-focused without auto-paid implication |

## Success States

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Conversation Detail | Reply sent | Confirms message sent | `docs/image-prompts/success-states.md` | `success-reply-sent.png` | Generated | Transparent PNG saved at `assets/images/success-reply-sent.png`; small confirmation/modal art |
| Receipt Review | Payment verified | Confirms human-reviewed payment | `docs/image-prompts/success-states.md` | `success-payment-verified.png` | Generated | Transparent PNG saved at `assets/images/success-payment-verified.png`; avoids implying screenshot auto-verified |
| Create Order | Order created | Confirms order saved | `docs/image-prompts/success-states.md` | `success-order-created.png` | Generated | Transparent PNG saved at `assets/images/success-order-created.png`; calm commerce moment |
| Follow-ups | Follow-up sent | Confirms recovery message sent | `docs/image-prompts/success-states.md` | `success-follow-up-sent.png` | Generated | Transparent PNG saved at `assets/images/success-follow-up-sent.png`; respectful tone |

## Error And Utility States

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| App-level | Offline | Explains limited connection | `docs/image-prompts/error-states.md` | `error-offline.png` | Generated | Transparent PNG saved at `assets/images/error-offline.png`; helpful, not alarming |
| WhatsApp Setup | WhatsApp disconnected | Shows reconnection issue | `docs/image-prompts/error-states.md` | `error-whatsapp-disconnected.png` | Generated | Transparent PNG saved at `assets/images/error-whatsapp-disconnected.png`; no WhatsApp logo imitation |
| Receipt Review | Receipt unreadable | Blurry/failed extraction | `docs/image-prompts/error-states.md` | `error-receipt-unreadable.png` | Generated | Transparent PNG saved at `assets/images/error-receipt-unreadable.png`; encourages resend/retry |
| Permission Denied | Restricted access | Role cannot perform action | `docs/image-prompts/error-states.md` | `error-permission-denied.png` | Generated | Transparent PNG saved at `assets/images/error-permission-denied.png`; calm locked state |

## Icons And Store Artwork

| Screen | Asset | Purpose | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Global | Core icon set | Custom business/category/status icons | `docs/image-prompts/icon-set.md` | `assets/icons/icon-*.svg` | Vectorized | Production SVG sources saved in `assets/icons`; PNG contact sheet remains in `assets/images` for review only |
| Store | App store screenshot set | Future store artwork using real screen captures | `docs/image-prompts/app-store-screenshots.md` | `store-screenshot-set-neo.png` | Planned | Generate only after real screens exist |

## UI Design Reference Images

These are planning-only UI screenshot references for Codex implementation prompts. They belong in `design-assets/ui-screens/`, not `assets/images/`, and they are not shipped inside the app.

| Screen | Prompt File | File Name | Status | Notes |
| --- | --- | --- | --- | --- |
| Global | `docs/ui-design-prompts/master-ui-design-style-prompt.md` | `design-assets/ui-screens/master-ui-style-reference.png` | Generated | UI reference screenshot saved; use as reference for all screen images |
| Welcome | `docs/ui-design-prompts/screens/welcome-screen.md` | `design-assets/ui-screens/welcome.png` | Generated | UI reference screenshot saved, not runtime asset |
| Register / Sign In | `docs/ui-design-prompts/screens/register-sign-in-screen.md` | `design-assets/ui-screens/register-sign-in.png` | Generated | UI reference screenshot saved, not runtime asset |
| Setup Checklist | `docs/ui-design-prompts/screens/setup-checklist-screen.md` | `design-assets/ui-screens/setup-checklist.png` | Generated | UI reference screenshot saved, not runtime asset |
| Business Profile | `docs/ui-design-prompts/screens/business-profile-screen.md` | `design-assets/ui-screens/business-profile.png` | Generated | UI reference screenshot saved, not runtime asset |
| Business Type | `docs/ui-design-prompts/screens/business-type-screen.md` | `design-assets/ui-screens/business-type.png` | Generated | UI reference screenshot saved, not runtime asset |
| WhatsApp Setup | `docs/ui-design-prompts/screens/whatsapp-setup-screen.md` | `design-assets/ui-screens/whatsapp-setup.png` | Generated | UI reference screenshot saved, not runtime asset |
| AI Personality | `docs/ui-design-prompts/screens/ai-personality-screen.md` | `design-assets/ui-screens/ai-personality.png` | Generated | UI reference screenshot saved, not runtime asset |
| Payment Rules | `docs/ui-design-prompts/screens/payment-rules-screen.md` | `design-assets/ui-screens/payment-rules.png` | Generated | UI reference screenshot saved, not runtime asset |
| Delivery Zones | `docs/ui-design-prompts/screens/delivery-zones-screen.md` | `design-assets/ui-screens/delivery-zones.png` | Generated | UI reference screenshot saved, not runtime asset |
| Product Basics | `docs/ui-design-prompts/screens/product-basics-screen.md` | `design-assets/ui-screens/product-basics.png` | Generated | UI reference screenshot saved, not runtime asset |
| Today Command Center | `docs/ui-design-prompts/screens/today-command-center-screen.md` | `design-assets/ui-screens/today-command-center.png` | Generated | UI reference screenshot saved, not runtime asset |
| Inbox | `docs/ui-design-prompts/screens/inbox-screen.md` | `design-assets/ui-screens/inbox.png` | Generated | UI reference screenshot saved, not runtime asset |
| Conversation Detail | `docs/ui-design-prompts/screens/conversation-detail-screen.md` | `design-assets/ui-screens/conversation-detail.png` | Generated | UI reference screenshot saved, not runtime asset |
| Create Order | `docs/ui-design-prompts/screens/create-order-screen.md` | `design-assets/ui-screens/create-order.png` | Generated | UI reference screenshot saved, not runtime asset |
| Order Detail | `docs/ui-design-prompts/screens/order-detail-screen.md` | `design-assets/ui-screens/order-detail.png` | Generated | UI reference screenshot saved, not runtime asset |
| AI Approval Queue | `docs/ui-design-prompts/screens/ai-approval-queue-screen.md` | `design-assets/ui-screens/ai-approval-queue.png` | Generated | UI reference screenshot saved, not runtime asset |
| Receipt Review | `docs/ui-design-prompts/screens/receipt-review-screen.md` | `design-assets/ui-screens/receipt-review.png` | Generated | UI reference screenshot saved, not runtime asset |
| Follow-ups | `docs/ui-design-prompts/screens/follow-ups-screen.md` | `design-assets/ui-screens/follow-ups.png` | Generated | UI reference screenshot saved, not runtime asset |
| Customer Profile | `docs/ui-design-prompts/screens/customer-profile-screen.md` | `design-assets/ui-screens/customer-profile.png` | Generated | UI reference screenshot saved, not runtime asset |
| Settings | `docs/ui-design-prompts/screens/settings-screen.md` | `design-assets/ui-screens/settings.png` | Generated | UI reference screenshot saved, not runtime asset |
| Permission Denied | `docs/ui-design-prompts/screens/permission-denied-screen.md` | `design-assets/ui-screens/permission-denied.png` | Generated | UI reference screenshot saved, not runtime asset |
