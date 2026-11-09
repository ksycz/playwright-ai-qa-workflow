import { defineConfig, devices } from '@playwright/test';

// retries stay at 0 on purpose: a flaky test must be visible, not hidden.
export default defineConfig({
  testDir: 'tests',
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    // Planted bugs are switched on with PLANTED_BUG=<name> (Milestone 4).
    env: { VITE_PLANTED_BUG: process.env.PLANTED_BUG ?? '' },
  },
});
