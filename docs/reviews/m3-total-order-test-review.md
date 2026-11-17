<!-- Date: 2026-11-17 -->
<!-- Skill: review-generated-test -->
<!-- Run on: tests/generated/total-*.spec.ts and order-*.spec.ts at commit d9042cf -->
<!-- Saved unedited from the Claude Code terminal -->

# Review: generated total and order tests

I reviewed the 9 tests against `specs/total.plan.md`, `specs/order.plan.md`, `requirements/` and `docs/conventions.md`. I worked out every price and total by hand from REQ-2.1 to 2.5 and REQ-3.1 to 3.4, and all of them are correct. All 9 tests pass against the current app and lint is clean. The app has no planted-bug code yet, so the planted-bug section is judged by reading the tests, not by running them. I changed no files.

| Test file | Title (shortened) | REQ ids | Plan scenario | Verdict |
|---|---|---|---|---|
| `total-rounding-1-1` | two children at 8 tickets show €8.51, total €119.08 | 3.1, 2.5 | total 1.1 | ok |
| `total-empty-2-1` | empty order: message, no total | 3.2 | total 2.1 | ok |
| `total-free-2-2` | only free tickets: not empty, total €0.00 | 3.4 | total 2.2 | ok |
| `total-free-2-3` | free ticket: €0.00, "Free" only as label | 3.4 | total 2.3 | change needed |
| `total-lines-2-4` | two visitors of the same age are two lines | 3.3 | total 2.4 | ok |
| `order-limit-1-1` | 10th ticket accepted, 11th refused | 1.3 | order 1.1 | ok |
| `order-limit-1-3` | at 10 tickets, "abc" shows the invalid-age message | 1.3, 1.2 | order 1.3 | ok |
| `order-age-1-5` | age 121 is rejected | 1.2 | order 1.5 | change needed |
| `order-remove-2-3` | removing the 8th ticket removes the discount | 1.4, 2.5 | order 2.3 | ok |

**Scenarios without a test:** All 5 total scenarios have a test. Order scenarios 1.2, 1.4, 1.6 to 1.14, 2.1, 2.2 and 2.4 have none, because you limited this batch to 1.1, 1.3, 1.5 and 2.3.

## Findings

1. **`total-free-2-3`, line 23: the "exactly once" check is loose.** `row.getByText('Free')` matches any casing and any text that contains "Free". A row with "free" or "Freebie" in another element would be counted the same way. This is the same problem as finding 1 in the 2026-11-15 review and the "Free" entry in the review log. The fix is `getByText('Free', { exact: true })`, keeping the count of 1. It's also a repeat: the agent was told to match exactly.
2. **`total-free-2-3`, line 23: hidden names aren't checked.** `getByText` reads only visible text. It cannot see an accessible name, so "Free" in the remove button's name would still pass. See question 1.
3. **`order-age-1-5`, line 20: the empty-order check is weaker than it could be.** `toBeVisible()` passes whatever text the element shows. REQ-3.2 defines the exact message, so `toHaveText('Add visitors to see a price')` proves that the empty order is still shown.
4. **`total-free-2-2`, line 30: the check is stricter than the plan's wording.** `empty-order` is checked with `toHaveCount(0)`, meaning absent, while the plan says "not shown". A count of 0 is the safe form against a silent pass. However, REQ-3.4 only says the order is "not empty", and REQ-3.2 requires absence only for the total element. This is fine as written; see question 2.
5. **`order-limit-1-3`, line 26: a page-wide text check, which is acceptable.** `page.getByText('An order can have at most 10 tickets')` with a count of 0 is a text-only locator. It checks the whole page, which is what "the limit message is not shown" asks for. The exact `toHaveText` on `age-error` would also fail if two error elements were shown. No change needed.
6. **`order-remove-2-3`, line 33: `.first()` on the remove button.** The plan says "any row" and all 8 rows are the same, and the count of 7 afterwards still catches extra rows. No change needed.
7. **`order-remove-2-3`: nothing proves the update happens "at once" (plan-level, not a test defect).** The title says "at once" and REQ-1.4 says the prices are "already correct" after the click. The retrying assertions would also pass if the update came late, and the test has no reload marker. Under the plan, only O2.2 gets the single non-retrying read, so the test does follow the plan. Whether 2.3 should get the same check is a decision for the plan.
8. **Plan gap: the group-discount notice isn't asserted.** REQ-2.5 now defines the notice "Group discount: 10% off every ticket". Neither `total-rounding-1-1` nor `order-remove-2-3` checks it (shown at 8 tickets, gone at 7), because neither plan includes it. The total plan still lists this as open question 5, although PR #21 answered it.
9. **All 9 tests: nothing else found.**
   - Each test opens `/` itself.
   - There are no waits, `try`/`catch`, conditionals or skips.
   - Lists use `toHaveText([...])`, which also checks the count.
   - Rows in `total-rounding-1-1` are found by category with exact matching.
   - The `for` loops only add visitors.
   - `total-empty-2-1` asserts the message before its count-0 checks, so a blank page cannot pass.

## Planted bugs

- **`group-from-9`** is caught by four tests, because at 8 tickets the prices would stay at €18.90 and €9.45:
  - `total-rounding-1-1`
  - `order-remove-2-3` (step 1)
  - `order-limit-1-1` (€189.00 instead of €170.10)
  - `order-limit-1-3` (€189.00 instead of €170.10)
- **`child-free-6`** is caught by none of these tests, since they use ages 0, 3, 5, 12, 30 and 121. `prices-categories-2-1` covers it.
- **`senior-over-65`** is caught by none of these tests. `prices-categories-2-2` covers it.
- Across all batches, every planted bug is caught by at least one test, judged by reading.

## Questions for the PO

1. **REQ-3.4:** Does "'Free' appears only as its category label" include hidden text, such as the remove button's accessible name? Issue #4 describes what the app does, but the requirement doesn't say. If yes, add it to REQ-3.4 so a test can check it, for example `getByRole('button', { name: /free/i })` with a count of 0 on the row.
2. **REQ-3.2 / REQ-3.4:** When the order has tickets, must the empty-order message be absent from the page, or is hidden enough? REQ-3.2 says absent only for the total element.
3. **REQ-3.3:** The order of the lines is still not specified (total plan question 3). These tests use identical visitors or find rows by category, so they don't depend on it.

To fix findings 1 and 3, decide whether to make the edits yourself or have me make them. Either way, CLAUDE.md requires each correction to go into `docs/review-log.md`. I can also save this review as `docs/reviews/m3-order-total-test-review.md` like the earlier ones.
