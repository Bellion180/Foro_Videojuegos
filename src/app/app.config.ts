import type { ApplicationConfig } from "@angular/core"
import { provideRouter, withComponentInputBinding, withViewTransitions } from "@angular/router"
import { routes } from "./app.routes"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { provideStore } from "@ngrx/store"
import { provideEffects } from "@ngrx/effects"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import { authInterceptor } from "./core/interceptor/auth.interceptor"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(), // Usar la versión async de provideAnimations
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
}
