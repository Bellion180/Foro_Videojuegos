import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = "auth_token";

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      console.log('Token encontrado en localStorage, obteniendo perfil de usuario');
      this.getProfile().subscribe({
        next: (user) => {
          console.log('Perfil de usuario cargado correctamente:', user);
          this.currentUserSubject.next(user);
        },
        error: (err) => {
          console.error('Error al cargar el perfil de usuario:', err);
          localStorage.removeItem(this.tokenKey);
        },
      });
    } else {
      console.log('No se encontró token en localStorage');
    }
  }

  login(email: string, password: string): Observable<User> {
    console.log(`Intentando iniciar sesión con email: ${email}`);
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        console.log('Respuesta de login:', response);
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        console.error('Error de login:', error);
        if (error.status === 401) {
          return throwError(() => new Error("Email o contraseña incorrectos"));
        } else if (error.status === 0) {
          return throwError(() => new Error("No se pudo conectar al servidor. Verifica tu conexión a internet."));
        }
        return throwError(() => new Error(error.error?.message || "Error en el inicio de sesión"));
      }),
    );
  }

  register(userData: any): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }),
      map((response) => response.user),
      catchError((error) => {
        return throwError(() => new Error(error.error?.message || "Error en el registro"));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(["/"]);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => console.log('Perfil de usuario obtenido:', user)),
      catchError((error) => {
        console.error('Error al obtener el perfil:', error);
        // Si hay error de autenticación, eliminamos el token
        if (error.status === 401) {
          localStorage.removeItem(this.tokenKey);
          this.currentUserSubject.next(null);
        }
        return throwError(() => new Error(error.error?.message || "Error al obtener el perfil"));
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const currentUser = this.currentUserSubject.value;
    console.log('Verificando login - Token:', !!token, 'Usuario:', !!currentUser);
    return !!token && !!currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  verifyToken(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/verify-token`).pipe(
      map(() => true),
      catchError(() => {
        // Si hay un error, limpiamos la sesión
        this.logout();
        return of(false);
      }),
    );
  }
}