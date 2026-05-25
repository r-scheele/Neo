# Example 04: Content App

## App Idea

Field Notes is a curated mobile reading app for independent designers who want short practical essays, saved reads, and offline-friendly reference notes.

## Target User

- Independent designer.
- Reads between client work.
- Wants high-signal content without a social feed.
- Values typography, offline access, and saved references.

## Visual Direction

- Mood: editorial, quiet, refined.
- Palette: white, ink black, soft blue accent, pale gray surfaces.
- Typography: strong editorial headings, highly readable body.
- Cards: text-forward, minimal borders.
- Illustration: rare; mostly typography and article imagery.
- Motion: minimal.

## Core Screens

- Today feed.
- Article detail.
- Categories.
- Saved articles.
- Search.
- Settings.

## Asset List

| Asset | Purpose | Prompt |
| --- | --- | --- |
| `logo-mark-field-notes.png` | Brand mark | Logo prompt |
| `empty-saved-articles.png` | No saves | Empty state prompt |
| `empty-search.png` | No results | Empty state prompt |
| `error-content-sync.png` | Content fetch error | Error state prompt |
| `splash-mark-field-notes.png` | Splash | Splash prompt |

## Stack Decisions

- Expo, React Native, TypeScript, Expo Router.
- NativeWind for layout and typography.
- Zustand for saved IDs and reader preferences.
- AsyncStorage for saved articles cache and preferences.
- Backend or CMS API when content is remote.
- No auth for MVP unless syncing saves across devices.
- PostHog for privacy-safe reading events.

## Example AGENTS.md Values

- `[APP_NAME]`: Field Notes
- `[ONE_LINE_DESCRIPTION]`: Field Notes is a curated reading app for independent designers who want short practical essays and offline-friendly saved references.
- `[TARGET_USER]`: Independent designers.
- `[FEATURE_LIST]`: today feed, article detail, categories, saved articles, search, settings.
- `[PRIMARY_SCREENS]`: Today, Article Detail, Categories, Saved, Search, Settings.
- `[VISUAL_DIRECTION]`: Editorial, quiet, refined; ink typography, soft blue accents, minimal cards, content-first.

## First Five Feature Prompts

### Prompt 1: Today Feed With Mock Articles

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement the Today feed with mock article data.

Constraints:
- Do not add CMS/API integration yet.
- Do not implement search.
- Do not add auth.
- Do not install libraries.

Reference:
- Route: app/(tabs)/today.tsx.
- Article fields: id, title, excerpt, category, readTime, publishedAt.

Acceptance criteria:
- Feed displays readable article cards.
- Empty state works.
- Long titles wrap cleanly.
- TypeScript and lint pass.
```

### Prompt 2: Article Detail

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement article detail route from the Today feed.

Constraints:
- Use mock articles.
- Do not add saving yet.
- Do not add rich markdown renderer unless approved.
- Keep layout readable.

Reference:
- Route: app/articles/[articleId].tsx.
- Existing article type.

Acceptance criteria:
- Tapping article opens detail.
- Missing article shows error state.
- Body text is readable.
- Back navigation works.
- TypeScript and lint pass.
```

### Prompt 3: Saved Articles Store

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Create saved article state with Zustand.

Constraints:
- Store article IDs only.
- Do not persist yet.
- Do not change article content source.
- Do not use `any`.

Reference:
- Existing article type.
- Screens: Today, Article Detail, Saved.

Acceptance criteria:
- User can save and unsave an article.
- Saved state is reflected on feed and detail.
- TypeScript and lint pass.
```

### Prompt 4: Saved Screen

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Implement Saved articles screen.

Constraints:
- Use existing saved state.
- Do not add persistence yet.
- Do not add search.
- Use approved empty state asset.

Reference:
- Route: app/(tabs)/saved.tsx.
- Asset: empty-saved-articles.png.

Acceptance criteria:
- Saved articles display.
- Empty state appears with clear copy.
- Tapping opens article detail.
- TypeScript and lint pass.
```

### Prompt 5: Persist Saved Articles

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Persist saved article IDs with AsyncStorage.

Constraints:
- Persist IDs only.
- Use key @field-notes/saved-articles-v1.
- Parse stored values safely.
- Do not store article body if not required.

Reference:
- Store file.
- AsyncStorage docs: [PASTE_CURRENT_DOCS].

Acceptance criteria:
- Saved IDs survive restart.
- Corrupt storage falls back safely.
- TypeScript and lint pass.
```

## Testing Plan

- Feed with articles and empty feed.
- Detail for valid and invalid article.
- Save and unsave.
- Restart app and verify saved articles.
- Long titles, long body text, large font settings.
- Offline behavior once remote content exists.
