# Prices

**As a** visitor,
**I want** each ticket priced by the visitor's age, with a discount for
larger groups,
**so that** children, seniors and groups pay less.

## Acceptance criteria

- **REQ-2.1** Adults (aged 18 to 64) pay the full price of €18.90. The ticket shows the label Adult.
- **REQ-2.2** Visitors under 6 (aged 0 to 5) go free. The ticket shows the label Free.
- **REQ-2.3** Visitors aged 6 to 17 pay half of the adult price of €18.90. The ticket shows the label Child.
- **REQ-2.4** Seniors (aged 65 and over) get 30% off the adult price of €18.90. The ticket shows the label Senior.
- **REQ-2.5** Orders of 8 or more tickets get a further 10% off every ticket. The 10% is taken from the price after the age discount. Free tickets count toward the 8 tickets. While the order has 8 or more tickets, the page shows the text "Group discount: 10% off every ticket". With fewer tickets no notice is shown.
