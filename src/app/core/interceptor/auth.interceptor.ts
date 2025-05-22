import type { HttpInterceptorFn, HttpRequest, HttpEvent } from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { TokenService } from "../services/token.service"
import { catchError, switchMap, take, throwError, Observable, BehaviorSubject, filter } from "rxjs"
import { NotificationService } from "../services/notification.service"

// BehaviorSubject para controlar el estado de refresh del token
// Esto evita múltiples solicitudes de refresh simultáneas
const isRefreshing = new BehaviorSubject<boolean>(false);
// Cola de solicitudes pendientes durante el refresh
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const tokenService = inject(TokenService)
  const notificationService = inject(NotificationService)
  const token = authService.getToken()
  
  // Ignoramos las solicitudes al endpoint de refresh token para evitar bucles infinitos
  if (req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  // Verificar la validez del token antes de enviar cualquier solicitud
  if (token && tokenService.isTokenExpired(token)) {
    console.warn('Token expirado detectado en interceptor, cerrando sesión');
    notificationService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    authService.logout();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('Token expirado'));
  }

  if (token) {
    // Si el token está cerca de expirar pero aún es válido, intentamos refrescarlo
    // sólo para endpoints relevantes (evitamos rutas públicas)
    if (tokenService.needsRefresh(token, 10) && !isPublicRoute(req.url)) {
      console.log(`Token a punto de expirar (${tokenService.getTimeToExpiration(token)}s), intentando renovar`);
      
      // Si ya estamos en proceso de refresh, esperar y usar el nuevo token
      if (isRefreshing.value) {
        return waitForTokenRefresh(req, next, token);
      }
      
      // Iniciar proceso de refresh
      isRefreshing.next(true);
      refreshTokenSubject.next(null);
      
      return authService.refreshToken().pipe(
        switchMap(newToken => {
          console.log('Token renovado con éxito');
          isRefreshing.next(false);
          refreshTokenSubject.next(newToken);
          
          // Continuar con la solicitud original pero con el token nuevo
          return next(addTokenToRequest(req, newToken));
        }),
        catchError(error => {
          isRefreshing.next(false);
          // Si falla el refresh, continuamos con el token actual
          console.warn('Error renovando token, continuando con token actual:', error);
          return next(addTokenToRequest(req, token));
        })
      );
    }
    
    // Si el token es válido y no necesita refresh, lo añadimos normalmente
    return next(addTokenToRequest(req, token)).pipe(
      catchError(error => {
        // Si recibimos un error 401 (No autorizado), el token puede haber expirado
        if (error.status === 401) {
          // Intentar refrescar el token si no estamos ya en ese proceso
          if (!isRefreshing.value) {
            console.log('Error 401, intentando refrescar token...');
            isRefreshing.next(true);
            refreshTokenSubject.next(null);
            
            return authService.refreshToken().pipe(
              switchMap(newToken => {
                console.log('Token refrescado tras error 401');
                isRefreshing.next(false);
                refreshTokenSubject.next(newToken);
                
                // Reintentar la solicitud original con el nuevo token
                return next(addTokenToRequest(req, newToken));
              }),
              catchError(refreshError => {
                console.error('Error al refrescar token después de 401:', refreshError);
                isRefreshing.next(false);
                
                // Si también falla el refresh, cerramos sesión
                notificationService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                authService.logout();
                router.navigate(['/auth/login']);
                return throwError(() => refreshError);
              })
            );
          } else {
            // Si ya estamos refrescando, esperar el resultado
            return waitForTokenRefresh(req, next, token);
          }
        }
        
        // Para otros errores, simplemente los propagamos
        return throwError(() => error);
      })
    );
  }

  // Si no hay token, simplemente dejamos pasar la solicitud
  return next(req);
};

// Función auxiliar para añadir token a una solicitud
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    headers: req.headers.set("Authorization", `Bearer ${token}`),
  });
}

// Función auxiliar para esperar a que termine un refresh de token en curso
function waitForTokenRefresh(req: HttpRequest<unknown>, next: any, originalToken: string): Observable<HttpEvent<unknown>> {
  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(newToken => {
      // Si tenemos un nuevo token, lo usamos
      if (newToken) {
        return next(addTokenToRequest(req, newToken));
      }
      // Si no, usamos el token original
      return next(addTokenToRequest(req, originalToken));
    })
  ) as Observable<HttpEvent<unknown>>;
}

// Función para verificar si una ruta es pública (no requiere autenticación)
function isPublicRoute(url: string): boolean {
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  
  // Verificar si la URL coincide con alguna ruta pública
  return publicRoutes.some(route => url.includes(route));
}
