import { Component, type OnInit, OnDestroy } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ForumService } from "../../core/services/forum.service"
import { ThreadService } from "../../core/services/thread.service"
import { AuthService } from "../../core/services/auth.service"
import { StatsService, type SiteStats } from "../../core/services/stats.service"
import { Forum } from "../../core/models/forum.model"
import type { Thread } from "../../core/models/thread.model"
import { Subscription } from "rxjs"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-content">          <h1 class="hero-title">Bienvenido a <span class="text-gradient">GamersHub</span></h1>
          <p class="hero-subtitle">Únete a la conversación con jugadores de todo el mundo.</p>
          <div class="hero-buttons">            <a routerLink="/forums" class="btn btn-primary">
              <span>Explorar Foros</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            @if (!isLoggedIn) {
              <a routerLink="/auth/register" class="btn btn-outline">Unirse a la Comunidad</a>
            }
          </div>
        </div>
        <div class="hero-image">
          <img src="logotipo2.png" alt="Gaming illustration" />
        </div>
      </section>

      <section class="featured-section">
        <div class="section-header">          <h2>Foros Populares</h2>
          <a routerLink="/forums" class="view-all">Ver Todos</a>
        </div>
        <div class="forums-grid">
          @for (forum of popularForums; track forum.id) {
            <div class="forum-card card">
              <div class="forum-icon">{{ forum.name.charAt(0) }}</div>
              <div class="forum-content">
                <h3>{{ forum.name }}</h3>
                <p>{{ forum.description }}</p>
                <div class="forum-stats">
                  <div class="stat">
                    <span class="stat-icon">📝</span>
                    <span>{{ forum.threadCount }} temas</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">💬</span>
                    <span>{{ forum.postCount }} mensajes</span>
                  </div>
                </div>
                <a [routerLink]="['/forums', forum.id]" class="forum-link">Ver Foro</a>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="recent-discussions">
        <div class="section-header">          <h2>Discusiones Recientes</h2>
          <a routerLink="/threads/latest" class="view-all">Ver Todas</a>
        </div>
        <div class="threads-list">
          @for (thread of recentThreads; track thread.id) {
            <div class="thread-item card">
              <div class="thread-main">
                <div class="thread-author">
                  <div class="author-avatar">
                    <img src="/assets/images/default-avatar.png" alt="User avatar">
                  </div>
                  <div class="author-info">
                    <span class="author-name">{{ thread.author.username }}</span>
                    <span class="thread-date">{{ thread.createdAt | date }}</span>
                  </div>
                </div>
                <h3><a [routerLink]="['/threads', thread.id]">{{ thread.title }}</a></h3>
                <div class="thread-meta">
                  <div class="meta-item">
                    <span class="meta-icon">👁️</span>                    <span>{{ thread.viewCount }} vistas</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">💬</span>
                    <span>{{ thread.replyCount }} respuestas</span>
                  </div>
                </div>
              </div>
              <div class="thread-tags">
                @for (tag of thread.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <section class="community-stats">        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <h3>{{ stats.userCount.toLocaleString() }}</h3>
          <p>Miembros en la Comunidad</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <h3>{{ stats.threadCount.toLocaleString() }}</h3>
          <p>Temas de Discusión</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <h3>{{ stats.postCount.toLocaleString() }}</h3>
          <p>Mensajes Totales</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <h3>{{ stats.onlineUsers.toLocaleString() }}</h3>
          <p>Usuarios en Línea</p>
        </div>      </section>

      @if (!isLoggedIn) {
        <section class="cta-section">
          <div class="cta-content">            <h2>¿Listo para unirte a la conversación?</h2>
            <p>Crea una cuenta para empezar a publicar, unirte a las discusiones y conectar con otros jugadores.</p>
            <div class="cta-buttons">
              <a routerLink="/auth/register" class="btn btn-primary">Crear Cuenta</a>
              <a routerLink="/auth/login" class="btn btn-outline">Iniciar Sesión</a>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  styles: [
    `
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
      animation: fadeIn 0.8s ease;
    }
    .hero-content {
      flex: 1;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
      color: var(--text-primary);
    }
    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      max-width: 600px;
    }
    .hero-buttons {
      display: flex;
      gap: 1rem;
    }
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .hero-image img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      transform: perspective(1000px) rotateY(-5deg);
      transition: transform 0.5s ease;
    }
    .hero-image img:hover {
      transform: perspective(1000px) rotateY(0deg);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .section-header h2 {
      font-size: 1.8rem;
      font-weight: 700;
      position: relative;
      padding-bottom: 0.5rem;
    }
    .section-header h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      border-radius: 3px;
    }
    .view-all {
      color: var(--primary);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.3s;
    }
    .view-all:hover {
      color: var(--primary-dark);
      transform: translateX(3px);
    }
    .forums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .forum-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      border-top: 4px solid var(--primary);
    }
    .forum-icon {
      width: 50px;
      height: 50px;
      background-color: var(--primary);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .forum-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .forum-card h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-size: 1.2rem;
    }
    .forum-card p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      flex: 1;
    }
    .forum-stats {
      display: flex;
      justify-content: space-between;
      color: var(--gray);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .stat-icon {
      font-size: 1rem;
    }
    .forum-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      margin-top: auto;
      transition: all 0.3s;
    }
    .forum-link:hover {
      color: var(--primary-dark);
      transform: translateX(3px);
    }
    .threads-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 3rem;
    }
    .thread-item {
      padding: 1.5rem;
    }
    .thread-author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    .author-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .author-info {
      display: flex;
      flex-direction: column;
    }
    .author-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    .thread-date {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .thread-main {
      flex: 1;
    }
    .thread-main h3 {
      margin: 0 0 0.75rem;
      font-size: 1.2rem;
    }
    .thread-main h3 a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.3s;
    }
    .thread-main h3 a:hover {
      color: var(--primary);
    }
    .thread-meta {
      display: flex;
      gap: 1.5rem;
      color: var(--gray);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .meta-icon {
      font-size: 1rem;
    }
    .thread-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tag {
      background-color: rgba(126, 34, 206, 0.1);
      color: var(--primary);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .community-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: var(--background-secondary);
      padding: 2rem 1.5rem;
      border-radius: var(--border-radius);
      text-align: center;
      box-shadow: var(--shadow);
      transition: all 0.3s;
      border: 2px solid var(--border-color);
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }
    .stat-card .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    .stat-card h3 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-weight: 800;
    }
    .stat-card p {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-primary);
      font-weight: 500;
    }
    .cta-section {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-radius: var(--border-radius);
      padding: 3rem 2rem;
      margin-bottom: 2rem;
      text-align: center;
      color: white;
      box-shadow: var(--shadow-lg);
    }
    .cta-content h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .cta-content p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.9;
    }
    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .cta-buttons .btn-outline {
      border-color: white;
      color: white;
    }
    .cta-buttons .btn-outline:hover {
      background-color: white;
      color: var(--primary);
    }
    .featured-section {
      margin-bottom: 3rem;
    }
    .recent-discussions {
      margin-bottom: 3rem;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        text-align: center;
      }
      .hero-title {
        font-size: 2.5rem;
      }
      .hero-buttons {
        justify-content: center;
      }
      .community-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      .cta-section {
        padding: 2rem 1rem;
      }
      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
    }
  `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  popularForums: Forum[] = []
  recentThreads: Thread[] = []
  isLoggedIn = false
  private authSubscription: Subscription | null = null
  stats = {
    userCount: 0,
    threadCount: 0,
    postCount: 0,
    onlineUsers: 0,
  }
  constructor(
    private forumService: ForumService,
    private threadService: ThreadService,
    private authService: AuthService,
    private statsService: StatsService,
  ) {}

  ngOnInit(): void {
    this.loadForums()
    this.loadRecentThreads()
    this.loadStats()
    this.isLoggedIn = this.authService.isLoggedIn()
    
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadForums(): void {
    this.forumService.getForums().subscribe({
      next: (forums) => {
        this.popularForums = Array.isArray(forums) ? forums.slice(0, 6) : [];
      },
      error: (err) => {
        console.error('Error loading forums:', err);
        this.popularForums = [];
      }
    });
  }

  loadRecentThreads(): void {
    this.threadService.getThreads({ sort: "recent", limit: 5 }).subscribe({
      next: (threads) => {
        this.recentThreads = Array.isArray(threads) ? threads : [];
      },
      error: (err) => {
        console.error('Error loading threads:', err);
        this.recentThreads = [];
      }
    });
  }
  loadStats(): void {
    this.statsService.getSiteStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading site statistics:', err);
        // Fallback to default values if API call fails
        this.stats = {
          userCount: 0,
          threadCount: 0,
          postCount: 0,
          onlineUsers: 0,
        };
      }
    });
  }
}
