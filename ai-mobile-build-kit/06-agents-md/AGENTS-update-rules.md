# AGENTS.md Update Rules

`AGENTS.md` is the project constitution. Keep it stable, useful, and current.

## When To Update AGENTS.md

Update it when:

- A new architecture convention is decided.
- A new approved dependency is added.
- A stable folder rule changes.
- A visual direction rule changes.
- A state management convention is chosen.
- A security or secrets rule is clarified.
- A testing command is added.
- A forbidden action needs to be made explicit.

## What Not To Put In AGENTS.md

Do not put:

- Temporary tasks.
- One-off bug descriptions.
- Current sprint notes.
- Chat transcripts.
- Unapproved ideas.
- Large product brainstorms.
- Long copied documentation.

## Keep It Stable

Before adding something, ask:

- Will this still matter in two weeks?
- Should every coding agent know this?
- Is this a decision, not a task?
- Does it prevent a real failure mode?

If yes, add it. If no, keep it in the feature spec or prompt.

## Avoid The Dumping Ground Problem

`AGENTS.md` becomes useless when it is too long, contradictory, or full of temporary notes.

Keep it:

- Organized.
- Specific.
- Current.
- Free of stale instructions.
- Focused on stable project rules.

## Update Prompt

```md
Anchor:
Read the existing AGENTS.md first.

Task:
Update AGENTS.md to record this stable project decision: [DECISION].

Constraints:
- Do not add temporary task notes.
- Do not rewrite unrelated sections.
- Do not change existing rules unless they conflict with the new decision.
- Keep the wording concise and operational.

Reference:
[DECISION_CONTEXT / FILES / DISCUSSION / DOCS]

Acceptance criteria:
- The new decision is recorded in the correct section.
- No unrelated AGENTS.md content is changed.
- The file remains easy to scan.
- Explain what changed.
```

## Done Looks Like

`AGENTS.md` is healthy when it helps AI make fewer wrong assumptions without becoming a notebook.
