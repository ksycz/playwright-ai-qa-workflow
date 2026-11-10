// spec: specs/prices.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price: the age edges 5/6 and 64/65 (fewer than 8 tickets)', () => {
  test('[REQ-2.2][REQ-2.3] risk 1: age 5 is Free and age 6 is a Child', async ({ page }) => {
    await page.goto('/');

    // 1. Open the page. Add age 5, then age 6.
    await page.getByTestId('age-input').fill('5');
    await page.getByRole('button', { name: 'Add visitor' }).click();
    await page.getByTestId('age-input').fill('6');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    const freeRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Free', { exact: true }) });
    const childRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Child', { exact: true }) });

    // expect: One Free row with ticket-price €0.00.
    await expect(freeRow.getByTestId('ticket-price')).toHaveText(['€0.00']);
    // expect: One Child row with ticket-price €9.45.
    await expect(childRow.getByTestId('ticket-price')).toHaveText(['€9.45']);
    // expect: order-total shows 'Total: €9.45'.
    await expect(page.getByTestId('order-total')).toHaveText('Total: €9.45');
  });
});
