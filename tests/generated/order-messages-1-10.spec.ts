// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.5][REQ-1.2] risk 2: a refusal message stays while the user is typing or clearing the field', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open the page, enter 'abc', click add-visitor-button.
    await page.getByTestId('age-input').fill('abc');
    await page.getByRole('button', { name: 'Add visitor' }).click();

    // expect: age-error is shown with the invalid-age message.
    await expect(page.getByTestId('age-error')).toHaveText(
      'Age must be a whole number from 0 to 120',
    );

    // 2. Clear age-input (fill it with an empty string) without clicking add-visitor-button.
    await page.getByTestId('age-input').fill('');

    // expect: age-error is still shown with the same message.
    await expect(page.getByTestId('age-error')).toHaveText(
      'Age must be a whole number from 0 to 120',
    );

    // 3. Type '3' in age-input without clicking add-visitor-button.
    await page.getByTestId('age-input').pressSequentially('3');

    // expect: age-error is still shown with the same message.
    await expect(page.getByTestId('age-error')).toHaveText(
      'Age must be a whole number from 0 to 120',
    );
  });
});
