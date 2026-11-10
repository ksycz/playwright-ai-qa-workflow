// spec: specs/prices.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price or total: group discount thresholds (boundaries first)', () => {
  test('[REQ-2.5] risk 1: 7 tickets get no group discount, the 8th ticket gives 10% off every ticket', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page and add seven visitors of age 30.
    for (let i = 0; i < 7; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }
    const prices = page.getByTestId('visitor-row').getByTestId('ticket-price');

    // expect: Every ticket-price is €18.90.
    await expect(prices).toHaveText([
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
      '€18.90',
    ]);
    // expect: order-total shows 'Total: €132.30' (7 x 18.90).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €132.30');

    // 2. Add an 8th visitor of age 30.
    await page.getByTestId('age-input').fill('30');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    // expect: All eight ticket-price values are €17.01 (18.90 less 10%).
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
    // expect: order-total shows 'Total: €136.08' (8 x 17.01).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €136.08');
  });
});
