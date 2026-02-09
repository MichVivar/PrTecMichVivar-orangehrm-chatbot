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

        const makeStep = async (title: string, task: () => Promise<void>) => {
            await base.step(title, async () => {
                await task();

                if (!page.isClosed()) {
                    try {
                        await page.waitForLoadState('load', { timeout: 5000 }).catch(() => {}); 
                        
                        const ssPath = `test-results/temp_${Date.now()}.png`;
                        await fs.ensureDir('test-results');

                        await page.screenshot({ path: ssPath, scale: 'css', timeout: 3000 }); 
                        
                        capturedSteps.push({ title, screenshotPath: ssPath });
                    } catch (e) {
                        console.warn(`No se pudo capturar pantalla en el paso: ${title}. El navegador podría estar cerrándose.`);
                    }
                }
            });
        };

        await use(makeStep);

        if (capturedSteps.length > 0) {
            await generateCorporatePDF(testInfo, capturedSteps);
        }
    },
});

export { expect };