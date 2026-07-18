import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '@env';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { APP_CONFIG } from './core/config/app.config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: APP_CONFIG, useValue: environment },
   provideHttpClient(
      withInterceptors([authInterceptor])
    ),

  ]
};
