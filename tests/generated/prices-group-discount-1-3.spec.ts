// spec: specs/prices.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price or total: group discount thresholds (boundaries first)', () => {
  test('[REQ-2.5][REQ-2.3] risk 1: a child in an 8-ticket order pays 10% off the half price', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page. Add one visitor of age 12 and seven visitors of age 30.
    await page.getByTestId('age-input').fill('12');
    await page.getByRole('button', { name: 'Add visitor' }).click();
    for (let i = 0; i < 7; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }

    const childRow = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Child', { exact: true }) });
    const adultRows = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Adult', { exact: true }) });

    // expect: The Child row shows €8.51 (9.45 less 10% = 8.505, rounded half up).
    await expect(childRow.getByTestId('ticket-price')).toHaveText(['€8.51']);
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
    // expect: order-total shows 'Total: €127.58' (8.51 + 7 x 17.01).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €127.58');
  });
});
