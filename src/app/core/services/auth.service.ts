import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, throwError } from "rxjs"
import { Router } from "@angular/router"
import type { User } from "../models/user.model"
import { catchError, map, tap } from "rxjs/operators"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private tokenKey = "auth_token"

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromStorage()
  }
  private loadUserFromStorage() {
    const storage = this.getStorageType();
    const token = storage.getItem(this.tokenKey)
    if (token) {
      this.getProfile().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user)
        },
        error: () => {
          storage.removeItem(this.tokenKey)
        },
      })
    }
  }
  private getStorageType() {
    // Check if we should use session storage or local storage
    const shouldRemember = localStorage.getItem('remember_me') === 'true';
    return shouldRemember ? localStorage : sessionStorage;
  }
  login(email: string, password: string, rememberMe: boolean = false): Observable<User> {
    // Store remember me preference
    localStorage.setItem('remember_me', rememberMe.toString());
    
    const storage = rememberMe ? localStorage : sessionStorage;
    
    const headers = { 'Content-Type': 'application/json' };
    
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
      tap((response) => {
        storage.setItem(this.tokenKey, response.token)
        this.currentUserSubject.next(response.user)
        
        // If we have a token, decode it to get expiration time
        if (response.token) {
          try {
            const payload = JSON.parse(atob(response.token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            
            // Set timeout to notify app before token expires
            this.setupTokenExpirationAlert(expirationTime);
          } catch (e) {
            console.error('Error parsing JWT token', e);
          }
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
    
    // If token is already expired, logout
    if (timeToExpiry <= 0) {
      this.logout();
      return;
    }
    
    // Alert user 5 minutes before expiration
    const alertTime = timeToExpiry - (5 * 60 * 1000);
    
    if (alertTime > 0) {
      setTimeout(() => {
        // You could emit an event here to show a refresh token dialog
        console.log('Token will expire soon. User should refresh their session.');
      }, alertTime);
    }
  }
  register(userData: any): Observable<User> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { headers }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token)
        this.currentUserSubject.next(response.user)
      }),
      map((response) => response.user),
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error en el registro"))
      }),
    )
  }
  logout(): void {
    const storage = this.getStorageType();
    storage.removeItem(this.tokenKey)
    localStorage.removeItem('remember_me')
    this.currentUserSubject.next(null)
    this.router.navigate(["/"])
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al obtener el perfil"))
      }),
    )
  }

  getToken(): string | null {
    const storage = this.getStorageType();
    return storage.getItem(this.tokenKey)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  updateProfile(userId: number, userData: Partial<User>, avatar?: File): Observable<User> {
    const formData = new FormData();
    
    // Add user data fields
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key as keyof Partial<User>]?.toString() || '');
    });
    
    // Add avatar if provided
    if (avatar) {
      formData.append('avatar', avatar);
    }
    
    return this.http.put<any>(`${environment.apiUrl}/users/${userId}`, formData).pipe(
      tap(response => {
        // Update the current user with the new data
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.user };
          this.currentUserSubject.next(updatedUser);
        }
      }),
      map(response => response.user),
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
