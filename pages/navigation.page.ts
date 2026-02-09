import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';


export class NavigationPage extends BasePage {
    
    private readonly inpuntSearch: Locator;
    private readonly adminMenu: Locator;
    private readonly pimMenu: Locator;
    private readonly leaveMenu: Locator;
    private readonly timeMenu: Locator;
    private readonly recruitmentMenu: Locator;
    private readonly myInfoMenu: Locator;
    private readonly performanceMenu: Locator;
    private readonly dashboardMenu: Locator;
    private readonly directoryMenu: Locator;
    private readonly maintenanceMenu: Locator;
    private readonly claimMenu: Locator;
    private readonly buzzMenu: Locator;

    constructor(page: Page) {
        super(page);

        this.inpuntSearch = page.locator('.oxd-main-menu-search input');
        this.adminMenu = page.locator('a[href*="admin/viewAdminModule"]');
        this.pimMenu = page.locator('a[href*="pim/viewPimModule"]');
        this.leaveMenu = page.locator('a[href*="leave/viewLeaveModule"]');
        this.timeMenu = page.locator('a[href*="time/viewTimeModule"]');
        this.recruitmentMenu = page.locator('a[href*="recruitment/viewRecruitmentModule"]');
        this.myInfoMenu = page.locator('a[href*="pim/viewMyDetails"]');
        this.performanceMenu = page.locator('a[href*="performance/viewPerformanceModule"]');
        this.dashboardMenu = page.locator('a[href*="dashboard/index"]');
        this.directoryMenu = page.locator('a[href*="directory/viewDirectory"]');
        this.maintenanceMenu = page.locator('a[href*="maintenance/viewMaintenanceModule"]');
        this.claimMenu = page.locator('a[href*="claim/viewClaimModule"]');
        this.buzzMenu = page.locator('a[href*="buzz/viewBuzz"]');
    }

    /**
     * @description Valida que todas las opciones principales del menú lateral sean visibles.
     * @returns {Promise<boolean>} True si todas existen, false si al menos una falla.
     */
    async validarMenuCompleto(): Promise<boolean> {
        const opciones = [
            this.adminMenu, this.pimMenu, this.leaveMenu, this.timeMenu, 
            this.recruitmentMenu, this.myInfoMenu, this.performanceMenu, 
            this.dashboardMenu, this.directoryMenu, this.maintenanceMenu, 
            this.claimMenu, this.buzzMenu
        ];

        try {
            await this.page.waitForSelector('.oxd-sidepanel-body', { state: 'visible', timeout: 5000 });

            const visibilidades = await Promise.all(
                opciones.map(opcion => opcion.isVisible())
            );

            if (visibilidades.includes(false)) {
                console.error("Una o más opciones del menú no son visibles.");
                return false;
            }
            
            return true;
        } catch (error) {
            console.error("El panel lateral no cargó a tiempo.");
            return false;
        }
    }

    /**
     * @description Metodo para navegar al menú Admin.
     */
    async irAAdmin () { await this.clickear(this.adminMenu); }
    async irAPIM () { await this.clickear(this.pimMenu); }
    async irALeave () { await this.clickear(this.leaveMenu); }
    async irATime () { await this.clickear(this.timeMenu); }
    async irARecruitment () { await this.clickear(this.recruitmentMenu); }
    async irAMyInfo () { await this.clickear(this.myInfoMenu); }
    async irAPerformance () { await this.clickear(this.performanceMenu); }
    async irADashboard () { await this.clickear(this.dashboardMenu); }
    async irADirectory () { await this.clickear(this.directoryMenu); }
    async irAMaintenance () { await this.clickear(this.maintenanceMenu); }
    async irAClaim () { await this.clickear(this.claimMenu); }
    async irABuzz () { await this.clickear(this.buzzMenu); }

    /**
     * @description Filtra el menú usando el buscador
     * @param texto El nombre del módulo a buscar.
     */
    async buscarNavegar(texto: string) {
        await this.escribir(this.inpuntSearch, texto);
        await this.page.waitForTimeout(500); 
    }
    
}