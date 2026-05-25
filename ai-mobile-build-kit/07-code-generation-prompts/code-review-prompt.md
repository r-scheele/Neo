# Code Review Prompt

Use this when you want AI to review before rewriting.

```md
Anchor:
Read AGENTS.md first and follow it strictly.

Task:
Review the latest changes. Do not rewrite yet.

Review scope:
[BRANCH / DIFF / FILES / FEATURE]

Constraints:
- Do not modify files.
- Do not propose broad rewrites unless required to fix a critical issue.
- Focus on bugs, regressions, security, data safety, type safety, accessibility, and test gaps.
- Categorize issues as critical, medium, or nice-to-have.
- Mention specific files and lines when possible.
- Recommend fix order.

Reference:
- Feature spec: [PASTE_OR_LINK]
- Acceptance criteria: [PASTE]
- Relevant docs: [DOCS]
- Screenshots or test notes: [LINKS]

Acceptance criteria:
- Review lists critical issues first.
- Review distinguishes must-fix from optional cleanup.
- Review identifies missing tests or manual checks.
- Review does not perform implementation.
- Review includes recommended next prompt if fixes are needed.

Return:
1. Critical issues.
2. Medium issues.
3. Nice-to-have issues.
4. Test gaps.
5. Recommended fix order.
```
