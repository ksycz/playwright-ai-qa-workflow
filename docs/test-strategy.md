# Test strategy

One page. It sets what we test first and why. The planner reads it before it
plans, and the plan review checks the plan against it.

## 1. Risks, ranked

1. **A wrong price or total.** A visitor pays the wrong amount. This is the
   core of the product. REQ-2.1 to 2.5 (prices, discounts, thresholds),
   REQ-3.1 (rounding, sum of tickets, euro format).
2. **Input wrongly accepted or refused.** A bad age gets into the order, or a
   good one is turned away. The 10-ticket limit lets in an 11th visitor.
   REQ-1.2, REQ-1.3, REQ-1.5.
3. **The order does not match what was done.** Add, remove and the empty
   order leave the screen out of step with the order. REQ-1.1, REQ-1.4,
   REQ-3.2 to 3.4.
4. **Display and accessibility.** Labels, messages and focus are wrong, but
   the numbers are right. Lowest risk here, so the fewest tests. No
   requirement covers it, so it gets one light check at most.

## 2. Test levels

- **Vitest (unit):** the pricing rules in `pricing.ts`: age categories,
  discounts, rounding, input parsing. Many values, fast, no browser.
- **Playwright (end to end):** what a visitor does and sees: adding and
  removing visitors, messages, line items, the total.
- **No duplicates:** a rule is tested at one level. A price that Vitest
  already checks is checked in the browser only once, to prove the screen
  shows it.

## 3. AI and human roles

The agents plan, generate and propose fixes. A human approves every plan,
every test and every heal, and logs each correction in `docs/review-log.md`.
The requirements come from the PO and are never written by the AI.

## 4. Test data

Chosen by equivalence classes and boundary values, using `derive-test-data`,
never by guesswork. Ages: 5/6, 17/18, 64/65, 0, 120, 121. Tickets: 7/8 for
the group discount, 10/11 for the limit. Expected values are worked out from
the requirements, not copied from the app.

## 5. Out of scope

Performance and load, browsers other than Chromium, and visual design (visual
tests are on the roadmap as a later idea).

## 6. Done

- Every REQ id is covered by a test, or named as a gap.
- Each planted bug is caught by at least one test.
- CI is green, and lint and unit tests pass.
