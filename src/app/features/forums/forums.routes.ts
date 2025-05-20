import type { Routes } from "@angular/router"

export const FORUMS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./forums-list/forums-list.component").then((m) => m.ForumsListComponent),
  },
  {
    path: ":id",
    loadComponent: () => import("./forum-detail/forum-detail.component").then((m) => m.ForumDetailComponent),
  },
]
