import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { Router } from "@angular/router"
import { User } from "../models/user.model"
import { delay, tap } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class AuthService {
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
    const token = localStorage.getItem(this.tokenKey)
    if (token) {
      try {
        // En una aplicación real, validarías el token con el servidor
        const userData = this.parseJwt(token)
        this.currentUserSubject.next(userData)
      } catch (error) {
        localStorage.removeItem(this.tokenKey)
      }
    }
  }

  private parseJwt(token: string): any {
    try {
      // Parseo simple de JWT (para propósitos de demostración)
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error("Error parsing JWT", e)
      return null
    }
  }

  login(email: string, password: string): Observable<User> {
    // En una aplicación real, esto sería una llamada a la API
    // Simulamos una respuesta exitosa para demostración
    const mockUser: User = {
      id: 1,
      username: "testuser",
      email: email,
      avatar: "/assets/images/default-avatar.png",
      bio: "This is a test user account",
      joinDate: new Date(),
      role: "user",
      postCount: 5,
      threadCount: 2,
    }

    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.8kNxHKlYNHJXFEPVLjDOgu1kCwLNBSWgH8YQwXKzAbs"

    return of(mockUser).pipe(
      delay(1000), // Simular retraso de red
      tap(() => {
        localStorage.setItem(this.tokenKey, mockToken)
        this.currentUserSubject.next(mockUser)
      }),
    )
  }

  register(userData: any): Observable<User> {
    // En una aplicación real, esto sería una llamada a la API
    // Simulamos una respuesta exitosa para demostración
    const mockUser: User = {
      id: 1,
      username: userData.username,
      email: userData.email,
      joinDate: new Date(),
      role: "user",
    }

    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.8kNxHKlYNHJXFEPVLjDOgu1kCwLNBSWgH8YQwXKzAbs"

    return of(mockUser).pipe(
      delay(1000), // Simular retraso de red
      tap(() => {
        localStorage.setItem(this.tokenKey, mockToken)
        this.currentUserSubject.next(mockUser)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
    this.currentUserSubject.next(null)
    this.router.navigate(["/"])
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }
}
