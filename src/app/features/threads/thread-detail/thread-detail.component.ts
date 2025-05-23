import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ThreadService } from "../../../core/services/thread.service"
import { AuthService } from "../../../core/services/auth.service"
import { NotificationService } from "../../../core/services/notification.service"
import { Thread } from "../../../core/models/thread.model"
import { Post } from "../../../core/models/post.model"
import { User } from "../../../core/models/user.model"
import { filter, Subscription } from "rxjs"

@Component({
  selector: "app-thread-detail",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="thread-detail-container">
      @if (thread) {
        <header class="thread-header">
          <div class="thread-title">
            <h1>{{ thread.title }}</h1>
            <div class="thread-meta">
              <span>Iniciado por {{ thread.author.username }}</span>
              <span>{{ thread.createdAt | date }}</span>
              <span>en <a [routerLink]="['/forums', thread.forumId]">Nombre del Foro</a></span>
            </div>
          </div>
        </header>

        <div class="posts-container">
          <!-- Original post -->
          <div class="post original-post">
            <div class="post-sidebar">
              <div class="user-avatar">
                <img [src]="thread.author.avatar || '/assets/images/default-avatar.png'" alt="Avatar del usuario">
              </div>
              <div class="user-info">
                <div class="username">{{ thread.author.username }}</div>
                <div class="user-role">{{ thread.author.role }}</div>
                <div class="join-date">Se unió el {{ thread.author.joinDate | date:'mediumDate' }}</div>
                <div class="post-count">{{ thread.author.postCount || 0 }} mensajes</div>
              </div>
            </div>
            <div class="post-content">
              <div class="post-body" [innerHTML]="thread.content"></div>
              <div class="post-footer">
                <div class="post-date">{{ thread.createdAt | date:'medium' }}</div>
                <div class="post-actions">
                  <!-- <button class="action-btn">Like</button>
                  <button class="action-btn">Quote</button>
                  <button class="action-btn">Report</button> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Replies -->
          @if (posts && posts.length > 0) {
            @for (post of posts; track post.id) {
              <div class="post reply" [class.accepted-answer]="post.isAcceptedAnswer">
                @if (post.isAcceptedAnswer) {
                  <div class="accepted-badge">Respuesta Aceptada</div>
                }
                <div class="post-sidebar">
                  <div class="user-avatar">
                    <img [src]="post.author.avatar || '/assets/images/default-avatar.png'" alt="Avatar del usuario">
                  </div>
                  <div class="user-info">
                    <div class="username">{{ post.author.username }}</div>
                    <div class="user-role">{{ post.author.role }}</div>
                    <div class="join-date">Se unió el {{ post.author.joinDate | date:'mediumDate' }}</div>
                    <div class="post-count">{{ post.author.postCount || 0 }} mensajes</div>
                  </div>
                </div>
                <div class="post-content">
                  <div class="post-body" [innerHTML]="post.content"></div>
                  <div class="post-footer">
                    <div class="post-date">
                      {{ post.createdAt | date:'medium' }}
                      @if (post.isEdited) {
                        <span class="edited-indicator">(editado)</span>
                      }
                    </div>
                    <div class="post-actions">
                      <!-- <button class="action-btn">Like</button>
                      <button class="action-btn">Quote</button>
                      <button class="action-btn">Report</button> -->
                    </div>
                  </div>
                </div>
              </div>
            }
          } @else {
            <div class="no-replies">
              <p>No hay respuestas todavía. ¡Sé el primero en responder!</p>
            </div>
          }
        </div>

        @if (authService.isLoggedIn()) {
          <div class="reply-form">
            <h3>Publica una Respuesta</h3>
            <textarea 
              placeholder="Escribe tu respuesta aquí..." 
              [(ngModel)]="replyContent" 
              rows="6"
              [disabled]="isSubmitting"
            ></textarea>
            <div class="form-actions">
              <button 
                class="btn secondary" 
                [disabled]="isSubmitting"
                (click)="replyContent = ''"
              >
                Cancelar
              </button>
              <button 
                class="btn primary" 
                (click)="submitReply()"
                [disabled]="!replyContent.trim() || isSubmitting"
              >
                {{ isSubmitting ? 'Enviando...' : 'Publicar Respuesta' }}
              </button>
            </div>
          </div>
        } @else {
          <div class="login-prompt">
            <p>Por favor <a routerLink="/auth/login" [queryParams]="{returnUrl: currentUrl}">inicia sesión</a> para publicar una respuesta.</p>
          </div>
        }
      } @else {
        <div class="loading">Cargando hilo...</div>
      }
    </div>
  `,
  styles: [`
    .thread-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .thread-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .thread-title h1 {
      font-size: 1.8rem;
      margin: 0 0 0.5rem;
      color: #1a1a2e;
    }
    .thread-meta {
      display: flex;
      gap: 1rem;
      color: #666;
      font-size: 0.9rem;
      flex-wrap: wrap;
    }
    .thread-meta a {
      color: #0072b1;
      text-decoration: none;
      transition: color 0.2s;
    }
    .thread-meta a:hover {
      color: #005380;
      text-decoration: underline;
    }
    .posts-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .post {
      display: flex;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: relative;
      transition: transform 0.2s;
    }
    .post:hover {
      transform: translateY(-2px);
    }
    .original-post {
      border-left: 4px solid #ff9f1c;
    }
    .accepted-answer {
      border-left: 4px solid #10b981;
    }
    .accepted-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: #10b981;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .post-sidebar {
      width: 200px;
      padding: 1.5rem;
      background-color: #f0f0f0;
      border-radius: 8px 0 0 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1rem;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .user-info {
      width: 100%;
    }
    .username {
      font-weight: bold;
      margin-bottom: 0.25rem;
      color: #1a1a2e;
    }
    .user-role {
      color: #0072b1;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      padding: 0.2rem 0.5rem;
      background-color: rgba(0,114,177,0.1);
      border-radius: 4px;
      display: inline-block;
    }
    .join-date, .post-count {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 0.25rem;
    }
    .post-content {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }
    .post-body {
      flex: 1;
      line-height: 1.6;
      color: #333;
    }
    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }
    .post-date {
      font-size: 0.9rem;
      color: #666;
    }
    .edited-indicator {
      font-style: italic;
      margin-left: 0.5rem;
      color: #666;
    }
    .post-actions {
      display: flex;
      gap: 0.5rem;
    }
    .action-btn {
      background: none;
      border: none;
      color: #0072b1;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .action-btn:hover {
      background-color: #e6f7ff;
      color: #005380;
    }
    .reply-form {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .reply-form h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1a1a2e;
      font-size: 1.2rem;
    }
    .reply-form textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      margin-bottom: 1rem;
      min-height: 120px;
      font-family: inherit;
      font-size: inherit;
      transition: border-color 0.2s;
    }
    .reply-form textarea:focus {
      outline: none;
      border-color: #0072b1;
    }
    .reply-form textarea:disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .primary {
      background-color: #0072b1;
      color: white;
    }
    .primary:hover:not(:disabled) {
      background-color: #005380;
    }
    .secondary {
      background-color: #f0f0f0;
      color: #333;
    }
    .secondary:hover:not(:disabled) {
      background-color: #e0e0e0;
    }
    .login-prompt {
      text-align: center;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-top: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .login-prompt a {
      color: #0072b1;
      text-decoration: none;
      font-weight: 500;
    }
    .login-prompt a:hover {
      text-decoration: underline;
    }
    .loading {
      text-align: center;
      padding: 3rem 0;
      color: #666;
    }
    .no-replies {
      text-align: center;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin: 1rem 0;
      color: #666;
    }
    @media (max-width: 768px) {
      .post {
        flex-direction: column;
      }
      .post-sidebar {
        width: 100%;
        border-radius: 8px 8px 0 0;
      }
      .user-avatar {
        width: 60px;
        height: 60px;
      }
      .thread-header {
        flex-direction: column;
        gap: 1rem;
      }
      .form-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      .btn {
        width: 100%;
      }
    }
  `],
})
export class ThreadDetailComponent implements OnInit, OnDestroy {
  thread: Thread | null = null;
  posts: Post[] = [];
  replyContent = "";
  currentUrl = "";
  isSubmitting = false;
  currentUser$ = null as any;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private notificationService: NotificationService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
    this.currentUrl = window.location.pathname;
    
    const routeSub = this.route.paramMap.subscribe((params) => {
      const threadId = Number(params.get("id"));
      if (threadId) {
        this.loadThread(threadId);
        this.loadPosts(threadId);
      }
    });
    
    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadThread(id: number): void {
    const threadSub = this.threadService.getThread(id).subscribe({
      next: (thread) => {
        this.thread = thread;
      },
      error: (err) => {
        this.notificationService.error("Error al cargar el hilo: " + err.message);
      }
    });
    
    this.subscriptions.add(threadSub);
  }

  loadPosts(threadId: number): void {
    const postsSub = this.threadService.getPostsByThread(threadId).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        this.notificationService.error("Error al cargar las respuestas: " + err.message);
      }
    });
    
    this.subscriptions.add(postsSub);
  }

  submitReply(): void {
    if (!this.thread || !this.replyContent.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    const newPost: Partial<Post> = {
      content: this.replyContent.trim(),
      threadId: this.thread.id,
    };

    // Primero verificamos que tengamos el usuario actual
    const submitSub = this.currentUser$.pipe(
      filter((user): user is User => user !== null && user !== undefined)
    ).subscribe((currentUser: User) => {
      const createPostSub = this.threadService.createPost(this.thread!.id, newPost).subscribe({
        next: (post) => {
          // Solo actualizamos el estado local después de un guardado exitoso
          if (this.thread) {
            this.thread.replyCount = (this.thread.replyCount || 0) + 1;
          }

          // Añadir el nuevo post con todos los datos necesarios
          const newPost: Post = {
            ...post,
            author: currentUser,
            createdAt: new Date(),
            isEdited: false,
            content: this.replyContent.trim(),
            id: post.id,
            threadId: this.thread!.id
          };

          this.posts = [...this.posts, newPost];

          // Limpiar el formulario y mostrar notificación
          this.replyContent = "";
          this.isSubmitting = false;
          this.notificationService.success("¡Tu respuesta ha sido publicada correctamente!");

          // Hacer scroll hasta el nuevo comentario
          setTimeout(() => {
            const lastPost = document.querySelector('.posts-container .post:last-child');
            if (lastPost) {
              lastPost.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.error("Error al publicar tu respuesta: " + error.message);
        }
      });
      
      this.subscriptions.add(createPostSub);
    });
    
    this.subscriptions.add(submitSub);
  }
}
