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
                // Captura temporal
                const ssPath = `test-results/temp_${Date.now()}.png`;
                await fs.ensureDir('test-results');
                await page.screenshot({ path: ssPath });
                capturedSteps.push({ title, screenshotPath: ssPath });
            });
        };

        await use(makeStep);

        // Al finalizar el test, generamos el PDF corporativo
        await generateCorporatePDF(testInfo, capturedSteps);
    },
});

export { expect };