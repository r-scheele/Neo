# Example 03: AI Chat App

## App Idea

Pocket Coach is an AI chat companion that helps first-time managers prepare for difficult workplace conversations.

## Target User

- First-time manager.
- Needs private, practical coaching.
- Wants scripts, rehearsal, and next steps.
- May type sensitive workplace details, so privacy boundaries matter.

## Visual Direction

- Mood: calm, confidential, competent.
- Palette: soft white, muted navy, sage accent, warm neutral surfaces.
- Typography: readable, professional, not playful.
- Cards: message bubbles with restrained contrast.
- Illustration: minimal abstract coaching imagery, no cartoon mascot.
- Motion: subtle typing/loading only.

## Core Screens

- Welcome.
- Chat thread.
- Conversation starter templates.
- Saved advice.
- Settings and privacy.

## Asset List

| Asset | Purpose | Prompt |
| --- | --- | --- |
| `logo-mark-pocket-coach.png` | Brand mark | Logo prompt |
| `onboarding-hero-coach.png` | Welcome | Onboarding hero prompt |
| `empty-chat.png` | New chat state | Empty state prompt |
| `error-ai-response.png` | AI response failure | Error state prompt |
| `success-saved-advice.png` | Saved advice | Success state prompt |

## Stack Decisions

- Expo, React Native, TypeScript, Expo Router.
- NativeWind for UI.
- Zustand for draft and UI state.
- AsyncStorage for local saved advice only if privacy-approved.
- Backend route required for AI calls because API keys must stay server-side.
- Clerk optional depending on whether history sync exists.
- PostHog only for privacy-safe product events, never raw message content.

## Example AGENTS.md Values

- `[APP_NAME]`: Pocket Coach
- `[ONE_LINE_DESCRIPTION]`: Pocket Coach helps first-time managers rehearse and plan difficult workplace conversations with AI guidance.
- `[TARGET_USER]`: First-time managers handling sensitive people conversations.
- `[FEATURE_LIST]`: welcome, starter templates, chat, save advice, privacy settings.
- `[PRIMARY_SCREENS]`: Welcome, Chat, Starters, Saved, Settings.
- `[VISUAL_DIRECTION]`: Calm, confidential, competent; muted navy, sage accents, warm surfaces, restrained message UI.

## First Five Feature Prompts

### Prompt 1: Chat UI With Mock Assistant

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the chat screen UI with local mock assistant responses.

Constraints:
- Do not call an AI API yet.
- Do not add backend routes.
- Do not store messages permanently.
- Do not track message content.
- Do not install libraries.

Reference:
- Route: app/(tabs)/chat.tsx.
- Visual direction from AGENTS.md.

Acceptance criteria:
- User can type and send a message.
- Mock assistant response appears.
- Empty chat state is shown before first message.
- Keyboard layout works.
- TypeScript and lint pass.
```

### Prompt 2: Starter Templates

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Add conversation starter templates to the chat screen.

Constraints:
- Do not call AI yet.
- Do not add new routes unless needed.
- Do not persist template selections.
- Do not install libraries.

Reference:
- Starter examples: feedback, performance concern, conflict, unclear expectations.
- Existing chat screen file.

Acceptance criteria:
- Templates are visible in empty state.
- Tapping a template fills or sends an appropriate draft.
- UI remains calm and professional.
- TypeScript and lint pass.
```

### Prompt 3: Server Route For AI

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create the server route boundary for AI chat responses.

Constraints:
- Keep API key server-side.
- Do not expose secrets in mobile code.
- Validate request shape.
- Do not log raw message content.
- Do not change chat UI except client call wiring if requested.

Reference:
- Server route plan.
- AI provider docs: [PASTE_CURRENT_DOCS].
- Request: { messages: ChatMessage[] }.

Acceptance criteria:
- Route accepts valid messages and returns assistant text.
- Invalid input returns safe error.
- Secrets remain server-side.
- TypeScript and lint pass.
```

### Prompt 4: Wire Chat To Server Route

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Wire the chat screen to the AI server route.

Constraints:
- Do not change server route behavior.
- Do not persist messages.
- Do not track message content.
- Handle loading and error states.
- Do not install libraries.

Reference:
- Chat screen.
- Server route response shape.

Acceptance criteria:
- Sending a message shows loading.
- Successful response appears in thread.
- Failed response shows retry or safe error.
- TypeScript and lint pass.
```

### Prompt 5: Save Advice Locally

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Allow users to save selected assistant advice locally.

Constraints:
- Store only user-selected assistant text.
- Do not store full chat history.
- Use AsyncStorage only after parsing data.
- Do not store sensitive metadata.

Reference:
- Privacy plan.
- AsyncStorage docs: [PASTE_CURRENT_DOCS].

Acceptance criteria:
- User can save and view saved advice.
- Saved advice survives restart.
- User can delete saved advice.
- TypeScript and lint pass.
```

## Testing Plan

- Empty chat.
- Keyboard send flow.
- Slow AI response.
- Failed AI response.
- No internet.
- Ensure API key is not in client code.
- Confirm analytics excludes message content.
