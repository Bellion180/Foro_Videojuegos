import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const authGuard = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isLoggedIn()) {
    return true
  }

  // Store the attempted URL for redirecting after login
  router.navigate(["/auth/login"], {
    queryParams: { returnUrl: router.routerState.snapshot.url },
  })
  return false
}
