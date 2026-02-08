import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/page-manager';
import { generateCorporatePDF } from './evidence-generator';
import * as fs from 'fs-extra';

// Definimos la interfaz para que TypeScript no marque "any"
export interface MyFixtures {
    pm: PageManager;
    makeStep: (title: string, task: () => Promise<void>) => Promise<void>;
}

export const test = base.extend<MyFixtures>({
    pm: async ({ page }, use) => {
        await use(new PageManager(page));
    },

    makeStep: async ({ page }, use, testInfo) => {
        const capturedSteps: { title: string; screenshotPath: string }[] = [];

        const makeStep = async (title: string, task: () => Promise<void>) => {
            await base.step(title, async () => {
                await task();
                
                // --- SEGURO PARA ORANGEHRM ---
                // Espera a que no haya peticiones de red activas (carga de datos)
                await page.waitForLoadState('networkidle').catch(() => {}); 
                // Espera un momento para que terminen las animaciones de CSS
                await page.waitForTimeout(500); 

                const ssPath = `test-results/temp_${Date.now()}.png`;
                await fs.ensureDir('test-results');
                
                // Tomamos la captura con 'fullPage' falso para evitar bugs de scroll
                await page.screenshot({ path: ssPath, scale: 'css' }); 
                
                capturedSteps.push({ title, screenshotPath: ssPath });
            });
        };

        await use(makeStep);

        // Al finalizar el test, generamos el PDF corporativo
        await generateCorporatePDF(testInfo, capturedSteps);
    },
});

export { expect };