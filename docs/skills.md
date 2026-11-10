# QE skills

Each skill is a short checklist in `.claude/skills/<name>/SKILL.md` that makes
one human-judgment step of the workflow repeatable. Claude Code loads a skill
when its description matches the task, or when you ask for it by name.

| Skill | Stage | Purpose | When to run |
| --- | --- | --- | --- |
| [`refine-requirements`](../.claude/skills/refine-requirements/SKILL.md) | 1. Requirements | Checks that every acceptance criterion has an id, can be tested and states its boundaries; lists gaps as questions | After writing or changing anything in `requirements/`, before the planner runs |
| [`review-test-plan`](../.claude/skills/review-test-plan/SKILL.md) | 2. Test plan | Maps every requirement id to the plan scenarios that cover it, flags gaps, weak assertions and silent assumptions | After the planner writes `specs/`, before any test is generated |
| [`derive-test-data`](../.claude/skills/derive-test-data/SKILL.md) | 2. Test plan | Lists equivalence classes and the values on and either side of each boundary, with expected results from the requirements | When choosing values for a rule, in the plan or for a generated test |
