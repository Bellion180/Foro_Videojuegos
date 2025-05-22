import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { NotificationService } from "../services/notification.service"

export const roleGuard = (allowedRoles: string[]) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const notificationService = inject(NotificationService)
  const user = authService.getCurrentUserValue()
  
  // First check if the user is logged in
  if (!authService.isLoggedIn()) {
    notificationService.warning('Debes iniciar sesión para acceder a esta página')
    router.navigate(["/auth/login"], {
      queryParams: { returnUrl: router.routerState.snapshot.url },
    })
    return false
  }
  
  // Then check if the user has the required role
  if (user && allowedRoles.includes(user.role)) {
    return true
  }
  
  // If user doesn't have permission
  notificationService.error('No tienes permiso para acceder a esta página')
  router.navigate(["/"])
  return false
}
