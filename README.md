# playwright-ai-qa-workflow

How AI-assisted QA works in practice, from written requirements to
AI-planned and AI-generated Playwright tests, planted bugs, healing and a
requirements-to-tests traceability report, with a human reviewing every step.

> **Status:** work in progress. Milestone 1 (app, requirements, Claude Code
> setup) is done. Milestone 2 is under way: the requirements are refined, and
> the test strategy, the Playwright agents and the seed test are in place. The
> AI-written test plan comes next. See [Roadmap](#roadmap).

## What this repo is for

AI agents can now write test plans, generate tests and repair broken ones.
This repo shows how to get **trustworthy** tests out of them: a human writes
the requirements and the test strategy, reviews everything the AI produces,
and records each decision. The app is a deliberately small stand-in, a
one-screen ticket price calculator with sharp pricing rules, because rules
with boundaries are where AI-written tests guess or go wrong.

## How this differs from playwright-test-ai-inspector

[playwright-test-ai-inspector](https://github.com/ksycz/playwright-test-ai-inspector)
analyzes what happens **after** tests run. This repo shows how good tests
come to exist **in the first place**.

| | playwright-test-ai-inspector | playwright-ai-qa-workflow |
| --- | --- | --- |
| Question it answers | What do I learn from a test run? | How do I get trustworthy tests with AI help? |
| Side of the workflow | After the run: failure analysis, flaky detection, trends, PR summaries | Before and around the run: requirements, plans, generated tests, healing |
| Test target | A demo shop with an existing Playwright suite | A one-screen ticket calculator, with requirements written first |
| What the AI produces | Reports and summaries | Plans, tests and repairs |
| The human's role | Reads the reports | Reviews and decides, with every decision logged |

## The workflow

It follows how a QA engineer works with AI in a real team. Claude plays the
product owner (PO); I play QA. The AI drafts, and a human decides at every step.

1. **Ticket arrives.** The PO writes each feature as a user story with
   numbered acceptance criteria (`REQ-1.1`), published as a GitHub issue:
   [#2 order](https://github.com/ksycz/playwright-ai-qa-workflow/issues/2), [#3 prices](https://github.com/ksycz/playwright-ai-qa-workflow/issues/3),
   [#4 total](https://github.com/ksycz/playwright-ai-qa-workflow/issues/4). The same criteria live in
   [`requirements/`](requirements/), the file the tools read.
2. **Refinement.** Before anything is tested, I review the tickets for gaps,
   vague wording and missing cases, then run the `refine-requirements` skill
   and compare the AI's questions with mine. Questions go to the PO as issue
   comments; the answers are copied into `requirements/`.
3. **Test strategy.** One page, written by hand
   ([`docs/test-strategy.md`](docs/test-strategy.md)): ranked risks, which test
   level checks what, what the AI does and what I decide, and what is out of
   scope.
4. **Exploration and plan.** Playwright's planner agent explores the running
   app and drafts a test plan. I review it against the requirements and the
   strategy.
5. **Generation and review.** The generator agent writes the tests; every
   title carries its REQ id. I review each one like a pull request: does it
   check the requirement, or just repeat what the screen shows?
6. **Bugs.** Planted bugs prove the tests catch real defects. Each caught bug
   gets a bug report issue: steps to reproduce, expected and actual result,
   severity, and the failing test. A real bug is reported, never "healed".
7. **Healing.** When the UI changes on purpose (a renamed button), the healer
   agent repairs the tests, and I check it changed only the locator.
8. **Sign-off.** A traceability report in CI maps every requirement to the
   tests that cover it, or names it as a gap.

Every correction I make to AI output is logged in
[`docs/review-log.md`](docs/review-log.md). That log is the evidence that a
human stays in control.

## The app

Add visitors by age and see each ticket's price and the order total.

| Rule | Value |
| --- | --- |
| Full price (adults, 18 to 64) | €18.90 |
| Under 6 | free |
| 6 to 17 | half of the adult price |
| Seniors (65 and over) | 30% off the adult price |
| 8 or more tickets | a further 10% off every ticket, after the age discount; free tickets count |
| Order size | at most 10 tickets |

The full rules, with exact messages and formats, are in
[`requirements/`](requirements/).

## Run it

Requires Node 22.12 or later.

```bash
npm ci
npm run dev        # app at http://localhost:5173
npm test           # pricing unit tests (Vitest)
npm run coverage   # the same tests, with coverage of pricing.ts
npm run lint       # Biome: format and lint (npm run format fixes)

npx playwright install chromium   # once
npm run e2e        # Playwright tests (starts the app itself)
```

## Repo layout

| Path | What it holds |
| --- | --- |
| `requirements/` | Human-written requirements; AI agents are not allowed to edit them |
| `app/` | The ticket price calculator (React, TypeScript, Vite) and its unit tests |
| `tests/` | Playwright tests: `seed.spec.ts` by hand, `generated/` by the agent |
| `specs/` | Test plans written by the planner agent |
| `docs/` | Test strategy, conventions, review log, agent prompts and the skills index |
| `CLAUDE.md` | Rules for Claude Code in this repo |
| `.claude/` | The Playwright agents, QE skills and settings |
| `.mcp.json` | The Playwright test server the agents use |
| `playwright.config.ts`, `biome.json` | Test runner and format and lint settings |

## Roadmap

| Milestone | Content | Status |
| --- | --- | --- |
| 1 | App, requirements, Claude Code setup | Done |
| 2 | Refinement on the tickets, test strategy, seed test, AI-written test plan and its review | In progress |
| 3 | AI-generated tests and their review | Planned |
| 4 | Planted bugs, bug reports and the healer | Planned |
| 5 | Traceability report and CI | Planned |
| 6 | Final README with findings | Planned |
| Later | Visual tests: a requirement for how the order screen looks, a few screenshot checks, and a planted layout bug. Baselines are made in CI only, and updating one is logged as a heal. | Idea |
| Later | Mutation testing of `pricing.ts` with Stryker: change the rules on purpose and check that a test fails, the automatic version of the planted bugs. Code coverage of `pricing.ts` is already reported by `npm run coverage`; CI will run it in Milestone 5. | Idea |

## License

[MIT](LICENSE)
