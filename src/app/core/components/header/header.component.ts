import { Component, OnInit, OnDestroy } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"
import { NgClass, CommonModule } from "@angular/common"
import { AuthService } from "../../services/auth.service"
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ThemeToggleComponent],
  template: `    <header class="header" [class.scrolled]="isScrolled">
      <div class="floating-icons">
        <span class="floating-icon">🎮</span>
        <span class="floating-icon">🎲</span>
        <span class="floating-icon">👾</span>
        <span class="floating-icon">🏆</span>
        <span class="floating-icon">⚔️</span>
        <span class="floating-icon">🎯</span>
      </div>
      <div class="header-container">
        <div class="logo">
          <a routerLink="/">
            <span class="logo-icon">🎮</span>
            <span class="logo-text">Gamers<span class="logo-highlight">Hub</span></span>
          </a>
        </div>
        
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Alternar menú">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
        
        <nav class="nav" [class.active]="mobileMenuOpen">
          <ul class="nav-list">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a></li>
            <li><a routerLink="/forums" routerLinkActive="active">Foros</a></li>
            <li><a routerLink="/threads/latest" routerLinkActive="active">Últimas Discusiones</a></li>
            <li class="theme-toggle-container"><app-theme-toggle></app-theme-toggle></li>            <ng-container *ngIf="authService.isAuthStatusKnown()">              <ng-container *ngIf="authService.isLoggedIn(); else notLoggedIn">
                <li class="dropdown">                  <button type="button" class="dropdown-toggle" (click)="toggleDropdown($event)">
                    <span class="user-avatar">
                      <img [src]="currentUser?.avatar || '/assets/images/default-avatar.png'" alt="Avatar de usuario">
                    </span>
                    <span>{{ currentUser?.username || 'Mi Cuenta' }}</span>
                    <span class="dropdown-arrow" [class.rotated]="dropdownOpen">▼</span>
                  </button>
                  <!-- Usamos div.dropdown-container para asegurar posicionamiento correcto -->
                  <div class="dropdown-container" [style.display]="dropdownOpen ? 'block' : 'none'" [style.backgroundColor]="'var(--card-bg)'">
                    <div class="dropdown-menu">
                      <ul>
                        <li><a routerLink="/profile" routerLinkActive="active">Mi Perfil</a></li>
                        <li><a routerLink="/profile/edit" routerLinkActive="active">Ajustes</a></li>
                        <li><button type="button" (click)="logout()" class="logout-btn">Cerrar Sesión</button></li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ng-container>
              <ng-template #notLoggedIn>
                <li><a routerLink="/auth/login" routerLinkActive="active" class="login-btn">Iniciar Sesión</a></li>
                <li><a routerLink="/auth/register" routerLinkActive="active" class="register-btn">Registrarse</a></li>
              </ng-template>
            </ng-container>
            <li *ngIf="!authService.isAuthStatusKnown()">
              <span class="loading-auth">Cargando...</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `    .header {
      background-color: rgba(var(--header-bg-rgb), 0.85);
      backdrop-filter: blur(10px);
      box-shadow: var(--header-shadow);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 0.75rem 0;
      transition: all 0.3s ease;
      height: 70px;
      display: flex;
      align-items: center;
      position: relative;
      overflow: visible; /* Cambiado de hidden a visible para permitir que elementos sobresalgan */
    }

    .header.scrolled {
      background-color: var(--header-bg);
      box-shadow: var(--header-shadow);
      height: 60px; /* Altura ligeramente menor al hacer scroll */
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(var(--secondary-rgb), 0.1) 0%, transparent 50%);
      z-index: -1;
      animation: pulseBackground 8s ease-in-out infinite;
    }

    .header::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        repeating-linear-gradient(45deg, 
          rgba(var(--primary-rgb), 0.05) 0, 
          rgba(var(--primary-rgb), 0.05) 1px, 
          transparent 1px, 
          transparent 10px);
      opacity: 0.5;
      z-index: -1;
      animation: moveGrid 20s linear infinite;
    }

    @keyframes pulseBackground {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }

    @keyframes moveGrid {
      0% { transform: translateX(-50%) translateY(-50%) rotate(45deg); }
      100% { transform: translateX(0%) translateY(0%) rotate(45deg); }
    }    .floating-icons {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .floating-icon {
      position: absolute;
      font-size: 24px;
      opacity: 0;
      animation: float 15s infinite linear;
    }

    .floating-icon:nth-child(1) { left: 10%; animation-delay: 0s; top: -50px; }
    .floating-icon:nth-child(2) { left: 30%; animation-delay: -2.5s; top: -50px; }
    .floating-icon:nth-child(3) { left: 50%; animation-delay: -5s; top: -50px; }
    .floating-icon:nth-child(4) { left: 70%; animation-delay: -7.5s; top: -50px; }
    .floating-icon:nth-child(5) { left: 85%; animation-delay: -10s; top: -50px; }
    .floating-icon:nth-child(6) { left: 95%; animation-delay: -12.5s; top: -50px; }

    @keyframes float {
      0% {
        transform: translateY(-60px) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.5;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        transform: translateY(calc(100vh + 60px)) rotate(360deg);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion) {
      .floating-icon {
        animation: none;
        opacity: 0.3;
      }
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .logo a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      color: var(--text-primary);
      text-decoration: none;
    }
    .logo-icon {
      font-size: 1.75rem;
    }
    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
    }
    .logo-highlight {
      color: var(--primary);
    }
    .nav-list {
      display: flex;
      list-style: none;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
      align-items: center;
    }
    .nav-list a {
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      border-radius: var(--border-radius);
      transition: all 0.3s;
    }
    .nav-list a:hover, .nav-list a.active {
      color: var(--primary);
      background-color: rgba(126, 34, 206, 0.1);
    }
    .login-btn, .register-btn {
      padding: 0.5rem 1.25rem !important;
      border-radius: 9999px !important;
    }
    .login-btn {
      border: 2px solid var(--primary);
    }
    .register-btn {
      background-color: var(--primary);
      color: white !important;
    }
    .register-btn:hover {
      background-color: var(--primary-dark);
      color: white !important;
    }
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 10;
    }
    .bar {
      height: 3px;
      width: 100%;
      background-color: var(--text-primary);
      border-radius: 10px;
      transition: all 0.3s;
    }    .dropdown {
      position: relative;
      z-index: 2000; /* Aumentado significativamente */
    }
    
    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: var(--border-radius);
      transition: all 0.3s;
      color: var(--text-primary);
    }
    
    .dropdown-toggle:hover {
      background-color: rgba(126, 34, 206, 0.1);
      color: var(--primary);
    }    .dropdown-arrow {
      font-size: 0.7rem;
      margin-left: 0.2rem;
      transition: transform 0.3s;
      display: inline-block;
    }
    
    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--primary);
    }
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }    .dropdown-container {
      position: absolute;
      top: 100%;
      right: 0;
      width: auto;
      z-index: 9999; /* Extremadamente alto para asegurar visibilidad */
      pointer-events: auto;
    }    .dropdown-menu {
      background-color: var(--card-bg) !important; /* Forzar color de fondo sólido */
      border-radius: 12px; /* Esquinas más redondeadas */
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      padding: 0.5rem;
      min-width: 200px;
      margin-top: 5px;
      border: 2px solid var(--primary);
      overflow: hidden; /* Asegurar que los elementos internos respeten el borde redondeado */
    }.dropdown-menu li {
      margin: 0;
      border-bottom: 1px solid rgba(126, 34, 206, 0.1);
    }    .dropdown-menu a, .dropdown-menu button {
      display: block;
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 8px; /* Bordes redondeados para los elementos del menú */
      transition: all 0.3s;
      text-align: left;
      width: 100%;
      font-size: 0.9rem;
      background: none;
      border: none;
      font-weight: 500;
      margin: 0.15rem 0; /* Pequeño margen para separar los elementos */
    }
    .dropdown-menu a:hover, .dropdown-menu button:hover {
      background-color: var(--primary) !important;
      color: white !important;
    }.logout-btn {
      color: var(--danger) !important;
      font-weight: 500;
    }
    .logout-btn:hover {
      background-color: var(--danger) !important;
      color: white !important;
    }@media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
      }
      .mobile-menu-btn {
        display: flex;
      }
      .nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 80%;
        max-width: 300px;
        height: 100vh;
        background-color: var(--background-primary);
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        padding: 5rem 1.5rem 2rem;
        z-index: 5;
      }
      .nav.active {
        right: 0;
      }
      .nav-list {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .nav-list a {
        display: block;
        width: 100%;
      }
      .dropdown {
        width: 100%;
      }
      .dropdown-container {
        position: static;
        width: 100%;
      }      .dropdown-menu {
        box-shadow: none;
        border: 2px solid var(--primary);
        padding: 0.5rem 0;
        margin-top: 0.5rem;
        margin-left: 1rem;
        width: 100%;
        background-color: var(--card-bg) !important;
        border-radius: 12px; /* Esquinas más redondeadas, consistente con la versión de escritorio */
        overflow: hidden; /* Asegurar que los elementos internos respeten el borde redondeado */
      }
    }
  .dropdown.active {
      background-color: rgba(126, 34, 206, 0.05);
      border-radius: var(--border-radius);
    }    .dropdown-toggle:hover {
      background-color: rgba(126, 34, 206, 0.1);
      color: var(--primary);
    }
    
    .dropdown.active .dropdown-toggle {
      color: var(--primary);
      background-color: rgba(126, 34, 206, 0.1);
    }
    .theme-toggle-container {
      display: flex;
      align-items: center;
      margin-right: 0.5rem;
    }
  `,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy { // Implemented OnInit, OnDestroy
  isScrolled = false;
  mobileMenuOpen = false;
  currentUser: User | null | undefined;
  dropdownOpen = false; // Nueva propiedad para controlar el estado del dropdown
  constructor(
    public authService: AuthService
  ) {}  ngOnInit() {
    console.log('Header component initialized');
    
    // Obtener datos del usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user updated:', this.currentUser?.username);
    });

    // Registrar eventos
    window.addEventListener('scroll', this.onScroll);
    document.addEventListener('click', this.closeDropdownOnOutsideClick);
    
    console.log('Event listeners registered');
  }

  ngOnDestroy() {
    // Limpiar eventos
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('click', this.closeDropdownOnOutsideClick);
  }

  onScroll = () => {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }  toggleDropdown(event?: Event): void {
    // Prevenir comportamientos por defecto del evento
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Cambiamos el estado con timeout para mejor rendimiento
    setTimeout(() => {
      this.dropdownOpen = !this.dropdownOpen;
      console.log('Dropdown state toggled to:', this.dropdownOpen);
      
      // Añadir clase active al elemento dropdown para mejor visualización
      if (this.dropdownOpen) {
        const dropdownElement = document.querySelector('.dropdown');
        if (dropdownElement) {
          dropdownElement.classList.add('active');
        }
      } else {
        const dropdownElement = document.querySelector('.dropdown');
        if (dropdownElement) {
          dropdownElement.classList.remove('active');
        }
      }
    }, 0);
  }// Cerrar el dropdown cuando se hace clic fuera
  closeDropdownOnOutsideClick = (event: MouseEvent) => {
    // Solo procedemos si el dropdown está abierto
    if (!this.dropdownOpen) return;
    
    // Verificamos si el clic fue dentro del dropdown
    const dropdownElement = document.querySelector('.dropdown');
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      // Si el clic fue fuera, cerramos el dropdown
      this.dropdownOpen = false;
      console.log('Dropdown closed by outside click');
    }
  }

  logout(): void {
    this.authService.logout()
    this.mobileMenuOpen = false
    this.dropdownOpen = false
  }
}
