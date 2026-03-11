import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authservice';
import { LoginRequest } from '../../../models/request/loginrequests';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { finalize, takeUntil } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-form-login',
  imports: [CommonModule, ReactiveFormsModule, GoogleSigninButtonDirective],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  isLoadingGoogle = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }
  ngOnInit(): void {
    this.loginGoogleSocial();
    this.getErrorLoginGoogleSocial();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Login successful!', 'Success');

          const returnUrl =
            this.activatedRoute.snapshot.queryParams['returnUrl'] ||
            '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(
            err.error?.message || 'Invalid credentials',
            'Error'
          );
        },
      });
    } else {
      this.toastr.info('Please complete all required fields correctly', 'Info');
    }
  }

  private loginGoogleSocial() {
    this.isLoadingGoogle = true;
    this.authService
      .isgoogleLoggedIn()
      .pipe(
        finalize(() => (this.isLoadingGoogle = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (value) => {
          this.toastr.success('Google Login Successful!', 'Success');

          const returnUrl =
            this.activatedRoute.snapshot.queryParams['returnUrl'] ||
            '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || 'Invalid Google Credentials',
            'Error'
          );
        },
      });
  }

  private getErrorLoginGoogleSocial() {
    this.authService
      .getgoogleErrorObservable()
      .pipe(
        finalize(() => (this.isLoadingGoogle = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (value) => {
          this.toastr.error('Google Login Error!', 'Error');
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || 'Invalid Google Credentials',
            'Error'
          );
        },
      });
  }
}
