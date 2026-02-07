import { test, expect } from '@playwright/test';
import { generateCorporatePDF } from '../utils/evidence-generator';

test('Prueba de fuego Framework @smoke', async ({ page }, testInfo) => {
    const steps: { title: string, screenshotPath: string }[] = [];

    // Paso 1: Ir a Google (o cualquier sitio)
    await page.goto('https://www.google.com');
    const path1 = `test-results/step1.png`;
    await page.screenshot({ path: path1 });
    steps.push({ title: 'Navegar a Google', screenshotPath: path1 });

    // Generar el PDF al terminar
    await generateCorporatePDF(testInfo, steps);
});