import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ChatbotPage extends BasePage {
    private readonly botFrame = this.page.frameLocator('iframe[title="Botpress"]');
    private readonly linkQuickstart: Locator;
    private readonly inputBusqueda: Locator;
    private readonly nombreModelo: Locator;
    private readonly ultimaRespuesta: Locator;
    private readonly botonEnviar: Locator;

    constructor(page: Page) {
        super(page);
        this.linkQuickstart = this.page.getByText('Quickstart', { exact: true });
        this.inputBusqueda = this.botFrame.locator('input.ask-ai-input');
        this.botonEnviar = this.botFrame.locator('button.ask-ai-send-button');
        this.nombreModelo = this.botFrame.locator('span.model-option-name');
        this.ultimaRespuesta = this.botFrame.locator('code.bpMessageBlocksTextCode').last();
    }

    async navegarADocs() {
        await this.page.goto('https://botpress.com/docs');
    }

    async irAlApartadoQuickstart() {
        //await this.linkQuickstart.click();
        await this.clickear(this.linkQuickstart);
    }

    async obtenerIdentificadorBot() {
        await this.nombreModelo.waitFor({ state: 'visible' });
        return await this.nombreModelo.innerText();
    }

    async chatear(mensaje: string) {
        //await this.inputBusqueda.fill(mensaje);
        await this.escribir(this.inputBusqueda, mensaje);
        await this.clickear(this.botonEnviar);
    }

    async validarRespuesta() {
        await this.ultimaRespuesta.waitFor({ state: 'visible', timeout: 15000 });
        return await this.ultimaRespuesta.innerText();
    }
}