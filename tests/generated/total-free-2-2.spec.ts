// spec: specs/total.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 3 - Screen out of step with the order (REQ-3.2, REQ-3.3, REQ-3.4)', () => {
  test('[REQ-3.4] risk 3: an order of only free tickets is not empty and totals €0.00', async ({
    page,
  }) => {
    // 1. Open the page. Add age 0, then age 5 (both Free).
    await page.goto('/');
    for (const age of ['0', '5']) {
      await page.getByTestId('age-input').fill(age);
      await page.getByRole('button', { name: 'Add visitor' }).click();
    }

    // expect: Two visitor-row items, each with ticket-price €0.00 and category-label Free.
    await expect(page.getByTestId('visitor-row')).toHaveCount(2);
    await expect(page.getByTestId('visitor-row').getByTestId('ticket-price')).toHaveText([
      '€0.00',
      '€0.00',
    ]);
    await expect(page.getByTestId('visitor-row').getByTestId('category-label')).toHaveText([
      'Free',
      'Free',
    ]);
    // expect: order-total shows 'Total: €0.00'.
    await expect(page.getByTestId('order-total')).toHaveText('Total: €0.00');
    // expect: empty-order is not shown.
    await expect(page.getByTestId('empty-order')).toHaveCount(0);
  });
});
