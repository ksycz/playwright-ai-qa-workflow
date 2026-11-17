// spec: specs/order.plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Risk 2 - Input wrongly accepted or refused (REQ-1.3 limit, REQ-1.2 validation, REQ-1.5 message lifetime)', () => {
  test('[REQ-1.5][REQ-1.3] risk 2: the limit message stays while the user is typing', async ({
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
    // expect: age-error shows the limit message. Without this check, step 2 could not tell "stayed" from "appeared later".
    await expect(page.getByTestId('age-error')).toHaveText('An order can have at most 10 tickets');

    // 2. Type '3' in age-input without clicking the button.
    await page.getByTestId('age-input').pressSequentially('3');

    // expect: age-error still shows 'An order can have at most 10 tickets'.
    await expect(page.getByTestId('age-error')).toHaveText('An order can have at most 10 tickets');
  });
});
