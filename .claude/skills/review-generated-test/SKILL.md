---
name: review-generated-test
description: Use when reviewing Playwright tests written by the generator agent in tests/generated/, against the plan scenario, requirements/ and docs/conventions.md, before they are committed or merged.
---

# Review a generated test

Read `docs/conventions.md`, every file in `requirements/`, the plan scenario
each test came from (`specs/`), and the tests under review
(`tests/generated/`). You only report; a human edits or rejects each test.
Review each test the way you would review a pull request.

## Checklist

1. **Title and trace.** The title starts with the REQ id or ids of the plan
   scenario it came from, and they are the right ones. One behavior per test.
   Name the plan scenario each test implements, and any scenario with no test.
2. **Steps match the plan.** Compare the steps and expectations with the plan
   scenario. List every step or expectation that is missing, added or changed.
3. **Assertions come from the requirement.** For every asserted value (a price,
   a message, a count, a category) find the requirement that defines it and work
   the value out by hand. Flag a value that has no requirement behind it, or that
   looks copied from the screen. Flag loose assertions: only `toBeVisible`
   where an exact text or a count is required, a regex or `toContainText` where
   the exact message is required, `.first()` or `.nth()` hiding extra rows, or an
   action with nothing asserted after it.
4. **Silent-pass risks.** Flag anything that can pass while the app is wrong:
   `try`/`catch`, `.catch()`, conditionals around assertions, `test.skip`,
   `test.fixme`, `expect.soft` where a hard failure is needed, `not.toBeVisible`
   where the requirement says the element must be absent (use a count of 0), and
   assertions on an element that is also present for a wrong result.
5. **Locators.** Only `getByRole` and `getByTestId`, with the ids listed in
   `docs/conventions.md`. Flag CSS, XPath, text-only locators for ids, rows picked
   by position when the plan says to find them by category, and forced clicks.
6. **Waits.** No `waitForTimeout`, `networkidle` or `page.pause()`. Rely on
   retrying assertions. The one allowed exception is the single non-retrying read
   and the window marker the plan names for REQ-1.4; flag any other.
7. **Independence.** Each test opens `/` itself and depends on no other test,
   order or shared state.
8. **Planted bugs.** For each test, name the planted bug it would catch, if any:
   `child-free-6` (age 6 treated as free), `senior-over-65` (age 65 treated as
   adult) or `group-from-9` (no discount at 8 tickets). List any planted bug no
   test would catch.
9. **Requirement gaps.** List every place the test needs a rule the
   requirements do not state. Each one becomes a question for the PO. Never
   accept a guess silently.

## Output

- A table: test file, title, REQ ids, plan scenario, verdict (`ok`,
  `change needed`, `reject`).
- A numbered list of findings, each naming the test, the line and the exact
  problem.
- A list of planted bugs with the test that catches each, or `none`.
- A numbered list of questions for the PO.

Never suggest skipping, deleting or loosening a test to make it pass. A test
that fails because the app disagrees with a requirement has found a defect;
report it, do not heal it.
