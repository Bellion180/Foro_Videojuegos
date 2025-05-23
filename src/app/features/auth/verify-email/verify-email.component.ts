import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Email Verification</h1>
        </div>

        @if (loading) {
          <div class="verification-status">
            <div class="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        } @else if (verified) {
          <div class="verification-status success">
            <div class="icon-success">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>Your account has been activated. You can now access all features of GamersHub.</p>
            <div class="auth-actions">
              <button class="btn btn-primary" (click)="goToHomePage()">Go to Homepage</button>
            </div>
          </div>
        } @else if (error) {
          <div class="verification-status error">
            <div class="icon-error">✗</div>
            <h2>Verification Failed</h2>
            <p>{{ errorMessage }}</p>
            <div class="auth-actions">
              @if (showResendButton) {
                <button class="btn btn-secondary" (click)="resendVerification()">
                  Resend Verification Email
                </button>
              }
              <a routerLink="/auth/login" class="btn btn-link">Back to Login</a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .verification-status {
      text-align: center;
      padding: 2rem 1rem;
      
      h2 {
        margin: 1rem 0;
      }
      
      p {
        margin-bottom: 1.5rem;
        color: #666;
      }
    }
    
    .spinner {
      display: inline-block;
      width: 50px;
      height: 50px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #3498db;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .success .icon-success {
      color: #2ecc71;
      font-size: 3rem;
      border: 3px solid #2ecc71;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      line-height: 54px;
      display: inline-block;
    }
    
    .error .icon-error {
      color: #e74c3c;
      font-size: 3rem;
      border: 3px solid #e74c3c;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      line-height: 54px;
      display: inline-block;
    }
    
    .auth-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
      
      button, a {
        width: 100%;
      }
    }
  `
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  verified = false;
  error = false;
  errorMessage = '';
  email = '';
  showResendButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const token = params['token'];
      
      if (!email || !token) {
        this.setError('Invalid verification link. Missing email or token.');
        return;
      }
      
      this.email = email;
      this.verifyEmail(email, token);
    });
  }

  verifyEmail(email: string, token: string): void {
    this.loading = true;
    this.authService.verifyEmail(email, token).subscribe({
      next: (response) => {
        this.loading = false;
        this.verified = true;
        
        // Si la respuesta incluye un token de autenticación, guardar la sesión
        if (response.token) {
          this.authService.saveUserSession(response.user, response.token, response.refreshToken);
        }
        
        this.notificationService.success('Email verified successfully! Your account is now active.');
      },
      error: (err) => {
        this.loading = false;
        this.setError(err.error.message || 'Failed to verify email. Please try again later.');
        this.showResendButton = true;
      }
    });
  }

  resendVerification(): void {
    if (!this.email) {
      this.notificationService.error('Email address is required for resending verification.');
      return;
    }
    
    this.loading = true;
    this.authService.resendVerification(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Verification email has been resent. Please check your inbox.');
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error(err.error.message || 'Failed to resend verification email.');
      }
    });
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  private setError(message: string): void {
    this.loading = false;
    this.error = true;
    this.errorMessage = message;
  }
}
