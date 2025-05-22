# Solución a Problemas de Persistencia de Sesión en Angular

## Cambios Implementados

### 1. Mejoras en el Servicio de Token (`token.service.ts`)
- Implementado decodificación local de tokens JWT
- Añadida verificación de expiración de token con periodo de gracia
- Agregada función para calcular tiempo restante de validez del token
- Añadida función `needsRefresh()` para determinar si un token necesita renovación

### 2. Mejoras en el Servicio de Autenticación (`auth.service.ts`)
- Implementado sistema de almacenamiento persistente de usuario en localStorage
- Añadido soporte para refresh tokens
- Verificación automática de token al iniciar la aplicación
- Verificación periódica de validez del token cada 5 minutos
- Implementada restauración de sesión con reintentos
- Renovación automática de tokens antes de que expiren

### 3. Mejoras en el Interceptor HTTP (`auth.interceptor.ts`)
- Verificación de token antes de cada solicitud HTTP
- Soporte para renovación automática de tokens
- Gestión centralizada de errores 401 (No autorizado)
- Cola de solicitudes durante proceso de renovación de token
- Evita múltiples renovaciones de token simultáneas

### 4. Mejoras en el AuthGuard (`auth.guard.ts`)
- Verificación mejorada del estado de autenticación
- Soporte para reconexión automática con token válido
- Protección contra tokens expirados

### 5. Mejoras en el Componente Principal (`app.component.ts`)
- Verificación de sesión al iniciar la aplicación
- Verificación de sesión al volver a la aplicación después de cambiar de pestaña
- Verificación de sesión al recuperar conexión de red

### 6. Implementación de Refresh Token en Backend
- Nuevo endpoint `/auth/refresh-token` para renovar tokens
- Generación de refresh tokens en login/register
- Almacén de refresh tokens en el servidor
- Validación de refresh tokens

## Guía de Pruebas

### Paso 1: Iniciar Backend
```bash
cd backend
npm run dev
```

### Paso 2: Iniciar Frontend
```bash
npm start
```

### Paso 3: Probar Funcionalidades

#### 3.1 Probar Refresh Token (Backend)
```bash
cd backend
npm run test-refresh-token
```

#### 3.2 Verificar Persistencia de Sesión (Frontend)
1. Iniciar sesión en la aplicación
2. Refrescar la página (F5)
3. Verificar que la sesión se mantiene
4. Abrir la consola del navegador para observar los logs del monitor de sesión

#### 3.3 Verificar Renovación Automática de Token
1. Iniciar sesión
2. Esperar a que se acerque el tiempo de expiración del token (puedes reducir el tiempo de expiración en el backend para pruebas)
3. Observar en la consola que el token se renueva automáticamente
4. Verificar que la sesión se mantiene activa

#### 3.4 Verificar Cierre de Sesión Automático
1. Iniciar sesión
2. Modificar manualmente el token en localStorage para que sea inválido
3. Realizar una acción en la aplicación
4. Verificar que se detecta el token inválido y se cierra la sesión

## Monitoreo de Sesión

Se ha implementado un monitor de sesión (`session-monitor.js`) que se carga automáticamente en entornos de desarrollo.
Este monitor registra todos los eventos relacionados con la autenticación y permite depurar problemas de sesión.

Para ver los eventos, abre la consola del navegador después de iniciar sesión.
