import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import type { Thread } from "../models/thread.model"
import type { Post } from "../models/post.model"
import { environment } from "../../../environments/environment"
import { catchError, tap } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class ThreadService {
  private apiUrl = `${environment.apiUrl}/threads`

  constructor(private http: HttpClient) {}

  getThreads(params: any = {}): Observable<any> {
    // Construir la URL con los parámetros de consulta
    let url = this.apiUrl
    const queryParams = new URLSearchParams()

    if (params.sort) queryParams.append("sort", params.sort)
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.forumId) queryParams.append("forumId", params.forumId.toString())

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }

    console.log("Solicitando hilos al backend con URL:", url)

    return this.http.get<any>(url).pipe(
      tap((response) => console.log("Hilos recibidos:", response)),
      catchError((error) => {
        console.error("Error al obtener los hilos:", error)
        return throwError(() => new Error(error.error?.message || "Error al obtener los hilos"))
      }),
    )
  }
  getThread(id: number): Observable<Thread> {
    return this.http.get<Thread>(`${this.apiUrl}/${id}`).pipe(
      tap(thread => console.log("Thread obtenido del servidor:", thread)),
      catchError((error) => {
        console.error("Error al obtener el thread:", error);
        return throwError(() => new Error(error.error?.message || "Error al obtener el hilo"))
      }),
    )
  }
  getPostsByThread(threadId: number): Observable<Post[]> {
    console.log(`Solicitando posts para el thread ${threadId} con URL: ${environment.apiUrl}/posts/thread/${threadId}`);
    return this.http.get<Post[]>(`${environment.apiUrl}/posts/thread/${threadId}`).pipe(
      tap(posts => console.log("Posts obtenidos del servidor:", posts)),
      catchError((error) => {
        console.error("Error al obtener los posts:", error);
        return throwError(() => new Error(error.error?.message || "Error al obtener las publicaciones del hilo"))
      }),
    )
  }

  createThread(thread: Partial<Thread>): Observable<Thread> {
    return this.http.post<Thread>(this.apiUrl, thread).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al crear el hilo"))
      }),
    )
  }

  updateThread(id: number, thread: Partial<Thread>): Observable<Thread> {
    return this.http.put<Thread>(`${this.apiUrl}/${id}`, thread).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al actualizar el hilo"))
      }),
    )
  }

  deleteThread(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al eliminar el hilo"))
      }),
    )
  }

  createPost(threadId: number, post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(`${environment.apiUrl}/posts/thread/${threadId}`, post).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al crear la publicación"))
      }),
    )
  }

  togglePinThread(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/pin`, {}).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al fijar/desfijar el hilo"))
      }),
    )
  }

  toggleLockThread(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/lock`, {}).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message || "Error al bloquear/desbloquear el hilo"))
      }),
    )
  }
}
