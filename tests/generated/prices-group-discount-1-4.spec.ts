// spec: specs/prices.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price or total: group discount thresholds (boundaries first)', () => {
  test('[REQ-2.5][REQ-2.4] risk 1: a senior in an 8-ticket order pays 10% off the senior price', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page. Add one visitor of age 80 and seven visitors of age 30.
    await page.getByTestId('age-input').fill('80');
    await page.getByRole('button', { name: 'Add visitor' }).click();
    for (let i = 0; i < 7; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }

    const seniorRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Senior') });
    const adultRows = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Adult') });

    // expect: The Senior row shows €11.91 (13.23 less 10% = 11.907, rounded). A simple 40% off would give €11.34 and is wrong.
    await expect(seniorRow.getByTestId('ticket-price')).toHaveText(['€11.91']);
    // expect: The Adult rows show €17.01.
    await expect(adultRows.getByTestId('ticket-price')).toHaveText([
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
    ]);
    // expect: order-total shows 'Total: €130.98' (11.91 + 7 x 17.01).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €130.98');
  });
});
