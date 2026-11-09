// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel.
  fullyParallel: true,

  // Prevent accidentally committing test.only in CI.
  forbidOnly: Boolean(process.env.CI),

  // Retry failed tests only in CI.
  retries: process.env.CI ? 2 : 0,

  // Use a single worker in CI.
  workers: process.env.CI ? 1 : undefined,

  // Save the HTML report in playwright-report/.
  reporter: 'html',

  use: {
    // Base URL for API requests in tests:
    // request.get('Books') -> https://.../api/v1/Books
    baseURL:
      process.env.API_BASE_URL ??
      'https://fakerestapi.azurewebsites.net/api/v1/',

    // Capture a trace on the first retry of a failed test.
    trace: 'on-first-retry',
  },
});
