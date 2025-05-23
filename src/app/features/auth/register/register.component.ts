import { Component, OnInit } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
import { EmailService } from "../../../core/services/email.service";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join the GamersHub community</p>
        </div>

        @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
        }

        @if (successMessage) {
          <div class="success-message">{{ successMessage }}</div>
        }

        <form class="auth-form" (ngSubmit)="register()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username" 
              required
              minlength="3"
              maxlength="100"
              (input)="validateUsername()"
            >
            @if (usernameError) {
              <div class="input-error">{{ usernameError }}</div>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email" 
              required
              (input)="validateEmail()"
              [disabled]="isVerifyingEmail"
            >
            @if (emailError) {
              <div class="input-error">{{ emailError }}</div>
            }
            @if (isVerifyingEmail) {
              <div class="verifying-email">
                <span class="spinner"></span> Verifying email...
              </div>
            } @else {
              <div class="email-validation-info">
                Please enter a valid email address. A welcome message will be sent to verify your email.
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
                required
                minlength="8"
                (input)="validatePassword()"
              >              <button 
                type="button" 
                class="toggle-password" 
                (click)="showPassword = !showPassword"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
              >
                <span>{{ showPassword ? '🔒' : '👁️' }}</span>
              </button>
            </div>
            <div class="password-requirements">
              Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
            </div>
            @if (passwordError) {
              <div class="input-error">{{ passwordError }}</div>
            }
          </div>          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input-container">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required
                (input)="validatePasswordMatch()"
              >              <button 
                type="button" 
                class="toggle-password" 
                (click)="showConfirmPassword = !showConfirmPassword"
                [attr.aria-label]="showConfirmPassword ? 'Hide password' : 'Show password'"
              >
                <span>{{ showConfirmPassword ? '🔒' : '👁️' }}</span>
              </button>
            </div>
            @if (confirmPasswordError) {
              <div class="input-error">{{ confirmPasswordError }}</div>
            }
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="agreeToTerms" name="agreeToTerms" required>
              <span>I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a></span>
            </label>
          </div>          <button type="submit" class="btn primary" [disabled]="isLoading || isVerifyingEmail || !isFormValid()">
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
    }    .auth-card {
      background-color: var(--bg-secondary, #f8f9fa);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1), var(--purple-glow);
      border: 3px solid var(--purple-border);
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      color: var(--text-primary);
    }
      color: var(--text-primary);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    .auth-header p {
      color: var(--text-secondary);
    }    .error-message {
      background-color: rgba(239, 68, 68, 0.2);
      color: var(--danger, #ef4444);
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
      border: 1px solid var(--danger, #ef4444);
    }
    .success-message {
      background-color: rgba(16, 185, 129, 0.2);
      color: var(--success, #10b981);
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
      border: 1px solid var(--success, #10b981);
    }.input-error {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-primary);
    }    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="password"] {
      padding: 0.75rem;
      border: 1px solid var(--input-border, #ddd);
      border-radius: 4px;
      background-color: var(--input-bg, #fff);
      color: var(--input-text, #333);
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
    }.password-requirements {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      padding: 0.5rem;
      background-color: rgba(148, 163, 184, 0.1);
      border-radius: 4px;
    }    .email-validation-info {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      padding: 0.5rem;
      background-color: rgba(148, 163, 184, 0.1);
      border-radius: 4px;
    }.verifying-email {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      color: var(--primary, #0072b1);
      margin-top: 0.5rem;
    }
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 8px;
      border: 2px solid rgba(0, 114, 177, 0.3);
      border-top-color: var(--primary, #0072b1);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--text-primary);
    }
    .checkbox-label input {
      margin-top: 0.25rem;
    }
    .checkbox-label a {
      color: var(--primary, #0072b1);
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
    }    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .auth-footer a {
      color: var(--primary, #0072b1);
      text-decoration: none;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `,
  ],
})
export class RegisterComponent implements OnInit {  
  username = "";  
  email = "";
  password = "";
  confirmPassword = "";
  agreeToTerms = false;
  isLoading = false;
  isVerifyingEmail = false;
  errorMessage = "";
  successMessage = "";
  showPassword = false;
  showConfirmPassword = false;
  isDarkTheme = false;
  
  // Error messages for individual fields
  usernameError = "";
  emailError = "";
  passwordError = "";
  confirmPasswordError = "";  constructor(
    private authService: AuthService,
    private router: Router,
    private emailService: EmailService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  // Validación del nombre de usuario
  validateUsername(): void {
    if (this.username.length < 3) {
      this.usernameError = "Username must be at least 3 characters long.";
    } else if (this.username.length > 100) {
      this.usernameError = "Username must be less than 100 characters.";
    } else {
      this.usernameError = "";
    }
  }  // Validación del email
  validateEmail(): void {
    // Si ya está verificando, no hacer nada
    if (this.isVerifyingEmail) return;
    
    // Primera validación básica con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = "Please enter a valid email address.";
      return;
    }

    // Validaciones adicionales para correos más específicos
    // 1. Verificar que tiene un dominio válido
    const emailParts = this.email.split('@');
    if (emailParts.length !== 2) {
      this.emailError = "Email must have exactly one @ symbol.";
      return;
    }

    const domainParts = emailParts[1].split('.');
    if (domainParts.length < 2) {
      this.emailError = "Invalid email domain.";
      return;
    }

    // 2. Verificar que el TLD tiene al menos 2 caracteres
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      this.emailError = "Invalid top-level domain in email.";
      return;
    }

    // 3. Verificar que el nombre de usuario no comienza ni termina con puntos
    const username = emailParts[0];
    if (username.startsWith('.') || username.endsWith('.') || username.includes('..')) {
      this.emailError = "Invalid username part in email.";
      return;
    }

    // Pasó todas las validaciones básicas
    this.emailError = "";
    
    // Solo realizar verificación si el email tiene un formato válido y si tiene al menos 5 caracteres
    if (this.email.length >= 5 && this.email.includes('@') && this.email.includes('.')) {
      this.checkEmailFormatDebounced();
    }
  }
  
  // Temporizador para la verificación del email
  private emailCheckTimer: any = null;
  
  // Verificación del formato del email con debounce
  private checkEmailFormatDebounced() {
    // Limpiar temporizador previo
    if (this.emailCheckTimer) {
      clearTimeout(this.emailCheckTimer);
    }
    
    // Configurar nuevo temporizador (debounce de 800ms)
    this.emailCheckTimer = setTimeout(() => {
      this.performEmailCheck();
    }, 800);
  }
  
  // Simula una verificación de email
  private performEmailCheck() {
    if (!this.email || this.emailError) return;
    
    this.isVerifyingEmail = true;
    
    // Simulamos la verificación con un timeout
    setTimeout(() => {
      this.isVerifyingEmail = false;
      
      // Verificamos si contiene dominios comunes
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'];
      const domain = this.email.split('@')[1]?.toLowerCase();
      
      if (domain && !validDomains.includes(domain)) {
        // No es un error, solo una advertencia que se mostrará pero no bloqueará
        console.log(`Dominio menos común: ${domain}`);
      }
    }, 1500);
  }

  // Validación de la contraseña
  validatePassword(): void {
    if (this.password.length < 8) {
      this.passwordError = "Password must be at least 8 characters long.";
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(this.password);
    const hasNumber = /\d/.test(this.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

    if (!hasLetter || !hasNumber || !hasSpecialChar) {
      this.passwordError = "Password must include letters, numbers, and symbols.";
    } else {
      this.passwordError = "";
    }

    // Si hay confirmación de contraseña, validar también
    if (this.confirmPassword) {
      this.validatePasswordMatch();
    }
  }

  // Validación de coincidencia de contraseñas
  validatePasswordMatch(): void {
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = "Passwords do not match.";
    } else {
      this.confirmPasswordError = "";
    }
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return (
      this.username.length >= 3 &&
      this.username.length <= 100 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) &&
      this.password.length >= 8 &&
      /[a-zA-Z]/.test(this.password) &&
      /\d/.test(this.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(this.password) &&
      this.password === this.confirmPassword &&
      this.agreeToTerms
    );
  }
  
  register(): void {
    // Validar todos los campos antes de enviar
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validatePasswordMatch();

    if (!this.isFormValid()) {
      this.errorMessage = "Please correct the errors in the form.";
      return;
    }    // No continuar si todavía está verificando el email
    if (this.isVerifyingEmail) {
      this.errorMessage = "Please wait while we verify your email.";
      return;
    }
      this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";
    
    // Validar que el email existe - esto ocurre en el backend
    // cuando se envía el correo de verificación
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      // Agregar campos adicionales según tu tabla
      avatar: "", // Puedes dejarlo vacío o asignar un avatar por defecto
      bio: "", // Campo opcional
      role: "user" // Por defecto según tu tabla
    };
    
    this.authService.register(userData).subscribe({
      next: (response: any) => {
        // Comprobar el mensaje de la respuesta para determinar si necesita verificación
        let requiresVerification = false;
        
        // Comprobar si la respuesta contiene indicación de verificación
        if (response && response.requiresVerification) {
          requiresVerification = true;
        } else if (response && response.message && response.message.includes('verifica')) {
          requiresVerification = true;
        }
        
        if (requiresVerification) {
          this.successMessage = "¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.";
          
          // Mostrar notificación de email de verificación enviado
          this.emailService.showEmailSentNotification(this.email, this.username);
          
          // Redirigir a página de login con mensaje
          setTimeout(() => {
            this.router.navigate(["/auth/login"], { 
              queryParams: { 
                message: "verification_pending",
                email: this.email
              } 
            });
          }, 3000);
        } else {
          // Flujo anterior para casos donde no se requiere verificación
          this.successMessage = "¡Registro exitoso! Se ha enviado un correo de bienvenida a tu dirección. Redirigiendo...";
          this.emailService.showEmailSentNotification(this.email, this.username);
          
          setTimeout(() => {
            this.router.navigate(["/"]);
          }, 2000);
        }
      },
      error: (error) => {
        if (error.status === 409) {
          if (error.error.message.includes("email")) {
            this.emailError = "This email is already registered.";
          } else if (error.error.message.includes("username")) {
            this.usernameError = "This username is already taken.";
          }
        } else {
          this.errorMessage = error.message || "Registration failed. Please try again.";
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}