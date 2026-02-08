import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { open: 'never' }], 
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['playwright-pdf-reporter', {
        outputFolder: 'playwright-report/pdf', 
        filename: 'test-report',
    }]
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php',
    headless: true, 
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
      {
        name: 'Chromium-Desktop',
        use: { 
          ...devices['Desktop Chrome'],
          viewport: { width: 1280, height: 720 }, 
          deviceScaleFactor: 1, 
        },
      },
  ],
});