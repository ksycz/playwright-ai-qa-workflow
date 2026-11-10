# Milestone 2: what the two review skills found

A short, human-readable summary of the two raw outputs next to this file:
[`m2-plan-review.md`](m2-plan-review.md) and
[`m2-derive-test-data.md`](m2-derive-test-data.md). The raw files stay the
evidence; this page is only a reading aid and may be edited.

Both reviews ran on the unedited plan (`specs/` at commit `04d48aa`, which
already includes four human edits). Verdict of both: all 14 REQ ids have
scenarios, but the plan is not ready for test generation.

## `review-test-plan` (16 findings, 8 questions for the PO)

- **Weak coverage:** REQ-1.4 (nothing proves "already correct"), REQ-1.5 (no
  scenario clears a message by removing a visitor) and REQ-3.4 (the test checks
  only the price cell, not that "Free" is only the category label).
- **Guessed rules:** the empty field at 10 tickets, and whether clearing the
  field counts as typing.
- **Weak negative cases:** refusals check the row count but not that the total
  is unchanged or that existing lines survive.
- **Missing values:** 9 tickets, ages -1, 1 and 119, an inner space like `3 0`.
- **Wrong level and duplicates:** scenarios that repeat Vitest values or belong
  in Vitest, and three scenarios that repeat others.
- **Order:** nothing sets the priority across the three plan files.
- **Strategy conflict:** browser tests use ages 3 and 12, so a shifted 5/6
  boundary under a planted bug would not be caught.

## `derive-test-data` (about 55 rows, 5 questions)

- Every price and total worked out by hand from `requirements/` only, for
  example €17.01 per adult at 8 tickets, child €8.51, senior €11.91, and a
  total of €127.58 for one child and seven adults.
- The exact edges: 0/1, 5/6, 17/18, 64/65, 119/120/121 and 7/8/9/10/11 tickets,
  with free tickets counting toward both limits.
- Questions the plan review did not raise: `000`, `0120` and `0121`, and tabs,
  non-breaking spaces and full-width digits.

## What each one missed

- `review-test-plan` has no table of values, so it did not raise zero-padded or
  unusual-whitespace inputs.
- `derive-test-data` ignores the plan by design, so it cannot see duplicates,
  wrong levels or the strategy conflict.

Running both is the point: they overlap on the big questions (the empty field
at 10 tickets, the group discount after a removal) and each finds things the
other cannot.

## What happened next

| Question | Decision | Where |
| --- | --- | --- |
| Spaces-only field | Empty: "Enter an age" | Issue #2, REQ-1.2 |
| `000`, `0121` | Age 0 accepted, 121 rejected | Issue #2, REQ-1.2 |
| Empty field at 10 tickets | "Enter an age" (age is checked first) | Issue #2, REQ-1.3 |
| Field after a successful add | Cleared | Issue #2, REQ-1.1 |
| Clearing the field counts as typing | Yes, the message stays | Issue #2, REQ-1.5 |
| Group discount after a removal | Recalculated at once | Issue #3, REQ-1.4 |
| "No total" | Element absent from the page | Issue #4, REQ-3.2 |
| "Free" only as category label | Confirmed, remove button has no category | Issue #4, REQ-3.4 |
| Tabs, non-breaking spaces, non-ASCII digits | Out of scope, not tested | `docs/test-strategy.md` |

The last row is a deliberate gap: the requirements say only "spaces" and
"digits", and the app trims more than that, so a test would record the app's
behaviour instead of a requirement.
