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

## Plan review (Milestone 2)

Run these in Claude Code, in the repo root, after the planner has written
`specs/`. Write your own expectations first (which REQ ids, which boundaries,
where you expect the planner to guess), and commit the plan unedited before you
change it.

```
Use the review-test-plan skill on specs/.
```

```
Use the derive-test-data skill on the age rules and the ticket-count rules in
requirements/.
```

Why each part is there:

- **`review-test-plan` on `specs/`:** checks every REQ id against the
  scenarios, the priorities against `docs/test-strategy.md`, boundaries,
  negative cases, vague expected results, and lists every assumption as a
  question for the PO.
- **`derive-test-data` on `requirements/`, not on the plan:** it works only
  from the requirements, so its values are independent of what the planner
  wrote. The difference between the two is where the findings are.

Save each output unedited before the plan is changed, so the review can be
checked later (the header and file names are in
[`reviews/README.md`](reviews/README.md)):

```
Write that output, unedited, to docs/reviews/m2-plan-review.md.
```

```
Write that output, unedited, to docs/reviews/m2-derive-test-data.md.
```

Each real finding becomes an entry in `docs/review-log.md`.
