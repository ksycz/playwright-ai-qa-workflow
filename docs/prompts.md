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

## Generator (Milestone 3)

Start the app first (`npm run dev`). Generate one plan file at a time, in the
run order from `specs/README.md` (prices, then total, then order), and review
and commit each batch before starting the next. In Claude Code, in the repo
root:

```
Use the playwright-test-generator agent on specs/prices.plan.md. Generate one
test for each scenario, one test per file, written to tests/generated/. Name
each file after the plan's File line plus the scenario number, for example
prices-categories-2-1.spec.ts. Copy the scenario title as the test title, so it
starts with its REQ id. Follow docs/conventions.md and copy the style of
tests/seed.spec.ts. Assert the expected values written in the plan, never what
the screen happens to show. If the app disagrees with the plan, do not adjust
the test: stop and tell me which scenario and which value. If a step is
unclear, ask instead of guessing.
```

For `specs/total.plan.md` and `specs/order.plan.md`, change only the plan file.

Why each part is there:

- **One plan file at a time:** the batch stays small enough to review like a
  pull request, and a mistake in the first batch is fixed before it is copied
  into the next.
- **One test per file, named from the plan:** the generator agent writes one
  test per file. The plan's File lines group several scenarios under one name,
  so the scenario number is added to keep the files apart. Traceability uses the
  REQ id in the title, not the file name.
- **Scenario title as test title:** it starts with the REQ id, which the
  traceability report reads.
- **Conventions and seed test:** locators, no fixed waits, one behavior per test.
- **Plan values, not screen values:** the expected prices and messages come from
  the requirements through the plan. A test that copies the screen locks bugs in.
- **Stop on disagreement:** if the app and the plan differ, the app might have a
  bug. The generator must not fix the test to match it.

Two scenarios need extra care. In `order.plan.md`, 2.2 reads the total once
right after the click and checks a marker on `window` (the plan overview names
this exception). In `total.plan.md` 2.1 and `order.plan.md` 2.4, the total must
not be in the page, so the test checks a count of 0.

## Generated test review (Milestone 3)

After each batch, before committing it, in Claude Code, in the repo root:

```
Use the review-generated-test skill on tests/generated/prices-*.spec.ts.
```

Save the output unedited, as for the plan review (header and naming in
[`reviews/README.md`](reviews/README.md)):

```
Write that output, unedited, to docs/reviews/m3-prices-test-review.md.
```

Then run the batch with `npx playwright test tests/generated/prices-*` and
repeat it a few times to look for flaky tests (`--repeat-each=5`, retries stay
at 0). Each correction you make goes in `docs/review-log.md`. A test that fails
because the app is wrong is not corrected: report it.
