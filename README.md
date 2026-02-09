# 🤖 OrangeHRM Chatbot Automation Challenge

Este repositorio contiene una solución de automatización desarrollada con **Playwright** y **TypeScript**. El proyecto valida el flujo completo de interacción con el chatbot de IA en la plataforma de documentación de Botpress.

## 📊 Criterios Técnicos Implementados

### 🎯 Cobertura de Escenarios
Se automatizaron los siguientes escenarios críticos, garantizando la estabilidad en entornos asíncronos:
- **Navegación:** Validación de carga y consistencia de títulos en Docs.
- **Manejo de IFrames:** Localización robusta de elementos dentro de frames dinámicos.
- **Identificación de IA:** Extracción del nombre del modelo (`GPT-OSS-120b`) con manejo de estados asíncronos.
- **Flujo de Chat E2E:** Envío de mensajes y validación de respuestas lógicas del asistente.

### 🛠️ Calidad de Código y Estrategia
- **Page Object Model (POM):** Arquitectura escalable que separa la lógica de negocio de los selectores para facilitar el mantenimiento.
- **Page Object Manager:** Un orquestador que inicializa todas las páginas en un solo punto, optimizando la memoria en los tests.
- **Selectores de Accesibilidad:** Uso de `getByRole` y `aria-label` para garantizar estabilidad ante cambios en el DOM.
- **Acciones Atómicas:** Separación de responsabilidades (escribir, enviar, validar) para identificar fallos con precisión quirúrgica.

---

## 🏗️ Stack Tecnológico

- **Lenguaje:** TypeScript
- **Framework:** Playwright
- **Patrón de Diseño:** Page Object Manager (POM)
- **Reportería:** Playwright HTML Report con Screenshots y Anotaciones.

---

## 🚀 Instrucciones de Ejecución Local

### Pre-requisitos
- **Node.js:** v18 o superior
- **NPM:** (Instalado con Node)

### Pasos
1. **Clonar el proyecto:**
   ```bash
   git clone [https://github.com/michvivar/examen-orange-chatbot.git](https://github.com/michvivar/examen-orange-chatbot.git)
   cd examen-orange-chatbot
    ```

2. **Instalar dependencias:**
    ```bash
    npm install
    ```

3. **Instalar navegadores de Playwright:**
    ```bash
    npx playwright install
    ```

4. **Ejecutar las pruebas:**
    ```bash
    npm test
    ```

## 📊 Visualización de Resultados
- **Anotaciones de IA:** El nombre del bot detectado y su respuesta aparecen como metadatos del test.
- **Screenshots:** Evidencia visual de cada paso de la interacción.
- **Logs de Consola** Trazabilidad completa del flujo de chat.

Nota: Este comando ejecuta el suite de pruebas y activa el conciliador de reportes configurado para la integración continua.