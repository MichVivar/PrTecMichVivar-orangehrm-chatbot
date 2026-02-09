const fs = require('fs-extra');
const path = require('path');

async function consolidar() {
    const basePath = './target/Evidencias_PDF';
    const sourceReport = './playwright-report';
    
    if (!await fs.pathExists(basePath)) {
        console.log("⚠️ No se encontró la carpeta de evidencias base.");
        return;
    }

    // 1. Buscamos la carpeta del ciclo real generada por los tests
    const folders = await fs.readdir(basePath);
    
    // Filtramos directorios y ordenamos para obtener el más reciente
    const latestFolder = folders
        .filter(f => fs.lstatSync(path.join(basePath, f)).isDirectory())
        .sort()
        .reverse()[0];

    // Validación de seguridad
    if (!latestFolder) {
        console.log("⚠️ No se encontró ninguna carpeta de ciclo.");
        return;
    }

    const sessionPath = path.join(basePath, latestFolder);
    const targetReport = path.join(sessionPath, 'Reporte_Tecnico_Graficas');

    try {
        // 2. Verificamos si existe el reporte de Playwright antes de copiar
        if (await fs.pathExists(sourceReport)) {
            // Usamos copySync o copy para asegurar que el reporte de gráficas 
            // se integre a la carpeta del ciclo único
            await fs.copy(sourceReport, targetReport);
            console.log(`✅ Reporte técnico integrado con éxito en: ${targetReport}`);
        } else {
            console.log("⚠️ No se encontró 'playwright-report' para consolidar.");
        }
    } catch (err) {
        console.error(`❌ Error al consolidar: ${err.message}`);
    }
}

consolidar();