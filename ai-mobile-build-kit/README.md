# AI Mobile Build Kit

This directory is a reusable operating system for planning, designing, prompting, building, testing, polishing, and shipping mobile apps with AI assistance. It is built around the Practical Vibe Coding workflow: move fast, but only inside clear product, design, architecture, and testing boundaries.

This kit does not build an app by itself. It gives the product owner and AI implementer a shared process, reusable prompts, checklists, and templates.

## Core Philosophy

- Build one feature at a time.
- Use AI heavily, but constrain it tightly.
- Treat `AGENTS.md` as the project source of truth.
- Every coding prompt must include an anchor, task, constraints, reference, and acceptance criteria.
- Every feature ends with review, test, and commit.
- Plan visual direction and assets before implementing screens.
- Use boring, stable, well-documented technologies.
- Avoid large rewrites, vague prompts, and "build the whole app" instructions.
- The human stays the product owner, reviewer, and tester.

## Default Stack

The templates assume this default mobile stack unless you choose otherwise:

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- Zustand
- AsyncStorage
- Clerk for auth
- PostHog for analytics
- EAS Build
- CodeRabbit, Codex, Cursor, or another AI reviewer

The prompts are adaptable to other stacks. When using a different stack, update `AGENTS.md`, the architecture plan, and all relevant prompt references before coding.

## Full Workflow

1. Define the product: app idea, target user, pain, outcome, MVP boundary, features, data, and user flows.
2. Research design: collect references, decide visual direction, and inventory screen states.
3. Plan assets: create a style anchor, then generate logo, illustrations, icons, empty states, splash, and store images.
4. Decide the stack: choose dependencies deliberately and document tradeoffs.
5. Set up the project: Expo app, routing, styling, linting, assets, environment files, GitHub.
6. Write `AGENTS.md`: encode product, architecture, UI rules, state rules, and forbidden actions.
7. Build feature by feature: one scoped prompt per feature or fix.
8. Review and test: inspect diffs, run the app, test regressions, run lint/typecheck.
9. Ship: test on real devices, production builds, stores, analytics, privacy, and release readiness.

## Use The Folders In Order

- `00-start-here/`: operating manual and AI collaboration rules.
- `01-product-definition/`: product brief, PRD, MVP, backlog, flows, screens, and data thinking.
- `02-design-research/`: visual research, style guide, references, competitors, and screen states.
- `03-image-generation-prompts/`: reusable prompts for consistent mobile assets.
- `04-stack-and-architecture/`: stack decisions, architecture, state, auth, persistence, analytics, and security.
- `05-project-setup/`: setup checklists and setup prompts for Codex or another coding agent.
- `06-agents-md/`: complete `AGENTS.md` templates and update rules.
- `07-code-generation-prompts/`: the main prompt library for building screens, components, integrations, tests, and fixes.
- `08-feature-development-loop/`: the repeatable build loop for one feature at a time.
- `09-testing-polish-shipping/`: device testing, edge cases, production build, stores, privacy, and analytics.
- `10-example-workflows/`: realistic example workflows for common app types.
- `11-copy-paste-master-prompts/`: larger prompts that generate complete planning documents.
- `12-checklists/`: final checklists for prompts, design, code, security, and shipping.

## Do Not Start Coding Early

Before screen implementation begins, the following must exist:

- Product definition and MVP boundary.
- Visual direction and screen state inventory.
- Asset plan and first generated style anchor.
- Stack and architecture decisions.
- Project setup checklist.
- Root-level `AGENTS.md` customized for the app.

If these are missing, coding prompts become guesses. Guessing is how AI creates inconsistent UI, unused abstractions, brittle state, unnecessary libraries, and hidden regressions.

## Starting From An Attached Idea File

When you have a rough app idea, handoff document, pitch, PRD, or notes file, start with:

`11-copy-paste-master-prompts/generate-complete-mobile-app-docs-from-attached-idea.md`

That master prompt turns the attached idea into the complete pre-coding docs set: product definition, MVP scope, screen map, design direction, screen-state inventory, asset inventory, and image-generation prompt pack. It deliberately stops before code, project setup, image generation, and final stack decisions.

## Daily Feature Workflow

Use this loop every working session:

1. Pick one feature from the backlog.
2. Write a feature spec using `08-feature-development-loop/feature-spec-template.md`.
3. Choose one prompt from `07-code-generation-prompts/`.
4. Fill in anchor, task, constraints, reference, and acceptance criteria.
5. Send the prompt to Codex, Cursor, ChatGPT, Gemini, or another coding model.
6. Review the diff manually.
7. Run the app.
8. Test the new feature.
9. Test old features that could be affected.
10. Run lint and typecheck.
11. Fix problems with one targeted bug-fix prompt.
12. Commit.

## Emergency Rule

If AI breaks something:

1. Stop broad prompting.
2. Identify the exact broken behavior.
3. Use `07-code-generation-prompts/bug-fix-prompt.md`.
4. Tell the AI to fix only that bug.
5. Do not ask it to rewrite the app.
6. Do not combine the fix with cleanup, redesign, or refactor work.

## What Done Looks Like

A feature is done only when:

- The implementation matches the feature spec.
- Loading, empty, error, and permission states are handled where relevant.
- The diff contains no unrelated rewrites.
- The UI matches the approved visual direction.
- TypeScript, lint, and manual testing pass.
- Old related flows still work.
- The change is committed with a clear message.

## Common AI Mistakes This Kit Prevents

- Building the whole app from one prompt.
- Adding dependencies because they are familiar, not needed.
- Refactoring working code during feature work.
- Producing inconsistent screens because visual direction was skipped.
- Creating huge components with mixed responsibilities.
- Accepting `any`, hidden secrets, or untyped API responses.
- Forgetting device testing and production builds.
