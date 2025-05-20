import { Component } from "@angular/core"
import { RouterLink, ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Log In</h1>
          <p>Welcome back to GamersHub</p>
        </div>

        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }

        <form class="auth-form" (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required>
            <div class="forgot-password">
              <a routerLink="/auth/forgot-password">Forgot password?</a>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" class="btn primary" [disabled]="isLoading">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
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
    .form-group input[type="email"],
    .form-group input[type="password"] {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .forgot-password {
      text-align: right;
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }
    .forgot-password a {
      color: #0072b1;
      text-decoration: none;
    }
    .forgot-password a:hover {
      text-decoration: underline;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .checkbox-label input {
      margin: 0;
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
export class LoginComponent {
  email = ""
  password = ""
  rememberMe = false
  isLoading = false
  errorMessage = ""
  returnUrl = "/"

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params["returnUrl"] || "/"
    })
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = "Please enter both email and password."
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl)
      },
      error: (error) => {
        this.errorMessage = error.message || "Login failed. Please check your credentials."
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }
}
