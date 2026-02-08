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
        this.dashboardTitle = page.getByRole('heading', { name: 'Dashboard' });
    }

    /**
     * Meodo para validar que estoy en el dashboard, verificando la presencia del título principal con un boolean.
     */
    async estaEnDashboard(): Promise<boolean> {
        return await this.esVisible(this.dashboardTitle);
    }
}