// Script para probar el endpoint de obtener perfil de usuario
const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:3000/api';
// Credenciales de prueba - ajustadas según el script create-test-user.js
const TEST_EMAIL = 'admin@example.com';
const TEST_PASSWORD = 'admin123';

async function testAuthEndpoint() {
  try {
    console.log("==========================================");
    console.log("PRUEBA DE AUTENTICACIÓN Y PERFIL DE USUARIO");
    console.log("==========================================");
    console.log(`URL base: ${API_BASE_URL}`);
    console.log(`Usuario: ${TEST_EMAIL}`);
    console.log("------------------------------------------");
    
    // Primero hacemos login para obtener un token
    console.log("\n1. Intentando iniciar sesión...");
    const loginUrl = `${API_BASE_URL}/auth/login`;
    console.log(`   URL: ${loginUrl}`);
    
    const loginResponse = await axios.post(loginUrl, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    
    console.log("\nLogin exitoso:");
    console.log("- Token:", token.substring(0, 20) + "...");
    console.log("- Usuario:", user.username);
    console.log("- ID:", user.id);
    
    // Luego probamos el endpoint de perfil con el token obtenido
    console.log("\n2. Verificando endpoint de perfil...");
    const profileUrl = `${API_BASE_URL}/users/me/profile`;
    console.log(`   URL: ${profileUrl}`);
    
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log("\nPerfil obtenido correctamente:");
    console.log(JSON.stringify(profileResponse.data, null, 2));
    
    console.log("\n==========================================");
    console.log("PRUEBA COMPLETADA EXITOSAMENTE");
    console.log("==========================================");
    
    return { success: true, token, user: profileResponse.data };
  } catch (error) {
    console.error("\n==========================================");
    console.error("ERROR EN LA PRUEBA");
    console.error("==========================================");
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Mensaje: ${JSON.stringify(error.response.data, null, 2)}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor");
      console.error(error.request);
    } else {
      console.error(`Error: ${error.message}`);
    }
    
    console.error("\nDetalles de configuración:");
    console.error(`- URL base: ${API_BASE_URL}`);
    console.error(`- Usuario: ${TEST_EMAIL}`);
    
    console.error("\n==========================================");
    
    return { success: false, error };
  }
}

// Ejecutar la prueba
testAuthEndpoint();
