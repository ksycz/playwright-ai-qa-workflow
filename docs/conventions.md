# Conventions

The rules for every test in this repo, whether a human or an agent writes it.
`CLAUDE.md` points here. The planner, generator and healer agents are told to
follow this file, so the rules live in one place.

## Where tests live

- `tests/seed.spec.ts`: the hand-written example the planner learns from.
- `tests/generated/`: tests written by the generator agent.
- `tests/manual/`: tests written by hand.

## Writing a test

- **Requirement id first.** Every test title starts with its requirement id in
  brackets: `[REQ-2.2] children under 6 go free`. A test that covers two
  requirements names both: `[REQ-1.3][REQ-1.5] ...`.
- **Assert on the requirement, not on the screen.** If a requirement says
  "€8.51", the test says "€8.51" even when the UI shows something else. A
  mismatch is a finding, not something to adjust.
- **Locate by role or test id.** Use `getByRole`, or `getByTestId` with the ids
  the app exposes: `age-input`, `add-visitor-button`, `age-error`,
  `visitor-row`, `category-label`, `ticket-price`, `remove-visitor-button`,
  `group-discount-note`, `order-total`, `empty-order`. No CSS or XPath.
- **No fixed waits.** Rely on Playwright's auto-waiting and web-first
  assertions (`expect(locator).toHaveText(...)`). No `waitForTimeout`.
- **One behavior per test.** Tests do not depend on each other or on order.
- **Test data comes from classes and boundaries.** Use the
  `derive-test-data` skill, not guesswork.

## Failing tests

- Never skip, delete or loosen a failing test to make it pass.
- A test that fails under a planted bug (`PLANTED_BUG=<name>`) did its job. Report
  it; do not heal it.
- Before the healer changes an assertion, it states the cause of the failure.
  A heal may change a locator when the UI changed on purpose. It may not change
  an expected value that a requirement defines.
- A requirement that is silent or vague is a question for the PO (a GitHub
  Issue comment), not a rule to guess.

## Review log

Every correction a human makes to AI output (plan, test or heal) gets an
entry in `docs/review-log.md`, in the format at the top of that file.

## Format and lint

Biome formats the code and enforces the mechanical rules above: no
`waitForTimeout`, no skipped or focused tests, no `networkidle`, no
`page.pause()`, no forced clicks. Run `npm run lint` to check and
`npm run format` to fix what can be fixed. Lint does not replace review: it
cannot tell whether an assertion matches a requirement.
