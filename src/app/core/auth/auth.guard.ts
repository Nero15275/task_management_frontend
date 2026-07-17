import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service'; // Adjust path as needed

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  // Check if the user is logged in using our StorageService
  if (storageService.isLoggedIn()) {
    return true;
  }

  // If not logged in, redirect to the login page
  return router.createUrlTree(['/login']);
};