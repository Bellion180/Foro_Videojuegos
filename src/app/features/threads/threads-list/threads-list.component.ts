import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ThreadService } from "../../../core/services/thread.service"; // Import regular
import { Thread } from "../../../core/models/thread.model"; // Cambiado si es clase
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-threads-list",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="threads-container">
      <header class="page-header">
        <h1>Últimas Discusiones</h1>
        <p>Explora las conversaciones más recientes en todos los foros</p>
      </header>

      <div class="thread-filters">
        <div class="filter-options">
          <button class="filter-btn" [class.active]="currentFilter === 'latest'" (click)="setFilter('latest')">Más Recientes</button>
          <button class="filter-btn" [class.active]="currentFilter === 'popular'" (click)="setFilter('popular')">Populares</button>
          <button class="filter-btn" [class.active]="currentFilter === 'unanswered'" (click)="setFilter('unanswered')">Sin Respuesta</button>
        </div>
        <div class="search-box">
          <input type="text" placeholder="Buscar hilos..." [(ngModel)]="searchQuery" (keyup.enter)="searchThreads()">
          <button (click)="searchThreads()">Buscar</button>
        </div>
      </div>

      @if (threads.length > 0) {
        <div class="threads-list">
          @for (thread of threads; track thread.id) {
            <div class="thread-item">
              <div class="thread-main">
                <h2><a [routerLink]="['/threads', thread.id]">{{ thread.title }}</a></h2>
                <div class="thread-meta">
                  <span>Iniciado por {{ thread.author.username }}</span>
                  <span>{{ thread.createdAt | date }}</span>
                  <span>en <a [routerLink]="['/forums', thread.forumId]">Nombre del Foro</a></span>
                </div>
                <div class="thread-tags" *ngIf="thread.tags && thread.tags.length > 0">
                  @for (tag of thread.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              </div>
              <div class="thread-stats">
                <div class="stat">
                  <span class="stat-value">{{ thread.viewCount }}</span>
                  <span class="stat-label">Vistas</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ thread.replyCount }}</span>
                  <span class="stat-label">Respuestas</span>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="pagination">
          <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Anterior</button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Siguiente</button>
        </div>
      } @else {
        <div class="no-threads">
          <p>No se encontraron hilos.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .threads-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .page-header p {
      color: #666;
      font-size: 1.1rem;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .thread-main {
      flex: 1;
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
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }
    .thread-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .tag {
      background-color: #e6f7ff;
      color: #0072b1;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
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
      color: #666;
    }
  `,
  ],
})
export class ThreadsListComponent implements OnInit {
  threads: Thread[] = []
  currentPage = 1
  totalPages = 1
  currentFilter = "latest"
  searchQuery = ""

  constructor(private threadService: ThreadService) {}

  ngOnInit(): void {
    this.loadThreads()
  }

  loadThreads(): void {
    this.threadService.getThreads({ sort: this.currentFilter }).subscribe((threads) => {
      this.threads = threads
      this.totalPages = Math.ceil(threads.length / 10) // Assuming 10 threads per page
    })
  }

  setFilter(filter: string): void {
    this.currentFilter = filter
    this.loadThreads()
  }

  searchThreads(): void {
    // In a real app, you would search threads with the query
    console.log("Searching for:", this.searchQuery)
  }

  changePage(page: number): void {
    this.currentPage = page
    // In a real app, you would load threads for the new page
  }
}
