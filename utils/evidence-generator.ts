/**
 * @file evidence-generator.ts
 * @description Utilidad para la generación de reportes en formato PDF.
 * Este módulo captura el flujo de ejecución, convierte capturas de pantalla a Base64
 * y genera un documento PDF con diseño HTML/CSS.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import dayjs from 'dayjs';
import { chromium } from '@playwright/test';

/**
 * Gestiona la creación de carpetas secuenciales (001, 002, etc.) para cada ejecución diaria.
 * @param {string} basePath - Ruta base donde se almacenarán las evidencias.
 * @returns {Promise<string>} - Ruta de la carpeta creada para la sesión actual.
 */
async function getSequentialFolder(basePath: string): Promise<string> {
    const date = dayjs().format('DD-MM-YYYY');
    let counter = 1;
    let folderPath = "";
    await fs.ensureDir(basePath);
    do {
        const paddedCounter = counter.toString().padStart(3, '0');
        folderPath = path.join(basePath, `${date}-${paddedCounter}`);
        counter++;
    } while (fs.existsSync(folderPath));
    await fs.ensureDir(folderPath);
    return folderPath;
}

/**
 * Genera el nombre de la carpeta del ciclo basado en la fecha y hora de inicio.
 * Esto asegura que todos los tests de una misma ejecución compartan la carpeta.
 */
function getCycleFolderName(): string {
    return dayjs().format('[Ejecucion]_DD-MMM_hh-mm-a');
}

/**
 * Genera un archivo PDF con la evidencia del test, incluyendo portada y pasos con capturas.
 * @param {any} testInfo - Metadatos del test proporcionados por Playwright.
 * @param {Array<{title: string, screenshotPath: string}>} steps - Listado de pasos ejecutados con sus respectivas imágenes.
 */
export async function generateCorporatePDF(testInfo: any, steps: { title: string, screenshotPath: string }[]) {
    const date = dayjs().format('DD/MM/YYYY');
    const timestamp = dayjs().format('HH:mm:ss');
    
    // 1. Definir la carpeta raíz del ciclo (será la misma para todos los tests de este minuto)
    const cycleFolder = path.join('./target/Evidencias_PDF', getCycleFolderName());

    // 2. Extraer nombres para la jerarquía
    const featureName = (testInfo.titlePath[1] || 'General')
        .replace(/\s+/g, '_')
        .replace(/@\w+/g, ''); // Limpia tags como @login
        
    const scenarioName = testInfo.title
        .replace(/[/\\?%*:|"<>]/g, '-') 
        .replace(/\s+/g, '_');
    const statusFolder = testInfo.status === 'passed' ? 'PASADOS' : 'FALLIDOS';

    // 3. Construir ruta final: Ciclo / Feature / Escenario / PASADOS_FALLIDOS
    const finalPath = path.join(cycleFolder, featureName, scenarioName, statusFolder);
    
    // fs-extra se encarga de crear toda la cadena de carpetas si no existen
    await fs.ensureDir(finalPath);

    const colorStatus = testInfo.status === 'passed' ? '#28a745' : '#dc3545';
    const azulPrimario = '#0066cc';

    await new Promise(resolve => setTimeout(resolve, 800));

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @page { size: A4; margin: 0; }
            html, body { 
                width: 210mm; 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: white; /* MODIFICADO: Forzar fondo blanco */
            }
            
            .cover { 
                padding: 60px 50px; 
                page-break-after: always; 
                height: 297mm; 
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                background-color: white;
            }
            .header-title { 
                color: ${azulPrimario}; 
                font-size: 28px; 
                font-weight: bold; 
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 3px solid ${azulPrimario};
                padding-bottom: 10px;
            }
            .res-banner { 
                text-align: center; 
                font-size: 32px; 
                font-weight: bold; 
                color: ${colorStatus}; 
                margin: 40px 0;
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
            }
            .info-box { 
                font-size: 14px; 
                margin-bottom: 30px; 
                border-left: 4px solid #eee; 
                padding-left: 15px; 
            }

            .step-container { 
                page-break-before: always; 
                padding: 20px;
                height: 297mm; 
                display: flex;
                flex-direction: column;
                box-sizing: border-box; 
                position: relative; 
                background-color: white;
            }
            .step-header { 
                margin-bottom: 10px; 
                border-left: 6px solid ${colorStatus};
                padding-left: 15px;
            }
            .step-num { font-size: 22px; font-weight: bold; color: ${colorStatus}; }
            .step-desc { font-size: 15px; color: #333; font-weight: bold; margin-top: 5px; }

            .img-wrapper { 
                width: 100%; 
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #ffffff;
            }
            .screenshot { 
                max-width: 95%; 
                max-height: 80vh; 
                height: auto; 
                border: 2px solid #222; 
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            }

            .footer { 
                position: absolute; 
                bottom: 15px; 
                left: 0; 
                right: 0; 
                text-align: center; 
                font-size: 10px; 
                color: #888; 
                border-top: 1px solid #eee; 
                padding-top: 10px; 
            }               
        </style>
    </head>
    <body>
        <div class="cover">
            <div class="header-title">REPORTE DE EVIDENCIA DE PRUEBA</div>
            <div class="res-banner">RESULTADO: ${testInfo.status === 'passed' ? 'PASADO' : 'FALLIDO'}</div>
            
            <div class="info-box">
                <span class="info-label">DATOS DE EJECUCIÓN</span>
                <div><b>Fecha/Hora:</b> ${date} ${timestamp}</div>
            </div>
            
            <div class="info-box">
                <span class="info-label">ESCENARIO DE PRUEBA</span>
                <div style="font-size: 16px;"><b>${testInfo.title}</b></div>
            </div>
            
            <div class="info-box">
                <span class="info-label">FLUJO DE PASOS:</span>
                <ol style="color: #333; font-size: 13px; line-height: 1.6;">
                    ${steps.map(s => `<li>${s.title}</li>`).join('')}
                </ol>
            </div>
            <div style="flex-grow: 1;"></div>
            <div class="footer" style="position: relative; border: none;">Generado por OrangeHRM Automation Framework</div>
        </div>

        ${steps.map((s, i) => {
            let base64Data = "";
            if (fs.existsSync(s.screenshotPath)) {
                base64Data = fs.readFileSync(s.screenshotPath).toString('base64');
            }

            return `
            <div class="step-container">
                <div class="step-header">
                    <div class="step-num">PASO ${i + 1}</div>
                    <div class="step-desc">${s.title}</div>
                </div>
                <div class="img-wrapper">
                    ${base64Data ? 
                        `<img class="screenshot" src="data:image/png;base64,${base64Data}">` : 
                        `<div style="color:red;">Error: No se pudo cargar la imagen del paso</div>`}
                </div>
                <div class="footer">TeonCred Automation - Página ${i + 2}</div>
            </div>`;
        }).join('')}
    </body>
    </html>
    `;

    const browser = await chromium.launch({ 
        headless: true, 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--font-render-hinting=none'
        ] 
    });
    const context = await browser.newContext({ deviceScaleFactor: 2 });
    const page = await context.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdfName = `Evidencia_${testInfo.title.replace(/\s+/g, '_')}.pdf`;
    await page.pdf({
        path: path.join(finalPath, pdfName),
        format: 'A4',
        printBackground: true, 
        preferCSSPageSize: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    await browser.close();
    
    steps.forEach(s => { 
        if (fs.existsSync(s.screenshotPath)) {
            try { fs.removeSync(s.screenshotPath); } catch (e) { console.log("Error limpiando imagen:", e); }
        }
    });
}