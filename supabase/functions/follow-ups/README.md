# follow-ups

Status: B06 permissions/audit implemented and deployed.

Current scope:
- Read backend follow-up queue records and counts.
- Mark follow-ups complete after a human action.
- Reschedule follow-ups in backend records.
- Do not send WhatsApp messages in B05.
- Enforce active membership permissions before follow-up mutations.
- Write audit rows for follow-up completion and rescheduling.

Future B07 scope:
- Enforce WhatsApp service-window and anti-spam rules before sending messages.

QA note:
- Signed-in Clerk QA still needs to verify follow-up mutations and audit rows before release.
