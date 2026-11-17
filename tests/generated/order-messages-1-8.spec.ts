// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.5][REQ-1.2] risk 2: a refusal message disappears after the next successful add', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page, enter 'abc', click add-visitor-button.
    await page.getByTestId('age-input').fill('abc');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    // expect: age-error is shown with the invalid-age message.
    await expect(page.getByTestId('age-error')).toHaveText('Age must be a whole number from 0 to 120');

    // 2. Enter 30 and click add-visitor-button.
    await page.getByTestId('age-input').fill('30');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    // expect: age-error is no longer shown.
    await expect(page.getByTestId('age-error')).toHaveCount(0);
    // expect: One visitor-row (Adult) is in the order.
    await expect(page.getByTestId('visitor-row')).toHaveCount(1);
    await expect(page.getByTestId('category-label')).toHaveText('Adult');
  });
});
