import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ThreadService } from "../../../core/services/thread.service"
import { AuthService } from "../../../core/services/auth.service"
import { Thread } from "../../../core/models/thread.model"
import { Post } from "../../../core/models/post.model"

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
              <span>Started by {{ thread.author.username }}</span>
              <span>{{ thread.createdAt | date }}</span>
              <span>in <a [routerLink]="['/forums', thread.forumId]">Forum Name</a></span>
            </div>
          </div>
          <div class="thread-actions">
            <button class="btn secondary">Share</button>
            @if (authService.isLoggedIn()) {
              <button class="btn primary">Reply</button>
            }
          </div>
        </header>

        <div class="posts-container">
          <!-- Original post -->
          <div class="post original-post">
            <div class="post-sidebar">
              <div class="user-avatar">
                <img [src]="thread.author.avatar || '/assets/images/default-avatar.png'" alt="User avatar">
              </div>
              <div class="user-info">
                <div class="username">{{ thread.author.username }}</div>
                <div class="user-role">{{ thread.author.role }}</div>
                <div class="join-date">Joined {{ thread.author.joinDate | date:'mediumDate' }}</div>
                <div class="post-count">{{ thread.author.postCount || 0 }} posts</div>
              </div>
            </div>
            <div class="post-content">
              <div class="post-body" [innerHTML]="thread.content"></div>
              <div class="post-footer">
                <div class="post-date">{{ thread.createdAt | date:'medium' }}</div>
                <div class="post-actions">
                  <button class="action-btn">Like</button>
                  <button class="action-btn">Quote</button>
                  <button class="action-btn">Report</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Replies -->
          @for (post of posts; track post.id) {
            <div class="post reply" [class.accepted-answer]="post.isAcceptedAnswer">
              @if (post.isAcceptedAnswer) {
                <div class="accepted-badge">Accepted Answer</div>
              }
              <div class="post-sidebar">
                <div class="user-avatar">
                  <img [src]="post.author.avatar || '/assets/images/default-avatar.png'" alt="User avatar">
                </div>
                <div class="user-info">
                  <div class="username">{{ post.author.username }}</div>
                  <div class="user-role">{{ post.author.role }}</div>
                  <div class="join-date">Joined {{ post.author.joinDate | date:'mediumDate' }}</div>
                  <div class="post-count">{{ post.author.postCount || 0 }} posts</div>
                </div>
              </div>
              <div class="post-content">
                <div class="post-body" [innerHTML]="post.content"></div>
                <div class="post-footer">
                  <div class="post-date">
                    {{ post.createdAt | date:'medium' }}
                    @if (post.isEdited) {
                      <span class="edited-indicator">(edited)</span>
                    }
                  </div>
                  <div class="post-actions">
                    <button class="action-btn">Like</button>
                    <button class="action-btn">Quote</button>
                    <button class="action-btn">Report</button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        @if (authService.isLoggedIn()) {
          <div class="reply-form">
            <h3>Post a Reply</h3>
            <textarea placeholder="Write your reply here..." [(ngModel)]="replyContent" rows="6"></textarea>
            <div class="form-actions">
              <button class="btn secondary">Cancel</button>
              <button class="btn primary" (click)="submitReply()">Post Reply</button>
            </div>
          </div>
        } @else {
          <div class="login-prompt">
            <p>Please <a routerLink="/auth/login" [queryParams]="{returnUrl: currentUrl}">log in</a> to post a reply.</p>
          </div>
        }
      } @else {
        <div class="loading">Loading thread...</div>
      }
    </div>
  `,
  styles: [
    `
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
    }
    .thread-meta a:hover {
      text-decoration: underline;
    }
    .thread-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }
    .primary {
      background-color: #ff9f1c;
      color: #1a1a2e;
    }
    .primary:hover {
      background-color: #f08c00;
    }
    .secondary {
      background-color: #1a1a2e;
      color: white;
    }
    .secondary:hover {
      background-color: #2a2a4e;
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
    }
    .user-role {
      color: #0072b1;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
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
    }
    .action-btn:hover {
      background-color: #e6f7ff;
    }
    .reply-form {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }
    .reply-form h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    .reply-form textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      margin-bottom: 1rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    .login-prompt {
      text-align: center;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-top: 2rem;
    }
    .login-prompt a {
      color: #0072b1;
      text-decoration: none;
    }
    .login-prompt a:hover {
      text-decoration: underline;
    }
    .loading {
      text-align: center;
      padding: 3rem 0;
      color: #666;
    }
  `,
  ],
})
export class ThreadDetailComponent implements OnInit {
  thread: Thread | null = null
  posts: Post[] = []
  replyContent = ""
  currentUrl = ""

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUrl = window.location.pathname
    this.route.paramMap.subscribe((params) => {
      const threadId = Number(params.get("id"))
      if (threadId) {
        this.loadThread(threadId)
        this.loadPosts(threadId)
      }
    })
  }

  loadThread(id: number): void {
    this.threadService.getThread(id).subscribe((thread) => {
      this.thread = thread
    })
  }

  loadPosts(threadId: number): void {
    this.threadService.getPostsByThread(threadId).subscribe((posts) => {
      this.posts = posts
    })
  }

  submitReply(): void {
    if (!this.thread || !this.replyContent.trim()) return

    const newPost: Partial<Post> = {
      content: this.replyContent,
      threadId: this.thread.id,
    }

    this.threadService.createPost(this.thread.id, newPost).subscribe((post) => {
      this.posts.push(post)
      this.replyContent = ""
    })
  }
}
