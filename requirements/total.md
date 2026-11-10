# Total

**As a** visitor,
**I want to** see the price of every ticket and the total,
**so that** I know exactly what I will pay.

## Acceptance criteria

- **REQ-3.1** Each ticket shows its price in euros, rounded half up to whole cents. The euro sign comes first with no space, then the amount with a dot and exactly two decimals: €18.90, €8.51, €0.00. The total is the sum of the rounded ticket prices. Example: two children in an 8-ticket order each show €8.51, so those two tickets add up to €17.02.
- **REQ-3.2** An empty order shows the message "Add visitors to see a price". No total element and no price lines are present on the page.
- **REQ-3.3** Each visitor is its own line item. Two visitors of the same age are two lines.
- **REQ-3.4** A free ticket shows €0.00 as its price, and "Free" appears only as its category label. An order that contains only free tickets is not empty. It shows "Total: €0.00".
