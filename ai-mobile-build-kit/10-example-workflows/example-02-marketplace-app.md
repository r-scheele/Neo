# Example 02: Marketplace App

## App Idea

LocalLoop is a neighborhood marketplace for residents who want to buy, sell, and reserve secondhand household items nearby.

## Target User

- Local residents.
- Wants trust and convenience.
- Uses the app in short sessions.
- Needs clear item details, seller identity, and safe contact flow.

## Visual Direction

- Mood: practical, trustworthy, local, friendly.
- Palette: clean white, deep teal, coral accent, warm gray neutrals.
- Typography: readable system font with strong listing titles.
- Cards: compact listing cards with image-first layout.
- Illustration: minimal, used only for empty states and onboarding.
- Motion: restrained.

## Core Screens

- Browse listings.
- Listing detail.
- Create listing.
- Seller profile.
- Saved items.
- Messages placeholder or contact flow.
- Settings.

## Asset List

| Asset | Purpose | Prompt |
| --- | --- | --- |
| `logo-mark-localloop.png` | App mark | Logo prompt |
| `empty-listings.png` | No listings nearby | Empty state prompt |
| `empty-saved-items.png` | No saved items | Empty state prompt |
| `success-listing-posted.png` | Listing posted | Success state prompt |
| `error-location.png` | Location unavailable | Error state prompt |

## Stack Decisions

- Expo, React Native, TypeScript, Expo Router.
- NativeWind for UI.
- Zustand for filters and saved local state.
- Clerk for auth before posting listings.
- Backend required for listings, users, and messages.
- AsyncStorage only for filter preferences and drafts.
- PostHog for browse-to-contact funnel events.

## Example AGENTS.md Values

- `[APP_NAME]`: LocalLoop
- `[ONE_LINE_DESCRIPTION]`: LocalLoop is a neighborhood marketplace app that helps residents find and sell secondhand items nearby.
- `[TARGET_USER]`: Local residents looking for trusted local buying and selling.
- `[FEATURE_LIST]`: browse listings, listing detail, create listing, saved items, seller profile, contact seller.
- `[PRIMARY_SCREENS]`: Browse, Listing Detail, Create Listing, Saved, Profile, Settings.
- `[VISUAL_DIRECTION]`: Practical, trustworthy, local; white surfaces, deep teal actions, coral accents, compact image-first cards.

## First Five Feature Prompts

### Prompt 1: Browse Listings With Mock Data

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the Browse listings screen using local mock data only.

Constraints:
- Do not add backend calls yet.
- Do not add auth.
- Do not implement create listing.
- Do not install libraries.

Reference:
- Route: app/(tabs)/browse.tsx.
- Listing fields: id, title, price, distanceLabel, image, condition.
- Visual direction from AGENTS.md.

Acceptance criteria:
- Listings display in image-first cards.
- Empty state appears when mock list is empty.
- Long titles do not break layout.
- TypeScript and lint pass.
```

### Prompt 2: Listing Detail Route

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement listing detail navigation from browse.

Constraints:
- Use mock data.
- Do not add messaging yet.
- Do not add backend.
- Keep route params typed.

Reference:
- List route: app/(tabs)/browse.tsx.
- Detail route: app/listings/[listingId].tsx.

Acceptance criteria:
- Tapping a listing opens detail.
- Missing listing shows friendly error.
- Back navigation works.
- TypeScript and lint pass.
```

### Prompt 3: Saved Listings Store

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create a Zustand store for saved listing IDs.

Constraints:
- Store only listing IDs.
- Do not persist yet.
- Do not add account sync.
- Do not use `any`.

Reference:
- Existing listing type.
- Screens: Browse and Listing Detail.

Acceptance criteria:
- User can save and unsave listings locally.
- Saved state is reflected in list and detail.
- TypeScript and lint pass.
```

### Prompt 4: Create Listing Form UI

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement Create Listing form UI with validation only.

Constraints:
- Do not submit to backend.
- Do not upload images yet.
- Do not add auth checks yet.
- Do not install form libraries.

Reference:
- Route: app/listings/create.tsx.
- Fields: title, price, condition, description.

Acceptance criteria:
- Required fields validate.
- Form is keyboard-safe.
- Submit shows a placeholder success state.
- TypeScript and lint pass.
```

### Prompt 5: Auth Gate For Create Listing

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Add auth gate behavior for Create Listing.

Constraints:
- Use Clerk only if already installed and configured.
- Do not implement backend listing submission.
- Do not redesign browse or detail screens.
- Do not expose secrets.

Reference:
- Auth plan.
- Clerk Expo docs: [PASTE_CURRENT_DOCS].
- Route: app/listings/create.tsx.

Acceptance criteria:
- Logged-out users see sign-in prompt before creating.
- Logged-in users see the form.
- Session loading is handled.
- TypeScript and lint pass.
```

## Testing Plan

- Browse with listings and with empty data.
- Open detail and invalid detail ID.
- Save and unsave listings.
- Test long titles and prices.
- Test create form validation.
- Test logged-out auth gate.
- Test slow network later when backend exists.
