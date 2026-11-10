# Prices test plan (requirements/prices.md)

## Application Overview

Scope: REQ-2.1 to REQ-2.5 of the ticket price calculator (http://localhost:5173): ticket price by age category and the 10% group discount from 8 tickets. Source of truth is requirements/prices.md. All scenarios are risk 1 (a wrong price or total, docs/test-strategy.md section 1). Boundaries come first: the 7/8 ticket edge, then one representative per age category. Level follows section 2: every pricing rule and every age boundary is proven in Vitest; the browser checks each price once, to show the screen displays it. Every scenario starts from a fresh page at `/` and is independent. Locators: age-input, add-visitor-button, visitor-row, category-label, ticket-price, order-total (or roles). No fixed waits. Rows are found by filtering visitor-row on its category-label. Expected values are worked out from the requirements: adult 18.90; child 18.90 x 0.5 = 9.45; senior 18.90 x 0.7 = 13.23; with 8 or more tickets each is multiplied by 0.9 and rounded half up (REQ-3.1): adult 17.01, child 8.505 -> 8.51, senior 11.907 -> 11.91.

Covered at Vitest level (not repeated in the browser): every age boundary and category mapping (0, 5/6, 17/18, 64/65, 120, with 121 invalid); the price of each category before and after the group discount; the 7/8 threshold as a numeric rule for every category; the order of discounts (age discount first, then 10%); and half-up rounding of 8.505 and 11.907. The browser checks only the representatives below.

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

### 2. Risk 1 - Wrong price or total: one representative per age category (fewer than 8 tickets)

**Seed:** `tests/seed.spec.ts`

#### 2.1. [REQ-2.2] risk 1: a child under 6 goes free

**File:** `tests/generated/prices-categories.spec.ts`

**Steps:**
  1. Open the page, enter 3, click add-visitor-button.
    - expect: One visitor-row with category-label Free and ticket-price €0.00.

#### 2.2. [REQ-2.3] risk 1: a visitor aged 6 to 17 pays half the adult price

**File:** `tests/generated/prices-categories.spec.ts`

**Steps:**
  1. Open the page, enter 12, click add-visitor-button.
    - expect: One visitor-row with category-label Child and ticket-price €9.45 (18.90 / 2).
    - expect: order-total shows 'Total: €9.45'.

#### 2.3. [REQ-2.1] risk 1: an adult pays the full price

**File:** `tests/generated/prices-categories.spec.ts`

**Steps:**
  1. Open the page, enter 40, click add-visitor-button.
    - expect: One visitor-row with category-label Adult and ticket-price €18.90.
    - expect: order-total shows 'Total: €18.90'.

#### 2.4. [REQ-2.4] risk 1: a senior gets 30% off the adult price

**File:** `tests/generated/prices-categories.spec.ts`

**Steps:**
  1. Open the page, enter 80, click add-visitor-button.
    - expect: One visitor-row with category-label Senior and ticket-price €13.23 (18.90 x 0.7).
    - expect: order-total shows 'Total: €13.23'.

### 3. Questions for the PO

No scenario is written for these; the requirement is silent or vague. App behaviour is given as information only.

1. REQ-2.5: Should the order show any notice that the group discount applies (text, wording, when it appears)? The requirement is silent. Observed: a note 'Group discount: 10% off every ticket' (group-discount-note) appears at 8 or more tickets and disappears below 8. Not asserted.
2. REQ-2.1 to 2.4: Is the category label required to match the name used in the requirement (Free, Child, Adult, Senior) for every age, including ages 6 and 65 as the first ages of Child and Senior? REQ-1.1 names the four categories, so the labels are asserted; the boundaries themselves are left to Vitest. No question beyond this.
3. REQ-2.5: Is the discount decided by the number of tickets in the order at the moment of display (so it changes when a visitor is removed)? REQ-1.4 implies it, so it is planned in the order plan, but REQ-2.5 does not say it.
4. Display and accessibility (risk 4): no requirement covers it, so nothing is planned.

**Seed:** `tests/seed.spec.ts`

### 4. Findings

None. In exploration the displayed prices matched the values worked out from the requirements: €18.90, €9.45, €13.23, €0.00 below 8 tickets, and €17.01, €8.51, €11.91, €0.00 at 8 tickets.

**Seed:** `tests/seed.spec.ts`

### 5. Coverage list (REQ id to scenarios)

- REQ-2.1: adult pays the full price; 7/8 edge (adults); age boundaries 17/18 and 64/65 at Vitest.
- REQ-2.2: child under 6 goes free; free ticket counts toward 8; boundaries 0 and 5/6 at Vitest.
- REQ-2.3: aged 6 to 17 pays half; child in an 8-ticket order; boundaries 5/6 and 17/18 at Vitest.
- REQ-2.4: senior gets 30% off; senior in an 8-ticket order; boundaries 64/65 and 120 at Vitest.
- REQ-2.5: 7/8 edge, free counts, child at 8, senior at 8; removal back to 7 in the order plan.
- Gaps: none with no scenario or note. Question 1 and 3 are open.

Scenario count: 8.

**Seed:** `tests/seed.spec.ts`
