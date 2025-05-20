import type { Routes } from "@angular/router"
import { authGuard } from "../../core/guards/auth.guard"

export const PROFILE_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./profile-view/profile-view.component").then((m) => m.ProfileViewComponent),
    canActivate: [authGuard],
  },
  {
    path: "edit",
    loadComponent: () => import("./profile-edit/profile-edit.component").then((m) => m.ProfileEditComponent),
    canActivate: [authGuard],
  },
]
