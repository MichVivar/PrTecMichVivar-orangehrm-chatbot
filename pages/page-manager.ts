import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { DashboardPage } from './dashboard.page'; 
import { NavigationPage } from './navigation.page';
import { PersonalDetailPage } from './personalDetail.page';

/**
 * @class PageManager
 * @description Clase centralizadora (Orquestador) para gestionar todas las instancias de Page Objects.
 */
export class PageManager {

    private readonly page: Page;
    private readonly _loginPage: LoginPage;
    private readonly _dashboardPage: DashboardPage; 
    private readonly _naviegationPage: NavigationPage;
    private readonly _personalDetailPage: PersonalDetailPage;

    /**
     * Instanciamos las páginas aquí
     */
    constructor(page: Page) {
        this.page = page;
        this._loginPage = new LoginPage(this.page);
        this._dashboardPage = new DashboardPage(this.page); 
        this._naviegationPage = new NavigationPage(this.page);
        this._personalDetailPage = new PersonalDetailPage(this.page);
    }

    /**
     * @returns {LoginPage} Instancia de la página de inicio de sesión.
     */
    get loginPage(): LoginPage {
        return this._loginPage;
    }

    /**
     * @returns {DashboardPage} Instancia de la página del Dashboard.
     */
    get dashboardPage(): DashboardPage {
        return this._dashboardPage;
    }

    /**
     * @returns {NavigationPage} Instancia de la página de navegación.
     */
    get navigationPage(): NavigationPage { 
        return this._naviegationPage;
    }

    /**
     * @returns {PersonalDetailPage} Instancia de la página de detalles personales.
     */
    get personalDetailPage(): PersonalDetailPage {
        return this._personalDetailPage;
    }

    /**
     * @returns {string} La URL actual del navegador.
     */
    get urlActual(): string {
        return this.page.url();
    }
}