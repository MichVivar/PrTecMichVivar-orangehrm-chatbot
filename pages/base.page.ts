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

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Escribe texto en un elemento, asegurando que esté visible antes de escribir.
     * @param locator Localizador del elemento.
     * @param texto Texto a ingresar.
     */
    async escribir(locator: Locator, texto: string) {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.fill(texto);
    }

    /**
     * Realiza un click en un elemento tras verificar que es accionable.
     * @param locator Localizador del elemento.
     */
    async clickear(locator: Locator) {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.click();
    }

    /**
     * Verifica si un elemento es visible actualmente sin lanzar error si no lo está.
     * @param locator Localizador del elemento.
     * @param timeout Tiempo máximo de espera opcional.
     */
    async esVisible(locator: Locator): Promise<boolean> {
        try {
            return await locator.isVisible({ timeout: 500 });
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
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        return await locator.innerText();
    }

    /**
     * Selecciona una opción de una lista desplegable (Select).
     * @param locator Localizador del select.
     * @param valor Valor o etiqueta de la opción a seleccionar.
     */
    async seleccionarOpcion(locator: Locator, valor: string) {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
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
}