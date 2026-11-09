---
name: refine-requirements
description: Use when drafting or reviewing user stories and acceptance criteria in requirements/, before any test plan is written from them.
---

# Refine requirements

Read every file in `requirements/`. You only report; a human edits the files.

## Checklist, per acceptance criterion

1. **Id.** It has an id in the form `REQ-<area>.<n>`, unique across all files.
2. **Testable.** A test could answer it pass or fail. Flag words that cannot be
   checked ("fast", "user-friendly", "appropriate").
3. **Boundaries.** Every number has its edges stated: is the limit included or
   excluded? What happens just below and just above?
4. **Missing cases.** Empty input, invalid input, the maximum, and what the user
   sees when something is refused.
5. **Silence.** Anything the criterion leaves open becomes a question. Never
   fill the gap with a guess.

## Output

- A table: id, one-line summary, verdict (`ok` or `question`).
- A numbered list of questions, each naming its id and the exact gap, for
  example: "REQ-9.1: can a password be exactly 8 characters long, or must it
  be longer?"
- The total count of ids found.
