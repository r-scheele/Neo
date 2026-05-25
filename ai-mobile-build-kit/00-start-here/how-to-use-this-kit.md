# How To Use This Kit

Use this kit as a step-by-step operating manual. Do not jump straight to code. The fastest path is a narrow path: define the product, define the look, define the architecture, then let AI implement one feature at a time.

## Step 1: Define The Idea

Use the templates in `01-product-definition/` to answer:

- What is the app?
- Who is it for?
- What painful job does it solve?
- What is the current workaround?
- What result should the user get?
- What is in the MVP?
- What is intentionally not in the MVP?

Done looks like:

- A one-sentence app description.
- A clear target user.
- A main pain and core outcome.
- A short MVP feature list.
- A list of non-goals.

Warning: do not let AI invent the product direction without your review. AI can draft options, but the product owner decides.

## Step 2: Research Design

Use `02-design-research/` before making screens. Collect references from:

- Pinterest for mood and imagery.
- Dribbble for polished UI patterns.
- Mobbin for real mobile screen flows.
- Behance for brand systems and visual direction.
- Real apps from the App Store or Google Play for practical constraints.

Done looks like:

- 5 to 12 references with notes.
- A visual direction document.
- A basic UI style guide.
- Screen states defined for loading, empty, error, success, offline, permissions, long content, first-time, and returning users.

Warning: references are for direction, not copying. Never clone another app pixel-for-pixel.

## Step 3: Generate Visual Assets

Use `03-image-generation-prompts/` in this order:

1. Generate a style anchor.
2. Generate logo and mascot if needed.
3. Generate onboarding and screen illustrations.
4. Generate empty, success, and error states.
5. Generate icons, splash screen, and app store screenshots.
6. Record every asset in `asset-inventory-template.md`.

Done looks like:

- Assets have consistent palette, proportions, lighting, line weight, and character style.
- Assets are named consistently.
- Assets are saved under `assets/images`.
- A future developer can find every asset from the inventory.

Warning: do not generate assets randomly one at a time. Without a style anchor, the app will look like several apps stitched together.

## Step 4: Pick The Stack

Use `04-stack-and-architecture/`. Start with the default stack unless there is a clear reason not to:

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- Zustand
- AsyncStorage
- Clerk
- PostHog
- EAS Build

Done looks like:

- Stack decisions are written down.
- Dependencies are justified.
- State, persistence, auth, analytics, and security have plans.
- You know what not to build yet.

Warning: avoid adding a backend, database, or new dependency before the product actually needs it.

## Step 5: Set Up The Project

Use `05-project-setup/`. Setup work should be boring and focused:

- Create the Expo app.
- Initialize Git.
- Add `.env` and `.env.example`.
- Configure Expo Router.
- Configure NativeWind.
- Create asset folders and centralized image imports.
- Add lint and typecheck commands.
- Push to GitHub.

Done looks like:

- The app runs locally.
- TypeScript works.
- Basic navigation works.
- Assets folder exists.
- Git has an initial commit.

Warning: setup prompts must not add extra libraries, example screens, or app features unless explicitly requested.

## Step 6: Write AGENTS.md

Use `06-agents-md/AGENTS.template.md` and customize it for the app.

`AGENTS.md` should include:

- Product overview.
- Tech stack.
- Folder rules.
- UI and styling rules.
- State and persistence rules.
- Auth and secrets rules.
- Testing rules.
- Forbidden actions.
- Communication rules.

Done looks like:

- A coding agent can read `AGENTS.md` and know how to work in the project.
- Repeated context has been moved out of prompts and into `AGENTS.md`.
- Stable decisions are recorded.

Warning: do not put temporary tasks in `AGENTS.md`. It is a constitution, not a scratchpad.

## Step 7: Build Feature By Feature

Use `07-code-generation-prompts/` and `08-feature-development-loop/`.

Every prompt must include:

- Anchor: read `AGENTS.md` first.
- Task: one feature, screen, bug, or integration.
- Constraints: what not to change.
- Reference: design, docs, files, screenshots, or examples.
- Acceptance criteria: how success will be checked.

Done looks like:

- One feature has been implemented.
- The diff is small enough to review.
- The feature has tests or manual verification.
- The change is committed.

Warning: never ask AI to "make it better" without defining better. That is an invitation to rewrite working code.

## Step 8: Test And Ship

Use `09-testing-polish-shipping/` and `12-checklists/`.

Before release, test:

- iOS and Android.
- Real devices.
- Slow internet and no internet.
- Empty data.
- Long content.
- Denied permissions.
- App restart.
- Logged in and logged out states.
- Production builds.

Done looks like:

- Production build passes.
- Store metadata is ready.
- Privacy and security are reviewed.
- Analytics events are verified.
- Dev utilities and noisy logs are removed.

Warning: simulator testing is not enough. Mobile apps fail in hands, networks, permissions, keyboards, safe areas, and app restarts.
