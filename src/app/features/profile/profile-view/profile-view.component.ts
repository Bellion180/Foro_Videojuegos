import { Component, OnInit } from "@angular/core";
import { RouterLink, Router } from "@angular/router"; // Import regular
import { AuthService } from "../../../core/services/auth.service"; // Import regular
import { User } from "../../../core/models/user.model"; // Puede mantenerse como type si es interfaz
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-profile-view",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="profile-container">
      @if (user) {
        <div class="profile-header">
          <div class="profile-avatar">
            <img [src]="user.avatar || '/assets/images/default-avatar.png'" alt="User avatar">
          </div>
          <div class="profile-info">
            <h1>{{ user.username }}</h1>
            <div class="profile-meta">
              <span>Member since {{ user.joinDate | date:'mediumDate' }}</span>
              <span>{{ user.role }}</span>
            </div>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-value">{{ user.threadCount || 0 }}</span>
                <span class="stat-label">Threads</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ user.postCount || 0 }}</span>
                <span class="stat-label">Posts</span>
              </div>
            </div>
          </div>
          <div class="profile-actions">
            <a routerLink="/profile/edit" class="btn primary">Edit Profile</a>
          </div>
        </div>

        <div class="profile-content">
          <div class="profile-section">
            <h2>About Me</h2>
            <p>{{ user.bio || 'No bio provided yet.' }}</p>
          </div>

          <div class="profile-section">
            <h2>Recent Activity</h2>
            @if (recentActivity.length > 0) {
              <div class="activity-list">
                @for (activity of recentActivity; track activity.id) {
                  <div class="activity-item">
                    <div class="activity-icon" [ngClass]="activity.type">
                      <!-- Icon based on activity type -->
                    </div>
                    <div class="activity-details">
                      <div class="activity-title">{{ activity.title }}</div>
                      <div class="activity-meta">{{ activity.date | date:'medium' }}</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p>No recent activity.</p>
            }
          </div>
        </div>
      } @else {
        <div class="loading">Loading profile...</div>
      }
    </div>
  `,
  styles: [
    `
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .profile-header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 2rem;
      align-items: center;
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
    }
    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .profile-info h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem;
      color: #1a1a2e;
    }
    .profile-meta {
      display: flex;
      gap: 1rem;
      color: #666;
      margin-bottom: 1rem;
    }
    .profile-stats {
      display: flex;
      gap: 2rem;
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1a1a2e;
    }
    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }
    .profile-actions {
      align-self: flex-start;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      display: inline-block;
    }
    .primary {
      background-color: #ff9f1c;
      color: #1a1a2e;
    }
    .primary:hover {
      background-color: #f08c00;
    }
    .profile-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .profile-section {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .profile-section h2 {
      font-size: 1.5rem;
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1a1a2e;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #ff9f1c;
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .activity-item {
      display: flex;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .activity-icon.thread {
      background-color: #0072b1;
    }
    .activity-icon.post {
      background-color: #10b981;
    }
    .activity-icon.like {
      background-color: #ef4444;
    }
    .activity-details {
      flex: 1;
    }
    .activity-title {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .activity-meta {
      font-size: 0.9rem;
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
export class ProfileViewComponent implements OnInit {
  user: User | null = null
  recentActivity: any[] = []

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile()
    this.loadRecentActivity()
  }

  loadUserProfile(): void {
    this.user = this.authService.getCurrentUser()
  }

  loadRecentActivity(): void {
    // In a real app, this would come from an API
    this.recentActivity = [
      {
        id: 1,
        type: "thread",
        title: 'Started a new thread: "Best RPG games of 2024"',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: 2,
        type: "post",
        title: 'Replied to "PC Building Guide for Gamers"',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: 3,
        type: "like",
        title: 'Liked "Top 10 FPS Games of All Time"',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    ]
  }
}
