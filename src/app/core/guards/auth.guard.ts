import { inject } from "@angular/core"
import { Router, type UrlTree } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { TokenService } from "../services/token.service"
import { Observable, map, filter, take, of, catchError, switchMap, tap } from "rxjs"

export const authGuard = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService)
  const tokenService = inject(TokenService)
  const router = inject(Router)

  console.log("Auth Guard: Verificando autenticación");
  
  // Si ya tenemos un usuario en memoria, permitimos acceso inmediato
  const token = authService.getToken();
  const currentUser = authService.getCurrentUserValue();
  
  console.log("Auth Guard: Token existe:", !!token, "Usuario en memoria:", !!currentUser);

  // Si no sabemos todavía si hay sesión o no, esperamos a que se resuelva
  if (!authService.isAuthStatusKnown()) {
    console.log('Auth Guard: Estado de autenticación aún no determinado, esperando...');
    return authService.currentUser$.pipe(
      // Solo continuamos cuando el estado de autenticación sea conocido
      filter(() => authService.isAuthStatusKnown()),
      take(1),
      switchMap(() => of(checkAuthAndNavigate()))
    );
  }
  
  // Si el estado de autenticación ya se conoce, evaluamos directamente
  return of(checkAuthAndNavigate());
  
  function checkAuthAndNavigate(): boolean | UrlTree {
    const token = authService.getToken();
    const currentUser = authService.getCurrentUserValue();
    
    // Si hay usuario en memoria y está autenticado
    if (currentUser) {
      console.log("Auth Guard: Usuario ya autenticado, permitiendo acceso");
      
      // Verificar adicionalmente que el token sea válido
      if (token && tokenService.isTokenExpired(token)) {
        console.warn("Auth Guard: Token expirado pero usuario en memoria, cerrando sesión");
        authService.logout();
        return router.createUrlTree(["/auth/login"], {
          queryParams: { returnUrl: router.routerState.snapshot.url },
        });
      }
      
      return true;
    }
    
    // Si hay token pero no usuario, intentemos obtener el usuario
    if (token && !currentUser) {
      console.log("Auth Guard: Token existe pero no hay usuario, verificando token...");
      
      // Verificar localmente si el token ha expirado
      if (tokenService.isTokenExpired(token)) {
        console.warn("Auth Guard: Token expirado localmente, redirigiendo al login");
        authService.logout(); // Limpiar token inválido
        return router.createUrlTree(["/auth/login"], {
          queryParams: { returnUrl: router.routerState.snapshot.url },
        });
      }
      
      // Si el token parece válido localmente, intentamos usarlo
      // Nota: no esperamos la respuesta aquí, el usuario será cargado en segundo plano
      // Si falla, el interceptor manejará el error y redirigirá
      console.log("Auth Guard: Token parece válido, permitiendo acceso y verificando en segundo plano");
      authService.getProfile().subscribe({
        next: user => console.log("Auth Guard: Perfil cargado en segundo plano:", user.username),
        error: err => console.error("Auth Guard: Error al cargar perfil en segundo plano:", err)
      });
      
      return true;
    }
    
    // Si no hay token ni usuario, no está autenticado
    console.log("Auth Guard: No hay token ni usuario, redirigiendo al login");
    return router.createUrlTree(["/auth/login"], {
      queryParams: { returnUrl: router.routerState.snapshot.url },
    });
  }
}
