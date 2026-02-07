const fs = require('fs-extra');
const path = require('path');

async function consolidar() {
    const basePath = './target/Evidencias_PDF';
    
    // 1. Validar que la carpeta base existe para evitar que el script truene
    if (!await fs.pathExists(basePath)) {
        console.log("⚠️ No se encontró la carpeta de evidencias base.");
        return;
    }

    // 2. Buscamos la carpeta del ciclo más reciente
    const folders = await fs.readdir(basePath);
    const latestFolder = folders
        .filter(f => fs.lstatSync(path.join(basePath, f)).isDirectory())
        .sort()
        .reverse()[0];

    const sourceReport = './playwright-report';

    // 3. VALIDACIÓN DE SEGURIDAD (Al inicio del proceso)
    if (!latestFolder || !await fs.pathExists(sourceReport)) {
        console.log("⚠️ No hay reportes nuevos o carpetas de ciclo para consolidar.");
        return;
    }

    const sessionPath = path.join(basePath, latestFolder);
    const targetReport = path.join(sessionPath, 'Reporte_Tecnico_Graficas');

    // 4. Copiamos el reporte interactivo al ciclo
    try {
        await fs.copy(sourceReport, targetReport);
        console.log(`✅ Historial consolidado con éxito en: ${sessionPath}`);
    } catch (err) {
        console.error(`❌ Error al consolidar: ${err.message}`);
    }
}

consolidar();