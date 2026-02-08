import { test, expect } from '../utils/test-base';
import loginData from '../data/login-data.json';

test.describe('Ingresar credenciales incorrectas @login', () => {

    const msg_Required = 'Required';
    const msg_InvalidID = 'Invalid credentials';

    test.beforeEach(async ({ pm, makeStep }) => {
        await makeStep('Navegar a la página de login', async () => {
            await pm.loginPage.navegarPagina();
        });

    });

    for (const data of loginData) {
        test(`Escenario: ${data.escenario}`, async ({ pm, makeStep }) => {
            
            await makeStep(`Intentar login con: ${data.usuario || 'vacío'} / ${data.password || 'vacío'}`, async () => {
                await pm.loginPage.iniciarSesion(data.usuario, data.password);
            });

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

                const dashboardVisible = await pm.dashboardPage.estaEnDashboard();
                expect(dashboardVisible).toBe(false); 

                expect(pm.urlActual).not.toContain('/dashboard');
            });
        });
    }
});