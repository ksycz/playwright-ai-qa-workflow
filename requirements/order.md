# Order

**As a** visitor buying tickets for a group,
**I want to** build an order by entering each visitor's age,
**so that** I can see what the visit will cost before I pay.

## Acceptance criteria

- **REQ-1.1** A visitor can be added by entering their age. The visitor appears in the order with their price category: Free Child, Adult or Senior.
- **REQ-1.2** An age is a whole number from 0 to 120. Only digits are accepted, spaces around them are ignored, and 007 is accepted. 5.0, +5, -5 and 1e1 are rejected. Exact messages: “Enter an age” for an empty field and “Age must be a whole number from 0 to 120” for anything else invalid.
- **REQ-1.3** An order has at most 10 tickets. Trying to add an 11th visitor shows a message, and the order stays at 10. The message is “An order can have at most 10 tickets”. Free tickets count toward the 10. If the age is invalid, the invalid-age message wins.
Messages go away after the next successful add or after a visitor is removed.
- **REQ-1.4** A visitor can be removed from the order. All prices and the total update at once. “At once” means correct right after the click, with no reload and no further action. After the click on remove, the prices and the total are already correct. A test checks the result right after the click. 
