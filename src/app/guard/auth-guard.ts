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

  if (!token) return redirectToLogin(state.url);

  if (jwtHelper.isTokenExpired(token)) {
    return authService.refreshToken().pipe(
      switchMap(success => success
        ? of(true)
        : of(redirectToLogin(state.url))
      ))
  }

  return true;

  function redirectToLogin(returnUrl: string): UrlTree {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
  }
};

