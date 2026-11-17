// spec: specs/total.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 1 - Wrong price or total: rounding, format and sum (REQ-3.1)', () => {
  test('[REQ-3.1][REQ-2.5] risk 1: two children in an 8-ticket order each show €8.51 and add up to €17.02', async ({
    page,
  }) => {
    // 1. Open the page. Add two visitors of age 12, then six visitors of age 30 (eight tickets).
    await page.goto('/');
    for (const age of ['12', '12', '30', '30', '30', '30', '30', '30']) {
      await page.getByTestId('age-input').fill(age);
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }

    const childRows = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Child', { exact: true }) });
    const adultRows = page
      .getByTestId('visitor-row')
      .filter({ has: page.getByTestId('category-label').getByText('Adult', { exact: true }) });

    // expect: Both Child rows show ticket-price €8.51 (9.45 x 0.9 = 8.505, rounded half up).
    await expect(childRows.getByTestId('ticket-price')).toHaveText(['€8.51', '€8.51']);
    // expect: The six Adult rows show €17.01.
    await expect(adultRows.getByTestId('ticket-price')).toHaveText([
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
      '€17.01',
    ]);
    // expect: order-total shows 'Total: €119.08' (2 x 8.51 = 17.02, plus 6 x 17.01 = 102.06).
    await expect(page.getByTestId('order-total')).toHaveText('Total: €119.08');
  });
});
