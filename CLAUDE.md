# playwright-ai-qa-workflow

This repo shows the AI-assisted QA workflow end to end: requirements, an
AI-written test plan, AI-generated Playwright tests, planted bugs, healing,
and a requirements-to-tests traceability report. A human reviews everything
the AI produces. The app (a one-screen ticket price calculator) is only a
stand-in to test against.

## Requirements are the source of truth

- `requirements/` is written by a human. Never edit it; the settings deny it.
- Write tests to the requirements, never the other way round.
- Assert on what the requirement says, not on whatever the UI happens to show.
- When a requirement is silent or vague, say so and ask. Do not guess a rule
  and then test your guess.

## Test conventions

- Generated tests go in `tests/generated/`, hand-written ones in `tests/manual/`.
- Every test title starts with its requirement id in brackets:
  `[REQ-2.2] children under 6 go free`.
- Locate elements with `getByRole` or `getByTestId`.
- Never skip, delete or loosen a failing test to make it pass.
- Full rules: `docs/conventions.md` (read it before
  writing or fixing a test).

## Review log

Every correction a human makes to AI output gets an entry in
`docs/review-log.md`, in the format at the top of that file.

## Planted bugs (added in Milestone 4)

Known defects are switched on with `PLANTED_BUG=<name>` (forwarded to the app
as `VITE_PLANTED_BUG`). The app code itself stays correct. A test that fails
under a planted bug has done its job: report it, do not heal it.

## Skills

QE skills live in `.claude/skills/`. Each one has a row in `docs/skills.md`;
add the row in the same commit as the skill.

## Pull requests

Every PR description has four parts: what changed, what problem it solves,
how to test it locally, and the risk.
