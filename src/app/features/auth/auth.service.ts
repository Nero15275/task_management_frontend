import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StorageService } from '../../core/services/storage.service';
import { LoginResponse } from '../../core/models/user';
import { APP_CONFIG } from 'src/app/core/config/app.config.token';
import { SocketService } from 'src/app/core/socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Use modern inject() syntax matching the functional interceptor style
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private config = inject(APP_CONFIG);
  private socketService = inject(SocketService);
  private readonly authUrl = `${this.config.apiUrl}v1/auth`;

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
        this.socketService.connect();
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


  logout(): void {
    this.http.get(`${this.authUrl}/logout`,{ withCredentials: true }).subscribe({
      next: () => {
        this.socketService.disconnect();
        this.clearSessionAndRedirect()
      },
      error: () => {
        this.socketService.disconnect();
        this.clearSessionAndRedirect()
      }

    });
  }

  private clearSessionAndRedirect(): void {
    this.storageService.clean();
    this.router.navigate(['/login']);
  }
}
