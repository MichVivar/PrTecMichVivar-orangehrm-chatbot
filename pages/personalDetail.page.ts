import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class PersonalDetailPage extends BasePage {

    private readonly personalDetailsHeader: Locator;
    private readonly firstNameInput: Locator;
    private readonly middleNameInput: Locator;
    private readonly lastNameInput: Locator
    private readonly employeIdInput: Locator;
    private readonly otherIdInput: Locator
    private readonly driverLicenseInput: Locator;
    private readonly licenseExpiryDateInput: Locator
    private readonly nationalitySelect: Locator;
    private readonly maritalStatusSelect: Locator;
    private readonly dateOfBirthInput: Locator;
    private readonly genderMaleRadio: Locator;
    private readonly genderFemaleRadio: Locator;
    private readonly saveButton: Locator;

    
    
    constructor(page: Page) {
        super(page);
        this.personalDetailsHeader = page.locator('.orangehrm-edit-employee-content h6').first();
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.employeIdInput = page.locator('.oxd-input-group').filter({ hasText: /Employee Id/ }).locator('input');
        this.otherIdInput = page.locator('.oxd-input-group').filter({ hasText: /Other Id/ }).locator('input');
        this.driverLicenseInput = page.locator('.oxd-input-group').filter({ hasText: /Driver's License Number/ }).locator('input');
        this.licenseExpiryDateInput = page.locator('input[placeholder="yyyy-dd-mm"], input[placeholder="yyyy-mm-dd"]').first();
        this.nationalitySelect = page.locator('.oxd-select-wrapper').nth(0);
        this.maritalStatusSelect = page.locator('.oxd-select-wrapper').nth(1);
        this.dateOfBirthInput = page.locator('input[placeholder="yyyy-dd-mm"], input[placeholder="yyyy-mm-dd"]').last();
        this.genderMaleRadio = page.locator('input[type="radio"][value="1"]');
        this.genderFemaleRadio = page.locator('input[type="radio"][value="2"]');
        
        this.saveButton = page.locator('button[type="submit"]').first();
    }

    /**
     * @description Valida que el encabezado Personal Details sea visible en la página.
     * @returns {Promise<boolean>} True si el encabezado es visible, false si no lo es.
     * @throws {Error} Si ocurre un error durante la validación, se lanza una excepción con el mensaje de error.
     */
    async validarEncabezadoPersonalDetails(): Promise<boolean> {
            return await this.esVisible(this.personalDetailsHeader);
    }

    /** *
     * @description Métodos para interactuar con los campos de Personal Details
     */ 
    async escribeFirtName(value: string) {
        await this.firstNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.firstNameInput).toBeEditable();
        await this.escribir(this.firstNameInput, value);
    }
    
    async escribeMiddleName(value: string) {
        await this.escribir(this.middleNameInput, value);
    }

    async escribeLastName(value: string) {
        await this.escribir(this.lastNameInput, value);
    }

    async escribeEmployeeId(value: string) {
        await this.escribir(this.employeIdInput, value);
    }

    async escribeOtherId(value: string) {
        await this.escribir(this.otherIdInput, value);
    }

    async escribeDriverLicense(value: string) {
        await this.escribir(this.driverLicenseInput, value);
    }

    async escribeLicenseExpiryDate(value: string) {
        await this.licenseExpiryDateInput.fill(value);
    }

    async seleccionarNationality(value: string) {
        await this.clickear(this.nationalitySelect);
        await this.page.getByRole('option', { name: value }).click();
    }

    async seleccionarEstadoCivil(value: string) {
        await this.clickear(this.maritalStatusSelect);
        await this.page.getByRole('option', { name: value }).click();
    }

    async escribirFehcaNacimiento(value: string) {
        await this.dateOfBirthInput.fill(value);
    }

    async seleccionarGenero(genero: 'Male' | 'Female') {
        const radio = genero === 'Male' ? this.genderMaleRadio : this.genderFemaleRadio;
        await radio.check({ force: true });
    }

    async clickGuardar() {
        await this.clickear(this.saveButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
    
    /**
     * @description Valida que se muestre un mensaje de éxito después de guardar los detalles personales.
     * @returns {Promise<void>} No retorna ningún valor, pero lanza una excepción si el mensaje no es visible o no contiene el texto esperado.
     */
    async validarMensajeExito() {
        const toast = this.page.locator('.oxd-toast');
        await expect(toast).toBeVisible({ timeout: 8000 });
        await expect(toast).toContainText('Success');
    }

    /**
     * @description Espera a que desaparezca el spinner de carga y que el formulario de Personal Details esté listo para interactuar.
     */
    // En PersonalDetailPage.ts
    async esperarCargaDeSeccion() {
        const spinner = this.page.locator('.orangehrm-paper-container .oxd-loading-spinner-container');
        await spinner.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
        await spinner.waitFor({ state: 'detached', timeout: 15000 });
        await expect(this.firstNameInput).toBeEditable({ timeout: 5000 });
    }
}