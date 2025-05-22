import { Component, OnInit } from "@angular/core";
import { RouterLink, Router } from "@angular/router"; // Import regular
import { AuthService } from "../../../core/services/auth.service"; // Import regular
import { User } from "../../../core/models/user.model"; // Puede mantenerse como type si es interfaz
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from "../../../core/services/notification.service";


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
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile()
  }
  loadUserProfile(): void {
    const user = this.authService.getCurrentUserValue() // Changed to getCurrentUserValue()
    if (user) {
      this.user = user
      this.formData = {
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      }
    } else {
      this.errorMessage = "No se pudo cargar el perfil de usuario";
      this.notificationService.error(this.errorMessage);
      // Redirigir al inicio de sesión si no hay usuario
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    }
  }
  onAvatarSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      // Verificar tipo de archivo (solo imágenes)
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        this.errorMessage = "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)";
        this.notificationService.warning(this.errorMessage);
        return;
      }

      // Verificar tamaño del archivo (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = "El tamaño del archivo excede el límite de 2MB";
        this.notificationService.warning(this.errorMessage);
        return;
      }

      this.avatarFile = file;
      this.errorMessage = "";

      // Crear una vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.onerror = () => {
        this.errorMessage = "Error al leer el archivo";
        this.notificationService.error(this.errorMessage);
      };
      reader.readAsDataURL(file);
    }
  }
  removeAvatar(): void {
    this.avatarFile = null;
    this.avatarPreview = null;
    this.notificationService.info("Imagen de perfil eliminada. Guarda los cambios para confirmar.");
  }saveProfile(): void {
    this.errorMessage = ""
    this.successMessage = ""
    this.isSaving = true

    if (!this.user) {
      this.errorMessage = "No se pudo cargar el perfil de usuario";
      this.notificationService.error(this.errorMessage);
      this.isSaving = false;
      return;
    }

    // Prepare user data for update
    const userData: Partial<User> = {
      username: this.formData.username,
      bio: this.formData.bio
    };

    this.authService.updateProfile(this.user.id, userData, this.avatarFile || undefined).subscribe({
      next: (updatedUser) => {
        this.isSaving = false;
        this.successMessage = "Perfil actualizado correctamente";
        this.notificationService.success(this.successMessage);
        
        // Update the local user object with the response
        this.user = updatedUser;
        
        // Keep the avatar preview in sync
        if (this.avatarFile && this.avatarPreview) {
          // The avatar preview stays valid because we successfully updated
        } else {
          // Reset the avatar preview to match the updated user
          this.avatarPreview = null;
        }
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || "Error al actualizar el perfil";
        this.notificationService.error(this.errorMessage);
        console.error("Error updating profile:", error);
      }
    });
  }  changePassword(): void {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.errorMessage = "Please fill in all password fields."
      this.notificationService.warning(this.errorMessage);
      return
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = "New passwords do not match."
      this.notificationService.warning(this.errorMessage);
      return
    }

    if (this.passwordData.newPassword.length < 8) {
      this.errorMessage = "New password must be at least 8 characters long."
      this.notificationService.warning(this.errorMessage);
      return
    }

    if (!this.user) {
      this.errorMessage = "No se pudo cargar el perfil de usuario";
      this.notificationService.error(this.errorMessage);
      return;
    }

    this.errorMessage = ""
    this.successMessage = ""
    this.isPasswordChanging = true

    this.authService.changePassword(
      this.user.id, 
      this.passwordData.currentPassword,
      this.passwordData.newPassword
    ).subscribe({
      next: () => {
        this.isPasswordChanging = false;
        this.successMessage = "Password changed successfully!";
        this.notificationService.success(this.successMessage);
        this.passwordData = {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      },
      error: (error) => {
        this.isPasswordChanging = false;
        this.errorMessage = error.message || "Error changing password. Please check your current password.";
        this.notificationService.error(this.errorMessage);
        console.error("Error changing password:", error);
      }
    });
  }
}
