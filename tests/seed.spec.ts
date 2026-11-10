import { expect, test } from '@playwright/test';

// The seed test is the example the planner and generator copy from, so it
// shows the conventions once: the REQ ids in the title, role or test-id
// locators, expected values taken from the requirements, and no fixed waits.

// The title starts with the requirement ids this test covers:
//   REQ-1.1 a visitor is added by age and shown with a category
//   REQ-2.1 an adult pays the full price of €18.90
//   REQ-3.1 the price is shown in euros, and the total is the sum
test('[REQ-1.1][REQ-2.1][REQ-3.1] an adult is added and priced at €18.90', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('age-input').fill('30');
  await page.getByRole('button', { name: 'Add visitor' }).click();

  const row = page
    .getByTestId('visitor-row')
    .filter({ has: page.getByTestId('category-label').getByText('Adult', { exact: true }) });

  // Expected values come from the requirements, not from what the screen happens to show.
  // These assertions retry on their own until they pass or time out, so there is no need for a fixed wait.
  await expect(row.getByTestId('ticket-price')).toHaveText('€18.90'); // REQ-2.1, REQ-3.1 format
  await expect(page.getByTestId('order-total')).toHaveText('Total: €18.90'); // REQ-3.1 total = sum of tickets
});
