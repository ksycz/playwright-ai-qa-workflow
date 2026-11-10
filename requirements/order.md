# Order

**As a** visitor buying tickets for a group,
**I want to** build an order by entering each visitor's age,
**so that** I can see what the visit will cost before I pay.

## Acceptance criteria

- **REQ-1.1** A visitor can be added by entering their age. The visitor appears in the order with their price category: Free, Child, Adult or Senior. A visitor can be added by entering their age. The visitor appears in the order with their price category: Free, Child, Adult or Senior. After a successful add, the age field is cleared.
- **REQ-1.2** An age is a whole number from 0 to 120. Only digits are accepted, and spaces around them are ignored. Leading zeros are accepted: "007" is age 7 and "000" is age 0. "5.0", "+5", "-5", "1e1", text and numbers above 120 are rejected, including "0121" (age 121). A field with only spaces counts as empty. No visitor is added when the age is rejected, and a message is shown:
  - empty field (including only spaces): "Enter an age"
  - any other invalid age: "Age must be a whole number from 0 to 120"
- **REQ-1.3** An order has at most 10 tickets, and free tickets count. Trying to add an 11th visitor shows the message "An order can have at most 10 tickets", and the order stays at 10. The age field and the "Add visitor" button stay enabled at 10 tickets. If the age is also invalid, the message from REQ-1.2 that applies is shown instead.
- **REQ-1.4** A visitor can be removed from the order. After the click on remove, all prices and the total are already correct, with no page reload and no further user action. The group discount from REQ-2.5 follows the current number of tickets, so removing a visitor can switch it off for every remaining ticket.
- **REQ-1.5** A refusal message from REQ-1.2 or REQ-1.3 disappears after the next visitor is added successfully or after a visitor is removed. It stays while the user is typing or clearing the field.
