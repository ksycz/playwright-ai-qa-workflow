// spec: specs/total.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 3 - Screen out of step with the order (REQ-3.2, REQ-3.3, REQ-3.4)', () => {
  test('[REQ-3.2] risk 3: an empty order shows the message and no total', async ({ page }) => {
    // 1. Open the page and add nothing.
    await page.goto('/');

    // expect: empty-order shows 'Add visitors to see a price'.
    await expect(page.getByTestId('empty-order')).toHaveText('Add visitors to see a price');
    // expect: order-total is not in the page (count 0).
    await expect(page.getByTestId('order-total')).toHaveCount(0);
    // expect: No visitor-row is shown.
    await expect(page.getByTestId('visitor-row')).toHaveCount(0);
  });
});
