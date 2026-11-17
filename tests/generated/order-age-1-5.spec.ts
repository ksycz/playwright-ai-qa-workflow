// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.2] risk 2: age 121 (just above the upper boundary) is rejected', async ({
    page,
  }) => {
    // 1. Open the page, enter 121, click add-visitor-button.
    await page.goto('/');
    await page.getByTestId('age-input').fill('121');
    await page.getByRole('button', { name: 'Add to order' }).click();

    // expect: age-error shows 'Age must be a whole number from 0 to 120'.
    await expect(page.getByTestId('age-error')).toHaveText(
      'Age must be a whole number from 0 to 120',
    );
    // expect: No visitor-row is added; empty-order is still shown.
    await expect(page.getByTestId('visitor-row')).toHaveCount(0);
    await expect(page.getByTestId('empty-order')).toHaveText('Add visitors to see a price');
  });
});
