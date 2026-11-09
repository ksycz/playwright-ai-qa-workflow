# QE skills

Each skill is a short checklist in `.claude/skills/<name>/SKILL.md` that makes
one human-judgment step of the workflow repeatable. Claude Code loads a skill
when its description matches the task, or when you ask for it by name.

| Skill | Stage | Purpose | When to run |
| --- | --- | --- | --- |
| [`refine-requirements`](../.claude/skills/refine-requirements/SKILL.md) | 1. Requirements | Checks that every acceptance criterion has an id, can be tested and states its boundaries; lists gaps as questions | After writing or changing anything in `requirements/`, before the planner runs |
