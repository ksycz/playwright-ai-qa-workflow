<!-- Date: 2026-11-17 -->
<!-- Agent: playwright-test-healer -->
<!-- Run on: tests/ at commit 5d5e2a7, after the add button was renamed, with REQ-1.3 updated to "Add to order" -->
<!-- Saved unedited from the Claude Code terminal -->

Agent "Heal add-button locators" finished · 3m 36s

I healed the tests: all 21 in tests/ pass again, lint is clean, and the only change is the button name in the locators. It took about 3.5 minutes.

Cause, stated before each edit: before the heal, 19 of the 21 tests failed. Every one failed the same way: the click timed out after 30s because getByRole('button', { name: 'Add visitor' }) found nothing once the button was renamed to "Add to order". No test failed for any other reason. The other 2 tests (total-empty-2-1 and total-free-2-3) never click the button, so they still passed.

What changed, which I checked in the diff myself:
- 32 lines across 19 files (18 generated tests plus tests/seed.spec.ts).
- Every changed line is exactly name: 'Add visitor' → name: 'Add to order', still with getByRole. No other line differs.
- No old locator is left anywhere in tests/.
- No title, step comment, assertion or expected value changed. "Add visitors to see a price" is untouched.

Still out of date: the plan still says "the 'Add visitor' button":
- specs/order.plan.md, scenario 1.1
- the copied plan-step comment at tests/generated/order-limit-1-1.spec.ts:34

REQ-1.3 now says "Add to order", so the plan should be updated, and the comment then regenerated or edited to match. I left both alone because you asked for locator changes only.

The edits and your change to REQ-1.3 in requirements/order.md are uncommitted on healer-demo. The healer didn't add a docs/review-log.md entry. CLAUDE.md asks for one only when a human corrects AI output, so you need one only if you change anything in this heal.
