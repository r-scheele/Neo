# B09 Prompt Index

Status values: `Planned`, `Ready`, `Blocked`, `Complete`.

Run one prompt at a time. Do not batch B09A-B09G into a single task.

| Order | Prompt | Purpose | Depends On | Requires Live Provider? | Status | Suggested Commit |
| --- | --- | --- | --- | --- | --- | --- |
| B09A | `prompts/B09A-whatsapp-webhook-live-qa.md` | Verify live WhatsApp webhook challenge and inbound test message handling. | B07, approved Meta test number/account | Yes | Planned | `record whatsapp webhook live qa` |
| B09B | `prompts/B09B-whatsapp-send-message-live-qa.md` | Verify server-side WhatsApp send to an approved test recipient only. | B09A, approved test recipient | Yes | Planned | `record whatsapp send live qa` |
| B09C | `prompts/B09C-openai-draft-generation-live-qa.md` | Verify OpenAI draft generation from real test WhatsApp context. | B09A, B08, approved OpenAI test key | Yes | Planned | `record openai draft live qa` |
| B09D | `prompts/B09D-sensitive-draft-approval-routing-qa.md` | Verify sensitive drafts route to Approvals and are never auto-sent. | B09C, test conversation cases | Yes | Planned | `record sensitive draft approval qa` |
| B09E | `prompts/B09E-log-analytics-privacy-audit.md` | Audit code, logs, analytics, and audit metadata for content/secret leakage. | B09A-B09D evidence | Maybe | Planned | `record provider privacy audit` |
| B09F | `prompts/B09F-provider-credential-rotation.md` | Rotate shared OpenAI and Meta test credentials after QA. | B09A-B09E complete or explicitly waived | Yes | Planned | `rotate shared provider test credentials` |
| B09G | `prompts/B09G-final-live-provider-qa-report.md` | Summarize B09 results, blockers, rotated secret names, and next track. | B09A-B09F | No | Planned | `add final live provider qa report` |

## Notes

- B09F must not run before the relevant live QA is complete.
- Failed B09 prompts should document blockers in `docs/backend/live-provider-qa-results.md`.
- Do not mark B09 complete until B09G is complete.
