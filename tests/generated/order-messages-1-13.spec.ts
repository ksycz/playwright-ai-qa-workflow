// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.5][REQ-1.2] risk 2: a refusal message disappears after a visitor is removed', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page. Add age 30, then enter 'abc' and click add-visitor-button.
    await page.getByTestId('age-input').fill('30');
    await page.getByRole('button', { name: 'Add to order' }).click();
    await page.getByTestId('age-input').fill('abc');
    await page.getByRole('button', { name: 'Add to order' }).click();

    // expect: age-error is shown.
    await expect(page.getByTestId('age-error')).toHaveText(
      'Age must be a whole number from 0 to 120',
    );

    // 2. Click remove-visitor-button on the row.
    await page.getByTestId('remove-visitor-button').click();

    // expect: age-error is no longer shown and empty-order is shown.
    await expect(page.getByTestId('age-error')).toBeHidden();
    await expect(page.getByTestId('empty-order')).toHaveText('Add visitors to see a price');
  });
});
