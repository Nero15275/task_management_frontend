import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service'; // Adjust path if necessary
import { UserRole } from '../models/user'; // Adjust path if necessary

export const roleGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  // Retrieve the roles allowed for this specific route
  const expectedRoles = route.data['expectedRoles'] as Array<UserRole | string>;
  const rawUserRole = storageService.getUserRole();

  if (rawUserRole) {
    // Normalize string (e.g., 'Team Lead' -> 'team_lead') to match the UserRole enum values safely
    const normalizedUserRole = rawUserRole.toLowerCase().trim().replace(/\s+/g, '_');

    // Check if the user's role is authorized for this route
    const isAuthorized = expectedRoles.some(
      (role) => role.toLowerCase() === normalizedUserRole
    );

    if (isAuthorized) {
      return true;
    }
  }

  // If user role is not authorized or not found, redirect to dashboard
  router.navigate(['/']);
  return false;
};