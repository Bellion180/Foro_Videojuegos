import type { Routes } from "@angular/router"
import { authGuard } from "../../core/guards/auth.guard"

export const THREADS_ROUTES: Routes = [
  {
    path: "latest",
    loadComponent: () => import("./threads-list/threads-list.component").then((m) => m.ThreadsListComponent),
  },
  {
    path: "create",
    loadComponent: () => import("./thread-create/thread-create.component").then((m) => m.ThreadCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: ":id",
    loadComponent: () => import("./thread-detail/thread-detail.component").then((m) => m.ThreadDetailComponent),
  },
]
