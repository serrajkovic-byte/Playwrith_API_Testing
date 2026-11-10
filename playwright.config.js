// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  reporter: [['list'], ['html']],

  use: {
    baseURL:
      process.env.API_BASE_URL ??
      'https://fakerestapi.azurewebsites.net/api/v1/',
    trace: 'on-first-retry',
  },
});
