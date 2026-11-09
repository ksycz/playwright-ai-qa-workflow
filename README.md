# playwright-ai-qa-workflow

How AI-assisted QA works in practice, from written requirements to
AI-planned and AI-generated Playwright tests, planted bugs, healing and a
requirements-to-tests traceability report, with a human reviewing every step.

> **Status:** work in progress. Milestone 1 (app, requirements, Claude Code
> setup) is in review. The AI-driven parts arrive in Milestones 2 to 4. See
> [Roadmap](#roadmap).

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
   [#2 order](../../issues/2), [#3 prices](../../issues/3),
   [#4 total](../../issues/4). The same criteria live in
   [`requirements/`](requirements/), the file the tools read.
2. **Refinement.** Before anything is tested, I review the tickets for gaps,
   vague wording and missing cases, then run the `refine-requirements` skill
   and compare the AI's questions with mine. Questions go to the PO as issue
   comments; the answers are copied into `requirements/`.
3. **Test strategy.** One page, written by hand: ranked risks, which test
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

Every correction I make to AI output is logged in `docs/review-log.md`
(from Milestone 2). That log is the evidence that a human stays in control.

## The app

Add visitors by age and see each ticket's price and the order total.

| Rule | Value |
| --- | --- |
| Full price | €18.90 |
| Under 6 | free |
| 6 to 17 | half price |
| Seniors | 30% off |
| 8 or more tickets | a further 10% off every ticket |
| Order size | at most 10 tickets |

## Run it

Requires Node 22.12 or later.

```bash
npm ci
npm test        # pricing unit tests (Vitest)
npm run dev     # app at http://localhost:5173
```

Playwright tests (`npm run e2e`) arrive in Milestone 2.

## Repo layout

| Path | What it holds |
| --- | --- |
| `requirements/` | Human-written requirements; AI agents are not allowed to edit them |
| `app/` | The ticket price calculator (React, TypeScript, Vite) |
| `CLAUDE.md` | Rules for Claude Code in this repo |
| `.claude/` | Agent settings and QE skills |
| `docs/skills.md` | Index of the QE skills: what each does and when to run it |

## Roadmap

| Milestone | Content | Status |
| --- | --- | --- |
| 1 | App, requirements, Claude Code setup | In review |
| 2 | Refinement on the tickets, test strategy, seed test, AI-written test plan and its review | Planned |
| 3 | AI-generated tests and their review | Planned |
| 4 | Planted bugs, bug reports and the healer | Planned |
| 5 | Traceability report and CI | Planned |
| 6 | Final README with findings | Planned |

## License

[MIT](LICENSE)
