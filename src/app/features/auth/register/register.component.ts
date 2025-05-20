import { Component } from "@angular/core"
import { RouterLink, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join the GamersHub community</p>
        </div>

        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }

        <form class="auth-form" (ngSubmit)="register()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" [(ngModel)]="username" name="username" required>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required>
            <div class="password-requirements">
              Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" required>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="agreeToTerms" name="agreeToTerms" required>
              <span>I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a></span>
            </label>
          </div>

          <button type="submit" class="btn primary" [disabled]="isLoading || !agreeToTerms">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Log in</a></p>
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
    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="password"] {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .password-requirements {
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.5rem;
    }
    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
    }
    .checkbox-label input {
      margin-top: 0.25rem;
    }
    .checkbox-label a {
      color: #0072b1;
      text-decoration: none;
    }
    .checkbox-label a:hover {
      text-decoration: underline;
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
export class RegisterComponent {
  username = ""
  email = ""
  password = ""
  confirmPassword = ""
  agreeToTerms = false
  isLoading = false
  errorMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = "Please fill in all fields."
      return
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match."
      return
    }

    if (this.password.length < 8) {
      this.errorMessage = "Password must be at least 8 characters long."
      return
    }

    if (!this.agreeToTerms) {
      this.errorMessage = "You must agree to the Terms of Service and Privacy Policy."
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    }

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(["/"])
      },
      error: (error) => {
        this.errorMessage = error.message || "Registration failed. Please try again."
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }
}
