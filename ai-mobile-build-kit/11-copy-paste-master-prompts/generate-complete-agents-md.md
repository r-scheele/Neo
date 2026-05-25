# Generate Complete AGENTS.md Prompt

Use this after product, design, stack, and architecture decisions are ready.

```md
You are a senior mobile app architect writing a root-level AGENTS.md for an AI-assisted Expo React Native project.

Task:
Generate a complete AGENTS.md for [APP_NAME].

Inputs:
Product brief:
[PASTE_PRODUCT_BRIEF]

Visual direction:
[PASTE_VISUAL_DIRECTION]

Stack decisions:
[PASTE_STACK_DECISIONS]

Architecture plan:
[PASTE_ARCHITECTURE_PLAN]

Feature list:
[PASTE_FEATURE_LIST]

Required sections:
- Role
- Project overview
- Product principles
- Tech stack
- Development philosophy
- Architecture
- Folder rules
- UI rules
- Styling rules
- NativeWind rules
- Style exception list
- Image rules
- State rules
- AsyncStorage rules
- Auth rules
- API/secrets rules
- TypeScript rules
- Navigation rules
- Form rules
- Loading/empty/error rules
- Accessibility rules
- Testing rules
- Feature implementation rules
- Refactor rules
- Dependency rules
- Forbidden actions
- Communication rules
- Final reminder

Constraints:
- Make the file operational, not motivational.
- Do not include temporary tasks.
- Do not include vague advice.
- Include concrete forbidden actions.
- Include the current app-specific visual direction.
- Include exact stack choices.
- Keep instructions reusable for future coding agents.

Acceptance criteria:
- A coding agent can read the file and safely implement a feature.
- The file prevents unrelated refactors and dependency sprawl.
- The file includes clear testing expectations.
- The file can be copied to the repo root as AGENTS.md.
```

## Done Looks Like

The output should become the app repo's source of truth for AI coding sessions.
