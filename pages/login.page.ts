import {Page, Locator} from '@playwright/test';
import { BasePage } from './base.page';

/**
 * @class LoginPage
 * @description Modela la página de inicio de sesión de OrangeHRM extendiendo de BasePage para heredar métodos de interacción comunes.
 */

export class LoginPage extends BasePage {

    private readonly userInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly warningCredInvalidas: Locator;
    private readonly warningCampoReqUser: Locator;
    private readonly warningCampoReqPw: Locator;

    constructor(page: Page) {
        super(page);
        
        this.userInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.warningCredInvalidas = page.locator('.oxd-alert-content-text')
        this.warningCampoReqUser = page.locator('div.oxd-input-group', { has: page.locator('input[name="username"]') })
                        .locator('.oxd-input-field-error-message');
        this.warningCampoReqPw = page.locator('div.oxd-input-group', { has: page.locator('input[name="password"]') })
                        .locator('.oxd-input-field-error-message');
    }

    /**
     * Carga la página inicial y espera a que el input de usuario sea visible.
     */
    async navegarPagina() {
        await this.navegarA('/');
        await this.userInput.waitFor({ state: 'visible' });
    }

    /**
     * Ejecuta el flujo de inicio de sesión. 
     */
    async iniciarSesion(user: string, password: string) {
        if (user) await this.escribir(this.userInput, user);
        if (password) await this.escribir(this.passwordInput, password);
        await this.clickear(this.loginButton);
    }

    // Médodos para validar mensajes de error específicos en la página de login
    async obtenerErrorGlobal() { 
        return await this.obtenerTexto(this.warningCredInvalidas); 
    }
    async obtenerErrorUsuario() { 
        return await this.obtenerTexto(this.warningCampoReqUser); 
    }
    async obtenerErrorPassword() { 
        return await this.obtenerTexto(this.warningCampoReqPw); 
    }

    async ingresaUsuario(user: string) {
        if (user) await this.escribir(this.userInput, user);
    }

    async ingresaPassword(password: string) {
        if (password) await this.escribir(this.passwordInput, password);
    }

    async clickLogin() {
        await this.clickear(this.loginButton);
    }
}
