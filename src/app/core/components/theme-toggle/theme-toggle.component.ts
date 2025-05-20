import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ThemeService } from "../../services/theme.service"

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle" 
      (click)="toggleTheme()" 
      [attr.aria-label]="isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'"
    >
      <div class="icon-container">
        <!-- Sol (tema claro) -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="sun-icon" 
          [class.active]="!isDarkTheme"
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        
        <!-- Luna (tema oscuro) -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="moon-icon" 
          [class.active]="isDarkTheme"
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
    </button>
  `,
  styles: [
    `
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-primary);
      background-color: var(--bg-tertiary);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .theme-toggle:hover {
      background-color: var(--primary-light);
      color: white;
      transform: scale(1.1);
    }
    
    .icon-container {
      position: relative;
      width: 24px;
      height: 24px;
    }
    
    .sun-icon, .moon-icon {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s ease;
    }
    
    .sun-icon.active, .moon-icon.active {
      opacity: 1;
      transform: scale(1);
    }
  `,
  ],
})
export class ThemeToggleComponent implements OnInit {
  isDarkTheme = false

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === "dark"
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
}
