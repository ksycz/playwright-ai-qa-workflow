import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['app/src/**/*.test.ts', 'scripts/**/*.test.ts'],
    coverage: {
      // Coverage is a check for gaps in the pricing rules, not a target to chase.
      provider: 'v8',
      include: ['app/src/pricing.ts'],
      reporter: ['text', 'html'],
    },
  },
});
