import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../../core/services/auth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }

        @if (successMessage) {
          <div class="success-message">{{ successMessage }}</div>
        }

        <form class="auth-form" (ngSubmit)="resetPassword()" *ngIf="!successMessage">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required>
          </div>

          <button type="submit" class="btn primary" [disabled]="isLoading">
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Remember your password? <a routerLink="/auth/login">Log in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 2rem 1rem;
    }
    .auth-card {
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .auth-header p {
      color: #666;
    }
    .error-message {
      background-color: #fee2e2;
      color: #b91c1c;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .success-message {
      background-color: #d1fae5;
      color: #065f46;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-group input[type="email"] {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      text-align: center;
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
    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.9rem;
    }
    .auth-footer a {
      color: #0072b1;
      text-decoration: none;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `,
  ],
})
export class ForgotPasswordComponent {
  email = ""
  isLoading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  resetPassword(): void {
    if (!this.email) {
      this.errorMessage = "Por favor ingresa tu dirección de correo electrónico."
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isLoading = false
        this.successMessage = "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada."
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = error.error?.message || "Ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo más tarde."
      }
    })
  }
}
