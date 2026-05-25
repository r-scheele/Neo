# Permission Denied And Staff Role Gates Implementation Prompt

## Direct Assistant Execution

This file is the complete implementation request. If this file is provided to the coding assistant by itself, treat it as an active coding task, not as documentation to summarize. Start by reading `AGENTS.md`, then verify every required reference listed below. If all required references exist, implement only the feature named in this file. If any required reference is missing, stop and report exactly what is missing. Do not ask for another prompt, do not broaden the task, and do not implement anything outside this file.


## When to run this prompt

Run this after Core Settings and at least one sensitive action screen exists, such as Receipt Review or AI Approval Queue.

## Implementation prompt

Read AGENTS.md first and follow it strictly.

Before coding, verify that these required references exist:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/auth-plan.md
- docs/security-and-secrets-plan.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- docs/ui-design-prompts/screens/permission-denied-screen.md
- design-assets/ui-screens/permission-denied.png
- assets/images/error-permission-denied.png
- constants/images.ts
- app/modals/permission.tsx

If any required file is missing, stop and report exactly what is missing. Do not implement from guesses.

Task:
Implement only Permission Denied and basic staff role gates.

Use:
- AGENTS.md
- docs/product-brief.md
- docs/visual-direction.md
- docs/ui-style-guide.md
- docs/screen-map.md
- docs/feature-backlog.md
- docs/auth-plan.md
- docs/security-and-secrets-plan.md
- docs/screen-state-inventory.md
- docs/asset-inventory.md
- assets/images/
- constants/images.ts

Also use:
- docs/ui-design-prompts/screens/permission-denied-screen.md
- design-assets/ui-screens/permission-denied.png

Scope:
- Replace only the Permission Denied modal/screen placeholder.
- Add simple local role labels or gates only where sensitive screens already exist.
- Route blocked sensitive actions to the permission explanation.

Constraints:
- Do not implement production authorization.
- Do not claim client-side role checks are secure.
- Do not implement staff invites or organization management.
- Do not install new libraries.
- Do not refactor unrelated files.
- Do not import images directly inside screens or components.
- Use `constants/images.ts` for runtime app images.
- Do not import UI design reference screenshots into app code.

State/persistence rules:
- Use local/mock role state only unless auth integration already provides role data.
- Use Zustand only if role state must be shared across sensitive screens.
- Do not use AsyncStorage for privileged role enforcement.
- Do not add backend/database logic.

UI rules:
- Match `design-assets/ui-screens/permission-denied.png` exactly.
- Explain the role limitation clearly.
- Provide a safe back action or ask-owner/admin action if shown.
- Make sure the screen works on small and large phones.

Validation:
- Permission Denied screen renders clearly.
- Blocked sensitive actions navigate to the permission explanation.
- Owner/manager/staff mock gates behave predictably.
- TypeScript passes.
- Lint passes.
- No unrelated files were changed.

Stop when:
- Permission Denied and local role gates work within mock scope.
- The diff is small and reviewable.
- You provide files changed, what changed, how to test, risks, and a suggested commit message.

## Manual test checklist

- [ ] Open Permission Denied route/modal directly.
- [ ] Compare it to `design-assets/ui-screens/permission-denied.png`.
- [ ] Trigger a blocked sensitive action.
- [ ] Confirm safe back/ask-owner action works.
- [ ] Confirm no production auth claim is made.

## Regression checklist

- [ ] Settings still works.
- [ ] Receipt Review or Approval Queue still works.
- [ ] Main tabs still work.

## Suggested commit message

add permission gates

