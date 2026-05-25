# UI Style Guide

## Design Tokens

### Colors

| Token | Value | Usage |
| --- | --- | --- |
| `color.primary` | `#0E3B2E` | Primary actions, active nav, brand anchors |
| `color.primaryPressed` | `#092A21` | Pressed primary actions |
| `color.background` | `#FBF7EF` | App background |
| `color.surface` | `#FFFDF8` | Cards, sheets, panels |
| `color.surfaceAlt` | `#F1E7D6` | Setup cards, muted panels, quiet highlights |
| `color.text` | `#1F2522` | Main text |
| `color.textMuted` | `#6F766F` | Metadata, helper copy |
| `color.border` | `#E4D8C5` | Borders and dividers |
| `color.success` | `#247A52` | Paid, completed, verified, connected |
| `color.warning` | `#B7791F` | Pending review, due soon, needs attention |
| `color.error` | `#B9473A` | Failed, rejected, disconnected, destructive |
| `color.info` | `#2F6F8F` | Neutral provider and system information |
| `color.gold` | `#C6A15B` | Premium accents |
| `color.terracotta` | `#B86A4B` | Warm emphasis |

### Spacing

| Token | Value | Usage |
| --- | --- | --- |
| `space.1` | `4px` | Tight icon/text gaps |
| `space.2` | `8px` | Small control gaps |
| `space.3` | `12px` | Row gaps |
| `space.4` | `16px` | Card padding and screen gutters |
| `space.5` | `20px` | Larger screen gutters |
| `space.6` | `24px` | Section gaps |
| `space.7` | `32px` | Onboarding or hero spacing |

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| `radius.xs` | `4px` | Tiny badges and inline highlights |
| `radius.sm` | `6px` | Small chips and controls |
| `radius.md` | `8px` | Cards, inputs, buttons |
| `radius.sheet` | `12px` | Bottom sheet top corners |
| `radius.full` | `999px` | Pills, avatars, status dots |

### Shadows

| Token | Value | Usage |
| --- | --- | --- |
| `shadow.none` | none | Most list rows |
| `shadow.soft` | low-opacity warm shadow | Cards that need separation |
| `shadow.focus` | subtle outline plus shadow | Active approval or modal states |

## Typography

Final fonts are not selected yet. The intended feel is humanist, professional, and readable, with an editorial touch in headings.

| Style | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| `displaySmall` | 28px | 700 | 34px | Onboarding title only |
| `screenTitle` | 22px | 700 | 28px | Screen titles |
| `sectionTitle` | 16px | 700 | 22px | Section headings |
| `body` | 15px | 400 | 22px | Main text |
| `bodyStrong` | 15px | 600 | 22px | Important row labels |
| `caption` | 12px | 500 | 16px | Metadata and helper text |
| `metric` | 24px | 700 | 30px | Command center numbers |
| `button` | 15px | 700 | 20px | Button labels |

### Typography Rules

- Use tabular numbers for currency, order counts, and metrics.
- Keep labels short enough for mobile.
- Do not shrink critical payment or warning text below readable size.
- Avoid negative letter spacing.
- Avoid viewport-based font scaling.

## Components

### Buttons

- Primary: forest green fill, ivory text, 8px radius, 48px default height.
- Secondary: ivory or surface fill, forest green text, sand border.
- Tertiary: text or icon button with clear accessible label.
- Destructive: brick red text or fill only for destructive confirmations.
- Disabled: muted beige surface, muted text, no shadow.
- Loading: preserve button width, show spinner and concise label.

### Cards

- Background: soft white.
- Border: 1px sand border.
- Radius: 8px.
- Shadow: none or subtle soft shadow.
- Padding: 14px to 16px.
- Queue cards: compact, scannable, with strong title, metadata, status badge, and primary action.
- Approval cards: include risk reason, AI recommendation, source context, and decision buttons.

### Inputs

- Default: surface background, sand border, 8px radius.
- Focus: forest green border and subtle focus shadow.
- Error: brick red border, specific helper text.
- Disabled: beige background and muted text.
- Helper text: short and practical.

### Lists

- Row height: flexible but stable, minimum 56px.
- Dividers: sand border, not heavy gray.
- Swipe actions: allowed for archive, mark done, and quick assignment where safe.
- Empty state: illustration plus direct next action.
- Long rows: wrap customer names and messages cleanly; truncate metadata second.

### Navigation

- Main tabs: Today, Inbox, Approvals, Follow-ups, Settings.
- Active tab: forest green icon/text.
- Inactive tab: warm muted gray.
- Header: compact title, optional status/search/filter controls.
- Modals: focused for create order, confirmation, filters, and sensitive decisions.

### Status Badges

- Paid/connected/completed: success green.
- Pending review/follow-up due: warning ochre.
- Failed/rejected/disconnected: brick red.
- AI handled/low confidence: muted blue or warning depending on risk.
- Always include text or icon plus color.

### Chat UI

- Customer messages: warm neutral bubbles.
- Staff replies: forest-tinted bubbles with high contrast text.
- AI drafts: distinct bordered draft card, not visually identical to sent messages.
- Receipt/media attachments: framed preview with status and review action.
- Composer: thumb-friendly, with attach, product/payment link, voice note, and send actions.

### Receipt Review UI

- Receipt preview must be prominent enough to inspect.
- AI extraction should be displayed as labeled rows.
- Warning copy must be visible before confirmation.
- Confirm Payment, Reject Receipt, Ask Customer, and Escalate must be visually distinct.
- Confirmation should require deliberate action, not accidental tap.

## Accessibility Rules

- Minimum touch target: 44px.
- Do not rely on color alone for status.
- Use clear labels for icon-only buttons.
- Keep warning and payment copy readable at larger font sizes.
- Long customer names, product names, locations, and chat snippets must wrap or truncate gracefully.
- Error messages must explain what happened and what the user can do next.

## Copy Tone

- Calm, direct, respectful, and local-aware.
- Use "ma/sir" examples where appropriate.
- Avoid hype around AI.
- Avoid blame in errors.
- Use trust-first payment language: "Verify against bank alert before confirming."

