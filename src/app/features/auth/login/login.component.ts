import { Component } from "@angular/core"
import { RouterLink, ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { NotificationService } from "../../../core/services/notification.service"

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
        </div>        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }
        
        <form class="auth-form" (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email" 
              #emailInput="ngModel"
              required 
              email
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              [class.input-error]="emailInput.invalid && (emailInput.dirty || emailInput.touched)"
            >
            @if (emailInput.invalid && (emailInput.dirty || emailInput.touched)) {
              <div class="validation-error">
                @if (emailInput.errors?.['required']) {
                  <span>Email is required</span>
                } @else if (emailInput.errors?.['email'] || emailInput.errors?.['pattern']) {
                  <span>Please enter a valid email address</span>
                }
              </div>
            }
          </div>          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                [(ngModel)]="password" 
                name="password" 
                #passwordInput="ngModel"
                required
                minlength="6"
                [class.input-error]="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)"
              >              <button 
                type="button" 
                class="toggle-password" 
                (click)="showPassword = !showPassword"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
              >
                <span>{{ showPassword ? '🔒' : '👁️' }}</span>
              </button>
            </div>
            @if (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)) {
              <div class="validation-error">
                @if (passwordInput.errors?.['required']) {
                  <span>Password is required</span>
                } @else if (passwordInput.errors?.['minlength']) {
                  <span>Password must be at least 6 characters long</span>
                }
              </div>
            }
            <div class="forgot-password">
              <a routerLink="/auth/forgot-password">Forgot password?</a>
            </div>
          </div><div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              <span>Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            class="btn primary" 
            [disabled]="isLoading || (loginForm.invalid && loginForm.touched)"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
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
      background-color:rgb(184, 139, 224);
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
    }    .error-message {
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
    }    .form-group input[type="email"],
    .form-group input[type="password"],
    .form-group input[type="text"] {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.3s ease;
    }
    .password-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    .password-input-container input {
      flex: 1;
      width: 100%;
    }    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .toggle-password:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .toggle-password:active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .form-group input.input-error {
      border-color: #dc2626;
    }
    .validation-error {
      color: #dc2626;
      font-size: 0.8rem;
      margin-top: 0.25rem;
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
  showPassword = false
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService  ) {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params["returnUrl"] || "/";
      
      // Check for verification_pending message
      if (params["message"] === "verification_pending" && params["email"]) {
        this.email = params["email"];
        this.errorMessage = "Please verify your email before logging in. Check your inbox.";
      }
    })
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = "Por favor, introduce tanto el email como la contraseña."
      return
    }

    // Validate email format
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = "Por favor, introduce un email válido."
      return
    }

    // Validate password length
    if (this.password.length < 6) {
      this.errorMessage = "La contraseña debe tener al menos 6 caracteres."
      return
    }    this.isLoading = true
    this.errorMessage = ""
    
    this.authService.login(this.email, this.password, this.rememberMe).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.notificationService.success(`¡Bienvenido ${user.username}! Has iniciado sesión correctamente.`);
        this.router.navigateByUrl(this.returnUrl)
      },
      error: (error) => {
        console.error('Login error:', error);
        
        // Verificar si el error es por falta de verificación de email
        if (error.error && error.error.requiresVerification) {
          this.errorMessage = "Please verify your email before logging in.";
          this.showResendVerificationOption(error.error.email || this.email);
        } else {
          this.errorMessage = error.message || "Error en el inicio de sesión. Por favor, verifica tus credenciales."
        }
        
        this.notificationService.error(this.errorMessage);
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }

  // Mostrar opción para reenviar email de verificación
  showResendVerificationOption(email: string): void {
    // Añadir al DOM un botón de reenvío de verificación
    const verificationMessage = document.createElement('div');
    verificationMessage.className = 'verification-message';
    verificationMessage.innerHTML = `
      <p>Didn't receive the verification email?</p>
      <button class="btn btn-secondary" id="resend-verification">Resend Verification Email</button>
    `;
    
    // Si ya existe un mensaje de verificación, eliminarlo
    const existingMessage = document.querySelector('.verification-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Insertar el mensaje después del mensaje de error
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage && errorMessage.parentNode) {
      errorMessage.parentNode.insertBefore(verificationMessage, errorMessage.nextSibling);
      
      // Configurar evento de clic en el botón
      const resendButton = document.getElementById('resend-verification');
      if (resendButton) {
        resendButton.onclick = () => {
          this.resendVerificationEmail(email);
        };
      }
    }
  }
  
  // Reenviar email de verificación
  resendVerificationEmail(email: string): void {
    this.isLoading = true;
    
    this.authService.resendVerification(email).subscribe({
      next: () => {
        this.notificationService.success('Verification email has been resent. Please check your inbox.');
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to resend verification email.');
        this.isLoading = false;
      }
    });
  }
}
