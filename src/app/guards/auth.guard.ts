import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: (roles?: string[]) => CanActivateFn =
  (allowedRoles: string[] = []) => () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token) {
      router.navigate(['/authentication/login']);
      return false;
    }

    if (allowedRoles.length && !allowedRoles.includes(rol || '')) {
      router.navigate(['/no-autorizado']);
      return false;
    }

    return true;
  };
