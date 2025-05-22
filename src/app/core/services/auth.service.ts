import { Injectable } from "@angular/core"
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { BehaviorSubject, type Observable, throwError, of, timer } from "rxjs"
import { Router } from "@angular/router"
import type { User } from "../models/user.model"
import { catchError, map, tap, switchMap, retry, filter, finalize, takeUntil } from "rxjs/operators"
import { environment } from "../../../environments/environment"
import { TokenService } from "./token.service"

@Injectable({
  providedIn: "root",
})
export class AuthService {  
  private apiUrl = `${environment.apiUrl}/auth`; // For login/register
  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined)
  public currentUser$ = this.currentUserSubject.asObservable()
  private tokenKey = "auth_token"
  private userKey = "current_user"
  private refreshTokenKey = "refresh_token"
  private tokenCheckInterval: any = null;
  private readonly TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
  private sessionRestoreAttempted = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    console.log("AuthService initialized");
    this.initializeAuth();
  }
  
  /**
   * Inicializa el proceso de autenticación
   * Carga el usuario desde localStorage y configura verificaciones periódicas
   */
  private initializeAuth() {
    console.log("Initializing authentication...");
    
    // Cargar usuario desde localStorage
    this.loadUserFromStorage();
    
    // Configurar verificación periódica del token
    this.setupTokenCheck();
    
    // Añadir evento para cuando la ventana recupere el foco
    // Esto ayuda a verificar el token cuando el usuario vuelve a la aplicación
    window.addEventListener('focus', () => {
      console.log("Window regained focus, checking authentication status");
      this.checkAuthStatus();
    });
  }  

  /**
   * Configura la verificación periódica del token
   */
  private setupTokenCheck() {
    // Limpiar intervalo anterior si existe
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    
    // Configurar nuevo intervalo
    this.tokenCheckInterval = setInterval(() => {
      this.checkAuthStatus();
    }, this.TOKEN_CHECK_INTERVAL);
  }
  
  /**
   * Verifica el estado de autenticación actual
   * Si el token ha expirado, cierra la sesión
   * Si el token está a punto de expirar, intenta renovarlo
   */
  private checkAuthStatus() {
    const token = this.getToken();
    if (!token) {
      return;
    }
    
    // Verificar si el token ha expirado
    if (this.tokenService.isTokenExpired(token)) {
      console.log("Token expirado localmente, cerrando sesión");
      this.logout();
      return;
    }
    
    // Verificar si el token está a punto de expirar y necesita renovación
    if (this.tokenService.needsRefresh(token)) {
      console.log("Token a punto de expirar, intentando renovarlo");
      this.refreshToken().subscribe({
        next: (newToken) => {
          console.log("Token renovado exitosamente");
        },
        error: (err) => {
          console.error("Error al renovar token:", err);
          // Si falla la renovación, verificamos el estado de la sesión con el servidor
          this.verifySession();
        }
      });
      return;
    }
    
    // Si el token parece válido, verificamos con el servidor ocasionalmente
    const shouldVerifyWithServer = Math.random() < 0.2; // 20% de probabilidad
    if (shouldVerifyWithServer) {
      console.log("Verificando sesión con servidor (verificación aleatoria)");
      this.verifySession();
    }
  }
  
  /**
   * Verifica la sesión actual con el servidor
   */
  private verifySession() {
    console.log("Verificando sesión con el servidor...");
    this.getProfile().subscribe({
      next: (user) => {
        console.log("Sesión verificada correctamente:", user.username);
        // Actualizar datos del usuario en localStorage
        const storage = this.getStorageType();
        storage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      },
      error: (err) => {
        console.error("Error al verificar sesión:", err);
        if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) {
          console.warn("Sesión inválida según el servidor, cerrando sesión");
          this.logout();
        }
      }
    });
  }

  private loadUserFromStorage() {
    const storage = this.getStorageType();
    const token = storage.getItem(this.tokenKey);
    const savedUser = storage.getItem(this.userKey);

    console.log("Cargando usuario desde almacenamiento. Token existe:", !!token);

    if (token) {
      try {
        // Primero, verificar si el token ha expirado localmente
        if (this.tokenService.isTokenExpired(token)) {
          console.log("Token expirado según verificación local");
          this.logout();
          return;
        }
        
        // Si tenemos un usuario guardado en localStorage, usarlo inmediatamente
        // para evitar la pantalla de carga mientras se verifica con el servidor
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            console.log("Usuario cargado desde localStorage:", user.username);
            this.currentUserSubject.next(user);
            this.sessionRestoreAttempted = true;
          } catch (e) {
            console.error('Error parsing saved user data', e);
          }
        }
        
        // Verificar token con el servidor con reintentos
        this.verifyTokenWithRetry(token, 3);
      } catch (e) {
        console.error('Error al verificar token', e);
        this.logout();
      }
    } else {
      // No hay token, así que el usuario no está autenticado
      console.log("No hay token en localStorage, usuario no autenticado");
      storage.removeItem(this.userKey);
      this.currentUserSubject.next(null);
      this.sessionRestoreAttempted = true;
    }
  }
  
  // Método para verificar token con reintentos
  private verifyTokenWithRetry(token: string, maxRetries: number, currentRetry: number = 0) {
    console.log(`Verificando token con el servidor (intento ${currentRetry + 1}/${maxRetries})...`);
    
    // Retardo exponencial: 1s, 2s, 4s, etc.
    const delay = currentRetry > 0 ? Math.pow(2, currentRetry - 1) * 1000 : 0;
    
    setTimeout(() => {
      this.getProfile().subscribe({
        next: (user) => {
          console.log("Perfil obtenido correctamente del servidor:", user.username);
          // Guardar el usuario actualizado en localStorage
          const storage = this.getStorageType();
          storage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.sessionRestoreAttempted = true;
        },
        error: (err) => {
          console.error('Error al verificar el perfil:', err);
          
          // Intentar de nuevo si no hemos alcanzado el máximo de reintentos
          if (currentRetry < maxRetries - 1) {
            console.log(`Reintentando verificación del token...`);
            this.verifyTokenWithRetry(token, maxRetries, currentRetry + 1);
          } else {
            console.error('Máximo de reintentos alcanzado. Cerrando sesión.');
            // Si el token es inválido después de todos los reintentos, limpiamos todo
            const storage = this.getStorageType();
            storage.removeItem(this.tokenKey);
            storage.removeItem(this.userKey);
            storage.removeItem(this.refreshTokenKey);
            localStorage.removeItem('remember_me');
            this.currentUserSubject.next(null);
            this.sessionRestoreAttempted = true;
          }
        },
      });
    }, delay);
  }
  
  private getStorageType() {
    return localStorage;
  }
  
  login(email: string, password: string, rememberMe: boolean = false): Observable<User> {
    const storage = this.getStorageType();
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    }
    
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
      tap((response) => {
        console.log("Login exitoso, guardando token en localStorage");
        
        // Verificar que tenemos un token válido
        if (!response.token) {
          console.error('Respuesta de login no contiene token');
          throw new Error('Respuesta de login inválida');
        }
        
        // Almacenar el token en storage
        storage.setItem(this.tokenKey, response.token);
        
        // Si la respuesta incluye un refresh token, guardarlo también
        if (response.refreshToken) {
          storage.setItem(this.refreshTokenKey, response.refreshToken);
        }
        
        // Verificar que tenemos datos de usuario
        if (!response.user) {
          console.error('Respuesta de login no contiene datos de usuario');
          throw new Error('Respuesta de login inválida');
        }
        
        // Almacenar datos del usuario en localStorage
        storage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.sessionRestoreAttempted = true;
        
        // Configurar alerta de expiración del token
        try {
          // Usar el TokenService para decodificar el token
          const decoded = this.tokenService.decodeToken(response.token);
          if (decoded && decoded.exp) {
            const timeToExpiration = this.tokenService.getTimeToExpiration(response.token);
            console.log(`Token expira en ${timeToExpiration} segundos (${Math.round(timeToExpiration/60/60*10)/10} horas)`);
            this.setupTokenExpirationAlert(decoded.exp * 1000);
          } else {
            console.warn('No se pudo determinar la expiración del token');
          }
        } catch (e) {
          console.error('Error al procesar el token JWT', e);
        }
      }),
      map((response) => response.user),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || "Error en el inicio de sesión"))
      }),
    )
  }
    
  private setupTokenExpirationAlert(expirationTime: number): void {
    const currentTime = Date.now();
    const timeToExpiry = expirationTime - currentTime;
    
    if (timeToExpiry <= 0) {
      console.warn('Token ya expirado al cargarlo');
      this.logout();
      return;
    }
    
    // Configurar alerta 5 minutos antes de que expire el token
    const alertTime = timeToExpiry - (5 * 60 * 1000);
    
    if (alertTime > 0) {
      console.log(`Configurando alerta de expiración de token para ${new Date(currentTime + alertTime).toLocaleTimeString()}`);
      setTimeout(() => {
        console.warn('Token a punto de expirar, intentando refrescar');
        
        // Intentar refrescar el token automáticamente
        this.refreshToken().subscribe({
          next: (newToken) => {
            console.log('Token refrescado automáticamente');
          },
          error: (err) => {
            console.error('Error al refrescar token:', err);
            // Notificar al usuario que su sesión está por expirar
            console.log('Sesión a punto de expirar. El usuario debe iniciar sesión nuevamente.');
          }
        });
      }, alertTime);
    }
    
    // Programar cierre de sesión automático cuando expire el token
    const logoutTime = timeToExpiry + (60 * 1000); // 1 minuto extra de gracia
    
    console.log(`Programando cierre de sesión automático para ${new Date(currentTime + logoutTime).toLocaleTimeString()}`);
    setTimeout(() => {
      const token = this.getToken();
      if (token && this.tokenService.isTokenExpired(token)) {
        console.warn('Token expirado, cerrando sesión automáticamente');
        this.logout();
      }
    }, logoutTime);
  }
  
  register(userData: any): Observable<User> {
    const storage = this.getStorageType();
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { headers }).pipe(
      tap((response) => {
        storage.setItem(this.tokenKey, response.token);
        
        // Si la respuesta incluye un refresh token, guardarlo también
        if (response.refreshToken) {
          storage.setItem(this.refreshTokenKey, response.refreshToken);
        }
        
        storage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.sessionRestoreAttempted = true;
      }),
      map((response) => response.user),
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error en el registro"))
      }),
    )
  }
  
  logout(): void {
    const storage = this.getStorageType();
    storage.removeItem(this.tokenKey);
    storage.removeItem(this.userKey);
    storage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('remember_me');
    this.currentUserSubject.next(null);
    this.sessionRestoreAttempted = true;
    
    // Limpiar el intervalo de verificación de token
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
    
    this.router.navigate(["/"]);
  }  
  
  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me/profile`).pipe(
      retry(3), // Reintenta hasta 3 veces en caso de error de red
      catchError((error) => {
        console.error('Error al obtener perfil:', error);
        return throwError(() => new Error(error.error?.message || "Error al obtener el perfil"));
      })
    );
  }
  
  /**
   * Método para refrescar el token de autenticación
   * @returns Observable con el nuevo token
   */
  refreshToken(): Observable<string> {
    const storage = this.getStorageType();
    const token = storage.getItem(this.tokenKey);
    const refreshToken = storage.getItem(this.refreshTokenKey);
    
    if (!token) {
      return throwError(() => new Error("No hay token para refrescar"));
    }
    
    // Si hay endpoint de refresh token, llamarlo
    if (refreshToken) {
      console.log("Intentando refrescar token con el servidor...");
      
      return this.http.post<any>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
        tap(response => {
          if (response.token) {
            // Guardar el nuevo token
            storage.setItem(this.tokenKey, response.token);
            console.log("Token refrescado exitosamente");
            
            // Si también nos dan un nuevo refresh token, actualizarlo
            if (response.refreshToken) {
              storage.setItem(this.refreshTokenKey, response.refreshToken);
            }
            
            // Si la respuesta incluye datos de usuario actualizados
            if (response.user) {
              storage.setItem(this.userKey, JSON.stringify(response.user));
              this.currentUserSubject.next(response.user);
            }
          } else {
            throw new Error("La respuesta no incluye un nuevo token");
          }
        }),
        map(response => response.token),
        catchError(error => {
          console.error("Error al refrescar token:", error);
          // Si el error es de autenticación, cerrar sesión
          if (error.status === 401 || error.status === 403) {
            this.logout();
          }
          return throwError(() => new Error("Error al refrescar token"));
        })
      );
    } else {
      // Si no hay refresh token o endpoint, simplemente devolvemos el token actual
      // En este caso, la renovación dependerá del guard y el interceptor
      console.log("No hay refresh token disponible, devolviendo token actual");
      return of(token);
    }
  }

  getToken(): string | null {
    const storage = this.getStorageType();
    return storage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && this.currentUserSubject.value !== undefined;
  }

  isAuthStatusKnown(): boolean {
    return this.currentUserSubject.value !== undefined || this.sessionRestoreAttempted;
  }

  getCurrentUserValue(): User | null | undefined {
    return this.currentUserSubject.value;
  }
  
  updateProfile(userId: number, userData: Partial<User>, avatar?: File): Observable<User> {
    const storage = this.getStorageType();
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key as keyof Partial<User>]?.toString() || '');
    });
    if (avatar) {
      formData.append('avatar', avatar);
    }
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}`, formData).pipe(
      tap(response => {
        const currentUser = this.getCurrentUserValue();
        if (currentUser) {
          // Si la respuesta contiene un objeto user, usarlo, de lo contrario usar la respuesta directamente
          const userData = response.user || response;
          const updatedUser = { ...currentUser, ...userData };
          storage.setItem(this.userKey, JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      }),
      map(response => response.user || response),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Error al actualizar el perfil'));
      })
    );
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const data = { currentPassword, newPassword };
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}/password`, data).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Error al cambiar la contraseña'));
      })
    );
  }
}
