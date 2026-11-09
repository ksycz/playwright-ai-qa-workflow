# Total

**As a** visitor,
**I want to** see the price of every ticket and the total,
**so that** I know exactly what I will pay.

## Acceptance criteria

- **REQ-3.1** Each ticket shows its price in euros, rounded half up to whole
  cents. The total is the sum of the ticket prices. The euro sign comes first, with no space, then the amount with a dot and exactly two decimals: €18.90, €8.51, €0.00. Never "18,90 €" and never "€18.9". The total is the sum of the rounded ticket prices. Visitors see every ticket price on screen, and the total must equal what they see added up. In your example, two children in an 8-ticket order each show €8.51, so those two tickets add up to €17.02, not €17.01.
- **REQ-3.2** An empty order shows a message instead of a total. The text is "Add visitors to see a price". It replaces the total, and no total or price lines are shown while the order is empty. Each visitor is its own line item. Nothing is aggregated, because every visitor has their own age and the order lists visitors one by one. Two 30-year-olds are two lines, each showing €18.90. A free ticket shows €0.00 as its price. The word "Free" appears only as its category label, next to the price. The word never replaces the price. An order that contains only free tickets shows Total: €0.00. That total is not an empty order, so the empty message does not appear. No total is shown at all while the order is empty. A "Total: €0.00" next to the message would be wrong. An order that contains only free tickets is not empty, and it shows "Total: €0.00".
