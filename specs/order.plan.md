# Order test plan (requirements/order.md)

## Application Overview

Scope: REQ-1.1 to REQ-1.5 of the ticket price calculator (http://localhost:5173), the order-building behaviour: adding visitors by age, age validation, the 10-ticket limit, refusal messages and removal. Source of truth is requirements/order.md. Priorities follow docs/test-strategy.md section 1 (risk 2 = input wrongly accepted or refused: REQ-1.2, 1.3, 1.5; risk 3 = screen out of step with the order: REQ-1.1, 1.4). Within each risk, boundaries come first. Level follows section 2: Playwright covers what a visitor does and sees. Every scenario starts from a fresh page at `/` (empty order) and is independent. Locators: test ids age-input, add-visitor-button, age-error, visitor-row, category-label, ticket-price, remove-visitor-button, order-total, empty-order, or roles. No fixed waits; use web-first assertions. Expected values come from the requirements. Out of scope (section 5): performance, browsers other than Chromium, visual design. Display and accessibility (risk 4): no requirement supports a check, so none is planned (see questions).

Covered at Vitest level (not repeated in the browser): the full age-parsing rule table of REQ-1.2 is a pure-function concern. Vitest should hold every accepted and rejected string (digits only, surrounding spaces, "007", "5.0", "+5", "-5", "1e1", text, 121, 120, 0, empty and whitespace-only) and the mapping from age to category at the REQ-2.x boundaries (0, 5/6, 17/18, 64/65, 120). In the browser we check one example per input class and the two age edges (0/120 accepted, 121 rejected), so the screen is shown to apply the rule and show each message.

Seed file: tests/seed.spec.ts.

## Test Scenarios

### 1. Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)

**Seed:** `tests/seed.spec.ts`

#### 1.1. [REQ-1.3] risk 2: the 10th ticket is accepted and the 11th is refused

**File:** `tests/generated/order-limit.spec.ts`

**Steps:**
  1. Open the page. Add ten visitors, each with age 30 (fill age-input, click add-visitor-button, ten times).
    - expect: Ten visitor-row items are shown.
    - expect: No age-error is shown.
    - expect: order-total shows 'Total: €170.10' (10 adults at the group price of €17.01, REQ-2.5).
  2. Enter age 30 and click add-visitor-button an 11th time.
    - expect: age-error shows exactly 'An order can have at most 10 tickets'.
    - expect: Still exactly ten visitor-row items and the total is unchanged.
    - expect: age-input and the 'Add visitor' button are both enabled.

#### 1.2. [REQ-1.3] risk 2: free tickets count toward the 10-ticket limit

**File:** `tests/generated/order-limit.spec.ts`

**Steps:**
  1. Open the page. Add ten visitors of age 0.
    - expect: Ten visitor-row items, each with category label Free.
    - expect: order-total shows 'Total: €0.00'.
  2. Enter age 30 and click add-visitor-button.
    - expect: age-error shows 'An order can have at most 10 tickets'.
    - expect: Order still has ten rows.
    - expect: order-total still shows 'Total: €0.00'.

#### 1.3. [REQ-1.3][REQ-1.2] risk 2: at 10 tickets a non-numeric age shows the invalid-age message, not the limit message

**File:** `tests/generated/order-limit.spec.ts`

**Steps:**
  1. Open the page and add ten visitors of age 30. Enter 'abc' and click add-visitor-button.
    - expect: age-error shows exactly 'Age must be a whole number from 0 to 120'.
    - expect: The limit message is not shown. Order still has ten rows.
    - expect: order-total still shows 'Total: €170.10'.

#### 1.4. [REQ-1.3][REQ-1.2] risk 2: at 10 tickets an empty age shows 'Enter an age', not the limit message

**File:** `tests/generated/order-limit.spec.ts`

**Steps:**
  1. Open the page and add ten visitors of age 30. Fill age-input with an empty string and click add-visitor-button.
    - expect: age-error shows exactly 'Enter an age'.
    - expect: The limit message is not shown. Order still has ten rows.
    - expect: order-total still shows 'Total: €170.10'.

#### 1.5. [REQ-1.2] risk 2: age 121 (just above the upper boundary) is rejected

**File:** `tests/generated/order-age.spec.ts`

**Steps:**
  1. Open the page, enter 121, click add-visitor-button.
    - expect: age-error shows 'Age must be a whole number from 0 to 120'.
    - expect: No visitor-row is added; empty-order is still shown.

#### 1.6. [REQ-1.2] risk 2: one non-whole number is rejected (parameterised: one test per value '5.0')

**File:** `tests/generated/order-age.spec.ts`

**Steps:**
  1. For each value in the list, in its own test from a fresh page: enter the value and click add-visitor-button.
    - expect: age-error shows exactly 'Age must be a whole number from 0 to 120'.
    - expect: No visitor-row is added; empty-order is still shown.

#### 1.7. [REQ-1.2] risk 2: an empty age shows 'Enter an age'

**File:** `tests/generated/order-age.spec.ts`

**Steps:**
  1. Open the page. With age-input empty, click add-visitor-button.
    - expect: age-error shows exactly 'Enter an age'.
    - expect: No visitor-row is added; empty-order is still shown.

#### 1.8. [REQ-1.5][REQ-1.2] risk 2: a refusal message disappears after the next successful add

**File:** `tests/generated/order-messages.spec.ts`

**Steps:**
  1. Open the page, enter 'abc', click add-visitor-button.
    - expect: age-error is shown with the invalid-age message.
  2. Enter 30 and click add-visitor-button.
    - expect: age-error is no longer shown.
    - expect: One visitor-row (Adult) is in the order.

#### 1.9. [REQ-1.5][REQ-1.3] risk 2: the limit message disappears after a visitor is removed

**File:** `tests/generated/order-messages.spec.ts`

**Steps:**
  1. Open the page, add ten visitors of age 30, then try an 11th so the limit message shows.
    - expect: age-error shows 'An order can have at most 10 tickets'.
  2. Click remove-visitor-button on the first visitor-row.
    - expect: age-error is no longer shown.
    - expect: Nine visitor-row items remain.

#### 1.10. [REQ-1.5][REQ-1.2] risk 2: a refusal message stays while the user is typing

**File:** `tests/generated/order-messages.spec.ts`

**Steps:**
  1. Open the page, enter 'abc', click add-visitor-button.
    - expect: age-error is shown with the invalid-age message.
  2. Clear age-input and type '3' without clicking add-visitor-button.
    - expect: age-error is still shown with the same message while the field text changes.

#### 1.11. [REQ-1.3][REQ-1.4] risk 2: after removing one of 10 tickets a new visitor can be added again

**File:** `tests/generated/order-limit.spec.ts`

**Steps:**
  1. Open the page, add ten visitors of age 30, click remove-visitor-button on one row.
    - expect: Nine rows remain.
  2. Enter 30 and click add-visitor-button.
    - expect: Ten rows are shown and no age-error is shown.

#### 1.12. [REQ-1.2] risk 2: a refused age leaves the existing lines and total unchanged

**Steps:**
  1. Open the page. Add age 30, then age 12.
    - expect: order-total shows 'Total: €28.35'.
  2. Enter 'abc' and click add-visitor-button.
    - expect: age-error shows 'Age must be a whole number from 0 to 120'.
    - expect: Two rows remain, Adult and Child, and order-total still shows 'Total: €28.35'.

#### 1.13. [REQ-1.5][REQ-1.2] risk 2: a refusal message disappears after a visitor is removed

**Steps:**
  1. Open the page. Add age 30, then enter 'abc' and click add-visitor-button.
    - expect: age-error is shown.
  2. Click remove-visitor-button on the row.
    - expect: age-error is no longer shown and empty-order is shown.

#### 1.14. [REQ-1.5][REQ-1.3] risk 2: the limit message stays while the user is typing

**Steps:**
  1. Open the page, add ten visitors of age 30, then try an 11th so the limit message shows.
  2. Type '3' in age-input without clicking the button.
    - expect: age-error still shows 'An order can have at most 10 tickets'.

### 2. Risk 3 - Screen out of step with the order (REQ-1.1 add, REQ-1.4 remove)

**Seed:** `tests/seed.spec.ts`

#### 2.1. [REQ-1.1] risk 3: a visitor appears in the order with its price category

**File:** `tests/generated/order-lines.spec.ts`

**Steps:**
  1. Open the page. Add age 40, then add age 3.
    - expect: Two visitor-row items appear, one with category-label Adult and one with category-label Free, in any position (line order is an open question; price values are checked in the prices and total plans).

#### 2.2. [REQ-1.4] risk 3: removing a middle visitor leaves the right visitors with correct prices and total at once

**File:** `tests/generated/order-remove.spec.ts`

**Steps:**
  1. Open the page. Add ages 30, 12, 3 (Adult, Child, Free).
    - expect: Total is 'Total: €28.35' (18.90 + 9.45 + 0.00).
  2. Click remove-visitor-button on the Child row (found by category-label, not by position).
    - expect: Two rows remain: Adult at €18.90 and Free at €0.00.
    - expect: order-total shows 'Total: €18.90' with no reload and no further action.

#### 2.3. [REQ-1.4][REQ-2.5] risk 3: removing the 8th ticket takes the group discount away at once

**File:** `tests/generated/order-remove.spec.ts`

**Steps:**
  1. Open the page and add eight visitors of age 30.
    - expect: Every ticket-price is €17.01 and order-total is 'Total: €136.08'.
  2. Click remove-visitor-button on any row.
    - expect: Seven rows remain, every ticket-price is €18.90, and order-total is 'Total: €132.30'.

#### 2.4. [REQ-1.4][REQ-3.2] risk 3: removing the last visitor returns to the empty order

**File:** `tests/generated/order-remove.spec.ts`

**Steps:**
  1. Open the page, add age 30, click remove-visitor-button.
    - expect: No visitor-row is shown.
    - expect: empty-order shows 'Add visitors to see a price'.
    - expect: order-total is not shown.

### 3. Questions for the PO

No scenario is written for these; the requirement is silent or vague. App behaviour is given as information only.

1. REQ-1.2: Is a field containing only spaces 'empty' (message 'Enter an age') or 'any other invalid age'? Observed: the app shows 'Enter an age'.
2. REQ-1.2: Are other whitespace characters (tab, non-breaking space) and non-ASCII digits (full-width, Arabic-Indic) 'spaces' and 'digits'? Not observed. Is there a limit on how many leading zeros are accepted (for example '00000000007')?
3. REQ-1.2: After a successful add, or after a rejection, should the age field be cleared or keep its text, and where should focus go? Observed: the field is empty after a successful add.
4. REQ-1.1: Can a visitor be added by pressing Enter in the age field, or only with the button? Not specified.
5. REQ-1.1: Should the order line show the entered age, and in what form for '007' (7 or 007)? Observed: 'Age 7'. Where does a new visitor appear? Observed: at the end of the list.
6. REQ-1.3: When the 11th visitor is refused, is the typed age kept or cleared? Not specified.
7. REQ-1.5: Does a refusal message also go away when the user corrects or clears the field, or when a different refusal replaces it? The requirement only says it stays while typing and goes after a successful add or a remove. Observed: it stays while typing.
8. REQ-1.4: Is anything required of the remove control (accessible name, keyboard use)? Observed: a button named 'Remove visitor N, aged X'. Not required, so not asserted.
9. Display and accessibility (strategy risk 4): must the refusal message be announced to assistive technology or associated with the field? No requirement says so, so no check is planned. Observed: age-error has role alert.

**Seed:** `tests/seed.spec.ts`

### 4. Findings

None. In exploration the app agreed with every requirement exercised here: messages and wording for REQ-1.2 and REQ-1.3, limit at 10 with free tickets counted, controls enabled at 10, message cleared after add and remove, message kept while typing, and prices and total correct right after removal.

**Seed:** `tests/seed.spec.ts`

### 5. Coverage list (REQ id to scenarios)

- REQ-1.1: 'a visitor appears in the order with its price category'.
- REQ-1.2: 120, 121, 0, '007', spaces, invalid values (5.0, +5, -5, 1e1, abc), empty; the two scenarios at 10 tickets; refusal-message scenarios. The full rule table is at Vitest level. Questions 1 to 3 open.
- REQ-1.3: 10th accepted and 11th refused, free tickets count, invalid age at 10, empty age at 10, add again after removal, limit message cleared on remove. Question 6 open.
- REQ-1.4: remove middle visitor, remove 8th ticket, remove last visitor, add again after removal from 10, limit message cleared on remove.
- REQ-1.5: cleared after successful add, cleared after remove, stays while typing. Question 7 open.
- Gaps: none. Display and accessibility has no scenario (question 9).

Scenario count: 19 (the invalid-value scenario is one scenario run as five parameterised tests).

**Seed:** `tests/seed.spec.ts`
