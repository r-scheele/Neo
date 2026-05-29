# Integration Prompt Index

This is the active Phase A prompt sequence. It is intentionally client/local only so prompts can be run in order without hitting deferred backend/API decisions.

Monorepo note: Phase A client prompts target `apps/mobile` unless a prompt explicitly names the marketing site, future web dashboard, or shared package.

Status values: `Not started`, `In progress`, `Blocked`, `Complete`.

Backend/API prompts are not mixed into this sequence. See `backend-deferred/backend-deferred-index.md` for Phase B.

## Phase A: Runnable Client/Local Sequence

| Order | Integration | Prompt File | Status | Depends On | Backend Required? | Safe To Run Now? | Suggested Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Environment/config cleanup | `prompts/01-environment-config-cleanup.md` | Complete | `AGENTS.md`, audit docs, package/config files | No | Already complete | `align integration config docs` |
| 02 | Clerk authentication | `prompts/02-clerk-authentication.md` | Complete for MVP wiring | Prompt 01, auth screens, `.env.example` | No | Already complete | `configure clerk authentication` |
| 03 | Navigation/app shell protection | `prompts/03-navigation-app-shell-protection.md` | Complete for MVP wiring | Prompts 01-02, Clerk session state, setup store | No | Already complete | `protect app navigation` |
| 04 | Zustand shared state completion | `prompts/04-zustand-shared-state-completion.md` | Complete for MVP wiring | Prompts 01-03, state plan | No | Already complete | `complete shared app state` |
| 05 | AsyncStorage persistence completion | `prompts/05-asyncstorage-persistence-completion.md` | Complete | Prompts 01-04, Clerk sign-out | No | Already complete | `complete safe local persistence` |
| 06 | Backend/API boundary documentation | `prompts/06-backend-api-boundary.md` | Complete as documentation boundary | Prompts 01-05, security plan | No implementation; docs only | Already complete | `define backend api boundary` |
| 07 | Integration status/index cleanup | `prompts/07-integration-status-index-cleanup.md` | Complete | Prompts 01-06 and current audit docs | No | Already complete | `reorganize integration prompts` |
| 08 | Local-only state hardening | `prompts/08-local-state-hardening.md` | Complete | Prompt 07, local-only placeholder report, state plan | No | Already complete | `harden local-only state` |
| 09 | PostHog production analytics | `prompts/09-posthog-production-analytics.md` | Complete for Phase A wiring | Prompt 07, Clerk auth wiring, analytics plan | No | Already complete; live event QA needs public PostHog values outside git | `configure posthog analytics` |
| 10 | Loading/empty/error state completion | `prompts/10-loading-empty-error-completion.md` | Complete for Phase A state coverage | Prompt 08, screen-state inventory, current local state sources | No | Already complete | `complete client state screens` |
| 11 | Maestro/QA baseline | `prompts/11-maestro-qa-baseline.md` | Complete as manual QA baseline | Prompts 07-10, package scripts, screen map | No | Already complete; Maestro unavailable and not installed | `add qa baseline` |
| 12 | Client release readiness precheck | `prompts/12-client-release-readiness-precheck.md` | Complete; not release-ready | Prompts 07-11, release blockers, audit docs | No | Already complete; live QA remains a blocker | `precheck client release readiness` |

## Phase B: Deferred Backend/API Sequence

Phase B is deferred until these decisions are approved:

- Backend provider.
- Database/schema.
- Deployment target.
- Public API base URL and public env var name.
- Clerk-to-backend auth handoff strategy.
- Media storage.
- Webhook strategy.
- Audit log retention.

Do not run Phase B prompts from the active sequence. Use `backend-deferred/backend-deferred-index.md` only after the decisions above are approved.

## Complete Enough Without A Dedicated Prompt

| Area | Status | Reason |
| --- | --- | --- |
| Runtime image registry | Complete enough | `constants/images.ts` maps runtime PNG assets from `assets/images/`; keep a smoke check in Prompt 12 rather than a separate prompt. |
| NativeWind/Tailwind config | Complete for current setup | The current NativeWind v5/Tailwind v4 CSS-first setup is documented; no extra config prompt is needed now. |
| Product surface separation | Complete enough | `apps/mobile`, `apps/marketing`, `apps/web`, and `packages/shared` exist. Marketing and future dashboard prompts should stay out of the mobile MVP sequence. |

## Optional Or Later Integrations

| Integration | Prompt Created? | Reason |
| --- | --- | --- |
| Push notifications | No | Current MVP only requires in-app attention badges. |
| Camera/photos/media picker | No | Wait until backend/media receipt intake is approved. |
| Location/maps | No | Delivery zones use manual text entry. |
| Microphone/voice notes | No | Voice transcription is P2. |
| Payment provider client SDK | No | Payment verification belongs behind backend/server decisions. |
| Admin console/monitoring | No | Future operational surface, not mobile MVP. |
