import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * @class ChatbotPage
 * @extends BasePage
 * @description Clase encargada de gestionar la interacción con la documentación de Botpress y su asistente de IA.
 * Maneja la lógica de navegación y la interacción con elementos dentro de un Iframe.
 */

export class ChatbotPage extends BasePage {
    private readonly botFrame = this.page.frameLocator('iframe[title="Botpress"]');
    private readonly linkQuickstart: Locator;
    private readonly inputBusqueda: Locator;
    private readonly nombreModelo: Locator;
    private readonly ultimaRespuesta: Locator;
    private readonly btnExpandirBot : Locator;
    private readonly mensajesEnviados: Locator;


    constructor(page: Page) {
        super(page);

        this.linkQuickstart = this.page.locator('[id="/get-started/quick-start"] >> text="Quickstart"');
        this.inputBusqueda = this.botFrame.getByRole('textbox', { name: 'Message Input' });
        this.nombreModelo = this.botFrame.locator('span.model-option-name');
        this.ultimaRespuesta = this.botFrame.locator('.bpMessageBlocksBubble p, .bpMessageBlocksBubble code').filter({ hasNotText: /thinking/i });
        this.btnExpandirBot = this.page.getByRole('button', { name: 'Open bot' });
        this.mensajesEnviados = this.botFrame.locator('p.bpMessageBlocksTextText');
    }

    /**
     * @description Navega directamente a la URL de documentación de Botpress.
     */
    async navegarADocs() {
        await this.page.goto('https://botpress.com/docs');
    }

    /**
     * @description Navega a la sección 'Quickstart' mediante un clic, activando la interfaz del chatbot.
     */
    async irAlApartadoQuickstart() {
        await this.clickear(this.linkQuickstart);
    }
    
    /**
     * @description Abre la interfaz del chatbot haciendo clic en el botón de toggle.
     */
    async expandirChatBot() {
        await this.btnExpandirBot.waitFor({ state: 'visible', timeout: 15000 });
        await this.clickear(this.btnExpandirBot);
    }

    /**
     * @description Despliega el menú de modelos y extrae el nombre del modelo activo.
     */
    async obtenerIdentificadorBot() {
        const btnSelector = this.botFrame.getByRole('button', { name: 'Select model' });
        await btnSelector.click();

        const modeloActivo = this.nombreModelo.first();
        await modeloActivo.waitFor({ state: 'visible', timeout: 10000 });
        
        const nombre = await modeloActivo.textContent();
        
        await modeloActivo.click();
        
        return nombre?.trim() || "No se encontró el nombre";
    }

    /**
     * @description Envía un mensaje al chatbot utilizando el input de búsqueda dentro del iframe.
     * @param {string} mensaje - El texto que se desea enviar al asistente.
     */
    async escribirMensaje(mensaje: string) {
        await this.escribir(this.inputBusqueda, mensaje);
    }

    /**
     * @description Hace clic en el botón de enviar mensaje.
     */
    async enviarMensaje() {
        await this.page.waitForTimeout(1500);
        await this.inputBusqueda.press('Enter');
    }

    /**
     * @description Espera y captura la última respuesta emitida por el chatbot.
     */
    async validarRespuesta() {
        const ultimaBurbuja = this.ultimaRespuesta.last();

        await ultimaBurbuja.waitFor({ state: 'visible', timeout: 15000 });

        await expect(async () => {
            const contenido = await ultimaBurbuja.innerText();
            if (contenido.includes('...')) {
                throw new Error("Aún está cargando...");
            }
            expect(contenido.length).toBeGreaterThan(10);
        }).toPass({ timeout: 10000 });

        const texto = await ultimaBurbuja.innerText();
        return texto.trim();
    }

    /**
     * @description Realiza la validación del título de la página para confirmar carga correcta.
     * @example await chatbotPage.validarTituloDocs();
     */
    async validarTituloQuickstart() {
        await expect(this.page).toHaveTitle(/Quick ?start/i, { timeout: 10000 });
        
        await expect(this.page).toHaveURL(/.*quick-start/, { timeout: 10000 });
    }

    /**
     * @description Valida que el componente Iframe del chatbot sea visible en el DOM.
     */
    async validarPresenciaBot() {
        const iframeBot = this.page.locator('iframe[title="Botpress"]');
        await expect(iframeBot).toBeVisible({ timeout: 15000 });
    }

    /**
     * @description Valida que el título de la pestaña corresponda a la página principal de documentación.
     * Se utiliza para asegurar que la carga inicial del sitio fue exitosa.
     */
    async validarTituloDocs() {
        await expect(this.page).toHaveTitle(/Welcome to Botpress|Botpress Docs/, { timeout: 10000 });
    }

    /**
     * @description Obtiene el texto del último mensaje enviado por el usuario al chat.
     */
    async obtenerUltimoMensajeEnviado() {
        const ultimoEnviado = this.mensajesEnviados.last();
        await ultimoEnviado.waitFor({ state: 'visible', timeout: 10000 });
        return await ultimoEnviado.innerText();
    }

    /**
     * @description Expone el locator del input para validaciones en los tests.
     */
    get campoBusqueda() {
        return this.inputBusqueda;
    }

    /**
     * @description Verifica si un mensaje específico enviado por el usuario es visible en el chat.
     * @param mensaje El texto que esperamos encontrar.
     */
    async verificarMensajeEnviado(mensaje: string) {
        const mensajeLocalizado = this.botFrame.locator('p.bpMessageBlocksTextText').filter({ hasText: mensaje });
        
        await mensajeLocalizado.waitFor({ state: 'visible', timeout: 5000 });
        
        return await mensajeLocalizado.isVisible();
    }
}