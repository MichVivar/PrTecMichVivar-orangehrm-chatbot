import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * @class DashboardPage
 * @description Mapeo la página principal
 */

export class DashboardPage extends BasePage {

    private readonly dashboardTitle: Locator;

    constructor(page: Page) {
        super(page);
        //Locator Dashboard (Inmune al idioma)
        this.dashboardTitle = page.locator('.oxd-topbar-header-title h6');
    }

    /**
     * Meodo para validar que estoy en el dashboard, verificando la presencia del título principal con un boolean.
     */
    async estaEnDashboard(): Promise<boolean> {
        return await this.esVisible(this.dashboardTitle);
    }

    /**
     * Meodo para validar que no se puede acceder al dashboard, verificando la ausencia del título principal con un boolean.
     */
    async estaBloqueado(): Promise<boolean> {
        const visible = await this.esVisible(this.dashboardTitle, 1500); 
        return !visible;
    }

}