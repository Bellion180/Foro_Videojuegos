import { Component, OnInit } from "@angular/core";
import { RouterLink, Router } from "@angular/router"; // Import regular
import { AuthService } from "../../../core/services/auth.service"; // Import regular
import { User } from "../../../core/models/user.model"; // Puede mantenerse como type si es interfaz
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: "app-profile-edit",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="profile-edit-container">
      <header class="page-header">
        <h1>Edit Profile</h1>
        <p>Update your personal information</p>
      </header>

      @if (errorMessage) {
        <div class="error-message">{{ errorMessage }}</div>
      }

      @if (successMessage) {
        <div class="success-message">{{ successMessage }}</div>
      }

      @if (user) {
        <div class="profile-form">
          <div class="form-section">
            <h2>Profile Picture</h2>
            <div class="avatar-upload">
              <div class="current-avatar">
                <img [src]="avatarPreview || user.avatar || '/assets/images/default-avatar.png'" alt="User avatar">
              </div>
              <div class="avatar-actions">
                <label for="avatar-upload" class="btn secondary">Choose Image</label>
                <input type="file" id="avatar-upload" accept="image/*" (change)="onAvatarSelected($event)" class="hidden-input">
                @if (avatarFile) {
                  <button class="btn danger" (click)="removeAvatar()">Remove</button>
                }
              </div>
              <p class="avatar-help">Recommended size: 200x200 pixels. Max file size: 2MB.</p>
            </div>
          </div>

          <div class="form-section">
            <h2>Personal Information</h2>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" [(ngModel)]="formData.username" name="username">
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="formData.email" name="email" disabled>
              <p class="field-help">Email cannot be changed. Contact support for assistance.</p>
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea id="bio" [(ngModel)]="formData.bio" name="bio" rows="4" placeholder="Tell us about yourself..."></textarea>
            </div>
          </div>

          <div class="form-section">
            <h2>Change Password</h2>
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input type="password" id="currentPassword" [(ngModel)]="passwordData.currentPassword" name="currentPassword">
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input type="password" id="newPassword" [(ngModel)]="passwordData.newPassword" name="newPassword">
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" [(ngModel)]="passwordData.confirmPassword" name="confirmPassword">
            </div>

            <button class="btn secondary" (click)="changePassword()" [disabled]="isPasswordChanging">
              {{ isPasswordChanging ? 'Changing Password...' : 'Change Password' }}
            </button>
          </div>

          <div class="form-actions">
            <button class="btn secondary" routerLink="/profile">Cancel</button>
            <button class="btn primary" (click)="saveProfile()" [disabled]="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      } @else {
        <div class="loading">Loading profile...</div>
      }
    </div>
  `,
  styles: [
    `
    .profile-edit-container {
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
    .error-message {
      background-color: #fee2e2;
      color: #b91c1c;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    .success-message {
      background-color: #d1fae5;
      color: #065f46;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .form-section {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .form-section h2 {
      font-size: 1.3rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #1a1a2e;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #ff9f1c;
    }
    .avatar-upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .current-avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .current-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-actions {
      display: flex;
      gap: 1rem;
    }
    .hidden-input {
      display: none;
    }
    .avatar-help {
      font-size: 0.9rem;
      color: #666;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: inherit;
    }
    .form-group input:disabled {
      background-color: #f0f0f0;
      cursor: not-allowed;
    }
    .form-group textarea {
      resize: vertical;
    }
    .field-help {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.5rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      display: inline-block;
      text-align: center;
      text-decoration: none;
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
    .danger {
      background-color: #ef4444;
      color: white;
    }
    .danger:hover {
      background-color: #dc2626;
    }
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    .loading {
      text-align: center;
      padding: 3rem 0;
      color: #666;
    }
  `,
  ],
})
export class ProfileEditComponent implements OnInit {
  user: User | null = null
  formData = {
    username: "",
    email: "",
    bio: "",
  }
  passwordData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }
  avatarFile: File | null = null
  avatarPreview: string | null = null
  errorMessage = ""
  successMessage = ""
  isSaving = false
  isPasswordChanging = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    const user = this.authService.getCurrentUser()
    if (user) {
      this.user = user
      this.formData = {
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      }
    }
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = "File size exceeds 2MB limit."
        return
      }

      this.avatarFile = file

      // Create a preview of the selected image
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  removeAvatar(): void {
    this.avatarFile = null
    this.avatarPreview = null
  }

  saveProfile(): void {
    this.errorMessage = ""
    this.successMessage = ""
    this.isSaving = true

    // In a real app, this would call an API endpoint
    setTimeout(() => {
      this.isSaving = false
      this.successMessage = "Profile updated successfully!"

      // Update the user object with new data
      if (this.user) {
        this.user.username = this.formData.username
        this.user.bio = this.formData.bio

        // In a real app, you would upload the avatar file to a server
        if (this.avatarFile) {
          // Simulate avatar update
          console.log("Avatar file would be uploaded:", this.avatarFile)
        }
      }
    }, 1500)
  }

  changePassword(): void {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.errorMessage = "Please fill in all password fields."
      return
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = "New passwords do not match."
      return
    }

    if (this.passwordData.newPassword.length < 8) {
      this.errorMessage = "New password must be at least 8 characters long."
      return
    }

    this.errorMessage = ""
    this.successMessage = ""
    this.isPasswordChanging = true

    // In a real app, this would call an API endpoint
    setTimeout(() => {
      this.isPasswordChanging = false
      this.successMessage = "Password changed successfully!"
      this.passwordData = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }
    }, 1500)
  }
}
