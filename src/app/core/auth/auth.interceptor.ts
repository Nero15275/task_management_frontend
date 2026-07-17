import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

import { StorageService } from '../services/storage.service';
import { AuthService } from "../../features/auth/auth.service"; 

const MAX_RETRIES = 3;

// Elegant state handling using Angular's HttpContext rather than raw request headers
const RETRY_COUNT = new HttpContextToken<number>(() => 0);

let isRefreshing = false;
let refreshSubject = new Subject<string>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const authService = inject(AuthService);

  // Exclude auth-specific endpoints from interceptor logic
  const EXCLUDED_URLS = [
    '/v1/auth/login',
    '/v1/auth/refresh',

  ];
  
  const isAuthRequest = EXCLUDED_URLS.some((url) => req.url.includes(url));
  if (isAuthRequest) {
    return next(req);
  }

  const token = storage.getToken();
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // We only care about unauthorized (401) errors
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const retry = authReq.context.get(RETRY_COUNT);

      // Check max retry limits to avoid infinite refresh loops
      if (retry >= MAX_RETRIES) {
        authService.logout();
        return throwError(() => error);
      }

      // If a refresh is already happening, park this request in the queue
      if (isRefreshing) {
        return refreshSubject.pipe(
          take(1),
          switchMap((newToken) =>
            next(
              authReq.clone({
                context: authReq.context.set(RETRY_COUNT, retry + 1),
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              })
            )
          )
        );
      }

      // Start the refresh cycle
      isRefreshing = true;

      return authService.refreshToken().pipe(
        switchMap((response) => {
          isRefreshing = false;
          const newAccessToken = response.data.accessToken;

          // Dispatch the fresh token to all waiting queued requests
          refreshSubject.next(newAccessToken);

          const retriedReq = authReq.clone({
            context: authReq.context.set(RETRY_COUNT, retry + 1),
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return next(retriedReq);
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          
          // CRITICAL: Propagate error to queued requests so they don't hang, then reset
          refreshSubject.error(refreshError);
          refreshSubject = new Subject<string>();

          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};