<!-- Date: 2026-11-17 -->
<!-- Agent: playwright-test-healer -->
<!-- Run on: tests/ at commit 65a8511, with PLANTED_BUG=group-from-9 -->
<!-- Saved unedited from the Claude Code terminal -->

I made no changes and left all six failures in place. Every failure is an app defect against REQ-2.5, not a test defect.

I read CLAUDE.md, docs/conventions.md and requirements/prices.md. I didn't open order.md or total.md, because none of the failures involve them.

**1. Initial run (chromium, 21 tests): 15 passed, 6 failed.**
All six failures are `toHaveText` mismatches on `ticket-price` in an order of exactly 8 tickets. The app shows the undiscounted price. The tests expect the discounted one.
- `tests/generated/prices-group-discount-1-1.spec.ts` [REQ-2.5]: the 8 adult prices were expected as €17.01 and received €18.90.
- `tests/generated/prices-group-discount-1-2.spec.ts` [REQ-2.5][REQ-2.2]: the 7 adult prices were expected as €17.01 and received €18.90.
- `tests/generated/prices-group-discount-1-3.spec.ts` [REQ-2.5][REQ-2.3]: the child price was expected as €8.51 and received €9.45.
- `tests/generated/prices-group-discount-1-4.spec.ts` [REQ-2.5][REQ-2.4]: the senior price was expected as €11.91 and received €13.23.
- `tests/generated/total-rounding-1-1.spec.ts` [REQ-3.1][REQ-2.5]: the two child prices were expected as €8.51 and received €9.45.
- `tests/generated/order-remove-2-3.spec.ts` [REQ-1.4][REQ-2.5]: the 8 prices were expected as €17.01 and received €18.90.

**2. Fixes made:** none. The locators are fine, as the same tests resolve the expected elements. There is no timing issue. The expected values are the ones REQ-2.5 defines: 8 or more tickets get a further 10% off every ticket after the age discount, so €18.90 becomes €17.01, 9.45 becomes 8.505 (€8.51) and 13.23 becomes 11.907 (€11.91). Changing them would loosen the tests.

**3. Tests left failing on purpose (all 6 above):**
- **Cause:** the app gives no group discount at exactly 8 tickets. That contradicts REQ-2.5, so it is an app bug.
- **Planted bug:** this matches the planted bug `group-from-9`. The condition in `app/src/planted-bugs.ts` (line 33) is `ages.length > GROUP_SIZE`, so the discount starts at 9 tickets instead of 8. Per CLAUDE.md, a test that fails under a planted bug has done its job, so I did not heal these.
- **Unconfirmed:** `PLANTED_BUG` is not set in `playwright.config.ts` or in any `.env`, `.claude` or `package.json` file I could search. I couldn't inspect the shell environment, so I can't confirm the variable is set. Whether it is set or the bug sits in the app, the fix is in the app.
- **Why only 6 fail:** the 9 other tests that exercise the group discount use 10 tickets, so they still pass. docs/review-log.md line 146 predicts this: 6 tests fail under `group-from-9`, and the bug report is issue #25.
- **Corroboration:** all six failures involve exactly 8 tickets. `group-discount-note` visibility is not in the error output for any of them.

**Open questions:** none. REQ-2.5 is explicit about the threshold and the rounding.

**4. Final run:** unchanged from the initial run, 15 passed and 6 failed. No files were modified.
