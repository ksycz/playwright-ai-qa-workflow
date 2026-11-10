<!-- Date: 2026-11-10 -->
<!-- Skill: review-generated-test -->
<!-- Run on: tests/generated/prices-*.spec.ts at commit 9580d43 -->
<!-- Saved unedited from the Claude Code terminal -->

**Planted bugs could not be run.** The app has no planted-bug code on this branch, because that arrives in Milestone 4, so the catches below come from reading the tests. All six specs pass against the correct app and lint is clean. I changed no files.

One test is ready as written and five need the same small locator change. All 6 plan scenarios have a test, and steps and expectations match the plan with nothing missing, added or changed. I worked out every price and total by hand from REQ-2.1 to 2.5 and REQ-3.1, and all are correct. Waits, independence and silent-pass checks found nothing.

| Test file | Title (shortened) | REQ ids | Plan scenario | Verdict |
|---|---|---|---|---|
| `prices-group-discount-1-1` | 7 tickets no discount, 8th gives 10% off | 2.5 | 1.1 | ok |
| `prices-group-discount-1-2` | free ticket counts toward the 8 | 2.5, 2.2 | 1.2 | change needed |
| `prices-group-discount-1-3` | child in an 8-ticket order | 2.5, 2.3 | 1.3 | change needed |
| `prices-group-discount-1-4` | senior in an 8-ticket order | 2.5, 2.4 | 1.4 | change needed |
| `prices-categories-2-1` | age 5 is Free, age 6 is a Child | 2.2, 2.3 | 2.1 | change needed |
| `prices-categories-2-2` | age 64 is an Adult, age 65 is a Senior | 2.1, 2.4 | 2.2 | change needed |

**Findings**

1. **The category filter accepts wrong labels.** REQ-1.1 names the labels Free, Child, Adult and Senior, but `getByText('Free')` matches any casing and any substring. In a quick check, it matched `free`, `FREE`, `Freebie` and `Not Free`. It is also outside the `getByRole`/`getByTestId` rule, and the plan relies on these labels being asserted at the age edges. The affected lines are:
   - `prices-group-discount-1-2.spec.ts:20` and `:23`
   - `prices-group-discount-1-3.spec.ts:22` and `:25`
   - `prices-group-discount-1-4.spec.ts:22` and `:25`
   - `prices-categories-2-1.spec.ts:18` and `:21`
   - `prices-categories-2-2.spec.ts:18` and `:21`

   Suggested tightening: `page.getByTestId('category-label').filter({ hasText: /^Free$/ })`. In the same check, this matched only the exact label `Free`.
2. **The generator copied this pattern from `tests/seed.spec.ts:18`.** Fix the seed before generating the total and order tests, or they will inherit it. The seed wasn't part of this review.

If you apply these changes, each correction needs an entry in `docs/review-log.md`.

**Planted bugs (expected catches)**

- `child-free-6`: `prices-categories-2-1`, because age 6 becomes a second Free row and no Child row exists.
- `senior-over-65`: `prices-categories-2-2`, because age 65 becomes a second Adult row and no Senior row exists.
- `group-from-9`: `prices-group-discount-1-1`, and also 1-2, 1-3 and 1-4, because 8 tickets stay undiscounted.

No planted bug is left uncaught.

**Questions for the PO**

1. **Total format:** Should every total read `Total: €X.XX`? Only REQ-3.4 shows the `Total: ` prefix, and only for an all-free order, while all six tests assert it on other totals.
2. **Child label:** Is `Child` the required label for ages 6 to 17? REQ-1.1 lists the label and REQ-2.3 sets the price, but no requirement links that age range to that label. Tests 2-1 and 1-3 depend on it.
3. **Group discount notice:** Should the order show a notice when the discount applies, and with what wording? This is still open from the plan. The app shows a note, but no test asserts it.
