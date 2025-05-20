import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router"; // Import regular
import { ForumService } from "../../../core/services/forum.service"; // Import regular
import { ThreadService } from "../../../core/services/thread.service"; // Import regular
import { Forum } from "../../../core/models/forum.model"; // Puede mantenerse como type si es interfaz
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-thread-create",
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="create-thread-container">
      <header class="page-header">
        <h1>Create New Thread</h1>
        <p>Start a new discussion in the community</p>
      </header>

      <div class="thread-form">
        <div class="form-group">
          <label for="forum">Forum</label>
          <select id="forum" [(ngModel)]="forumId" required>
            <option value="">Select a forum</option>
            @for (forum of forums; track forum.id) {
              <option [value]="forum.id">{{ forum.name }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" [(ngModel)]="title" placeholder="Enter a descriptive title" required>
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" [(ngModel)]="content" rows="10" placeholder="Write your post here..." required></textarea>
        </div>

        <div class="form-group">
          <label for="tags">Tags (optional)</label>
          <input type="text" id="tags" [(ngModel)]="tagsInput" placeholder="Enter tags separated by commas">
          <div class="tags-preview" *ngIf="tagsArray.length > 0">
            @for (tag of tagsArray; track tag) {
              <span class="tag">{{ tag }} <button (click)="removeTag(tag)" class="remove-tag">×</button></span>
            }
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="cancel()">Cancel</button>
          <button class="btn primary" [disabled]="!isFormValid()" (click)="createThread()">Create Thread</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .create-thread-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .page-header p {
      color: #666;
    }
    .thread-form {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: inherit;
    }
    .form-group textarea {
      resize: vertical;
    }
    .tags-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .tag {
      background-color: #e6f7ff;
      color: #0072b1;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
    }
    .remove-tag {
      background: none;
      border: none;
      color: #0072b1;
      margin-left: 0.25rem;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
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
    .primary:disabled {
      background-color: #ffd699;
      cursor: not-allowed;
    }
    .secondary {
      background-color: #1a1a2e;
      color: white;
    }
    .secondary:hover {
      background-color: #2a2a4e;
    }
  `,
  ],
})
export class ThreadCreateComponent implements OnInit {
  forums: Forum[] = []
  forumId: number | string = ""
  title = ""
  content = ""
  tagsInput = ""

  constructor(
    private forumService: ForumService,
    private threadService: ThreadService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadForums()
    this.route.queryParams.subscribe((params) => {
      if (params["forumId"]) {
        this.forumId = Number(params["forumId"])
      }
    })
  }

  loadForums(): void {
    this.forumService.getForums().subscribe((forums) => {
      this.forums = forums
    })
  }

  get tagsArray(): string[] {
    if (!this.tagsInput) return []
    return this.tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  removeTag(tagToRemove: string): void {
    const tags = this.tagsArray.filter((tag) => tag !== tagToRemove)
    this.tagsInput = tags.join(", ")
  }

  isFormValid(): boolean {
    return !!this.forumId && !!this.title.trim() && !!this.content.trim()
  }

  createThread(): void {
    if (!this.isFormValid()) return

    const newThread = {
      title: this.title,
      content: this.content,
      forumId: Number(this.forumId),
      tags: this.tagsArray,
    }

    this.threadService.createThread(newThread).subscribe((thread) => {
      this.router.navigate(["/threads", thread.id])
    })
  }

  cancel(): void {
    this.router.navigate(["/forums"])
  }
}
