# playwright-ai-qa-workflow

How AI-assisted QA works in practice, from written requirements to
AI-planned and AI-generated Playwright tests, planted bugs, healing and a
requirements-to-tests traceability report, with a human reviewing every step.

> **Status:** the core path is done: requirements, test strategy, reviewed
> test plan, 20 generated and reviewed tests, three planted bugs that the tests
> catch, a healer demo, a traceability report with no gaps, and CI. What I learned is in
> [Findings](#findings). Work for later is in the [Roadmap](#roadmap).

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
npm run trace      # traceability report: reports/traceability.md
```

To switch on a planted bug, stop any running `npm run dev` first (Playwright
reuses a running server, which would not have the bug), then:

```bash
PLANTED_BUG=child-free-6 npm run e2e     # or senior-over-65, group-from-9
```

The bugs live in `app/src/planted-bugs.ts`. `pricing.ts` stays correct, so the
unit tests are not affected.

## Repo layout

| Path | What it holds |
| --- | --- |
| `requirements/` | Human-written requirements; AI agents are not allowed to edit them |
| `app/` | The ticket price calculator (React, TypeScript, Vite) and its unit tests |
| `tests/` | Playwright tests: `seed.spec.ts` by hand, `generated/` by the agent |
| `specs/` | Test plans written by the planner agent |
| `scripts/` | The traceability report script and its unit tests |
| `.github/workflows/` | CI: lint, build, unit tests with coverage, end-to-end tests, traceability report |
| `docs/` | Test strategy, conventions, review log, agent prompts, saved review outputs (`docs/reviews/`) and the skills index |
| `CLAUDE.md` | Rules for Claude Code in this repo |
| `.claude/` | The Playwright agents, QE skills and settings |
| `.mcp.json` | The Playwright test server the agents use |
| `playwright.config.ts`, `biome.json` | Test runner and format and lint settings |

## Findings

What the review log ([`docs/review-log.md`](docs/review-log.md)) shows after
19 entries: 11 corrections to the AI-written plan and 8 to the generated tests
and the AI review.

- **The plan needed most of the work.** The planner covered every REQ id but
  guessed rules the requirements did not state (3 times), wrote assertions too
  weak to prove the requirement (3 times) and missed the boundary values that
  matter, such as ages 5/6 and 64/65 in browser tests. Each guess became a
  question for the PO and an edit to `requirements/`, not a test of the guess.
- **Generated tests were mostly right.** With a reviewed plan and a seed test,
  the generator wrote correct prices and totals every time. Its mistakes were
  small and repeated: loose text locators, copied from the seed until the seed
  was fixed, a check that an element is visible where the requirement defines
  its text, and "disappears" read as "removed from the page".
- **The assistant steered the generator too.** In two batches, Claude Code
  briefed the generator with extra choices of its own. Some were good, one was
  a guessed rule, and one test comment named the wrong source. The extra
  instructions are now listed in `docs/prompts.md`, because the prompt alone
  did not tell the whole story.
- **The AI review was useful but not proof.** The `review-generated-test` skill
  found real problems, but one finding was wrong (it asked to weaken a check
  that was already the stronger form) and it predicted two planted-bug catches
  that did not happen. Only running the tests with `PLANTED_BUG` set showed
  which tests catch which bug.
- **The healer stayed inside its limits, with help.** After the add button was
  renamed, it stopped because REQ-1.3 named the old label and asked how to
  proceed. Once the PO approved the rename in the requirement, it changed only
  the button name in 19 files and flagged the stale plan wording itself
  ([output](docs/reviews/healer-rename.md)). With `group-from-9` switched on
  and a prompt that just said "fix what fails", it changed nothing and named
  the 6 failures as an app defect against REQ-2.5
  ([output](docs/reviews/healer-planted-bug.md)). One caveat: it also found
  `app/src/planted-bugs.ts`, and CLAUDE.md tells it about planted bugs. A real
  bug comes with no such hint, so every heal still gets a human review.
- **Planted bugs prove the tests.** Every planted bug is caught by at least
  one test. `group-from-9` is caught by the six tests that use exactly 8
  tickets, and reported in [issue #25](https://github.com/ksycz/playwright-ai-qa-workflow/issues/25).
- **Gaps are named, not hidden.** The traceability report (`npm run trace`,
  also in each CI run's summary) maps every requirement to its tests. CI fails
  on a new gap, and accepted gaps must be listed in `KNOWN_GAPS`. REQ-1.5,
  message lifetime, was the last gap and now has 5 browser tests.

## Roadmap

The core path is what shows the whole workflow end to end. Everything marked
"Later" is planned but not needed for that, and the traceability report names
each such gap instead of hiding it.

| Milestone | Content | Status |
| --- | --- | --- |
| 1 | App, requirements, Claude Code setup | Done |
| 2 | Refinement on the tickets, test strategy, seed test, AI-written test plan and its review | Done |
| 3 | AI-generated tests and their review. Prices: done. Core, as one generate-and-review batch: the total plan (total 1.1 and 2.1 to 2.4) and four order scenarios: the 10-ticket limit (order 1.1), which message wins at 10 tickets (order 1.3), age 121 (order 1.5) and removing the 8th ticket (order 2.3). Then message lifetime, REQ-1.5 (order 1.8, 1.9, 1.10, 1.13, 1.14), to close the last gap | Done |
| 4 | Core: switch on the three planted bugs and check that the right tests fail, and write one bug report. Each bug is caught: `child-free-6` by prices-categories-2-1, `senior-over-65` by prices-categories-2-2, `group-from-9` by the 6 tests with exactly 8 tickets ([bug report #25](https://github.com/ksycz/playwright-ai-qa-workflow/issues/25)) | Done |
| 5 | Core: traceability report (`scripts/traceability.ts` maps every REQ id in `requirements/` to the test titles that carry it, or names it as a gap), CI (lint, build, unit tests with coverage, end-to-end tests, the report) and the [Findings](#findings) | Done |
| Healer demo | One heal for an intended rename of the add button (after REQ-1.3 was updated) next to one refused heal under the planted bug `group-from-9`. Outputs in `docs/reviews/healer-*.md` | Done |
| Later | The other order scenarios: free tickets and the limit, empty age at 10 tickets, non-whole and empty ages (order 1.2, 1.4, 1.6, 1.7), adding again after a removal and a refused age that leaves the order unchanged (order 1.11, 1.12), line items and removal (order 2.1, 2.2 and 2.4). Their REQ ids are already covered by other tests | Planned |
| Later | A planted bug for message lifetime (for example, the message clears on typing), so the REQ-1.5 tests are seen to fail at least once | Idea |
| Later | Bug reports for the other two planted bugs | Planned |
| Later | Visual tests: a requirement for how the order screen looks, a few screenshot checks, and a planted layout bug. Baselines are made in CI only, and updating one is logged as a heal. | Idea |
| Later | Mutation testing of `pricing.ts` with Stryker: change the rules on purpose and check that a test fails, the automatic version of the planted bugs. Code coverage of `pricing.ts` is already reported by `npm run coverage`, and CI runs it. | Idea |

## License

[MIT](LICENSE)
