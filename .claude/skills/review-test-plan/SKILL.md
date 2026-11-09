---
name: review-test-plan
description: Use when reviewing an AI-written test plan in specs/ against requirements/ and docs/test-strategy.md, before any test is generated from it.
---

# Review a test plan

Read every file in `requirements/`, `docs/test-strategy.md` and the plan under
review (`specs/`). You only report; a human edits the plan.

## Checklist

1. **Coverage map.** For every REQ id, list the plan scenarios that cover it.
   Name every id with no scenario as `uncovered`. Name any scenario with no
   REQ id as `orphan`.
2. **Priorities.** Check that the plan's order and priorities follow the risks
   in `docs/test-strategy.md`: wrong price or total first, then wrongly
   accepted or refused input, then display. Flag any mismatch.
3. **Boundaries.** For every number in the requirements, check the plan tests
   the values on and either side of the edge. List missing ones.
4. **Negative cases.** Check refused input, the order limit and the empty order
   each have a scenario that shows the message and checks nothing else changed.
5. **Assertions.** Every scenario states an expected result that comes from a
   requirement (a price, a message, a count). Flag vague results such as "the
   price is correct".
6. **Assumptions.** List every place the plan relies on something the
   requirements do not say. Each one becomes a question for the PO. Never
   accept an assumption silently.
7. **Duplicates and level.** Flag scenarios that repeat each other, and rules
   that belong in a Vitest unit test rather than a browser test (see the test
   levels in `docs/test-strategy.md`).

## Output

- A table: REQ id, covering scenarios, verdict (`covered`, `uncovered`,
  `weak`).
- A numbered list of findings, each naming the scenario or REQ id and the
  exact gap.
- A numbered list of assumptions, each as a question for the PO.
