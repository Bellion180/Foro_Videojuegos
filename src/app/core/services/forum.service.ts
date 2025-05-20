import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"
import type { Forum } from "../models/forum.model"
import type { Thread } from "../models/thread.model"
import { environment } from "../../../environments/environment"
import { delay } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forums`

  constructor(private http: HttpClient) {}

  getForums(): Observable<Forum[]> {
    // Simulamos datos para demostración
    return of([
      {
        id: 1,
        name: "Action Games",
        description: "Discuss the latest action games, share tips and strategies.",
        threadCount: 245,
        postCount: 1872,
      },
      {
        id: 2,
        name: "RPG Discussion",
        description: "For fans of role-playing games, both western and JRPGs.",
        threadCount: 189,
        postCount: 1543,
      },
      {
        id: 3,
        name: "Strategy Games",
        description: "RTS, turn-based, and all other strategy game discussions.",
        threadCount: 132,
        postCount: 987,
      },
      {
        id: 4,
        name: "Indie Games",
        description: "Discover and discuss indie game gems and upcoming releases.",
        threadCount: 201,
        postCount: 1245,
      },
      {
        id: 5,
        name: "Gaming News",
        description: "The latest news, announcements, and industry updates.",
        threadCount: 312,
        postCount: 2134,
      },
    ]).pipe(delay(500)) // Simular retraso de red
  }

  getForum(id: number): Observable<Forum> {
    // Simulamos datos para demostración
    return of({
      id: id,
      name: id === 1 ? "Action Games" : id === 2 ? "RPG Discussion" : "Gaming Forum",
      description: "A place to discuss your favorite games and gaming topics.",
      threadCount: 245,
      postCount: 1872,
    }).pipe(delay(300)) // Simular retraso de red
  }

  getThreadsByForum(forumId: number): Observable<Thread[]> {
    // Simulamos datos para demostración
    const mockThreads: Thread[] = []

    for (let i = 1; i <= 10; i++) {
      mockThreads.push({
        id: i + 100,
        title: `Thread ${i} in Forum ${forumId}`,
        content: `This is the content of thread ${i}`,
        forumId: forumId,
        author: {
          id: 1,
          username: "user" + i,
          email: "user" + i + "@example.com",
          joinDate: new Date(),
          role: "user",
        },
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
}
