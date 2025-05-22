/**
 * Script para probar el sistema de autenticación y refresh token
 * Este script simula:
 * 1. Login de usuario
 * 2. Verificación de token (profile)
 * 3. Refresh de token
 * 4. Verificación del nuevo token
 */

const axios = require('axios');

// Configuración
const API_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
};

// Variables para almacenar tokens
let authToken = null;
let refreshToken = null;

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Imprime un mensaje con formato y color
 */
function log(message, color = colors.reset, isError = false) {
  const outputFunc = isError ? console.error : console.log;
  outputFunc(`${color}${message}${colors.reset}`);
}

/**
 * Realiza el login de usuario
 */
async function login() {
  try {
    log('1. Iniciando sesión...', colors.cyan);
    const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    
    authToken = response.data.token;
    refreshToken = response.data.refreshToken;
    
    log(`Login exitoso: ${response.data.user.username}`, colors.green);
    log(`Token JWT: ${authToken.substring(0, 20)}...`, colors.yellow);
    log(`Refresh Token: ${refreshToken.substring(0, 20)}...`, colors.yellow);
    
    return true;
  } catch (error) {
    log(`Error en login: ${error.response?.data?.message || error.message}`, colors.red, true);
    return false;
  }
}

/**
 * Verifica el token obteniendo el perfil
 */
async function verifyToken() {
  try {
    log('\n2. Verificando token (obteniendo perfil)...', colors.cyan);
    const response = await axios.get(`${API_URL}/users/me/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log(`Perfil obtenido: ${response.data.username}`, colors.green);
    log(`ID: ${response.data.id}`, colors.green);
    log(`Email: ${response.data.email}`, colors.green);
    
    return true;
  } catch (error) {
    log(`Error al verificar token: ${error.response?.data?.message || error.message}`, colors.red, true);
    return false;
  }
}

/**
 * Refresca el token usando el refresh token
 */
async function refreshTokenTest() {
  try {
    log('\n3. Refrescando token...', colors.cyan);
    const response = await axios.post(`${API_URL}/auth/refresh-token`, 
      { refreshToken }, 
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const oldToken = authToken;
    authToken = response.data.token;
    refreshToken = response.data.refreshToken;
    
    log('Token refrescado exitosamente', colors.green);
    log(`Token anterior: ${oldToken.substring(0, 20)}...`, colors.yellow);
    log(`Nuevo token: ${authToken.substring(0, 20)}...`, colors.yellow);
    log(`Nuevo refresh token: ${refreshToken.substring(0, 20)}...`, colors.yellow);
    
    return true;
  } catch (error) {
    log(`Error al refrescar token: ${error.response?.data?.message || error.message}`, colors.red, true);
    return false;
  }
}

/**
 * Verifica el nuevo token obteniendo el perfil
 */
async function verifyNewToken() {
  try {
    log('\n4. Verificando nuevo token...', colors.cyan);
    const response = await axios.get(`${API_URL}/users/me/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log(`Perfil obtenido con el nuevo token: ${response.data.username}`, colors.green);
    log('Sesión mantenida correctamente', colors.green);
    
    return true;
  } catch (error) {
    log(`Error al verificar nuevo token: ${error.response?.data?.message || error.message}`, colors.red, true);
    return false;
  }
}

/**
 * Función principal para ejecutar todas las pruebas
 */
async function runTests() {
  log('=== PRUEBA DE AUTENTICACIÓN Y REFRESH TOKEN ===\n', colors.magenta);
  
  const loginSuccess = await login();
  if (!loginSuccess) {
    log('\nNo se pudo continuar con las pruebas debido a un error en el login', colors.red, true);
    return;
  }
  
  const verifySuccess = await verifyToken();
  if (!verifySuccess) {
    log('\nNo se pudo verificar el token', colors.red, true);
  }
  
  const refreshSuccess = await refreshTokenTest();
  if (!refreshSuccess) {
    log('\nNo se pudo refrescar el token', colors.red, true);
    return;
  }
  
  const verifyNewSuccess = await verifyNewToken();
  if (!verifyNewSuccess) {
    log('\nNo se pudo verificar el nuevo token', colors.red, true);
    return;
  }
  
  log('\n=== TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE ===', colors.magenta);
}

// Ejecutar pruebas
runTests().catch(error => {
  log(`Error inesperado: ${error.message}`, colors.red, true);
  console.error(error);
});
