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
    const token = localStorage.getItem(this.tokenKey)
    if (token) {
      this.getProfile().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user)
        },
        error: () => {
          localStorage.removeItem(this.tokenKey)
        },
      })
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token)
        this.currentUserSubject.next(response.user)
      }),
      map((response) => response.user),
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error en el inicio de sesión"))
      }),
    )
  }

  register(userData: any): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
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
    localStorage.removeItem(this.tokenKey)
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
    return localStorage.getItem(this.tokenKey)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }
}
