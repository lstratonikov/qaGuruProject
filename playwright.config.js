//@ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['line'], ['allure-playwright']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'API_tests',
      testMatch: 'tests/api/**/*.spec.js',
      use: {
        baseURL: 'https://apichallenges.herokuapp.com',
      }
    },
    {
      name: 'UI_tests',
      testMatch: 'tests/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://realworld.qa.guru/',
      },
    },
  ],
});

