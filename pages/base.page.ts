import { Page, Locator, expect } from '@playwright/test';

/**
 * @class BasePage
 * @description Clase base que encapsula las acciones comunes a todas las páginas de la aplicación. 
 * Proporciona métodos genéricos para interactuar con elementos, navegar y validar estados. 
 * Todas las clases de Page Object deben extender de esta clase para heredar 
 * métodos de interacción estables.
 */
export class BasePage {
    protected readonly page: Page;
    protected readonly timeoutGeneral: number = 10000;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Escribe texto en un elemento, asegurando que esté visible antes de escribir.
     * @param locator Localizador del elemento.
     * @param texto Texto a ingresar.
     */
    async escribir(locator: Locator, texto: string) {
        await locator.waitFor({ state: 'visible', timeout: this.timeoutGeneral });
        await expect(locator).toBeEditable({timeout: this.timeoutGeneral});
        await locator.fill(texto);
    }

    /**
     * Realiza un click en un elemento tras verificar que es accionable.
     * @param locator Localizador del elemento.
     */
    async clickear(locator: Locator) {
        await locator.waitFor({ state: 'visible', timeout: this.timeoutGeneral });
        await locator.click();
    }

    /**
     * Verifica si un elemento es visible. 
     * Espera a que el elemento aparezca antes de retornar el resultado.
     * @param locator Localizador del elemento.
     * @param timeout Tiempo máximo de espera.
     */
    async esVisible(locator: Locator, timeout: number = this.timeoutGeneral): Promise<boolean> {
        try {
            if (await locator.isVisible()) return true;
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Retorna la URL actual del navegador.
     */
    obtenerURL(): string {
        return this.page.url();
    }

    /**
     * Obtiene el texto interno de un elemento.
     * @param locator Localizador del elemento.
     * @returns {Promise<string>} El contenido de texto del elemento.
     */
    async obtenerTexto(locator: Locator): Promise<string> {
        await locator.waitFor({ state: 'visible', timeout: this.timeoutGeneral });
        return await locator.innerText();
    }

    /**
     * Selecciona una opción de una lista desplegable (Select).
     * @param locator Localizador del select.
     * @param valor Valor o etiqueta de la opción a seleccionar.
     */
    async seleccionarOpcion(locator: Locator, valor: string) {
        await locator.waitFor({ state: 'visible', timeout: this.timeoutGeneral });
        await locator.selectOption(valor);
    }

    /**
     * Navega a una URL específica y espera a que la red esté inactiva.
     * @param url Ruta o URL completa.
     */
    async navegarA(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * @description Método para esperar a que desaparezca un spinner de carga.
      * Espera a que el elemento del spinner deje de ser visible o desaparezca del DOM.
     */
    async esperarQueDesaparezcaElCargando() {
        const spinner = this.page.locator('.oxd-loading-spinner');
        await spinner.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {
            console.log('El spinner no apareció o ya se había ido.');
        });
    }
}