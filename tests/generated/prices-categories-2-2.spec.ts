// spec: specs/prices.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price: the age edges 5/6 and 64/65 (fewer than 8 tickets)', () => {
  test('[REQ-2.1][REQ-2.4] risk 1: age 64 is an Adult and age 65 is a Senior', async ({ page }) => {
    await page.goto('/');

    // 1. Open the page. Add age 64, then age 65.
    await page.getByTestId('age-input').fill('64');
    await page.getByRole('button', { name: 'Add visitor' }).click();
    await page.getByTestId('age-input').fill('65');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    const adultRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Adult') });
    const seniorRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Senior') });

    // expect: One Adult row with ticket-price €18.90.
    await expect(adultRow.getByTestId('ticket-price')).toHaveText(['€18.90']);
    // expect: One Senior row with ticket-price €13.23.
    await expect(seniorRow.getByTestId('ticket-price')).toHaveText(['€13.23']);
    // expect: order-total shows 'Total: €32.13'.
    await expect(page.getByTestId('order-total')).toHaveText('Total: €32.13');
  });
});
