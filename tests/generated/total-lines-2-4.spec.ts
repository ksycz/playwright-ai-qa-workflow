// spec: specs/total.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 3 - Screen out of step with the order (REQ-3.2, REQ-3.3, REQ-3.4)', () => {
  test('[REQ-3.3] risk 3: two visitors of the same age are two line items', async ({ page }) => {
    // 1. Open the page. Add age 30 twice.
    await page.goto('/');
    for (let i = 0; i < 2; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add to order' }).click();
    }

    // expect: Exactly two visitor-row items, each with category-label Adult and ticket-price €18.90.
    await expect(page.getByTestId('visitor-row')).toHaveCount(2);
    await expect(page.getByTestId('visitor-row').getByTestId('category-label')).toHaveText([
      'Adult',
      'Adult',
    ]);
    await expect(page.getByTestId('visitor-row').getByTestId('ticket-price')).toHaveText([
      '€18.90',
      '€18.90',
    ]);
    // expect: order-total shows 'Total: €37.80'.
    await expect(page.getByTestId('order-total')).toHaveText('Total: €37.80');
  });
});
