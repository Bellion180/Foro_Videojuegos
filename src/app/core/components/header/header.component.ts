import { Component, OnInit, OnDestroy } from "@angular/core" // Added OnInit, OnDestroy
import { RouterLink, RouterLinkActive } from "@angular/router"
import { NgClass, CommonModule } from "@angular/common"
import { AuthService } from "../../services/auth.service"
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component"
import type { User } from "../../models/user.model"; // Added User import

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ThemeToggleComponent],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <div class="floating-icons">
        <span class="game-icon" style="left: 10%; animation-delay: 0s;">🎮</span>
        <span class="game-icon" style="left: 25%; animation-delay: 2s;">🎲</span>
        <span class="game-icon" style="left: 40%; animation-delay: 4s;">👾</span>
        <span class="game-icon" style="left: 55%; animation-delay: 6s;">🏆</span>
        <span class="game-icon" style="left: 70%; animation-delay: 8s;">⚔️</span>
        <span class="game-icon" style="left: 85%; animation-delay: 10s;">🎯</span>
      </div>
      <div class="header-container">
        <div class="logo">
          <a routerLink="/">
            <span class="logo-icon">🎮</span>
            <span class="logo-text">Gamers<span class="logo-highlight">Hub</span></span>
          </a>
        </div>
        
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Toggle menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
        
        <nav class="nav" [class.active]="mobileMenuOpen">
          <ul class="nav-list">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
            <li><a routerLink="/forums" routerLinkActive="active">Forums</a></li>
            <li><a routerLink="/threads/latest" routerLinkActive="active">Latest Discussions</a></li>
            <li class="theme-toggle-container"><app-theme-toggle></app-theme-toggle></li>
            @if (authService.isAuthStatusKnown()) {
              @if (authService.isLoggedIn()) {
                <li class="dropdown">
                  <a class="dropdown-toggle">
                    <span class="user-avatar">
                      <img [src]="currentUser?.avatar || '/assets/images/default-avatar.png'" alt="User avatar">
                    </span>
                    <span>{{ currentUser?.username || 'My Account' }}</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li><a routerLink="/profile" routerLinkActive="active">My Profile</a></li>
                    <li><a routerLink="/profile/edit" routerLinkActive="active">Settings</a></li>
                    <li><button (click)="logout()" class="logout-btn">Logout</button></li>
                  </ul>
                </li>
              } @else {
                <li><a routerLink="/auth/login" routerLinkActive="active" class="login-btn">Login</a></li>
                <li><a routerLink="/auth/register" routerLinkActive="active" class="register-btn">Register</a></li>
              }
            } @else {
              <!-- Optionally, show a loading indicator or nothing while auth status is unknown -->
              <li><span class="loading-auth">Loading...</span></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
    .header {
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
      overflow: hidden;
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
    }

    .floating-icons {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
    }

    .game-icon {
      position: absolute;
      font-size: 1.2rem;
      opacity: 0.2;
      animation: floatIcon 10s linear infinite;
    }

    @keyframes floatIcon {
      0% {
        transform: translateY(100%) rotate(0deg);
        opacity: 0;
      }
      10% { opacity: 0.2; }
      90% { opacity: 0.2; }
      100% {
        transform: translateY(-100%) rotate(360deg);
        opacity: 0;
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
    }
    .dropdown {
      position: relative;
    }
    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
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
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: var(--background-primary);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      padding: 0.5rem;
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s;
    }
    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .dropdown-menu li {
      margin: 0;
    }
    .dropdown-menu a, .dropdown-menu button {
      display: block;
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--border-radius);
      transition: all 0.3s;
      text-align: left;
      width: 100%;
      font-size: 0.9rem;
      background: none;
      border: none;
    }
    .dropdown-menu a:hover, .dropdown-menu button:hover {
      background-color: rgba(126, 34, 206, 0.1);
      color: var(--primary);
    }
    .logout-btn {
      color: var(--danger) !important;
    }
    .logout-btn:hover {
      background-color: rgba(239, 68, 68, 0.1) !important;
      color: var(--danger) !important;
    }
    @media (max-width: 768px) {
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
      .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        padding: 0;
        margin-top: 0.5rem;
        margin-left: 1rem;
        width: 100%;
      }
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

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  onScroll = () => {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  logout(): void {
    this.authService.logout()
    this.mobileMenuOpen = false
  }
}
