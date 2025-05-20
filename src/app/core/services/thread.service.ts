import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"
import { delay } from "rxjs/operators"
import type { Thread } from "../models/thread.model"
import { Post } from "../models/post.model"
import type { User } from "../models/user.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ThreadService {
  private apiUrl = `${environment.apiUrl}/threads`

  constructor(private http: HttpClient) {}

  getThreads(params: any = {}): Observable<Thread[]> {
    // Simulamos datos para demostración
    const mockThreads: Thread[] = []

    for (let i = 1; i <= 10; i++) {
      const author: User = {
        id: 1,
        username: "user" + i,
        email: "user" + i + "@example.com",
        joinDate: new Date(),
        role: "user" as const, // Usamos 'as const' para asegurar el tipo literal
      }

      mockThreads.push({
        id: i,
        title: `Thread Title ${i}`,
        content: `This is the content of thread ${i}`,
        forumId: (i % 5) + 1,
        author: author,
        createdAt: new Date(Date.now() - i * 86400000), // i days ago
        viewCount: Math.floor(Math.random() * 1000),
        replyCount: Math.floor(Math.random() * 50),
        isPinned: i === 1,
        isLocked: false,
        tags: ["gaming", "discussion"],
      })
    }

    return of(mockThreads).pipe(delay(500)) // Simular retraso de red
  }

  getThread(id: number): Observable<Thread> {
    // Simulamos datos para demostración
    const author: User = {
      id: 1,
      username: "user" + id,
      email: "user" + id + "@example.com",
      joinDate: new Date(Date.now() - 365 * 86400000), // 1 year ago
      role: "user" as const,
      postCount: 120,
      threadCount: 15,
    }

    const thread: Thread = {
      id: id,
      title: `Thread Title ${id}`,
      content: `<p>This is the content of thread ${id}. It includes some formatted text and possibly images or other media.</p><p>This is a second paragraph with more details about the topic.</p>`,
      forumId: (id % 5) + 1,
      author: author,
      createdAt: new Date(Date.now() - id * 86400000), // id days ago
      viewCount: Math.floor(Math.random() * 1000),
      replyCount: Math.floor(Math.random() * 50),
      isPinned: id === 1,
      isLocked: false,
      tags: ["gaming", "discussion"],
    }

    return of(thread).pipe(delay(300)) // Simular retraso de red
  }

  getPostsByThread(threadId: number): Observable<Post[]> {
    // Simulamos datos para demostración
    const mockPosts: Post[] = []

    for (let i = 1; i <= 5; i++) {
      const author: User = {
        id: i + 1,
        username: "replier" + i,
        email: "replier" + i + "@example.com",
        joinDate: new Date(Date.now() - (365 - i * 30) * 86400000),
        role: i === 1 ? ("moderator" as const) : ("user" as const),
        postCount: 50 + i * 10,
        threadCount: 5 + i,
      }

      mockPosts.push({
        id: i,
        content: `<p>This is reply #${i} to thread ${threadId}.</p><p>It contains some discussion points and opinions about the topic.</p>`,
        threadId: threadId,
        author: author,
        createdAt: new Date(Date.now() - (threadId + i) * 3600000), // hours ago
        isEdited: i === 2,
        likes: Math.floor(Math.random() * 20),
        isAcceptedAnswer: i === 3,
      })
    }

    return of(mockPosts).pipe(delay(500)) // Simular retraso de red
  }

  createThread(thread: Partial<Thread>): Observable<Thread> {
    // Simulamos la creación de un hilo
    const author: User = {
      id: 1,
      username: "currentUser",
      email: "currentuser@example.com",
      joinDate: new Date(),
      role: "user" as const,
    }

    const newThread: Thread = {
      id: Math.floor(Math.random() * 1000) + 100,
      title: thread.title || "New Thread",
      content: thread.content || "",
      forumId: thread.forumId || 1,
      author: author,
      createdAt: new Date(),
      viewCount: 0,
      replyCount: 0,
      isPinned: false,
      isLocked: false,
      tags: thread.tags || [],
    }

    return of(newThread).pipe(delay(800)) // Simular retraso de red
  }

  createPost(threadId: number, post: Partial<Post>): Observable<Post> {
    // Simulamos la creación de una respuesta
    const author: User = {
      id: 1,
      username: "currentUser",
      email: "currentuser@example.com",
      joinDate: new Date(),
      role: "user" as const,
    }

    const newPost: Post = {
      id: Math.floor(Math.random() * 1000) + 100,
      content: post.content || "",
      threadId: threadId,
      author: author,
      createdAt: new Date(),
      isEdited: false,
      likes: 0,
    }

    return of(newPost).pipe(delay(800)) // Simular retraso de red
  }
}
