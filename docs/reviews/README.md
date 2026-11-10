# Review outputs

The raw output of the review skills, saved exactly as the AI produced it, so
the review can be checked later. The decisions taken because of it are in
[`../review-log.md`](../review-log.md); the plan changes are in the commit
history of `specs/`.

## What goes here

| File | Skill | Run on | Milestone |
| --- | --- | --- | --- |
| `m2-plan-review.md` | `review-test-plan` | `specs/` | 2 |
| `m2-derive-test-data.md` | `derive-test-data` | `requirements/` | 2 |
| `summary.md` | both (written by hand) | the two files above | 2 |

`summary.md` is a reading aid, not raw output, so it may be edited.

Later runs get the same naming: the milestone, then what was reviewed
(for example `m3-generated-test-review.md`).

## Rules

- **Unedited.** Save the output as it was printed. Do not fix it, shorten it or
  remove findings that turned out wrong. A false alarm is part of the evidence.
- **Header on every file.** Date, skill, what it was run on, and the commit of
  the input (`git rev-parse --short HEAD` at the time of the run), so it is
  clear which version of the plan was reviewed.
- **Saved before the plan is edited.** The review is of the AI's plan, not of
  the corrected one.
- **A snapshot, not a living document.** Once the plan changes, the output no
  longer describes it. The log and the history say what changed.

## Header to copy

```
<!-- Date: YYYY-MM-DD -->
<!-- Skill: review-test-plan | derive-test-data -->
<!-- Run on: specs/ at commit <short hash> -->
<!-- Saved unedited from the Claude Code terminal -->
```
