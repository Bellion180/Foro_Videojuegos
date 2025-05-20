import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <a routerLink="/" class="home-link">Return to Home</a>
    </div>
  `,
  styles: [
    `
    .not-found {
      text-align: center;
      padding: 4rem 1rem;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #ff9f1c;
    }
    h2 {
      font-size: 2rem;
      margin-top: 0;
    }
    p {
      margin-bottom: 2rem;
      color: #666;
    }
    .home-link {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #1a1a2e;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .home-link:hover {
      background-color: #ff9f1c;
    }
  `,
  ],
})
export class NotFoundComponent {}
