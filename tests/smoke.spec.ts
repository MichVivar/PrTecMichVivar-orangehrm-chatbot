import { test } from '@playwright/test';
import { generateCorporatePDF } from '../utils/evidence-generator';
import * as fs from 'fs-extra';

test('Validar Generacion de PDF @smoke', async ({ page }, testInfo) => {
    const steps: { title: string, screenshotPath: string }[] = [];
    
    // Asegurarnos que existe la carpeta temporal para fotos
    await fs.ensureDir('test-results/screenshots');

    await page.goto('https://opensource-demo.orangehrmlive.com/');
    
    // Captura 1
    const path1 = `test-results/screenshots/paso1.png`;
    await page.screenshot({ path: path1 });
    steps.push({ title: 'Carga de pagina inicial', screenshotPath: path1 });

    // Captura 2
    const path2 = `test-results/screenshots/paso2.png`;
    await page.screenshot({ path: path2 });
    steps.push({ title: 'Verificación de selectores', screenshotPath: path2 });

    // LLAMADA VITAL AL GENERADOR
    await generateCorporatePDF(testInfo, steps);
});