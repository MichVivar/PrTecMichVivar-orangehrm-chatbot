import * as fs from 'fs-extra';
import * as path from 'path';
import dayjs from 'dayjs';
import { chromium } from '@playwright/test';

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

export async function generateCorporatePDF(testInfo: any, steps: { title: string, screenshotPath: string }[]) {
    const date = dayjs().format('DD/MM/YYYY');
    const timestamp = dayjs().format('HH:mm:ss');
    const sessionFolder = await getSequentialFolder('./target/Evidencias_PDF');
    const statusFolder = testInfo.status === 'passed' ? 'PASADOS' : 'FALLIDOS';
    const finalPath = path.join(sessionFolder, statusFolder);
    
    await fs.ensureDir(finalPath);

    const colorStatus = testInfo.status === 'passed' ? '#28a745' : '#dc3545';
    const azulPrimario = '#0066cc';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @page { size: A4; margin: 0; }
            html, body { 
                width: 210mm; 
                height: 297mm; 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
            }
            
            /* --- ESTILOS DE LA PORTADA --- */
            .cover { 
                padding: 60px 50px; 
                page-break-after: always; 
                height: 297mm; 
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
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
            .info-label { 
                font-weight: bold; 
                color: #555;
                text-transform: uppercase;
                font-size: 12px;
                margin-bottom: 5px; 
                display: block;
            }

            /* --- ESTILOS DE PASOS (PANTALLA COMPLETA) --- */
            .step-container { 
                page-break-before: always; 
                padding: 20px;
                height: 297mm; 
                display: flex;
                flex-direction: column;
                box-sizing: border-box; 
                position: relative; 
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
            }
            .screenshot { 
                max-width: 98%; 
                max-height: 82vh; 
                height: auto; 
                border: 2px solid #222; 
                border-radius: 5px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
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
            <div class="footer" style="position: relative; border: none;">Generado por TeonCred Automation Framework</div>
        </div>

        ${steps.map((s, i) => `
            <div class="step-container">
                <div class="step-header">
                    <div class="step-num">PASO ${i + 1}</div>
                    <div class="step-desc">${s.title}</div>
                </div>
                <div class="img-wrapper">
                    <img class="screenshot" src="data:image/png;base64,${fs.readFileSync(s.screenshotPath).toString('base64')}">
                </div>
                <div class="footer">TeonCred Automation - Página ${i + 2}</div>
            </div>
        `).join('')}
    </body>
    </html>
    `;

    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    const pdfName = `Evidencia_${testInfo.title.replace(/\s+/g, '_')}.pdf`;
    await page.pdf({
        path: path.join(finalPath, pdfName),
        format: 'A4',
        printBackground: true
    });

    await browser.close();
    steps.forEach(s => { if (fs.existsSync(s.screenshotPath)) fs.removeSync(s.screenshotPath); });
}