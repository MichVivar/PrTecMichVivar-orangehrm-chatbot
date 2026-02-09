import { test , expect } from '../utils/test-base';

/**
 * @description Suite para validar el flujo principal de acceso al sistema del ChatBot
 */
test.describe('Validar ChatBot presente en sitio web', () => {
    test('Acceder a la URL', async ({ pm , makeStep}) =>{
        await makeStep('Navegar a la página de documentación de Botpress', async () => {
            await pm.chatbotPage.navegarADocs();
        });

        await makeStep('Validar que la URL inicial y el título sean correctos', async () => {
            expect(pm.urlActual).toContain('botpress.com/docs');
            await pm.chatbotPage.validarTituloDocs(); 
        })

        await makeStep('Dirigirse a la pagina del ChaBot', async () =>{
            await pm.chatbotPage.irAlApartadoQuickstart();
        });

        await makeStep('Validar que la URL y el título sean los correctos', async () => {
            await pm.chatbotPage.validarTituloQuickstart();
        });
    
    });
});

/**
 * @description Suite para interactuar con el sistema del ChatBot
 */
test.describe('Interacciones con el ChatBot', async () =>{
    test.beforeEach(async ({ pm, makeStep }) => {
        await makeStep('Navegar a la página de documentación de Botpress', async () => {
            await pm.chatbotPage.navegarADocs();
            expect(pm.urlActual).toContain('botpress.com/docs');
            await pm.chatbotPage.validarTituloDocs();
        });
        await makeStep('Dirigirse a la pagina del ChaBot', async () =>{
            await pm.chatbotPage.irAlApartadoQuickstart();
        });
        await makeStep('Abrir el chat bot', async () => {
            await pm.chatbotPage.expandirChatBot();
        });
    });
    
    test('Encontrar el componente del bot' ,async ({ pm , makeStep}) => {
        await makeStep('Validar que la URL y el título sean los correctos', async () => {
            await pm.chatbotPage.validarTituloQuickstart();
        });

        await makeStep('Verificar que el Iframe del Chatbot sea visible', async () => {
            await pm.chatbotPage.validarPresenciaBot();
        });
    });

    test('Interactuar con el iframe y obtener identificador del bot ', async ({ pm , makeStep }) => {
        await makeStep('Verificar que el Iframe del Chatbot sea visible', async () => {
            await pm.chatbotPage.validarPresenciaBot();
        });

        await makeStep('Obtener el nombre del modelo de IA desde el chatbot', async () => {
            const nombreBot = await pm.chatbotPage.obtenerIdentificadorBot();
            test.info().annotations.push({
                type: 'Nombre del Bot Detectado',
                description: nombreBot
            });
            expect(nombreBot).not.toBeNull();
            expect(nombreBot.length).toBeGreaterThan(0);
        });
    });

    test('Ingresar y mandar un texto', async ({ pm , makeStep}) => {
        const mensajeAEnviar = 'Hola';

        await makeStep('Escribir la palabra  "Hola"', async () => {
            await pm.chatbotPage.escribirMensaje(mensajeAEnviar);
        });

        await makeStep('Enviar el mensaje escrito', async () => {
            await pm.chatbotPage.enviarMensaje();
        });
    
        await makeStep('Validar que el mensaje fue enviado', async () => {
            const esVisible = await pm.chatbotPage.verificarMensajeEnviado(mensajeAEnviar);
            console.log(`📤 ¿Mensaje "Hola" visible en chat?: ${esVisible}`);
            expect(esVisible).toBe(true)
        });
    });

    test('Recibir respuesta', async ({ pm , makeStep }) => {
        const mensajeAEnviar = 'Hola';

        await makeStep('Escribir y enviar mensaje', async () => {
            await pm.chatbotPage.escribirMensaje(mensajeAEnviar);
            await pm.chatbotPage.enviarMensaje();
            
            const esVisible = await pm.chatbotPage.verificarMensajeEnviado(mensajeAEnviar);
            console.log(`📤 ¿Mensaje "Hola" visible en chat?: ${esVisible}`);
            expect(esVisible).toBe(true)
        });

        await makeStep('Recibir respuesta y validar contenido', async () => {
            const respuesta = await pm.chatbotPage.validarRespuesta();
            
            console.log(`🤖 Respuesta final: ${respuesta}`);
            
            expect(respuesta.length).toBeGreaterThan(10);
        });
    });
});

