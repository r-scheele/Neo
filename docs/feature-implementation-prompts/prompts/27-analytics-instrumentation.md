# Analytics Instrumentation Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after the core MVP flows exist and PostHog is installed/configured through an approved setup task. Do not run this while core screens are still placeholders.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/feature-backlog.md
- docs/analytics-plan.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md
- package.json

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only analytics instrumentation for existing MVP flows.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/feature-backlog.md
- docs/analytics-plan.md
- docs/security-and-secrets-plan.md
- docs/state-management-plan.md

Scope:
- Add typed analytics event helpers if they do not already exist.
- Instrument only approved events from `docs/analytics-plan.md` for already-built flows.
- Provide no-op behavior when analytics configuration is missing if the project pattern supports it.

Constraints:
- Do not install PostHog or any new library in this prompt.
- Do not track private customer messages, phone numbers, AI prompt text, AI draft text, receipt images, bank details, exact payment references, exact addresses, tokens, or secrets.
- Do not add analytics to placeholder or unbuilt flows.
- Do not refactor unrelated files.
- Do not change UI except where required for safe event hooks.
- Do not import UI design reference screenshots into app code.
- Do not import images directly inside screens or components.
- Analytics failures must never block app behavior.

State/persistence rules:
- Do not persist analytics events manually unless the existing SDK handles it.
- Use categories, booleans, and bands instead of sensitive exact values.
- Keep event names and properties typed.

UI rules:
- Preserve existing implemented UI exactly.
- Do not change layout, spacing, or visual hierarchy.
- Existing screens must still work on small and large phones.

Validation:
- Approved events fire for implemented flows only.
- Event properties exclude sensitive data.
- Missing analytics configuration does not crash the app.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Analytics instrumentation works for existing MVP flows.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Trigger implemented activation events.
- [ ] Trigger Today, Inbox, AI draft, order, receipt, and follow-up events where flows exist.
- [ ] Confirm event payloads contain no sensitive content.
- [ ] Confirm the app works when analytics keys are missing.

## Regression checklist

- [ ] Core screens still load.
- [ ] Navigation still works.
- [ ] No user action is blocked by analytics.

## Suggested commit message

add analytics instrumentation
