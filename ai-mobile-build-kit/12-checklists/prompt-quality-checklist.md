# Prompt Quality Checklist

Use this before sending any coding prompt.

## Required Structure

- [ ] Does the prompt have one task?
- [ ] Does it mention `AGENTS.md`?
- [ ] Does it include constraints?
- [ ] Does it include references?
- [ ] Does it include acceptance criteria?
- [ ] Does it say what not to change?
- [ ] Does it ask for files changed and how to test?

## Scope

- [ ] The task can be reviewed in one diff.
- [ ] The task does not combine unrelated features.
- [ ] The task does not include vague improvement language.
- [ ] The task says whether dependencies are allowed.
- [ ] The task says whether UI changes are allowed.
- [ ] The task says whether refactors are allowed.

## References

- [ ] Design image included for UI work.
- [ ] Current docs included for library work.
- [ ] File names included.
- [ ] Feature spec included.
- [ ] Acceptance criteria included.
- [ ] Error logs or reproduction steps included for bugs.

## Constraints

Good prompts explicitly say:

- Do not change unrelated files.
- Do not refactor existing code.
- Do not install libraries without approval.
- Do not expose secrets.
- Do not add unrequested features.
- Preserve existing UI unless requested.

## Done Looks Like

A prompt is ready when the AI has enough context to act and enough constraints to avoid improvising the product.
