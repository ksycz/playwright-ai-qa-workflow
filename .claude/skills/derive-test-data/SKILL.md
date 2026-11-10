---
name: derive-test-data
description: Use when choosing test values for a rule or requirement: lists the equivalence classes and the values on and either side of each boundary.
---

# Derive test data

Work from the requirement text, never from the app. You only report; a human
decides which values become tests.

## Checklist, per rule

1. **Inputs.** Name each input the rule depends on (for example the age, or the
   number of tickets in the order).
2. **Equivalence classes.** Split each input into classes the rule treats the
   same way, including the invalid ones. Pick one representative value from
   each class.
3. **Boundaries.** For every numeric edge, list the value just below, on, and
   just above it. State whether the edge itself is included, quoting the
   requirement. If the requirement does not say, that is a question, not a
   guess.
4. **Invalid input.** List empty, a decimal, a negative number, text, spaces,
   leading zeros and a value above the maximum, as far as the requirement
   defines them.
5. **Combinations.** Only combine inputs where the requirement combines them,
   for example an age category with the group discount. Do not list every
   pairing.
6. **Expected values.** For each value, give the expected result as the
   requirement defines it, with the REQ id. Work out any price by hand from the
   requirement, not from the app.

## Output

A table: REQ id, input, class or boundary, expected result. Then a list of
questions where the requirement does not define an edge or an expected value.
