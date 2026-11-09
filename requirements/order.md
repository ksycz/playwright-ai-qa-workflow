# Order

**As a** visitor buying tickets for a group,
**I want to** build an order by entering each visitor's age,
**so that** I can see what the visit will cost before I pay.

## Acceptance criteria

- **REQ-1.1** A visitor can be added by entering their age. The visitor
  appears in the order with their price category: Free, Child, Adult or
  Senior.
- **REQ-1.2** An age is a whole number from 0 to 120. Anything else (an empty
  field, a decimal, a negative number, text, or a number above 120) shows a
  message, and no visitor is added.
- **REQ-1.3** An order has at most 10 tickets. Trying to add an 11th visitor
  shows a message, and the order stays at 10.
- **REQ-1.4** A visitor can be removed from the order. All prices and the
  total update at once.
