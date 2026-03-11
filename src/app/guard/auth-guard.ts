import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/authservice';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, of, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  const token = localStorage.getItem('access_token');

  // 1. Sin token -> Login
  if (!token) return redirectToLogin(state.url);

  // 2. Token expirado -> Intentar renovar
  if (jwtHelper.isTokenExpired(token)) {
    return authService.refreshToken().pipe(
      switchMap(success => success
        ? of(true)
        : of(redirectToLogin(state.url))
      ))
  }

  // 3. Token válido -> Acceso permitido
  return true;

  // Función auxiliar
  function redirectToLogin(returnUrl: string): UrlTree {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
  }
};

