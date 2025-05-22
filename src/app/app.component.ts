import { Component, OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "./core/components/header/header.component"
import { FooterComponent } from "./core/components/footer/footer.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { AnimatedBackgroundComponent } from "./core/components/animated-background/animated-background.component"
import { NotificationsComponent } from "./core/components/notifications/notifications.component"
import { CommonModule } from "@angular/common"
import { AuthService } from "./core/services/auth.service"
import { TokenService } from "./core/services/token.service"
import { NotificationService } from "./core/services/notification.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AnimatedBackgroundComponent,
    NotificationsComponent,
    CommonModule,
  ],
  template: `
    <app-animated-background></app-animated-background>
    <app-notifications></app-notifications>
    <div class="app-container" id="top">
      <app-header></app-header>
      <div class="content-container">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      min-height: 100vh;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: transparent;
      position: relative;
      z-index: 1;
    }
    
    .content-container {
      display: flex;
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: 1rem;
      gap: 1.5rem;
      margin-top: 90px; /* Espacio para el header fijo */
    }
    
    .main-content {
      flex: 1;
      border-radius: var(--border-radius);
      padding: 1.5rem;
      background-color: var(--card-bg);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow);
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .content-container {
        flex-direction: column;
        padding: 0.5rem;
      }
      .main-content {
        padding: 1rem;
      }
    }
  `,  ],
})
export class AppComponent implements OnInit {
  title = "gaming-forum"
  
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit() {
    // Al iniciar la aplicación, verificamos la sesión
    this.checkStoredSession();
    
    // Configurar listener para el evento visibilitychange
    // Esto permite verificar la sesión cuando el usuario vuelve a la pestaña
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('Documento visible nuevamente, verificando sesión...');
        this.checkStoredSession(false);
      }
    });
    
    // Configurar listener para el evento offline/online
    // Verificar la sesión cuando se recupera la conexión
    window.addEventListener('online', () => {
      console.log('Conexión recuperada, verificando sesión...');
      this.checkStoredSession(false);
    });
  }
  
  /**
   * Verifica si hay una sesión almacenada y la valida
   * @param showLoading Indica si se debe mostrar mensaje de carga
   */
  private checkStoredSession(showLoading: boolean = true) {
    const token = this.authService.getToken();
    
    if (token) {
      console.log('Token encontrado en almacenamiento, verificando validez...');
      
      // Verificar primero localmente si el token ha expirado
      if (this.tokenService.isTokenExpired(token)) {
        console.warn('Token expirado según verificación local, cerrando sesión');
        this.notificationService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        this.authService.logout();
        return;
      }
      
      // Verificar si el token está a punto de expirar
      if (this.tokenService.needsRefresh(token)) {
        console.log('Token a punto de expirar, intentando renovarlo...');
        this.authService.refreshToken().subscribe({
          next: (newToken) => {
            console.log('Token renovado exitosamente al iniciar');
          },
          error: (err) => {
            console.error('Error al renovar token inicial:', err);
          }
        });
      }
      
      if (showLoading) {
        this.notificationService.info('Restaurando sesión...');
      }
      
      // Verificar token con el backend
      this.authService.getProfile().subscribe({
        next: (user) => {
          console.log('Sesión restaurada correctamente:', user.username);
          if (showLoading) {
            this.notificationService.success(`¡Bienvenido de nuevo, ${user.username}!`);
          }
        },
        error: (err) => {
          console.error('Error al restaurar sesión:', err);
          if (err.status === 401 || err.status === 403) {
            this.notificationService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            this.authService.logout();
          }
        }
      });
    } else {
      console.log('No se encontró token en almacenamiento');
    }
  }
}
