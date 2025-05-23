const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Almacenamiento temporal para tokens de verificación (en producción, usar base de datos)
const verificationTokens = {}; // { email: { token, expiresAt } }

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // usar Gmail como servicio de correo
  auth: {
    user: process.env.EMAIL_USER, // email configurado en .env
    pass: process.env.EMAIL_PASSWORD // contraseña de la app configurada en .env
  }
});

/**
 * Realiza una verificación básica de formato y dominio de correo electrónico
 * @param {string} email - Correo electrónico a verificar
 * @returns {boolean} - Si el correo tiene un formato válido
 */
const validateEmailFormat = (email) => {
  // Expresión regular para validar formato básico de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Verificar partes del email
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  // Verificar el dominio
  const domain = parts[1];
  if (!domain.includes('.')) {
    return false;
  }

  // Verificar TLD
  const tld = domain.split('.').pop();
  if (tld.length < 2) {
    return false;
  }

  return true;
};

/**
 * Genera un token de verificación para un email
 * @param {string} email - Email para el que generar el token
 * @returns {string} - Token generado
 */
const generateVerificationToken = (email) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas de validez
  
  verificationTokens[email] = {
    token,
    expiresAt
  };
  
  return token;
};

/**
 * Verifica si un token de verificación es válido
 * @param {string} email - Email asociado al token
 * @param {string} token - Token a verificar
 * @returns {boolean} - Si el token es válido
 */
const verifyToken = (email, token) => {
  const storedData = verificationTokens[email];
  
  if (!storedData) {
    return false;
  }
  
  if (storedData.token !== token) {
    return false;
  }
  
  if (new Date() > storedData.expiresAt) {
    delete verificationTokens[email];
    return false;
  }
  
  // Eliminar el token después de verificado
  delete verificationTokens[email];
  return true;
};

/**
 * Envía un email de verificación con un enlace para confirmar
 * @param {string} email - Email del destinatario
 * @param {string} username - Nombre de usuario
 * @returns {Promise} - Promesa que se resuelve cuando el email se envía
 */
const sendVerificationEmail = async (email, username) => {
  try {
    const token = generateVerificationToken(email);
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica tu correo electrónico - GamersHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a1a2e;">Verificación de correo electrónico</h1>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Hola <strong>${username}</strong>,</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Gracias por registrarte en GamersHub. Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #ff9f1c; color: #1a1a2e; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Verificar mi correo electrónico</a>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">O copia y pega el siguiente enlace en tu navegador:</p>
          <p style="font-size: 14px; color: #666; word-break: break-all;">${verificationLink}</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Este enlace expirará en 24 horas.</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Si no has solicitado esta verificación, puedes ignorar este correo.</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Saludos,<br>El equipo de GamersHub</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de verificación enviado:', info.response);
    return { success: true, token };
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    throw error;
  }
};

/**
 * Envía un correo electrónico de bienvenida al nuevo usuario
 * @param {string} email - Email del destinatario
 * @param {string} username - Nombre de usuario del destinatario
 * @returns {Promise} - Promesa que se resuelve cuando el email se envía
 */
  sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '¡Bienvenido a GamersHub!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a1a2e;">¡Bienvenido a GamersHub!</h1>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Hola <strong>${username}</strong>,</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">¡Gracias por unirte a nuestra comunidad de gamers! En GamersHub encontrarás:</p>
          
          <ul style="font-size: 16px; color: #333; line-height: 1.5;">
            <li>Foros de discusión sobre tus juegos favoritos</li>
            <li>Noticias y actualizaciones del mundo gaming</li>
            <li>Comunidad de jugadores apasionados</li>
            <li>Eventos y torneos especiales</li>
          </ul>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Tu cuenta ha sido verificada y activada exitosamente. Ya puedes comenzar a participar en nuestros foros.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/auth/login" style="background-color: #ff9f1c; color: #1a1a2e; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Iniciar Sesión</a>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos a través de nuestra sección de soporte.</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">¡Bienvenido a la comunidad!</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.5;">El equipo de GamersHub</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de bienvenida enviado:', info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    throw error;
  }
};

module.exports = {
  validateEmailFormat,
  generateVerificationToken,
  verifyToken,
  sendVerificationEmail,
  sendWelcomeEmail
};
