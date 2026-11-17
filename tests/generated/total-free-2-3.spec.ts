// spec: specs/total.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 3 - Screen out of step with the order (REQ-3.2, REQ-3.3, REQ-3.4)', () => {
  test("[REQ-3.4] risk 3: a free ticket shows €0.00 as its price and 'Free' only as its category label", async ({
    page,
  }) => {
    // 1. Open the page, enter 3, click add-visitor-button.
    await page.goto('/');
    await page.getByTestId('age-input').fill('3');
    await page.getByTestId('add-visitor-button').click();

    const row = page.getByTestId('visitor-row');

    // expect: category-label of the row has the text 'Free'.
    await expect(row.getByTestId('category-label')).toHaveText('Free');
    // expect: ticket-price of the row has the text '€0.00' and does not contain the word 'Free'.
    await expect(row.getByTestId('ticket-price')).toHaveText('€0.00');
    await expect(row.getByTestId('ticket-price')).not.toContainText('Free');
    // expect: The word 'Free' appears exactly once on the row, in the category-label.
    await expect(row.getByText('Free')).toHaveCount(1);
    await expect(row.getByTestId('category-label').getByText('Free', { exact: true })).toHaveCount(
      1,
    );
  });
});
