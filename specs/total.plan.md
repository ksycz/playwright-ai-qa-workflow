# Total test plan (requirements/total.md)

## Application Overview

Scope: REQ-3.1 to REQ-3.4 of the ticket price calculator (http://localhost:5173): price format, rounding and total, the empty order, line items and free tickets. Source of truth is requirements/total.md. Ordered by docs/test-strategy.md section 1: risk 1 (wrong price or total: REQ-3.1) first, then risk 3 (screen out of step with the order: REQ-3.2, 3.3, 3.4). Boundaries first inside each risk (the rounding edge, then the empty order). Every scenario starts from a fresh page at `/` and is independent. Locators: age-input, add-visitor-button, visitor-row, category-label, ticket-price, order-total, empty-order, remove-visitor-button (or roles). No fixed waits. Expected values are worked out from the requirements (adult 18.90, child 9.45, senior 13.23; with 8 or more tickets x 0.9, rounded half up per ticket: 17.01, 8.51, 11.91), never copied from the screen.

Covered at Vitest level (not repeated in the browser): half-up rounding of single prices as a function (for example 8.505 -> 8.51, 11.907 -> 11.91, and exact values such as 9.45 and 13.23 unchanged), the money format function (euro sign first, no space, dot, exactly two decimals), and the total as a sum of already-rounded prices. The browser shows the format once per price and the rounding and sum once, below.

Seed file: tests/seed.spec.ts.

## Test Scenarios

### 1. Risk 1 - Wrong price or total: rounding, format and sum (REQ-3.1)

**Seed:** `tests/seed.spec.ts`

#### 1.1. [REQ-3.1][REQ-2.5] risk 1: two children in an 8-ticket order each show €8.51 and add up to €17.02

**File:** `tests/generated/total-rounding.spec.ts`

**Steps:**
  1. Open the page. Add two visitors of age 12, then six visitors of age 30 (eight tickets).
    - expect: Both Child rows show ticket-price €8.51 (9.45 x 0.9 = 8.505, rounded half up).
    - expect: The six Adult rows show €17.01.
    - expect: order-total shows 'Total: €119.08' (2 x 8.51 = 17.02, plus 6 x 17.01 = 102.06).

### 2. Risk 3 - Screen out of step with the order (REQ-3.2, REQ-3.3, REQ-3.4)

**Seed:** `tests/seed.spec.ts`

#### 2.1. [REQ-3.2] risk 3: an empty order shows the message and no total

**File:** `tests/generated/total-empty.spec.ts`

**Steps:**
  1. Open the page and add nothing.
    - expect: empty-order shows 'Add visitors to see a price'.
    - expect: order-total is not in the page (count 0).
    - expect: No visitor-row is shown.

#### 2.2. [REQ-3.4] risk 3: an order of only free tickets is not empty and totals €0.00

**File:** `tests/generated/total-free.spec.ts`

**Steps:**
  1. Open the page. Add age 0, then age 5 (both Free).
    - expect: Two visitor-row items, each with ticket-price €0.00 and category-label Free.
    - expect: order-total shows 'Total: €0.00'.
    - expect: empty-order is not shown.

#### 2.3. [REQ-3.4] risk 3: a free ticket shows €0.00 as its price and 'Free' only as its category label

**File:** `tests/generated/total-free.spec.ts`

**Steps:**
  1. Open the page, enter 3, click add-visitor-button.
    - expect: category-label of the row has the text 'Free'.
    - expect: ticket-price of the row has the text '€0.00' and does not contain the word 'Free'.
    - expect: The word 'Free' appears exactly once on the row, in the category-label.

#### 2.4. [REQ-3.3] risk 3: two visitors of the same age are two line items

**File:** `tests/generated/total-lines.spec.ts`

**Steps:**
  1. Open the page. Add age 30 twice.
    - expect: Exactly two visitor-row items, each with category-label Adult and ticket-price €18.90.
    - expect: order-total shows 'Total: €37.80'.

### 3. Questions for the PO

No scenario is written for these; the requirement is silent or vague. App behaviour is given as information only.

1. REQ-3.1: Must the total line carry the 'Total: ' prefix? REQ-3.4 shows 'Total: €0.00'; REQ-3.1 only specifies the amount format. The plan asserts the REQ-3.4 form for every total. Please confirm it applies to all totals.
2. REQ-3.2: absent or hidden. Answered on issue #4: absent, not in the page.
3. REQ-3.3: In what order must the line items appear? Observed: order added, with new visitors at the end. Not asserted.
4. REQ-3.4: 'Free' only as category label. Answered on issue #4: confirmed, the remove button name has no category.
5. REQ-2.5 and REQ-3.1: Should the group discount note be shown (see question 1 in the prices plan)? It is not asserted here.
6. Display and accessibility (risk 4): no requirement supports a check; none planned.

**Seed:** `tests/seed.spec.ts`

### 4. Findings

None. In exploration the displayed rounding (€8.51, €11.91), the sum of rounded prices (€83.37 for the mixed 8-ticket order), the empty-order message with no total, the free-only total of €0.00 and the separate lines for equal ages all matched the values worked out from the requirements.

**Seed:** `tests/seed.spec.ts`

### 5. Coverage list (REQ id to scenarios)

- REQ-3.1: two children at 8 tickets (€8.51, €17.02 pair); rounding function and format function at Vitest. Question 1 open.
- REQ-3.2: empty order shows message and no total element (also checked after the last removal in the order plan).
- REQ-3.3: two visitors of the same age are two lines. Question 3 open.
- REQ-3.4: free-only order is not empty with €0.00 total; free ticket shows €0.00 and Free only as label.
- Gaps: none.

Scenario count: 5.

**Seed:** `tests/seed.spec.ts`
