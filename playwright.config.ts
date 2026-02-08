import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { open: 'never' }], // Cambiado 'on-failure' a 'never' para evitar que se trabe en CI
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['playwright-pdf-reporter', {
        outputFolder: 'playwright-report/pdf', // Ajustado para que consolidar.js lo encuentre fácil
        filename: 'test-report',
    }]
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php',
    // Quitamos el viewport de aquí para que mande el del proyecto
    headless: true, 
    trace: 'on', // Cámbialo a 'on' para que siempre tengamos rastro si algo sale gris
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
      {
        name: 'Chromium-Desktop',
        use: { 
          ...devices['Desktop Chrome'],
          viewport: { width: 1280, height: 720 }, // Un tamaño más estándar para PDF
          deviceScaleFactor: 1, // <--- Baja esto para local
        },
      },
  ],
});