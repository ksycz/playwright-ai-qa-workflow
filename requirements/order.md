# Order

**As a** visitor buying tickets for a group,
**I want to** build an order by entering each visitor's age,
**so that** I can see what the visit will cost before I pay.

## Acceptance criteria

- **REQ-1.1** A visitor can be added by entering their age. The visitor appears in the order with their price category: Free, Child, Adult or Senior.
- **REQ-1.2** An age is a whole number from 0 to 120. Only digits are accepted, and spaces around them are ignored. "007" is accepted. "5.0", "+5", "-5", "1e1", text and numbers above 120 are rejected. No visitor is added when the age is rejected, and a message is shown:
  - empty field: "Enter an age"
  - any other invalid age: "Age must be a whole number from 0 to 120"
- **REQ-1.3** An order has at most 10 tickets, and free tickets count. Trying to add an 11th visitor shows the message "An order can have at most 10 tickets", and the order stays at 10. The age field and the "Add visitor" button stay enabled at 10 tickets. If the age is also invalid, the invalid-age message from REQ-1.2 is shown instead.
- **REQ-1.4** A visitor can be removed from the order. After the click on remove, all prices and the total are already correct, with no page reload and no further user action.
- **REQ-1.5** A refusal message from REQ-1.2 or REQ-1.3 disappears after the next visitor is added successfully or after a visitor is removed. It stays while the user is typing.
