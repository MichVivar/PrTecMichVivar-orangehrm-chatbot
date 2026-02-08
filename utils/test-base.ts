/**
 * @file test-base.ts
 * @description Extensión de Playwright para configurar Fixtures personalizados.
 * Define la infraestructura para la inyección del PageManager y la lógica de captura 
 * de pasos automatizada.
 */

import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/page-manager';
import { generateCorporatePDF } from './evidence-generator';
import * as fs from 'fs-extra';

/**
 * @interface MyFixtures
 * @description Define los tipos de los Fixtures personalizados disponibles en los tests.
 */

export interface MyFixtures {
    pm: PageManager;
    makeStep: (title: string, task: () => Promise<void>) => Promise<void>;
}

/**
 * Extensión del objeto 'test' de Playwright.
 * Configura el ciclo de vida de los fixtures antes y después de cada prueba.
 */

export const test = base.extend<MyFixtures>({
    pm: async ({ page }, use) => {
        await use(new PageManager(page));
    },

    makeStep: async ({ page }, use, testInfo) => {
        const capturedSteps: { title: string; screenshotPath: string }[] = [];

        /**
         * Realiza la acción, espera estabilidad de la UI y captura pantalla.
         */
        const makeStep = async (title: string, task: () => Promise<void>) => {
            await base.step(title, async () => {
                await task();
                
                await page.waitForLoadState('networkidle').catch(() => {}); 
                await page.waitForTimeout(500); 

                const ssPath = `test-results/temp_${Date.now()}.png`;
                await fs.ensureDir('test-results');

                await page.screenshot({ path: ssPath, scale: 'css' }); 
                
                capturedSteps.push({ title, screenshotPath: ssPath });
            });
        };

        await use(makeStep);

        await generateCorporatePDF(testInfo, capturedSteps);
    },
});

export { expect };