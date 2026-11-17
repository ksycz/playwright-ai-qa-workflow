// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 3 - Screen out of step with the order (REQ-1.1 add, REQ-1.4 remove)', () => {
  test('[REQ-1.4][REQ-2.5] risk 3: removing the 8th ticket takes the group discount away at once', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page and add eight visitors of age 30.
    for (let i = 0; i < 8; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }
    const prices = page.getByTestId('visitor-row').getByTestId('ticket-price');

    // expect: Every ticket-price is €17.01 and order-total is 'Total: €136.08'.
    await expect(prices).toHaveText([
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
    ]);
    await expect(page.getByTestId('order-total')).toHaveText('Total: €136.08');

    // 2. Click remove-visitor-button on any row.
    await page.getByTestId('remove-visitor-button').first().click();

    // expect: Seven rows remain, every ticket-price is €18.90, and order-total is 'Total: €132.30'.
    await expect(page.getByTestId('visitor-row')).toHaveCount(7);
    await expect(prices).toHaveText([
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
    ]);
    await expect(page.getByTestId('order-total')).toHaveText('Total: €132.30');
  });
});
