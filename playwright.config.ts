import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { open: 'on-failure' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['playwright-pdf-reporter', {
        outputFolder: 'reportes-pdf',
        filename: 'Reporte_Pruebas_TeonCred',
    }]
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php',
    
    viewport: { width: 1440, height: 900 },
    
    headless: true, 
    
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'Chromium-Desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});