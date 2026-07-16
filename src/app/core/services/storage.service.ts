import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  // Clear storage on logout
  clean(): void {
    localStorage.clear();
  }

  // Save & Get Token
  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Save & Get User Object (contains username, email, role)
  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Quick helper to check if user is logged in
  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Quick helper to get the user's role for RBAC
  public getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null; // Returns 'Manager', 'Team Lead', or 'Employee'
  }
}