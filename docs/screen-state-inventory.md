# Screen State Inventory

Every MVP screen must handle the states below. Neo is an operations product, so state handling is part of trust, not polish.

## State Checklist

| Screen | Loading | Empty | Error | Success | Offline | Permission Denied | Long Content | First-Time | Returning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Setup Checklist | Skeleton checklist | No setup tasks means show ready state | Failed to load setup status with retry | Step saved toast | Show cached progress and block connection tests | Staff cannot change owner setup | Checklist scrolls, progress stays visible | Welcome and explain required steps | Resume next incomplete step |
| Today Command Center | Skeleton cards and queue rows | "No urgent work right now" with test inbox action | Could not refresh queue with retry | Action completed toast and card updates | Show last synced time and cached queue | Restricted cards hidden or locked | Queue groups collapse/expand | Setup prompts appear first | Urgent items sorted by risk |
| Inbox | Conversation row skeletons | "No conversations yet" with WhatsApp setup/test message | Inbox failed to load with retry | Archive/assign/send toast | Cached conversations read-only where needed | Staff sees only assigned conversations | Rows wrap names and snippets safely | Explain labels and AI review | Default to All or Mine tab |
| Conversation Detail | Message skeletons and draft placeholder | No messages shows customer context and start note | Failed to load messages or draft with retry | Reply sent or order created confirmation | Can read cached thread, cannot send until online | Locked actions show role explanation | Chat scroll, sticky composer, media previews resize | Show first customer context hints | Open at latest unread message |
| AI Approval Queue | Approval card skeletons | "No approvals waiting" with safety rules link | Failed to load approvals with retry | Approved/rejected card moves out | Cached approvals visible, decisions disabled | Only owner/manager can approve sensitive actions | Cards expand details without layout break | Explain why approvals protect trust | Sort by payment, complaint, low confidence |
| Receipt Review | Receipt preview skeleton | No receipt found shows linked order fallback | Image/extraction failed with retry | Decision confirmation and order/payment update | Can inspect cached image if available, cannot confirm | Staff without payment permission cannot confirm | Zoomable image, extracted rows wrap | Explain manual receipt risk | Show previous review history if any |
| Create Order | Form skeleton for linked chat | No product data prompts add manual item | Save failed with retry and preserved fields | Order saved and opens detail | Draft can remain local, submit disabled | Staff without order permission cannot save | Item list scrolls, totals remain visible | Suggest order from active conversation | Pre-fill customer and last product context |
| Order Detail | Order card skeleton | Missing order shows safe error | Failed to load order with retry | Status/reminder update toast | Cached order visible, risky changes disabled | Payment/delivery actions locked by role | Timeline and item list scroll cleanly | Explain order lifecycle if first order | Show current next action |
| Follow-ups | Follow-up card skeletons | "No follow-ups due" with create manual follow-up | Failed to load follow-ups with retry | Sent/marked done confirmation | Cached follow-ups visible, send disabled | Restricted staff cannot send templates | Long suggested messages expand | Explain respectful follow-ups | Today tab shows due and overdue first |
| Customer Profile | Profile skeleton | New customer profile with no orders yet | Failed to load customer with retry | Note saved confirmation | Cached profile visible, new notes disabled | Sensitive notes hidden if role lacks access | Tabs and history scroll without overlap | Explain customer memory | Summary and next action appear first |
| Settings | Form row skeletons | Missing settings show recommended defaults | Save/load failed with inline error | Saved toast | Read cached settings, save disabled | Role-limited settings locked | Long forms grouped into sections | Guided defaults by business type | Show current connection and guardrail status |

## Loading State Rules

- Use skeletons for lists, cards, chat messages, and receipt review.
- Use spinners only for small inline actions.
- Preserve layout height while loading to avoid jumping.
- If loading takes more than 5 seconds, show calm copy with retry or "still loading" state.

## Empty State Rules

- Empty states should explain what will appear there.
- The primary action must help the user create or connect the missing data.
- Empty states should not make the user feel behind or at fault.
- Use illustration only when it supports the action; dense operational screens can use compact empty cards.

## Error State Rules

- State what failed in plain language.
- Provide retry when user-fixable.
- Preserve unsaved form fields where possible.
- Do not expose raw provider errors to the user.
- Payment and receipt errors should be extra careful and calm.

## Success State Rules

- Use toasts or inline confirmations for routine saves.
- Use a stronger confirmation for receipt decisions, sent replies, and created orders.
- After success, update the affected card immediately.
- Avoid confetti and exaggerated celebration.

## Offline State Rules

- Show last synced time when showing cached data.
- Disable risky actions such as sending replies, confirming payments, and changing settings.
- Allow read-only review where safe.
- Queueing actions should only be introduced after explicit product approval.

## Permission Denied Rules

- Explain the role limitation clearly.
- Offer "Ask owner/admin" when appropriate.
- Do not show sensitive customer, payment, or staff details to roles that lack permission.
- Avoid dead-end screens; always provide a safe way back.

## Long Content Rules

- Chat messages, product names, customer names, locations, and suggested replies must wrap or truncate predictably.
- Critical actions should remain reachable.
- Receipt images must be zoomable or openable in a focused viewer.
- Timelines should collapse or group older items.

## First-Time User Rules

- Lead with setup and a clear first useful action.
- Use demo examples sparingly and mark them clearly if used.
- Explain AI approval and manual receipt review before the first sensitive decision.
- Avoid overwhelming the user with all future modules.

## Returning User Rules

- Default to the Today Command Center.
- Prioritize urgent and risky items.
- Show stale data warnings when needed.
- Keep repeated education minimal and dismissible.

