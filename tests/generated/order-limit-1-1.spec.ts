// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.3] risk 2: the 10th ticket is accepted and the 11th is refused', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page. Add ten visitors, each with age 30 (fill age-input, click add-visitor-button, ten times).
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }

    // expect: Ten visitor-row items are shown.
    await expect(page.getByTestId('visitor-row')).toHaveCount(10);
    // expect: No age-error is shown.
    await expect(page.getByTestId('age-error')).toHaveCount(0);
    // expect: order-total shows 'Total: €170.10' (10 adults at the group price of €17.01, REQ-2.5).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €170.10');

    // 2. Enter age 30 and click add-visitor-button an 11th time.
    await page.getByTestId('age-input').fill('30');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    // expect: age-error shows exactly 'An order can have at most 10 tickets'.
    await expect(page.getByTestId('age-error')).toHaveText('An order can have at most 10 tickets');
    // expect: Still exactly ten visitor-row items and the total is unchanged.
    await expect(page.getByTestId('visitor-row')).toHaveCount(10);
    await expect(page.getByTestId('order-total')).toHaveText('Total: €170.10');
    // expect: age-input and the 'Add visitor' button are both enabled.
    await expect(page.getByTestId('age-input')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Add visitor' })).toBeEnabled();
  });
});
