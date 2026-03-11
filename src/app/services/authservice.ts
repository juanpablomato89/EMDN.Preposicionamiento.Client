import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { LoginRequest } from '../models/request/loginrequests';
import { SignUpRequest } from '../models/request/signuprequest';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { ResetPasswordRequest } from '../models/request/resetpasswordrequests';

@Injectable({
  providedIn: 'root',
})
export class AuthService {  
  private loggedIn = new BehaviorSubject<boolean>(this.hasValidToken());
  private error$ = new Subject<any>();

  private googleLoggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());
  private googleerror$ = new Subject<any>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
  }

  login(credentials: LoginRequest) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/auth/login`, credentials, {
        observe: 'response',
      })
      .pipe(
        tap({
          next: (response) => {
            const authHeader = response.headers.get('Authorization');
            const refreshTokenHeader = response.headers.get('RefreshToken');

            if (authHeader && refreshTokenHeader) {
              const accessToken = authHeader.replace('Bearer ', '');
              localStorage.setItem('access_token', accessToken);
              localStorage.setItem('refreshToken', refreshTokenHeader);
              this.loggedIn.next(true);
            }
          },
          error: (error) => this.handleLoginError(error)
        })
      );
  }

  private handleLoginError(error: any) {
    this.error$.next(error.error);
  }

  signUp(credentials: SignUpRequest): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/auth/register`,
      credentials
    );
  }

  logout() {
    this.httpClient
      .post<any>(`${environment.apiUrl}/auth/logout`, {})
      .subscribe({
        next: () => this.clearAuthData(),
        error: (error) => this.handleLogoutError(error)
      });
  }

  private clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  private handleLogoutError(error: any) {
    this.clearAuthData();
    this.error$.next(error.error);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getErrorObservable(): Observable<any> {
    return this.error$.asObservable();
  }

  isgoogleLoggedIn(): Observable<boolean> {
    return this.googleLoggedIn$.asObservable();
  }

  getgoogleErrorObservable(): Observable<any> {
    return this.googleerror$.asObservable();
  }

  hasValidToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const token = localStorage.getItem('access_token');
        return !!token && !this.jwtHelper.isTokenExpired(token);
      } catch (error) {
        console.error('Error verificando token', error);
        return false;
      }
    }
    return false;
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.httpClient.post<any>(`${environment.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      map(response => {
        if (response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
          this.loggedIn.next(true);
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.clearAuthData();
        return of(false);
      })
    );
  }

  sendResetLink(email: string): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/auth/send-code`,{email});
  }

  resetPassword(result: ResetPasswordRequest):Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/auth/reset-password`, result);
  }

  getUserValue(): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiUrl}/auth/user-details`);
   }
}