# Screen Map

This is the canonical screen map for design and image prompt work. Neo is one consolidated product; this map starts with the first mobile screens while leaving room for the complete operating system.

## First Five Screens

1. Setup Checklist
2. Today Command Center
3. Inbox
4. Conversation Detail with AI Draft
5. AI Approval and Receipt Review

## MVP Screens

| Screen | Purpose | Primary Action |
| --- | --- | --- |
| Welcome | Introduce Neo to a new business owner | Start setup |
| Register / Sign In | Identify owner or staff | Continue |
| Setup Checklist | Complete required business setup | Open next setup task |
| Business Profile | Save business name, category, location, and phone | Save profile |
| Business Type | Select fashion, tailor, food, logistics, real estate, beauty/hair, or other | Choose type |
| WhatsApp Setup | Connect or validate WhatsApp Business status | Connect/test |
| AI Personality | Set tone, language, reply length, and approval preferences | Save AI rules |
| Payment Rules | Add payment methods and manual receipt review rules | Save payment rules |
| Delivery Zones | Add common delivery locations and fees | Add zone |
| Product Basics | Add starter products and prices | Add product |
| Today Command Center | Show urgent operational work | Open urgent item |
| Inbox | Triage customer chats | Open conversation |
| Conversation Detail | Review messages, AI draft, customer context, and order options | Send/edit/take over/create order |
| Create Order | Turn chat intent into an order | Save order |
| Order Detail | Review order, payment, delivery, and timeline | Send reminder/update status |
| AI Approval Queue | Review sensitive AI actions | Approve/edit/reject |
| Receipt Review | Verify bank transfer screenshot | Confirm/reject/ask customer |
| Follow-ups | Recover unpaid and silent leads | Send/edit/mark done |
| Customer Profile | See customer history and preferences | Add note or open linked item |
| Settings | Manage business and safety rules | Save setting |

## App Navigation Model

- New users start in Welcome and Setup.
- Returning users land on Today Command Center.
- Main mobile tabs: Today, Inbox, Approvals, Follow-ups, Settings.
- Detail screens open from queue cards, inbox rows, order rows, receipt rows, and customer links.
- Sensitive confirmations use focused screens or modals with warning copy and clear decision actions.

## Screen State Coverage

Every MVP screen needs:

- Loading
- Empty
- Error
- Success
- Offline
- Permission denied
- Long content
- First-time user
- Returning user
