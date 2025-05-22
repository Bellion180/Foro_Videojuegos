/**
 * Script para probar la persistencia de sesión después de refrescar la página en Angular
 * 
 * Este script simula la interacción del usuario con la aplicación Angular y verifica
 * que la sesión se mantiene correctamente al refrescar la página.
 */

// En este archivo podemos monitorear los eventos específicos que suceden en la aplicación
// Angular para depurar problemas de persistencia de sesión

// 1. Eventos a monitorizar:
// - Carga inicial de la aplicación
// - Almacenamiento y recuperación de tokens en localStorage
// - Verificación de token al cargar la aplicación
// - Intentos de renovación automática de token
// - Eventos de visibilidad del documento

class SessionMonitor {
  constructor() {
    this.originalConsoleLog = console.log;
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    this.originalSetItem = localStorage.setItem;
    this.originalGetItem = localStorage.getItem;
    this.originalRemoveItem = localStorage.removeItem;
    
    this.setupMonitoring();
  }
  
  setupMonitoring() {
    // 1. Monitorear console.log, console.error, console.warn
    console.log = this.createLogWrapper(this.originalConsoleLog, '[LOG]');
    console.error = this.createLogWrapper(this.originalConsoleError, '[ERROR]');
    console.warn = this.createLogWrapper(this.originalConsoleWarn, '[WARN]');
    
    // 2. Monitorear localStorage
    localStorage.setItem = this.createStorageWrapper(this.originalSetItem, 'setItem');
    localStorage.getItem = this.createStorageWrapper(this.originalGetItem, 'getItem');
    localStorage.removeItem = this.createStorageWrapper(this.originalRemoveItem, 'removeItem');
    
    // 3. Monitorear eventos del ciclo de vida de la aplicación
    this.monitorLifecycleEvents();
    
    // 4. Monitorear visibilidad del documento
    this.monitorVisibility();
  }
  
  createLogWrapper(originalFn, prefix) {
    return (...args) => {
      // Filtrar mensajes relacionados con la autenticación
      const message = args[0]?.toString() || '';
      if (this.isAuthRelated(message)) {
        const timestamp = new Date().toISOString().substring(11, 23);
        originalFn.apply(console, [`${timestamp} ${prefix}`, ...args]);
      } else {
        originalFn.apply(console, args);
      }
    };
  }
  
  createStorageWrapper(originalFn, method) {
    return (...args) => {
      const key = args[0];
      const result = originalFn.apply(localStorage, args);
      
      if (this.isAuthKey(key)) {
        const timestamp = new Date().toISOString().substring(11, 23);
        const value = method === 'setItem' ? args[1].substring(0, 30) + '...' : 
                     method === 'getItem' ? result?.substring(0, 30) + '...' : '';
                     
        this.originalConsoleLog.apply(console, [
          `${timestamp} [STORAGE] ${method} - ${key} ${value ? '- ' + value : ''}`
        ]);
      }
      
      return result;
    };
  }
  
  monitorLifecycleEvents() {
    // Angular no tiene un evento de inicio de aplicación global como React
    // Pero podemos detectar cuándo se carga
    window.addEventListener('load', () => {
      this.originalConsoleLog.apply(console, [
        `${new Date().toISOString().substring(11, 23)} [APP] Aplicación cargada`
      ]);
    });
    
    // Detectar navegación
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      this.originalConsoleLog.apply(console, [
        `${new Date().toISOString().substring(11, 23)} [NAVIGATION] Navegación a ${args[2]}`
      ]);
      return originalPushState.apply(history, args);
    };
  }
  
  monitorVisibility() {
    document.addEventListener('visibilitychange', () => {
      this.originalConsoleLog.apply(console, [
        `${new Date().toISOString().substring(11, 23)} [VISIBILITY] Document ${document.visibilityState}`
      ]);
    });
    
    window.addEventListener('focus', () => {
      this.originalConsoleLog.apply(console, [
        `${new Date().toISOString().substring(11, 23)} [FOCUS] Window gained focus`
      ]);
    });
    
    window.addEventListener('blur', () => {
      this.originalConsoleLog.apply(console, [
        `${new Date().toISOString().substring(11, 23)} [BLUR] Window lost focus`
      ]);
    });
  }
  
  isAuthRelated(message) {
    const authPatterns = [
      'token', 'auth', 'login', 'sesión', 'usuario', 'perfil', 
      'expirado', 'localStorage', 'verificando', 'refrescando'
    ];
    
    return authPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }
  
  isAuthKey(key) {
    const authKeys = ['auth_token', 'refresh_token', 'current_user', 'remember_me'];
    return authKeys.includes(key);
  }
}

// Iniciar el monitor de sesión automáticamente
const sessionMonitor = new SessionMonitor();
console.log('Session Monitor iniciado - Monitorizando eventos de autenticación...');

// Comandos de prueba para ejecutar en consola:
// 
// 1. Verificar contenido actual de localStorage:
// Object.keys(localStorage).forEach(key => console.log(`${key}: ${localStorage.getItem(key)}`))
//
// 2. Simular refresh manual:
// localStorage.getItem('auth_token') ? 
//   console.log('Token encontrado en localStorage:', localStorage.getItem('auth_token').substring(0, 30) + '...') : 
//   console.log('No hay token en localStorage')
//
// 3. Verificar estado de autenticación:
// console.log('Current User:', JSON.parse(localStorage.getItem('current_user')))
