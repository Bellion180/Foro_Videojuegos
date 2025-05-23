import { Component, type OnInit } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ForumService } from "../../../core/services/forum.service"
import type { Forum } from "../../../core/models/forum.model"

@Component({
  selector: "app-forums-list",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="forums-container">
      <header class="page-header">
        <h1>Foros</h1>
        <p>Explora todas las categorías de discusión</p>
      </header>

      <div class="forums-list">
        @for (forum of forums; track forum.id) {
          <div class="forum-item">
            <div class="forum-icon">
              <!-- Placeholder for forum icon -->
              <div class="icon-placeholder">{{ forum.name.charAt(0) }}</div>
            </div>
            <div class="forum-info">
              <h2><a [routerLink]="['/forums', forum.id]">{{ forum.name }}</a></h2>
              <p>{{ forum.description }}</p>
            </div>
            <div class="forum-stats">
              <div class="stat">
                <span class="stat-value">{{ forum.threadCount }}</span>
                <span class="stat-label">Hilos</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ forum.postCount }}</span>
                <span class="stat-label">Mensajes</span>
              </div>
            </div>
            <div class="forum-last-post" *ngIf="forum.lastPost">
              <div class="last-post-info">
                <span class="post-title">{{ forum.lastPost.title }}</span>
                <span class="post-meta" *ngIf="forum.lastPost.author">
                  por {{ forum.lastPost.author.username }} • {{ forum.lastPost.date | date:'short' }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
    .forums-container {
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
    .forums-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .forum-item {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 1.5rem;
      align-items: center;
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .forum-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .forum-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-placeholder {
      width: 50px;
      height: 50px;
      background-color: #1a1a2e;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .forum-info h2 {
      margin: 0 0 0.5rem;
      font-size: 1.3rem;
    }
    .forum-info h2 a {
      color: #1a1a2e;
      text-decoration: none;
      transition: color 0.3s;
    }
    .forum-info h2 a:hover {
      color: #ff9f1c;
    }
    .forum-info p {
      color: #666;
      margin: 0;
    }
    .forum-stats {
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
      font-size: 0.9rem;
      color: #666;
    }
    .forum-last-post {
      max-width: 200px;
    }
    .last-post-info {
      display: flex;
      flex-direction: column;
    }
    .post-title {
      font-weight: 500;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .post-meta {
      font-size: 0.8rem;
      color: #666;
    }
  `,
  ],
})
export class ForumsListComponent implements OnInit {
  forums: Forum[] = []

  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    this.loadForums()
  }

  loadForums(): void {
    this.forumService.getForums().subscribe((forums) => {
      this.forums = forums
    })
  }
}
