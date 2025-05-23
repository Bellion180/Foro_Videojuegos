import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ForumService } from "../../services/forum.service"
import { ThreadService } from "../../services/thread.service"
import { Forum } from "../../models/forum.model"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-section">        <h3>
          <span class="icon">🏆</span>
          Categorías Populares
        </h3>
        @if (isLoading) {
          <div class="loading-indicator">
            <div class="spinner"></div>
            <span>Cargando...</span>
          </div>
        } @else if (error) {
          <div class="error-message">{{ error }}</div>
        } @else {
          <ul class="category-list">
            @if (popularForums.length === 0) {
              <li class="empty-state">No hay categorías disponibles</li>
            } @else {
              @for (forum of popularForums; track forum.id) {
                <li>
                  <a [routerLink]="['/forums', forum.id]">
                    <span class="category-icon">{{ forum.name.charAt(0) }}</span>
                    <span>{{ forum.name }}</span>
                  </a>
                </li>
              }
            }
          </ul>
        }
      </div>
      
      <div class="sidebar-section">        <h3>
          <span class="icon">🔥</span>
          Temas Destacados
        </h3>
        @if (isLoading) {
          <div class="loading-indicator">
            <div class="spinner"></div>
            <span>Cargando...</span>
          </div>
        } @else if (error) {
          <div class="error-message">{{ error }}</div>
        } @else {
          <ul class="topic-list">
            @if (hotThreads.length === 0) {
              <li class="empty-state">No hay temas disponibles</li>
            } @else {
              @for (thread of hotThreads; track thread.id) {
                <li>
                  <a [routerLink]="['/threads', thread.id]">
                    <div class="topic-title">{{ thread.title }}</div>                    <div class="topic-meta">                      <span class="replies">
                        <span class="replies-icon">💬</span>
                        {{ thread.replyCount ? (thread.replyCount + 1) : 0 }} respuestas
                      </span>
                    </div>
                  </a>
                </li>
              }
            }
          </ul>
        }
      </div>
      
      
      
      
    </aside>
  `,
  styles: [
    `
    .sidebar {
      width: 300px;
      background-color: var(--card-bg);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      height: fit-content;
      position: sticky;
      top: 5.5rem;
    }
    .sidebar-section {
      margin-bottom: 2rem;
    }
    .sidebar-section h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary-light);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .icon {
      font-size: 1.2rem;
    }
    .category-list, .topic-list {
      list-style: none;
      padding: 0;
    }
    .category-list li, .topic-list li {
      margin-bottom: 0.75rem;
    }
    .category-list a, .topic-list a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--border-radius);
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.3s;
      background-color: var(--bg-tertiary);
    }
    .category-list a:hover, .topic-list a:hover {
      background-color: rgba(126, 34, 206, 0.1);
      color: var(--primary);
      transform: translateX(5px);
    }
    .category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: var(--primary);
      color: white;
      border-radius: 8px;
      font-weight: bold;
    }
    .topic-list a {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .topic-title {
      font-weight: 500;
    }
    .topic-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
    }
    .replies {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .replies-icon {
      font-size: 0.9rem;
    }
    .online-count {
      background-color: rgba(16, 185, 129, 0.1);
      padding: 0.75rem;
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--success);
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .pulse {
      width: 12px;
      height: 12px;
      background-color: var(--success);
      border-radius: 50%;
      position: relative;
    }
    .pulse::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--success);
      animation: pulse 2s infinite;
      z-index: -1;
    }
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      70% {
        transform: scale(2);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    .online-avatars {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-more {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--gray-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
      color: var(--dark);
    }
    .promo-card {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      padding: 1.5rem;
      border-radius: var(--border-radius);
      text-align: center;
    }
    .promo-card h3 {
      color: white;
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }
    .promo-card p {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    .btn-premium {
      display: inline-block;
      background-color: white;
      color: var(--primary);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s;
    }    .btn-premium:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 0.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .error-message {
      padding: 1rem;
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-radius: var(--border-radius);
      font-size: 0.9rem;
    }
    .empty-state {
      padding: 1rem;
      text-align: center;
      color: var(--text-muted);
      font-style: italic;
      background-color: var(--bg-tertiary);
      border-radius: var(--border-radius);
    }
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        position: static;
        margin-bottom: 1.5rem;
      }
    }
  `,
  ],
})
export class SidebarComponent {
  popularForums: Forum[] = []
  hotThreads: any[] = []
  onlineUsers = 0
  isLoading = true
  error: string | null = null

  constructor(private forumService: ForumService, private threadService: ThreadService) {
    this.loadSidebarData()
  }

  loadSidebarData() {
    // Cargar foros populares
    this.forumService.getForums().subscribe({
      next: (forums) => {
        // Ordenar los foros por recuento de hilos o publicaciones (si están disponibles)
        this.popularForums = forums
          .sort((a, b) => {
            // Si hay recuento de hilos, ordenar por eso
            if (a.threadCount !== undefined && b.threadCount !== undefined) {
              return b.threadCount - a.threadCount
            }
            // De lo contrario, usar el ID
            return a.id - b.id
          })
          .slice(0, 5) // Obtener los primeros 5 (los más populares)
      },
      error: (err) => {
        console.error('Error al cargar foros populares:', err)
        this.error = 'No se pudieron cargar los foros populares'
      }
    })

    // Cargar hilos más activos (hot)
    this.threadService.getThreads({
      sort: 'popular', // Asumiendo que el backend admite este tipo de ordenación
      limit: 4         // Sólo queremos los 4 más populares
    }).subscribe({
      next: (response) => {
        this.hotThreads = response.threads || []
        this.isLoading = false
      },
      error: (err) => {
        console.error('Error al cargar hilos populares:', err)
        this.error = 'No se pudieron cargar los hilos populares'
        this.isLoading = false
      }
    })

    // En una aplicación real podrías obtener el número de usuarios en línea desde un servicio
    // Por ejemplo: this.userService.getOnlineUsers().subscribe(count => this.onlineUsers = count)
    // Por ahora, se utiliza un valor de ejemplo
    this.onlineUsers = 237
  }
}
