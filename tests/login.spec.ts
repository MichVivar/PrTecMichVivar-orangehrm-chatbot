import { test, expect } from '../utils/test-base';
import loginData from '../data/login-data.json';

test.beforeEach(async ({ pm, makeStep }) => {
    await makeStep('Navegar a la página de login', async () => {
        await pm.loginPage.navegarPagina();
    });
});

/**
 * @description Suite para validar el flujo principal de acceso al sistema.
 * @tag login @smoke
 */
test.describe('Login exitoso @login', () => {

    /**
     * @description Caso de prueba: Verificación de acceso con credenciales administrativas.
     * Valida el Login hacia el Dashboard de forma exitosa, asegurando que el usuario pueda ingresar al sistema.
     */
    test('Ingresa usuario válido', async ({ pm, makeStep }) => {
        await makeStep('Ingresar usuario válido', async () => {
            await pm.loginPage.ingresaUsuario('Admin');
        });

        await makeStep('Ingresar contraseña válida', async () => {
            await pm.loginPage.ingresaPassword('admin123');
        });
        
        await makeStep('Hacer click en Login', async () => {
            await pm.loginPage.clickLogin();
        });

        await makeStep('Validar que se redirige al Dashboard', async () => {
            // Verificación visual del componente Dashboard
            const dashboardVisible = await pm.dashboardPage.estaEnDashboard();
            expect(dashboardVisible).toBe(true);
            
            // Verificación técnica de la URL
            expect(pm.urlActual).toContain('/dashboard');
        });
    });
});

/**
 * @description Suite de pruebas para validar el manejo de errores en el login.
 * Cubre escenarios de credenciales inválidas y campos requeridos.
 * @tag login
 */
test.describe('Ingresar credenciales incorrectas @login', () => {

    const msg_Required = 'Required';
    const msg_InvalidID = 'Invalid credentials';

    /**
     * @description Generación dinámica de pruebas basadas en data-driven (JSON).
     * Itera sobre cada objeto en login-data.json para ejecutar validaciones específicas.
     */
    for (const data of loginData) {
        test(`Escenario: ${data.escenario}`, async ({ pm, makeStep }) => {
            
            // Paso: Ejecución del intento de inicio de sesión con los datos actuales del loop
            await makeStep(`Intentar login con: ${data.usuario || 'vacío'} / ${data.password || 'vacío'}`, async () => {
                await pm.loginPage.iniciarSesion(data.usuario, data.password);
            });

            // Paso: Verificación de mensajes de error y seguridad de acceso
            await makeStep('Validar respuesta del sistema y bloqueo de acceso', async () => {

                if (!data.usuario && !data.password) {
                    expect(await pm.loginPage.obtenerErrorUsuario()).toBe(msg_Required);
                    expect(await pm.loginPage.obtenerErrorPassword()).toBe(msg_Required);
                } 
                else if (!data.usuario) {
                    expect(await pm.loginPage.obtenerErrorUsuario()).toBe(msg_Required);
                } 
                else if (!data.password) {
                    expect(await pm.loginPage.obtenerErrorPassword()).toBe(msg_Required);
                } 
                else {
                    expect(await pm.loginPage.obtenerErrorGlobal()).toBe(msg_InvalidID);
                }

                await makeStep('Validar que el sistema deniega el acceso', async () => {
                    const denegado = await pm.dashboardPage.estaBloqueado();
                    expect(denegado).toBe(true);
                });

                // Validación de URL para confirmar que el usuario sigue en la pantalla de login
                expect(pm.urlActual).not.toContain('/dashboard');
            });
        });
    }
});