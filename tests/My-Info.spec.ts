import { test, expect } from '../utils/test-base';
import userData from '../data/personal-data.json';

test.beforeEach(async ({ pm, makeStep }) => {
    await makeStep('Navegar a la página de login', async () => {
        await pm.loginPage.navegarPagina();
    });
    await makeStep('Iniciar sesión con credenciales válidas', async () => {
        await pm.loginPage.ingresaUsuario('Admin');
        await pm.loginPage.ingresaPassword('admin123');
        await pm.loginPage.clickLogin();
    });
});

/**
 * @description Suite para validar el acceso a la sección My Info y la visualización del encabezado Personal Details.
 * @tag login @smoke
 */
test.describe('Acceso a My Info @myinfo', () => {

    /**
     * @description Caso de prueba: Acceso a My Info y validación del encabezado Personal Details.
     */
    test('Accede a My Info y valida el encabezado Personal Details', async ({ pm, makeStep }) => {
        await makeStep('Valida que el menú lateral esté completo', async () => {
            const memnuValido = await pm.navigationPage.validarMenuCompleto();
            expect(memnuValido).toBe(true);
        });

        await makeStep('Filtrar el menú lateral buscando "My Info"', async () => {
            await pm.navigationPage.buscarNavegar('My Info');
        });

        await makeStep('Hacer clic en la opción filtrada de My Info', async () => {
            await pm.navigationPage.irAMyInfo();
        });

        await makeStep('Validar que se muestra el encabezado Personal Details', async () => {
            const encabezado = await pm.personalDetailPage.validarEncabezadoPersonalDetails();
            expect(encabezado).toBe(true);
        });
    });
});

test.describe('Llenado de información de Personal Details @myinfo', () => {

    test.beforeEach(async ({ pm, makeStep }) => {
        await makeStep('Navegar a la sección My Info', async () => {
            await pm.navigationPage.irAMyInfo();
            const encabezado = await pm.personalDetailPage.validarEncabezadoPersonalDetails();
            expect(encabezado).toBe(true);
            await pm.personalDetailPage.esperarCargaDeSeccion();
        });
    });

    /**
     * @description Caso de prueba: Llenado y guardado de la información en Personal Details.
     * Valida que el usuario pueda ingresar datos en los campos correspondientes y guardar la información correctamente.
     */

    test('Agregar y guardar la información de Personal Details', async ({ pm, makeStep }) => {
        const dt = userData.datosEmpleado.personalDetails;
        const genero = dt.gender as "Male" | "Female";

        await makeStep('Llenar el apartasdo Employee Full Name', async () => {
            await pm.personalDetailPage.escribeFirtName(dt.firstName);
            await pm.personalDetailPage.escribeMiddleName(dt.middleName);
            await pm.personalDetailPage.escribeLastName(dt.lastName);
        });

        await makeStep('Llenar el apartado Employee Id', async () => {
            await pm.personalDetailPage.escribeEmployeeId(dt.employeeId);
        });
        
        await makeStep('Llenar el apartado Other Id', async () => {
            await pm.personalDetailPage.escribeOtherId(dt.otherId);
        });

        await makeStep('Llenar el apartado Drivers License Number', async () => {
            await pm.personalDetailPage.escribeDriverLicense(dt.driverLicense);
        });

        await makeStep('Llenar el apartado License Expiry Date', async () => {
            await pm.personalDetailPage.escribeLicenseExpiryDate(dt.licenseExpiry);
        });

        await makeStep('Seleccionar Nacionalidad', async () => {
            await pm.personalDetailPage.seleccionarNationality(dt.nationality);
        });

        await makeStep('Seleccionar Estado Civil', async () => {
            await pm.personalDetailPage.seleccionarEstadoCivil(dt.maritalStatus);
        });

        await makeStep('Escribir Fecha de Nacimiento', async () => {
            await pm.personalDetailPage.escribirFehcaNacimiento(dt.birthDate);
        });

        await makeStep('Seleccionar Género', async () => {
            await pm.personalDetailPage.seleccionarGenero(genero);
        });

        await makeStep('Hacer clic en el botón Guardar', async () => {
            await pm.personalDetailPage.clickGuardar();
        });

        await makeStep('Validar que se muestra un mensaje de éxito', async () => {
            await pm.personalDetailPage.validarMensajeExito();
        });
    });

    test('Agregar y guardar la información de Custom Fields', async ({ pm, makeStep }) => {
        const dt = userData.datosEmpleado.customFields;
        
        await makeStep('Llenar el campo de Blood Type', async () => {
            await pm.personalDetailPage.seleccionarBloodType(dt.bloodType);
        });

        await makeStep('Llenar campo de Test Field', async () => {
            await pm.personalDetailPage.escribirTestField(dt.testField);
        });

        await makeStep('Hacer clic en el botón Guardar', async () => {
            await pm.personalDetailPage.clickGuardarCustomFields();
        });

        await makeStep('Validar que se muestra un mensaje de éxito', async () => {
            await pm.personalDetailPage.validarMensajeExito();
        });
    });

    test('Acciones en la sección de Attachments', async ({ pm, makeStep }) => {
        const adjunto = userData.datosEmpleado.attachments;

        await makeStep('Cargar un archivo adjunto', async () => {
            await pm.personalDetailPage.agregarAdjunto(adjunto.fileName, adjunto.comment);
            await pm.personalDetailPage.validarMensajeExito();
        });

        await makeStep('Editar el comentario de un archivo adjunto', async () => {
            await pm.personalDetailPage.editarComentario(adjunto.updatedComment);
            await pm.personalDetailPage.validarMensajeExito();
        });

        await makeStep('Descargar el archivo adjunto', async () => {
            await pm.personalDetailPage.descargarPrimerAdjunto();
        });

        await makeStep('Eliminar el archivo adjunto', async () => {
            await pm.personalDetailPage.eliminarAdjunto();
            await pm.personalDetailPage.validarMensajeExito();
        });
    });
});