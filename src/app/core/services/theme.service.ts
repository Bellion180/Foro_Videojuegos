import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"
import { BehaviorSubject } from "rxjs"

type Theme = "light" | "dark"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private renderer: Renderer2
  private theme = new BehaviorSubject<Theme>("light")
  public theme$ = this.theme.asObservable()
  private readonly THEME_KEY = "preferred-theme"

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null)
    this.initTheme()
  }

  private initTheme(): void {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null

    // Verificar si el sistema usa modo oscuro
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Usar el tema guardado, o el preferido del sistema, o light por defecto
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")

    this.setTheme(initialTheme)
  }

  public setTheme(theme: Theme): void {
    this.theme.next(theme)
    localStorage.setItem(this.THEME_KEY, theme)

    if (theme === "dark") {
      this.renderer.addClass(document.body, "dark-theme")
    } else {
      this.renderer.removeClass(document.body, "dark-theme")
    }
  }

  public toggleTheme(): void {
    const newTheme = this.theme.value === "light" ? "dark" : "light"
    this.setTheme(newTheme)
  }

  public getCurrentTheme(): Theme {
    return this.theme.value
  }
}
