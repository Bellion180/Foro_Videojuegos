import type { Routes } from "@angular/router"

export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    loadComponent: () => import("./login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "forgot-password",
    loadComponent: () => import("./forgot-password/forgot-password.component").then((m) => m.ForgotPasswordComponent),
  },
  {
    path: "verify-email",
    loadComponent: () => import("./verify-email/verify-email.component").then((m) => m.VerifyEmailComponent),
  },
]
