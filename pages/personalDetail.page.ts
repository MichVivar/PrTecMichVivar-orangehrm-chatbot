import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import path from 'path';

/**
 * @class PersonalDetailPage
 * @description Modela la página de MyInfo y metodos de interacción
 */

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
    private readonly bloodTypeSelect: Locator;
    private readonly testFieldInput: Locator;
    private readonly customFieldsSaveButton: Locator;
    private readonly attachmentsSection: Locator;
    private readonly addAttachmentButton: Locator;
    private readonly fileInput: Locator;
    private readonly commentTextArea: Locator;
    private readonly saveAttachmentButton: Locator;
    private readonly firstRowEditButton: Locator;
    private readonly firstRowDownloadButton: Locator;
    private readonly firstRowDeleteButton: Locator;
    private readonly confirmDeleteButton: Locator;

    
    constructor(page: Page) {
        super(page);

        //Botones y campos de Personal Details
        this.personalDetailsHeader = page.getByRole('heading', { name: 'Personal Details' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.employeIdInput = page.locator('div.oxd-input-group:has-text("Employee Id") input');
        this.otherIdInput = page.locator('div.oxd-input-group:has-text("Other Id") input');
        this.driverLicenseInput = page.locator('div.oxd-input-group:has-text("Driver\'s License Number") input');
        this.licenseExpiryDateInput = page.locator('div.oxd-input-group:has-text("License Expiry Date") input');
        this.nationalitySelect = page.locator('div.oxd-input-group:has-text("Nationality") .oxd-select-text');
        this.maritalStatusSelect = page.locator('div.oxd-input-group:has-text("Marital Status") .oxd-select-text');
        this.dateOfBirthInput = page.locator('div.oxd-input-group:has-text("Date of Birth") input');
        this.genderMaleRadio = page.getByRole('radio', { name: 'Male', exact: true });
        this.genderFemaleRadio = page.getByRole('radio', { name: 'Female', exact: true });
        this.saveButton = page.locator('button[type="submit"]').first();

        //Botones y campos para Custom Fields 
        this.bloodTypeSelect = page.locator('div.orangehrm-custom-fields').locator('.oxd-select-wrapper');
        this.testFieldInput = page.locator('div.orangehrm-custom-fields').locator('input').last(); 
        this.customFieldsSaveButton = page.locator('div.orangehrm-custom-fields').locator('button[type="submit"]');

        this.attachmentsSection = page.locator('div.orangehrm-attachment');
    
        // Botones de acción principal
        this.addAttachmentButton = this.attachmentsSection.getByRole('button', { name: 'Add' });
        this.fileInput = page.locator('input[type="file"]');
        this.commentTextArea = this.attachmentsSection.locator('textarea');
        this.saveAttachmentButton = this.attachmentsSection.locator('button[type="submit"]');

        // Botones de la tabla (Iconos)
        this.firstRowEditButton = this.attachmentsSection.locator('.bi-pencil-fill').first();
        this.firstRowDownloadButton = this.attachmentsSection.locator('.bi-download').first();
        this.firstRowDeleteButton = this.attachmentsSection.locator('.bi-trash').first();
        
        // El modal de confirmación de eliminación tiene un botón con el texto "Yes, Delete"
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });

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
        await this.escribir(this.licenseExpiryDateInput, value);
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
        await this.escribir(this.dateOfBirthInput, value);
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
        const spinner = this.page.locator('.oxd-loading-spinner').first();
        await spinner.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
        await spinner.waitFor({ state: 'detached', timeout: 30000 }).catch(() => {
            console.log("El spinner tardó demasiado, intentaré continuar...");
        });

        await expect(this.firstNameInput).toBeVisible({ timeout: 10000 });
    }

    /**
     * @description Selecciona el tipo de sangre.
     */
    async seleccionarBloodType(tipo: string) {
        await this.clickear(this.bloodTypeSelect);
        await this.page.getByRole('option', { name: tipo }).click();
    }

    /**
     * @description Escribe en el campo de TestField.
     */
    async escribirTestField(valor: string) {
        await this.escribir(this.testFieldInput, valor);
    }

    /**
     * @description Guarda específicamente la sección de Custom Fields.
     */
    async clickGuardarCustomFields() {
        await this.clickear(this.customFieldsSaveButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    /**
     * @description Sube un archivo en la sección de Attachments.
     */
    async agregarAdjunto(nombreArchivo: string, comentario: string) {
        await this.attachmentsSection.scrollIntoViewIfNeeded();
        await this.clickear(this.addAttachmentButton);
        
        const filePath = path.resolve(__dirname, '../utils/fixtures/' + nombreArchivo);

        await this.fileInput.setInputFiles(filePath);
        await this.escribir(this.commentTextArea, comentario);
        await expect(this.saveAttachmentButton).toBeEnabled({ timeout: 5000 });
        await this.clickear(this.saveAttachmentButton);
        await this.addAttachmentButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    /**
     * @description Maneja la descarga de un archivo.
     */
    async descargarPrimerAdjunto() {
        await this.attachmentsSection.scrollIntoViewIfNeeded();
        const downloadPromise = this.page.waitForEvent('download');
        await this.clickear(this.firstRowDownloadButton);
        const download = await downloadPromise;

        const fileName = download.suggestedFilename();
        await download.saveAs(path.join('./test-results/descargas/', fileName));
        
        return fileName;
    }

    /**
     * @description Elimina el primer adjunto de la lista.
     */
    async eliminarAdjunto() {
        await this.attachmentsSection.scrollIntoViewIfNeeded();
        await this.clickear(this.firstRowDeleteButton);
        await this.clickear(this.confirmDeleteButton);
    }

    /**
     * @description Edita el comentario del primer adjunto de la lista.
     * @param nuevoComentario El nuevo texto para el comentario.
     */
    async editarComentario (nuevoComentario: string) {
        await this.attachmentsSection.scrollIntoViewIfNeeded();
        await this.clickear(this.firstRowEditButton);
        await this.commentTextArea.waitFor({ state: 'visible', timeout: 5000 });
        await this.escribir(this.commentTextArea, nuevoComentario);
        await this.clickear(this.saveAttachmentButton);
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
}