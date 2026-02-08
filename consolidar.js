const fs = require('fs-extra');
const path = require('path');

async function consolidar() {
    const basePath = './target/Evidencias_PDF';
    
    if (!await fs.pathExists(basePath)) {
        console.log("⚠️ No se encontró la carpeta de evidencias base.");
        return;
    }

    // 1. Buscamos las carpetas y filtramos nombres conflictivos
    const folders = await fs.readdir(basePath);
    
    // Filtramos para obtener la carpeta del ciclo
    const latestFolder = folders
        .filter(f => fs.lstatSync(path.join(basePath, f)).isDirectory())
        .sort()
        .reverse()[0];

    const sourceReport = './playwright-report';

    if (!latestFolder || !await fs.pathExists(sourceReport)) {
        console.log("⚠️ No hay reportes nuevos o carpetas de ciclo para consolidar.");
        return;
    }

    // 2. LIMPIEZA: Aseguramos que la ruta de destino sea segura para GitHub
    // Reemplazamos ":" por "-" en el nombre de la carpeta del ciclo si es que lo trae
    const safeFolderName = latestFolder.replace(/[:]/g, '-');
    const sessionPath = path.join(basePath, safeFolderName);
    const targetReport = path.join(sessionPath, 'Reporte_Tecnico_Graficas');

    try {
        // Si el nombre original tenía ":", renombramos la carpeta físicamente antes de copiar
        if (latestFolder !== safeFolderName) {
            await fs.rename(path.join(basePath, latestFolder), sessionPath);
        }

        // 3. Copiamos el reporte interactivo al ciclo
        await fs.copy(sourceReport, targetReport);
        console.log(`✅ Historial consolidado con éxito en: ${sessionPath}`);
    } catch (err) {
        console.error(`❌ Error al consolidar: ${err.message}`);
    }
}

consolidar();