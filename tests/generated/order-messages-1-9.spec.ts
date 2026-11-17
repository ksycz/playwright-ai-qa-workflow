// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.5][REQ-1.3] risk 2: the limit message disappears after a visitor is removed', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page, add ten visitors of age 30, then try an 11th so the limit message shows.
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('age-input').fill('30');
      await page.getByRole('button', { name: 'Add to order' }).click();
    }
    await page.getByTestId('age-input').fill('30');
    await page.getByRole('button', { name: 'Add to order' }).click();

    // expect: age-error shows 'An order can have at most 10 tickets'.
    await expect(page.getByTestId('age-error')).toHaveText('An order can have at most 10 tickets');

    // 2. Click remove-visitor-button on the first visitor-row.
    await page.getByTestId('visitor-row').first().getByTestId('remove-visitor-button').click();

    // expect: age-error is no longer shown.
    await expect(page.getByTestId('age-error')).toBeHidden();
    // expect: Nine visitor-row items remain.
    await expect(page.getByTestId('visitor-row')).toHaveCount(9);
  });
});
