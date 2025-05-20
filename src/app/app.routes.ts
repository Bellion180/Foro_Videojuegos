import type { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "forums",
    loadChildren: () => import("./features/forums/forums.routes").then((r) => r.FORUMS_ROUTES),
  },
  {
    path: "threads",
    loadChildren: () => import("./features/threads/threads.routes").then((r) => r.THREADS_ROUTES),
  },
  {
    path: "profile",
    loadChildren: () => import("./features/profile/profile.routes").then((r) => r.PROFILE_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then((r) => r.AUTH_ROUTES),
  },
  {
    path: "**",
    loadComponent: () => import("./core/components/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },
]
