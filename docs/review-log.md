# Review log

Every correction a human makes to AI output gets an entry here. The log is the
evidence that a human reviewed what the AI produced and what the AI got wrong.
Newest entry last. Log a correction in the same commit as the change.

## Entry format

```
### YYYY-MM-DD: <short title>

- **Stage:** refinement | plan | generated test | heal | report
- **AI output:** what the AI produced (link or quote a line)
- **Correction:** what I changed or rejected
- **Why:** the requirement or the rule it broke (REQ id, convention)
- **Kind:** missing case | wrong assertion | guessed rule | weak locator | other
```

## Entries

### 2026-11-10: empty field at 10 tickets asserted without a rule

- **Stage:** plan
- **AI output:** In `order.plan.md`, O1.4 expected "Enter an age" for an empty field at 10 tickets. REQ-1.3 only said "the invalid-age message", and REQ-1.2 has two of them.
- **Correction:** I asked the PO (issue #2). The age is checked first, so the message is "Enter an age". REQ-1.3 now says "the message from REQ-1.2 that applies".
- **Why:** REQ-1.3 and REQ-1.2 left the rule open, so the plan guessed it. That is a question for the PO.
- **Kind:** guessed rule

### 2026-11-10: plan relied on the field clearing itself

- **Stage:** plan
- **AI output:** O1.4 said "leave age-input empty" after ten adds. That only works if the field clears after an add, and no requirement said so.
- **Correction:** I asked the PO (issue #2): the field is cleared after a successful add. I added that sentence to REQ-1.1, and the step now fills age-input with an empty string.
- **Why:** REQ-1.1. A test should not depend on behaviour no requirement states.
- **Kind:** guessed rule

### 2026-11-10: "clearing counts as typing" assumed

- **Stage:** plan
- **AI output:** O1.14 cleared the field, typed "3" and expected the message to stay. It assumed that clearing counts as typing.
- **Correction:** I asked the PO (issue #2): clearing counts as typing. REQ-1.5 now says "typing or clearing the field", and scenario 1.10 clears the field first, checks the message, then types.
- **Why:** REQ-1.5.
- **Kind:** guessed rule

### 2026-11-10: "already correct" proven only by retrying assertions

- **Stage:** plan
- **AI output:** O2.2 and O2.3 used only web-first assertions, which pass on a late update, and nothing could detect a page reload.
- **Correction:** O2.2 now reads the total once right after the click, with no retry, and checks a marker on window to show there was no reload. The exception is written in the plan overview.
- **Why:** REQ-1.4 says prices and total are already correct after the click, with no page reload and no further user action.
- **Kind:** wrong assertion

### 2026-11-10: "no total" asserted as not visible

- **Stage:** plan
- **AI output:** T2.1 and O2.4 asserted that order-total is "not visible", which also passes when the element is only hidden.
- **Correction:** I asked the PO (issue #4): the element is absent. Both scenarios now assert a count of 0, and REQ-3.2 says no total element and no price lines are present.
- **Why:** REQ-3.2.
- **Kind:** wrong assertion

### 2026-11-10: "Free only as the category label" checked on the price cell only

- **Stage:** plan
- **AI output:** T2.3 checked that ticket-price does not contain "Free", but not the rest of the line.
- **Correction:** I added an expectation that the word "Free" appears exactly once on the row, in category-label. The PO confirmed this reading (issue #4).
- **Why:** REQ-3.4.
- **Kind:** wrong assertion

### 2026-11-10: gaps in REQ-1.5 and in negative cases

- **Stage:** plan
- **AI output:** No scenario cleared a REQ-1.2 message by removing a visitor, and none kept the limit message while typing. Refusals checked the row count but not the total or the existing lines.
- **Correction:** I added scenarios 1.12 (a refused age leaves lines and total unchanged), 1.13 (a refusal cleared by a removal) and 1.14 (the limit message stays while typing). I also added "order-total unchanged" to 1.2, 1.3 and 1.4.
- **Why:** REQ-1.5, REQ-1.2 and REQ-1.3.
- **Kind:** missing case

### 2026-11-10: browser tests missed the planted-bug edges

- **Stage:** plan
- **AI output:** The browser scenarios used ages 3, 12, 40 and 80, so a shifted boundary at 5/6 or 64/65 would pass.
- **Correction:** I replaced the four representative scenarios with two edge scenarios: age 5 Free and age 6 Child (prices 2.1), and age 64 Adult and age 65 Senior (prices 2.2). The 7/8 edge was already covered by prices 1.1.
- **Why:** Section 6 of `docs/test-strategy.md` says each planted bug must be caught by a Playwright test, and Vitest runs without the bug flag.
- **Kind:** missing case

### 2026-11-10: duplicates and scenarios at the wrong level

- **Stage:** plan
- **AI output:** 34 scenarios. O1.5, O1.7, O1.8 and O1.9 repeated values that Vitest already tests, and O1.10 ran five values. T1.2 and T1.3 repeated prices and formats checked elsewhere, T2.4 tested removal as a second behavior, and P2.1 and P2.3 repeated T2.3 and the seed test.
- **Correction:** I deleted those scenarios, cut O1.10 to one value and removed the removal step from T2.4. 29 scenarios remain.
- **Why:** `docs/conventions.md`: one behavior per test, and nothing tested twice without a reason.
- **Kind:** other

### 2026-11-10: no order across the three plan files

- **Stage:** plan
- **AI output:** Three plans, each ordered inside itself, with nothing that set the order between them.
- **Correction:** I added a run order to `specs/README.md`: prices, total section 1, order section 1, then order and total section 2.
- **Why:** `docs/test-strategy.md` section 1 (risk order).
- **Kind:** other

### 2026-11-10: unusual whitespace and non-ASCII digits

- **Stage:** plan
- **AI output:** `derive-test-data` asked whether tabs, non-breaking spaces and full-width digits count as "spaces" and "digits". The plan asked the same.
- **Correction:** I put them out of scope in `docs/test-strategy.md`. The requirements say only "spaces" and "digits", and the app trims more than that, so a test would record the app's behaviour instead of a requirement.
- **Why:** `CLAUDE.md`: write tests to the requirements, never the other way round.
- **Kind:** other

### 2026-11-10: category rows matched by loose text

- **Stage:** generated test
- **AI output:** The five prices tests found the Free, Child, Adult and Senior rows with `getByText('Free')` and the like, copied from `tests/seed.spec.ts`. That matches any casing and any text containing the word.
- **Correction:** I changed every category locator to `getByText('...', { exact: true })` in the five tests and in the seed.
- **Why:** REQ-1.1 names the four labels exactly. A row labelled "free" or "Freebie" must fail.
- **Kind:** weak locator