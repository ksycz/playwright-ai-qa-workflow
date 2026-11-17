// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.3][REQ-1.2] risk 2: at 10 tickets a non-numeric age shows the invalid-age message, not the limit message', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page and add ten visitors of age 30. Enter 'abc' and click add-visitor-button.
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }
    await page.getByTestId('age-input').fill('abc');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    // expect: age-error shows exactly 'Age must be a whole number from 0 to 120'.
    await expect(page.getByTestId('age-error')).toHaveText(
      'Age must be a whole number from 0 to 120',
    );
    // expect: The limit message is not shown. Order still has ten rows.
    await expect(page.getByText('An order can have at most 10 tickets')).toHaveCount(0);
    await expect(page.getByTestId('visitor-row')).toHaveCount(10);
    // expect: order-total still shows 'Total: €170.10'.
    await expect(page.getByTestId('order-total')).toHaveText('Total: €170.10');
  });
});
