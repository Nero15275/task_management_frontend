import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StorageService } from '../../core/services/storage.service';
import { LoginResponse } from '../../core/models/user';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Use modern inject() syntax matching the functional interceptor style
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  private readonly authUrl = `${environment.apiUrl}v1/auth`;

  /**
   * Registers a new user
   */
  register(user: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${this.authUrl}/register`, user);
  }

  /**
   * Authenticates user credentials and captures session details
   */
  login(credentials: Record<string, unknown>): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, credentials,{ withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.accessToken) {
          this.storageService.saveToken(response.data.accessToken);
        }
        if (response?.data?.user) {
          this.storageService.saveUser(response.data.user);
        }
      })
    );
  }

  /**
   * Performs silent token refresh using HTTP-only cookie credentials
   */
  refreshToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.authUrl}/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response?.data?.accessToken) {
            this.storageService.saveToken(response.data.accessToken);
          }
        })
      );
  }

  /**
   * Logs out the user by notifying the server and cleaning local storage
   */
  logout(): void {
    this.http.get(`${this.authUrl}/logout`,{ withCredentials: true }).subscribe({
      next: () => this.clearSessionAndRedirect(),
      error: () => this.clearSessionAndRedirect(), // Force local cleanup even if API fails (e.g. token already expired)
    });
  }

  private clearSessionAndRedirect(): void {
    this.storageService.clean();
    this.router.navigate(['/login']);
  }
}
