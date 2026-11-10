# Agent prompts

The prompts used to run each Playwright agent, kept here so a run can be
repeated and compared. Each prompt points the agent at the requirements and the
rules in this repo, because the generated agent files know nothing about them.
If a prompt changes, change it here in the same commit.

## Planner (Milestone 2)

Start the app first (`npm run dev`), then in Claude Code, in the repo root:

```
Use the playwright-test-planner agent. Explore http://localhost:5173,
use tests/seed.spec.ts as the seed, take the features from requirements/
and the priorities and scope from docs/test-strategy.md. Write the plans to
specs/. Start every scenario title with its REQ id in brackets. If a
requirement is silent, list a question instead of a scenario.
```

Why each part is there:

- **Explore the running app:** the planner needs the real screen to write
  concrete steps.
- **Seed test:** shows the style and the locators to copy.
- **Features from `requirements/`:** the plan follows the requirements, not
  whatever the screen shows.
- **Priorities from `docs/test-strategy.md`:** the human's risk order decides
  what is planned first.
- **REQ id in every title:** it makes the plan traceable, and the generator
  copies the title into the test.
- **Questions, not guesses:** a silent requirement goes to the PO as an issue
  comment.

After the run, review the plan with `review-test-plan` and `derive-test-data`,
edit it by hand, and log each correction in `docs/review-log.md`.
