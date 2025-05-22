// Este script prueba la carga de archivos para el avatar de usuario

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Función para obtener un token JWT (debes tener un usuario de prueba)
async function login() {
  console.log('Iniciando proceso de login...');
  try {
    console.log(`Realizando petición a ${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    console.log('Respuesta recibida. Status:', response.status);
    const data = await response.json();
    console.log('Datos recibidos:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    throw error;
  }
}

// Función para cargar un avatar
async function uploadAvatar(userId, token, imagePath) {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(imagePath)) {
      throw new Error(`El archivo no existe: ${imagePath}`);
    }

    // Crear un FormData y añadir el archivo
    const form = new FormData();
    form.append('avatar', fs.createReadStream(imagePath));
    form.append('username', 'testuser_updated'); // También actualizamos el nombre de usuario
    form.append('bio', 'Esta es una bio de prueba actualizada con una imagen');

    // Hacer la solicitud
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // No incluir Content-Type, FormData lo establece automáticamente con el boundary
      },
      body: form,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar el avatar');
    }

    console.log('Avatar cargado correctamente:', data);
    return data;
  } catch (error) {
    console.error('Error al cargar el avatar:', error);
    throw error;
  }
}

// Función principal
async function main() {
  try {
    // Iniciar sesión
    console.log('Iniciando sesión...');
    const { token, user } = await login();
    console.log('Sesión iniciada correctamente. ID de usuario:', user.id);

    // Ruta a una imagen de prueba
    const imagePath = path.join(__dirname, '../../public/uploads/test-avatar.png');
    
    // Si no existe el archivo de prueba, crear un mensaje
    if (!fs.existsSync(imagePath)) {
      console.log(`No se encontró la imagen de prueba en: ${imagePath}`);
      console.log('Por favor, coloca una imagen PNG en esa ubicación antes de ejecutar este script.');
      return;
    }

    // Cargar el avatar
    console.log('Cargando avatar...');
    const result = await uploadAvatar(user.id, token, imagePath);
    
    console.log('Proceso completado con éxito.');
    console.log('URL del avatar actualizado:', result.user.avatar);
  } catch (error) {
    console.error('Error durante la ejecución:', error);
  }
}

// Ejecutar el script
main();
