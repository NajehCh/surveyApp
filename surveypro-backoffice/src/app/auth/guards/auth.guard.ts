import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isBrowser } from '../../utils/storage.utils';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!isBrowser()) {
    // Côté serveur → autoriser pour éviter l'erreur
    return true;
  }

  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
