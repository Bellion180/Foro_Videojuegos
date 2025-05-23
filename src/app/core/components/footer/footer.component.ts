import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section branding">
          <div class="logo">
            <span class="logo-icon">🎮</span>
            <span class="logo-text">Gamers<span class="logo-highlight">Hub</span></span>
          </div>
          <p>The ultimate gaming community for discussing your favorite games, sharing tips, and connecting with fellow gamers.</p>
          <div class="social-links">
            <a href="#" aria-label="Twitter" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" aria-label="Discord" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 19c-4.3 0-7.8-3.5-7.8-7.8S7.7 3.4 12 3.4s7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8z"></path><path d="M12 19c-2.3 0-4.1-1.9-4.1-4.1S9.7 10.7 12 10.7s4.1 1.9 4.1 4.1-1.8 4.2-4.1 4.2z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="YouTube" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>
        
        <div class="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/forums">Forums</a></li>
            <li><a routerLink="/threads/latest">Latest Discussions</a></li>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-section links">
          <h3>Categories</h3>
          <ul>
            <li><a routerLink="/forums/1">Action Games</a></li>
            <li><a routerLink="/forums/2">RPG Discussion</a></li>
            <li><a routerLink="/forums/3">Strategy Games</a></li>
            <li><a routerLink="/forums/4">Indie Games</a></li>
          </ul>
        </div>
        
        <div class="footer-section newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest gaming news and community updates.</p>
          <form class="newsletter-form">
            <input type="email" placeholder="Your email address" required>
            <button type="submit" class="btn-subscribe">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 GamersHub. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
    .footer {
      background-color: var(--background-secondary);
      color: var(--text-primary);
      padding: 3rem 0 1rem;
      margin-top: 3rem;
      border-top: 1px solid var(--border-color);
    }
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      gap: 2rem;
    }
    .footer-section {
      flex: 1;
      min-width: 250px;
    }
    .branding {
      max-width: 350px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .logo-icon {
      font-size: 1.75rem;
    }
    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .logo-highlight {
      color: var(--primary);
    }
    .footer-section p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .social-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: var(--background-tertiary);
      border-radius: 50%;
      color: var(--text-primary);
      transition: all 0.3s;
    }
    .social-link svg {
      width: 20px;
      height: 20px;
    }
    .social-link:hover {
      background-color: var(--primary);
      color: white;
      transform: translateY(-3px);
    }
    .footer-section h3 {
      font-size: 1.2rem;
      margin-bottom: 1.25rem;
      position: relative;
      padding-bottom: 0.75rem;
      color: var(--text-primary);
    }
    .footer-section h3::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--primary-light);
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    .footer-section ul li {
      margin-bottom: 0.75rem;
    }
    .footer-section a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s;
      display: inline-block;
    }
    .footer-section a:hover {
      color: var(--primary);
      transform: translateX(3px);
    }
    .newsletter-form {
      display: flex;
      margin-top: 1rem;
    }
    .newsletter-form input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      background-color: var(--background-primary);
      color: var(--text-primary);
    }
    .newsletter-form input::placeholder {
      color: var(--text-secondary);
    }
    .newsletter-form input:focus {
      outline: none;
      border-color: var(--primary);
      background-color: var(--background-primary);
    }
    .btn-subscribe {
      padding: 0 1.25rem;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-subscribe:hover {
      background-color: var(--primary-dark);
    }
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid var(--border-color);
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1rem;
      padding-right: 1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .footer-bottom p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .footer-links {
      display: flex;
      gap: 1.5rem;
    }
    .footer-links a {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color 0.3s;
    }
    .footer-links a:hover {
      color: var(--primary);
    }
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 2rem;
      }
      .footer-section {
        min-width: 100%;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
      .footer-links {
        justify-content: center;
      }
    }
  `,
  ],
})
export class FooterComponent {}
