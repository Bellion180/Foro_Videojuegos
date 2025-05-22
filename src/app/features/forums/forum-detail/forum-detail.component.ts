import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ForumService } from "../../../core/services/forum.service"
import { AuthService } from "../../../core/services/auth.service"
import { Forum } from "../../../core/models/forum.model"
import { Thread } from "../../../core/models/thread.model"

@Component({
  selector: "app-forum-detail",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="forum-detail-container">
      @if (forum) {
        <header class="forum-header">
          <div class="forum-title">
            <h1>{{ forum.name }}</h1>
            <p>{{ forum.description }}</p>
          </div>
          <div class="forum-actions">
            @if (authService.isLoggedIn()) {
              <a [routerLink]="['/threads/create']" [queryParams]="{forumId: forum.id}" class="btn primary">New Thread</a>
            }
          </div>
        </header>

        <div class="thread-filters">
          <div class="filter-options">
            <button class="filter-btn" [class.active]="currentFilter === 'latest'" (click)="setFilter('latest')">Latest</button>
            <button class="filter-btn" [class.active]="currentFilter === 'popular'" (click)="setFilter('popular')">Popular</button>
            <button class="filter-btn" [class.active]="currentFilter === 'unanswered'" (click)="setFilter('unanswered')">Unanswered</button>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search this forum..." [(ngModel)]="searchQuery" (keyup.enter)="searchThreads()">
            <button (click)="searchThreads()">Search</button>
          </div>
        </div>

        @if (threads.length > 0) {
          <div class="threads-list">
            @for (thread of threads; track thread.id) {
              <div class="thread-item" [class.pinned]="thread.isPinned">
                @if (thread.isPinned) {
                  <div class="pin-indicator">Pinned</div>
                }
                <div class="thread-main">
                  <h2><a [routerLink]="['/threads', thread.id]">{{ thread.title }}</a></h2>
                  <div class="thread-meta">
                    <span>Started by {{ thread.author.username }}</span>
                    <span>{{ thread.createdAt | date }}</span>
                  </div>
                </div>
                <div class="thread-stats">
                  <div class="stat">
                    <span class="stat-value">{{ thread.viewCount }}</span>
                    <span class="stat-label">Views</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ thread.replyCount }}</span>
                    <span class="stat-label">Replies</span>
                  </div>
                </div>
                <div class="thread-last-reply" *ngIf="thread.lastReply">
                  <div class="last-reply-info">
                    <span>Last reply by {{ thread.lastReply.author.username }}</span>
                    <span>{{ thread.lastReply.createdAt | date:'short' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="pagination">
            <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Next</button>
          </div>
        } @else {
          <div class="no-threads">
            <p>No threads found in this forum.</p>
            @if (authService.isLoggedIn()) {
              <a [routerLink]="['/threads/create']" [queryParams]="{forumId: forum.id}" class="btn primary">Start a New Discussion</a>
            } @else {
              <p>Please <a routerLink="/auth/login">log in</a> to start a new discussion.</p>
            }
          </div>
        }
      } @else {
        <div class="loading">Loading forum...</div>
      }
    </div>
  `,
  styles: [
    `
    .forum-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .forum-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .forum-title h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem;
      color: #1a1a2e;
    }
    .forum-title p {
      color: #666;
      margin: 0;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
    }
    .primary {
      background-color: #ff9f1c;
      color: #1a1a2e;
    }
    .primary:hover {
      background-color: #f08c00;
    }
    .thread-filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }
    .filter-options {
      display: flex;
      gap: 0.5rem;
    }
    .filter-btn {
      background: none;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;
    }
    .filter-btn:hover, .filter-btn.active {
      background-color: #1a1a2e;
      color: white;
    }
    .search-box {
      display: flex;
    }
    .search-box input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      width: 200px;
    }
    .search-box button {
      padding: 0.5rem 1rem;
      background-color: #1a1a2e;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    .threads-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .thread-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1.5rem;
      align-items: center;
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: relative;
    }
    .thread-item.pinned {
      background-color: #fff8e6;
      border-left: 4px solid #ff9f1c;
    }
    .pin-indicator {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: #ff9f1c;
      color: #1a1a2e;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .thread-main h2 {
      margin: 0 0 0.5rem;
      font-size: 1.2rem;
    }
    .thread-main h2 a {
      color: #1a1a2e;
      text-decoration: none;
      transition: color 0.3s;
    }
    .thread-main h2 a:hover {
      color: #ff9f1c;
    }
    .thread-meta {
      display: flex;
      gap: 1rem;
      color: #666;
      font-size: 0.9rem;
    }
    .thread-stats {
      display: flex;
      gap: 1.5rem;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1a1a2e;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }
    .thread-last-reply {
      max-width: 200px;
    }
    .last-reply-info {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
      color: #666;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .pagination button {
      padding: 0.5rem 1rem;
      background-color: #1a1a2e;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .pagination button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .no-threads {
      text-align: center;
      padding: 3rem 0;
    }
    .no-threads p {
      margin-bottom: 1.5rem;
      color: #666;
    }
    .loading {
      text-align: center;
      padding: 3rem 0;
      color: #666;
    }
  `,
  ],
})
export class ForumDetailComponent implements OnInit {
  forum: Forum | null = null
  threads: Thread[] = []
  currentPage = 1
  totalPages = 1
  currentFilter = "latest"
  searchQuery = ""

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const forumId = Number(params.get("id"))
      if (forumId) {
        this.loadForum(forumId)
        this.loadThreads(forumId)
      }
    })
  }

  loadForum(id: number): void {
    this.forumService.getForum(id).subscribe((forum) => {
      this.forum = forum
    })
  }
  loadThreads(forumId: number): void {
    this.forumService.getThreadsByForum(forumId, this.currentPage, this.currentFilter).subscribe((response) => {
      console.log("Respuesta de getThreadsByForum:", response);
      if (response && response.threads) {
        this.threads = response.threads;
        if (response.pagination) {
          this.totalPages = response.pagination.totalPages || 1;
          this.currentPage = response.pagination.page || 1;
        }
      } else {
        console.error("La respuesta no tiene el formato esperado:", response);
        this.threads = [];
        this.totalPages = 1;
      }
    });
  }
  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 1; // Reiniciar a la primera página cuando cambia el filtro
    
    if (this.forum) {
      this.loadThreads(this.forum.id);
    }
  }
  searchThreads(): void {
    if (this.searchQuery && this.searchQuery.trim()) {
      // Aquí asumo que necesitamos crear un endpoint para buscar threads por texto
      // Para pruebas, podemos filtrar los threads actuales en el frontend
      console.log("Buscando:", this.searchQuery);
      
      if (this.forum) {
        // Debería haber un endpoint como: /api/threads/search?forumId=X&query=Y
        // Por ahora, usamos el endpoint normal y filtramos en el front
        this.forumService.getThreadsByForum(this.forum.id, 1, this.currentFilter)
          .subscribe((response) => {
            if (response && response.threads) {
              // Filtrado local (esto debería hacerse en el backend idealmente)
              const searchLower = this.searchQuery.toLowerCase();
              this.threads = response.threads.filter((thread: Thread) => 
                thread.title.toLowerCase().includes(searchLower) || 
                thread.content.toLowerCase().includes(searchLower)
              );
              
              // No actualizamos totalPages ya que estamos haciendo una búsqueda local
            }
          });
      }
    } else {
      // Si la búsqueda está vacía, volvemos a cargar todos los threads
      if (this.forum) {
        this.loadThreads(this.forum.id);
      }
    }
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      if (this.forum) {
        this.loadThreads(this.forum.id);
      }
    }
  }
}
