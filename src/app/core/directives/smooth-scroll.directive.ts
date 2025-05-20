import { Directive, HostListener, Input } from "@angular/core"

@Directive({
  selector: "[appSmoothScroll]",
  standalone: true,
})
export class SmoothScrollDirective {
  @Input() appSmoothScroll = ""
  @Input() offset = 90 // Offset para el header fijo

  @HostListener("click", ["$event"])
  onClick(event: Event) {
    event.preventDefault()

    if (!this.appSmoothScroll) return

    const targetElement = document.querySelector(this.appSmoothScroll)

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - this.offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }
}
