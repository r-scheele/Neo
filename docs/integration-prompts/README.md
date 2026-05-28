# Integration Prompts

These prompts move the completed local MVP prototype forward through small, reviewable integration passes.

Phase A client/local work is complete. Backend/API prompts are Phase B and live under `backend-deferred/`. B01 Supabase foundation, B02 API client/auth boundary, and B03 database schema readiness are complete; B04 server auth/profile bootstrap is next if Clerk server verification inputs are ready.

Use them in order:

1. Open `backend-deferred/backend-deferred-index.md` for backend work.
2. Start with the next ready backend prompt, currently B04 if Clerk server verification inputs are ready.
3. Run only one integration prompt.
4. Review the diff.
5. Run typecheck/lint.
6. Run the app.
7. Test the related feature.
8. Test old features.
9. Commit.
10. Move to the next integration prompt.

Each prompt is intentionally narrow. Do not merge prompts together, skip dependencies, or run B05-B08 before B03-B04 and required secrets/contracts exist.

Optional or later integrations are documented in `../integration-build-sequence.md`, the prompt index, and `backend-deferred/backend-deferred-index.md`. They are not immediate implementation prompts unless their dependencies are ready.
