//@ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config()

export default defineConfig({

  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['line'],
    ['allure-playwright']
  ],
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
        baseURL: process.env.BASE_URL_API
      }
    },
    {
      name: 'UI_tests',
      testMatch: 'tests/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_UI,
      },
    },
  ],
});

