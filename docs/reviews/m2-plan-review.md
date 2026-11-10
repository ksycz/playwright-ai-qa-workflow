<!-- Date: 2026-11-10 -->
<!-- Skill: review-test-plan -->
<!-- Run on: specs/ at commit 04d48aa -->
<!-- Saved unedited from the Claude Code terminal -->
<!-- Note: the skill states that commit 04d48aa, titled "unedited", includes four human edits made after the planner run. -->

Verdict: the plans aren't ready for test generation yet. All 14 REQ ids have scenarios and none are orphaned, but two scenarios assert rules the requirements don't settle (findings 1 and 2).

Commit 04d48aa is titled "unedited", but it includes the four edits I made after the planner finished. If that commit is your baseline for the review log, the title needs correcting. This review changed nothing.

Coverage

O, P and T stand for the order, prices and total plans.

┌─────────┬──────────────────────────┬─────────┐
│ REQ id  │    Covering scenarios    │ Verdict │
├─────────┼──────────────────────────┼─────────┤
│ REQ-1.1 │ O2.1                     │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-1.2 │ O1.3–1.12, O1.14         │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-1.3 │ O1.1–1.4, O1.13, O1.15   │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-1.4 │ O1.13, O1.15, O2.2–2.4   │ weak    │
├─────────┼──────────────────────────┼─────────┤
│ REQ-1.5 │ O1.12–1.14               │ weak    │
├─────────┼──────────────────────────┼─────────┤
│ REQ-2.1 │ P1.1, P2.3               │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-2.2 │ P1.2, P2.1               │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-2.3 │ P1.3, P2.2               │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-2.4 │ P1.4, P2.4               │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-2.5 │ P1.1–1.4, O2.3, T1.1–1.2 │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-3.1 │ T1.1–1.3                 │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-3.2 │ T2.1, O2.4               │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-3.3 │ T2.4                     │ covered │
├─────────┼──────────────────────────┼─────────┤
│ REQ-3.4 │ T2.2, T2.3               │ weak    │
└─────────┴──────────────────────────┴─────────┘

Findings

Every scenario states a concrete expected result, apart from the gap in finding 4. Each plan follows the risk order internally.

1. O1.4: it asserts "Enter an age" for an empty field at 10 tickets. REQ-1.3 says only "the invalid-age message", and REQ-1.2 has two messages, so this should be a question.
2. O1.14: it clears the field before typing and expects the message to stay, but whether clearing counts as typing is open (order question 7).
3. O1.4: "leave age-input empty" after ten adds relies on the field clearing itself, which is also open. The step should clear it explicitly.
4. REQ-1.4, O2.2 and O2.3: retrying assertions would pass on a late update, so "already correct" is not proven. No step can detect a page reload either.
5. REQ-1.5: no scenario clears a REQ-1.2 message by removing a visitor, and none keeps the limit message while typing.
6. REQ-3.4, T2.3: it checks only the price cell, while the requirement says "Free" appears only as the category label.
7. Negative cases: O1.2, O1.3 and O1.4 check the row count but not that the total is unchanged. No scenario refuses a bad age with a partly filled order, so nothing shows existing lines survive.
8. Boundaries: 9 tickets is untested in the plans and in Vitest. Ages -1, 1 and 119 are also untested. No reachable price rounds down, so only the upward side of rounding can be tested.
9. REQ-1.2: an inner space such as 3 0 has no test at either level.
10. Priorities across plans: nothing sets an order across the three files. Taken alphabetically, order's risk 2 comes before the risk 1 scenarios.
11. O2.3: this group-discount boundary sits after O2.1 and O2.2, though boundaries should come first within a risk.
12. T2.4: step 2 tests removal under [REQ-3.3] only, which is a second behavior and an unnamed requirement.
13. Level: O1.5, O1.6, O1.7 and O1.9 repeat values Vitest already tests (120, 121, 0, 30).
14. Level: O1.8 and O1.10 belong in Vitest, which lacks 007, 5.0, +5 and 1e1. Add those there, then cut O1.10 to one browser check.
15. Duplicates: T1.3 repeats P2.1–2.4, and P2.3 repeats the seed test. T2.3 contains P2.1, and T1.2 already covers the prices in P1.3, P1.4 and T1.1.
16. Planted bugs: none exist yet, only the config wiring, so section 6 of the strategy can't be checked. Browser tests use ages 3 and 12, so they would miss a shifted 5/6 boundary.

Questions for the PO

These are the assumptions the plans rely on. The other questions already in the plans still stand.

1. Is an empty field at 10 tickets answered with "Enter an age", the invalid-age message, or the limit message? (O1.4)
2. Does clearing the field count as typing under REQ-1.5? (O1.14)
3. Is the age field cleared after a successful add? (O1.4)
4. Does every total use the Total: €x.xx form, with the same money format as tickets? (nearly all scenarios)
5. Does "no total" mean absent from the page, or is hidden acceptable? (T2.1, O2.4)
6. Does "Free only as its category label" apply to the whole line, including the remove button's name? (T2.3)
7. Is the group discount recalculated when removal drops the order below 8 tickets? I read REQ-1.4 as saying yes, but REQ-2.5 doesn't say so. (O2.3)
8. Is a spaces-only field "empty" or an invalid age? The order plan's Vitest note already lists it as a case to test.