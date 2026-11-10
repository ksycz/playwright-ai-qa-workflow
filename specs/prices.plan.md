# Prices test plan (requirements/prices.md)

## Application Overview

Scope: REQ-2.1 to REQ-2.5 of the ticket price calculator (http://localhost:5173): ticket price by age category and the 10% group discount from 8 tickets. Source of truth is requirements/prices.md. All scenarios are risk 1 (a wrong price or total, docs/test-strategy.md section 1). Boundaries come first: the 7/8 ticket edge, then the age edges 5/6 and 64/65. Level follows section 2: every pricing rule and every age boundary is proven in Vitest; the browser checks each price once, to show the screen displays it. Every scenario starts from a fresh page at `/` and is independent. Locators: age-input, add-visitor-button, visitor-row, category-label, ticket-price, order-total (or roles). No fixed waits. Rows are found by filtering visitor-row on its category-label. Expected values are worked out from the requirements: adult 18.90; child 18.90 x 0.5 = 9.45; senior 18.90 x 0.7 = 13.23; with 8 or more tickets each is multiplied by 0.9 and rounded half up (REQ-3.1): adult 17.01, child 8.505 -> 8.51, senior 11.907 -> 11.91.

Covered at Vitest level (not repeated in the browser): every age boundary and category mapping (0, 5/6, 17/18, 64/65, 120, with 121 invalid); the price of each category before and after the group discount; the 7/8 threshold as a numeric rule for every category; the order of discounts (age discount first, then 10%); and half-up rounding of 8.505 and 11.907. The browser checks only the edges 5/6 and 64/65 below, where the planted bugs sit.

Seed file: tests/seed.spec.ts.

## Test Scenarios

### 1. Risk 1 - Wrong price or total: group discount thresholds (boundaries first)

**Seed:** `tests/seed.spec.ts`

#### 1.1. [REQ-2.5] risk 1: 7 tickets get no group discount, the 8th ticket gives 10% off every ticket

**File:** `tests/generated/prices-group-discount.spec.ts`

**Steps:**
  1. Open the page and add seven visitors of age 30.
    - expect: Every ticket-price is €18.90.
    - expect: order-total shows 'Total: €132.30' (7 x 18.90).
  2. Add an 8th visitor of age 30.
    - expect: All eight ticket-price values are €17.01 (18.90 less 10%).
    - expect: order-total shows 'Total: €136.08' (8 x 17.01).

#### 1.2. [REQ-2.5][REQ-2.2] risk 1: a free ticket counts toward the 8 tickets

**File:** `tests/generated/prices-group-discount.spec.ts`

**Steps:**
  1. Open the page. Add one visitor of age 0, then seven visitors of age 30 (eight tickets, one free).
    - expect: The Free row shows €0.00.
    - expect: All seven Adult rows show €17.01.
    - expect: order-total shows 'Total: €119.07' (7 x 17.01).

#### 1.3. [REQ-2.5][REQ-2.3] risk 1: a child in an 8-ticket order pays 10% off the half price

**File:** `tests/generated/prices-group-discount.spec.ts`

**Steps:**
  1. Open the page. Add one visitor of age 12 and seven visitors of age 30.
    - expect: The Child row shows €8.51 (9.45 less 10% = 8.505, rounded half up).
    - expect: The Adult rows show €17.01.
    - expect: order-total shows 'Total: €127.58' (8.51 + 7 x 17.01).

#### 1.4. [REQ-2.5][REQ-2.4] risk 1: a senior in an 8-ticket order pays 10% off the senior price

**File:** `tests/generated/prices-group-discount.spec.ts`

**Steps:**
  1. Open the page. Add one visitor of age 80 and seven visitors of age 30.
    - expect: The Senior row shows €11.91 (13.23 less 10% = 11.907, rounded). A simple 40% off would give €11.34 and is wrong.
    - expect: The Adult rows show €17.01.
    - expect: order-total shows 'Total: €130.98' (11.91 + 7 x 17.01).

### 2. Risk 1 - Wrong price: the age edges 5/6 and 64/65 (fewer than 8 tickets)

**Seed:** `tests/seed.spec.ts`

#### 2.1. [REQ-2.2][REQ-2.3] risk 1: age 5 is Free and age 6 is a Child

**File:** `tests/generated/prices-categories.spec.ts`

**Steps:**
  1. Open the page. Add age 5, then age 6.
    - expect: One Free row with ticket-price €0.00.
    - expect: One Child row with ticket-price €9.45.
    - expect: order-total shows 'Total: €9.45'.

#### 2.2. [REQ-2.1][REQ-2.4] risk 1: age 64 is an Adult and age 65 is a Senior

**File:** `tests/generated/prices-categories.spec.ts`

**Steps:**
  1. Open the page. Add age 64, then age 65.
    - expect: One Adult row with ticket-price €18.90.
    - expect: One Senior row with ticket-price €13.23.
    - expect: order-total shows 'Total: €32.13'.

### 3. Questions for the PO

No scenario is written for these; the requirement is silent or vague. App behaviour is given as information only.

1. REQ-2.5: Should the order show any notice that the group discount applies (text, wording, when it appears)? The requirement is silent. Observed: a note 'Group discount: 10% off every ticket' (group-discount-note) appears at 8 or more tickets and disappears below 8. Not asserted.
2. REQ-2.1 to 2.4: Is the category label required to match the name used in the requirement (Free, Child, Adult, Senior) for every age, including ages 6 and 65 as the first ages of Child and Senior? REQ-1.1 names the four categories, so the labels are asserted; the edges 5/6 and 64/65 are asserted in the browser, the others are left to Vitest. No question beyond this.
3. REQ-2.5: discount by current ticket count. Answered on issue #3: yes, recalculated at once after an add or a remove.
4. Display and accessibility (risk 4): no requirement covers it, so nothing is planned.

**Seed:** `tests/seed.spec.ts`

### 4. Findings

None. In exploration the displayed prices matched the values worked out from the requirements: €18.90, €9.45, €13.23, €0.00 below 8 tickets, and €17.01, €8.51, €11.91, €0.00 at 8 tickets.

**Seed:** `tests/seed.spec.ts`

### 5. Coverage list (REQ id to scenarios)

- REQ-2.1: age 64 is an Adult (edge); 7/8 edge (adults); boundary 17/18 at Vitest.
- REQ-2.2: age 5 is Free (edge); free ticket counts toward 8; boundary 0 at Vitest.
- REQ-2.3: age 6 is a Child (edge); child in an 8-ticket order; boundary 17/18 at Vitest.
- REQ-2.4: age 65 is a Senior (edge); senior in an 8-ticket order; boundary 120 at Vitest.
- REQ-2.5: 7/8 edge, free counts, child at 8, senior at 8; removal back to 7 in the order plan.
- Gaps: none with no scenario or note. Question 1 is open.

Scenario count: 6.

**Seed:** `tests/seed.spec.ts`
