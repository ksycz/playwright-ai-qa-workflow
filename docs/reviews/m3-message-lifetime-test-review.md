<!-- Date: 2026-11-17 -->
<!-- Skill: review-generated-test -->
<!-- Run on: tests/generated/order-messages-*.spec.ts at commit 0fcad1f -->
<!-- Saved unedited from the Claude Code terminal -->

# Review: generated message lifetime tests

I reviewed the 5 tests against `specs/order.plan.md`, `requirements/` and `docs/conventions.md`. `requirements/order.md` and the order plan haven't changed since the plan was written. Every message text matches REQ-1.2 or REQ-1.3 word for word. All 5 tests pass at `0fcad1f`, after formatting, and lint is clean. The app has no planted-bug code yet, so the planted-bug section is judged by reading. I changed no files.

| Test file | Title (shortened) | REQ ids | Plan scenario | Verdict |
|---|---|---|---|---|
| `order-messages-1-8` | refusal message disappears after the next successful add | 1.5, 1.2 | order 1.8 | ok |
| `order-messages-1-9` | limit message disappears after a removal | 1.5, 1.3 | order 1.9 | ok |
| `order-messages-1-10` | refusal message stays while typing or clearing | 1.5, 1.2 | order 1.10 | ok |
| `order-messages-1-13` | refusal message disappears after a removal | 1.5, 1.2 | order 1.13 | ok |
| `order-messages-1-14` | limit message stays while typing | 1.5, 1.3 | order 1.14 | ok |

**Scenarios without a test:** Order 1.12 ("a refused age leaves the existing lines and total unchanged") has the same File line, `order-messages.spec.ts`, but it wasn't part of this batch. The files are split per scenario (`-1-8` and so on), as you asked, not one file as the plan's File line says.

## Findings

1. **`order-messages-1-10`, lines 25 and 33, and `order-messages-1-14`, line 26: "stays" can't be fully proven by a retrying assertion (low risk).**
   - These checks pass the moment the message is present. If the app removed the message a little after the keystroke, for example after a debounce or timer, the assertion could pass before the removal happened.
   - For React's normal input handling the risk is small, because the screen updates before Playwright's next command.
   - In 1-10 you could make it tighter by checking the field before each "still shown" check: `expect(ageInput).toHaveValue('')` after line 22 and `toHaveValue('3')` after line 30. This confirms the input was handled first, without loosening anything.
   - In 1-14 the same check can't be written yet, because the field's value after the 11th refusal is not specified (question 3).
2. **`order-messages-1-10`, line 22: the clearing step only tests clearing if the field still holds "abc".** Issue #2 says the text is kept after a refusal, so `fill('')` really empties a full field. That answer isn't in REQ-1.2 and isn't asserted. If the app emptied the field on refusal, step 2 would test nothing and still pass. See question 2.
3. **Checks added beyond the plan's wording, as I chose when I briefed the generator.**
   - 1-13, line 19 asserts the exact invalid-age message where the plan says only "age-error is shown". REQ-1.2 defines that message for "abc", so the check is backed by a requirement and is stricter, not looser.
   - 1-14, line 20 checks the limit message before typing, where the plan has no expect line. Without it, step 2's "still shows" could not tell "stayed" apart from "appeared later". The comment on line 19 says the generator added it; the honest note would be that I asked for it.
   - Both checks fit the plan, but the plan doesn't list them. If you keep them, the plan should say so for 1.13 and 1.14.
4. **1-8 line 26, 1-9 line 27, 1-13 line 27: "no longer shown" is checked as removed from the page (count 0).** REQ-1.5 says the message "disappears", which doesn't say whether it is removed or hidden. A count of 0 can't pass while a hidden message is still there, so it's the safe form. It is still a reading of the requirement, though. See question 1.
5. **`order-messages-1-8`, line 29: `category-label` is checked across the whole page, not inside the row.** It's safe because line 28 checks there is exactly one row, and `toHaveText` would fail on two labels. Finding the row by category, as in `tests/seed.spec.ts`, would match the other tests better. Optional.
6. **`order-messages-1-9`, line 24 and `order-messages-1-13`, line 24: the remove clicks are fine.**
   - 1-9 uses `.first()` because the plan says "the first visitor-row", and the count of 9 afterwards catches extra rows.
   - 1-13 clicks without choosing a row. With two rows the click would fail, not pass silently.
7. **All 5: nothing else found.**
   - Titles are verbatim with the right REQ ids.
   - Each test opens `/` itself.
   - Only test-id and role locators are used.
   - There are no waits, `try`/`catch`, conditionals or skips.
   - Every action is followed by an assertion.

## Planted bugs

- **`group-from-9`:** none of these tests. 1-9 and 1-14 reach 10 tickets but assert no price. `order-limit-1-1`, `order-limit-1-3`, `order-remove-2-3` and `total-rounding-1-1` cover it.
- **`child-free-6`:** none, because only age 30 is used. `prices-categories-2-1` covers it.
- **`senior-over-65`:** none. `prices-categories-2-2` covers it.
- Every planted bug is caught somewhere in the suite. No planted bug targets REQ-1.5, though, so these 5 tests have never been seen to fail against a broken message lifetime. Consider one for Milestone 4, such as a message that clears on typing.

## Questions for the PO

1. **REQ-1.5:** Does "disappears" mean the message is removed from the page, or is hidden enough? The tests require removal.
2. **REQ-1.2:** Issue #2 answered that the typed text is kept after a refusal. Can that go into the requirement? Test 1-10's clearing step depends on it.
3. **REQ-1.3:** After an 11th visitor is refused, is the typed age kept or cleared? This is order plan question 6, still open. It decides what the field holds when 1-14 types "3".
4. **REQ-1.5:** If a second, different refusal follows the first, does the new message replace the old one? This is order plan question 7, still open. No test covers it.
