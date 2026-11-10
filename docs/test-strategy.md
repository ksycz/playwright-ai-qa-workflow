# Test strategy

One page. It sets what we test first and why. The planner reads it before it
plans, and `review-test-plan` checks the plan against it.

## 1. Risks, ranked

Ranked by what a wrong result costs the visitor, then by how likely the rule is
to be got wrong. Boundaries (ages, 8 and 10 tickets, rounding) are the most
likely place for a defect, so they are tested first inside each risk.

1. **A wrong price or total.** The visitor pays the wrong amount. REQ-2.1 to
   2.5 (categories, discounts, thresholds), REQ-3.1 (rounding, sum, format).
2. **Input wrongly accepted or refused.** A bad age gets in, a good one is
   turned away, or an 11th visitor is added. REQ-1.2, REQ-1.3, REQ-1.5.
3. **The screen is out of step with the order.** Adding, removing and the empty
   order show the wrong lines or total. REQ-1.1, REQ-1.4, REQ-3.2 to 3.4.
4. **Display and accessibility.** Wrong labels or focus with correct numbers.
   No requirement covers it, so at most one light check.

## 2. Test levels

- **Vitest:** every pricing rule and every boundary value, fast, no browser.
- **Playwright:** what a visitor does and sees, using one representative per
  age category, the 7/8 and 10/11 ticket edges, each message, line items,
  remove and the empty order.
- **No duplicates:** a rule is tested at one level. A price Vitest already
  proves is checked in the browser once, to show the screen displays it.
- Each test starts from a fresh page and does not depend on another test.

## 3. AI and human roles

- The agents plan, generate and propose fixes. A human approves every plan,
  every test and every heal, and logs each correction in `docs/review-log.md`.
- Gates in order: refinement of the requirements, then the plan review, then the
  generated-test review. Nothing moves on until the gate is passed.
- A requirement that is silent is a question to the PO on the GitHub Issue.
  A test never guesses the rule.
- A failing test is never skipped or loosened. `retries` stays at 0, so a
  flaky test stays visible and gets diagnosed.

## 4. Test data

Chosen by equivalence classes and boundary values with `derive-test-data`,
never by guesswork. Ages: 0, 5/6, 17/18, 64/65, 120, 121. Tickets: 7/8 for the
group discount, 10/11 for the limit. Expected values are worked out from the
requirements, not copied from the app.

## 5. Out of scope

Performance and load, browsers other than Chromium, and visual design (visual
tests are on the roadmap as a later idea).

## 6. Done

- The traceability report shows every REQ id covered by a test, or named as a
  gap with a reason.
- Each planted bug is caught by at least one Playwright test, by name. (Vitest
  runs without the bug flag, so it does not count here.)
- Every correction of AI output is in the review log.
- CI is green: lint, unit tests and end-to-end tests.
