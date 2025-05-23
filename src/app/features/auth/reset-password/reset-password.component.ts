import { Component, OnInit } from "@angular/core"
import { RouterLink, ActivatedRoute, Router } from "@angular/router"
import { FormsModule } from '@angular/forms'
import { AuthService } from "../../../core/services/auth.service"
import { NotificationService } from "../../../core/services/notification.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Restablecer Contraseña</h1>
          <p>Crea una nueva contraseña para tu cuenta</p>
        </div>

        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }

        @if (successMessage) {
          <div class="success-message">{{ successMessage }}</div>
        }

        @if (tokenInvalid) {
          <div class="error-message">
            El enlace para restablecer la contraseña es inválido o ha expirado.
            <p>Por favor solicita un nuevo enlace de restablecimiento.</p>
          </div>
          <div class="auth-footer">
            <a routerLink="/auth/forgot-password" class="btn secondary">Solicitar nuevo enlace</a>
            <p>¿Recuerdas tu contraseña? <a routerLink="/auth/login">Iniciar sesión</a></p>
          </div>
        } @else {
          <form class="auth-form" (ngSubmit)="resetPassword()" *ngIf="!successMessage">
            <div class="form-group">
              <label for="password">Nueva Contraseña</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="newPassword" 
                name="password" 
                required 
                minlength="8"
              >
              <div class="password-requirements">
                La contraseña debe tener al menos 8 caracteres
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required
              >
            </div>

            <button type="submit" class="btn primary" [disabled]="isLoading">
              {{ isLoading ? 'Procesando...' : 'Restablecer Contraseña' }}
            </button>
          </form>

          @if (successMessage) {
            <div class="auth-footer">
              <a routerLink="/auth/login" class="btn secondary">Ir a inicio de sesión</a>
            </div>
          }

          @if (!successMessage) {
            <div class="auth-footer">
              <p>¿Recuerdas tu contraseña? <a routerLink="/auth/login">Iniciar sesión</a></p>
            </div>
          }
        }
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
    .form-group input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .password-requirements {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #666;
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
    .secondary {
      background-color: #e9ecef;
      color: #1a1a2e;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .secondary:hover {
      background-color: #dee2e6;
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
    .auth-footer .btn {
      display: block;
      width: 100%;
      margin-bottom: 1rem;
    }
  `,
  ],
})
export class ResetPasswordComponent implements OnInit {
  email: string = ""
  token: string = ""
  newPassword: string = ""
  confirmPassword: string = ""
  isLoading: boolean = false
  errorMessage: string = ""
  successMessage: string = ""
  tokenInvalid: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
      
      if (!this.email || !this.token) {
        this.tokenInvalid = true;
        this.errorMessage = "El enlace de restablecimiento de contraseña es inválido o ha expirado.";
      }
    });
  }

  resetPassword(): void {
    if (!this.email || !this.token) {
      this.errorMessage = "Los datos de restablecimiento de contraseña son inválidos.";
      return;
    }

    if (!this.newPassword) {
      this.errorMessage = "Por favor ingresa una nueva contraseña.";
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = "La contraseña debe tener al menos 8 caracteres.";
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.resetPassword(this.email, this.token, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.";
        this.notificationService.success("Contraseña restablecida exitosamente.");
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || "Ha ocurrido un error al restablecer tu contraseña. El enlace puede haber expirado.";
        
        if (error.status === 400 && error.error?.message?.includes("Token")) {
          this.tokenInvalid = true;
        }
      }
    });
  }
}
