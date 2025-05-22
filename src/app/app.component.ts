import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "./core/components/header/header.component"
import { FooterComponent } from "./core/components/footer/footer.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { AnimatedBackgroundComponent } from "./core/components/animated-background/animated-background.component"
import { NotificationsComponent } from "./core/components/notifications/notifications.component"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-root",
  standalone: true,  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AnimatedBackgroundComponent,
    NotificationsComponent,
    CommonModule,
  ],  template: `
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
  `,
  ],
})
export class AppComponent {
  title = "gaming-forum"
}
