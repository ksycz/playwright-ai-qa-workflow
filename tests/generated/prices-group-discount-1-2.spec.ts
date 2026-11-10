// spec: specs/prices.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price or total: group discount thresholds (boundaries first)', () => {
  test('[REQ-2.5][REQ-2.2] risk 1: a free ticket counts toward the 8 tickets', async ({ page }) => {
    await page.goto('/');

    // 1. Open the page. Add one visitor of age 0, then seven visitors of age 30 (eight tickets, one free).
    await page.getByTestId('age-input').fill('0');
    await page.getByRole('button', { name: 'Add visitor' }).click();
    for (let i = 0; i < 7; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }

    const freeRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Free') });
    const adultRows = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Adult') });

    // expect: The Free row shows €0.00.
    await expect(freeRow.getByTestId('ticket-price')).toHaveText(['€0.00']);
    // expect: All seven Adult rows show €17.01.
    await expect(adultRows.getByTestId('ticket-price')).toHaveText([
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
    ]);
    // expect: order-total shows 'Total: €119.07' (7 x 17.01).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €119.07');
  });
});
