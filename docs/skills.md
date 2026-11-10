# QE skills

Each skill is a short checklist in `.claude/skills/<name>/SKILL.md` that makes
one human-judgment step of the workflow repeatable. Claude Code loads a skill
when its description matches the task, or when you ask for it by name.

| Skill | Stage | Purpose | When to run |
| --- | --- | --- | --- |
| [`refine-requirements`](../.claude/skills/refine-requirements/SKILL.md) | 1. Requirements | Checks that every acceptance criterion has an id, can be tested and states its boundaries; lists gaps as questions | After writing or changing anything in `requirements/`, before the planner runs |
| [`review-test-plan`](../.claude/skills/review-test-plan/SKILL.md) | 2. Test plan | Maps every requirement id to the plan scenarios that cover it, flags gaps, weak assertions and silent assumptions | After the planner writes `specs/`, before any test is generated |
| [`derive-test-data`](../.claude/skills/derive-test-data/SKILL.md) | 2. Test plan | Lists equivalence classes and the values on and either side of each boundary, with expected results from the requirements | When choosing values for a rule, in the plan or for a generated test |
| [`review-generated-test`](../.claude/skills/review-generated-test/SKILL.md) | 3. Generated tests | Checks each generated test against its plan scenario and the requirements: title and REQ id, assertions, locators, waits, silent-pass risks and which planted bug it would catch | After the generator writes `tests/generated/`, before the tests are committed |

## `derive-test-data` in more detail

It takes a rule from the requirements and turns it into the exact values to
test, plus the result each value must give. Its output is test data, not tests.
Run it on `requirements/`, not on the plan, so its values are independent of
what the planner chose. A boundary it lists that the plan lacks is a finding
for `docs/review-log.md`.

1. **Inputs.** Name what the rule depends on, such as the age or the number of
   tickets.
2. **Equivalence classes.** Split each input into groups the rule treats the
   same way, invalid ones included, and pick one value from each.
3. **Boundaries.** For every number, list the value just below, on and just
   above the edge (for the child range: 5, 6, 17, 18). If the requirement does
   not say whether an edge is included, that is a question for the PO.
4. **Invalid input.** List the bad inputs the requirements define: empty, a
   decimal, a negative, text, spaces, leading zeros, a number above the
   maximum.
5. **Combinations.** Only those a requirement joins, such as an age category
   with the group discount.
6. **Expected values.** Give the expected result for each value with its REQ
   id, worked out by hand from the requirements and never copied from the app.

**Output:** a table of REQ id, input, class or boundary and expected result,
then a list of questions where a requirement leaves an edge or a result
undefined.

**Limits:** it runs nothing and does not look at the app.
