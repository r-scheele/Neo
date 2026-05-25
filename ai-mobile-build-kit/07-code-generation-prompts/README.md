# Code Generation Prompts

This is the main prompt library for AI-assisted mobile app implementation.

## Universal Prompt Structure

Every coding prompt must include these five parts.

### 1. Anchor

Tell the model what project rules to read first.

```md
Read AGENTS.md first and follow it strictly.
```

### 2. Task

Ask for one feature, one screen, one component, one bug, or one integration.

Bad:

```md
Build the app.
```

Good:

```md
Implement the Create Habit modal UI and local form validation only.
```

### 3. Constraints

Say what not to change.

Examples:

- Do not change unrelated files.
- Do not refactor existing code.
- Do not install new libraries without asking.
- Preserve existing UI unless explicitly instructed.
- Do not expose secrets in client code.

### 4. Reference

Give the model concrete material:

- Design image.
- Current docs.
- File names.
- Existing components.
- Screen map.
- API contract.
- Error logs.
- Screenshots.

### 5. Acceptance Criteria

Define how done will be judged:

- Required behavior.
- Required states.
- iOS and Android considerations.
- TypeScript passes.
- Lint passes.
- Manual testing steps.

## Required Handoff

Every coding prompt should ask the model to return:

1. Files changed.
2. What changed.
3. How to test.
4. Risks or follow-up tasks.

## Warning

Do not use these prompts to combine unrelated work. If a task mentions UI, storage, auth, analytics, and release prep, split it.
