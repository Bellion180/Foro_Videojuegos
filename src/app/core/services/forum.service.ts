import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import type { Forum } from "../models/forum.model"
import type { Thread } from "../models/thread.model"
import { environment } from "../../../environments/environment"
import { catchError, tap } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forums`

  constructor(private http: HttpClient) {}

  getForums(): Observable<Forum[]> {
    console.log("Solicitando foros al backend...")
    return this.http.get<Forum[]>(this.apiUrl).pipe(
      tap((forums) => console.log("Foros recibidos:", forums)),
      catchError((error) => {
        console.error("Error al obtener los foros:", error)
        return throwError(() => new Error(error.error?.message || "Error al obtener los foros"))
      }),
    )
  }

  getForum(id: number): Observable<Forum> {
    return this.http.get<Forum>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al obtener el foro"))
      }),
    )
  }

  getThreadsByForum(forumId: number): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${environment.apiUrl}/threads?forumId=${forumId}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al obtener los hilos del foro"))
      }),
    )
  }

  createForum(forum: Partial<Forum>): Observable<Forum> {
    return this.http.post<Forum>(this.apiUrl, forum).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al crear el foro"))
      }),
    )
  }

  updateForum(id: number, forum: Partial<Forum>): Observable<Forum> {
    return this.http.put<Forum>(`${this.apiUrl}/${id}`, forum).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al actualizar el foro"))
      }),
    )
  }

  deleteForum(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al eliminar el foro"))
      }),
    )
  }
}
