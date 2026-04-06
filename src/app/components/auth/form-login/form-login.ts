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
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

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
          this.toastr.success('Inicio de sesión exitoso!', 'Éxito');

          const returnUrl =
            this.activatedRoute.snapshot.queryParams['returnUrl'] ||
            '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(
            err.error?.message || 'Credenciales no válidas',
            'Error'
          );
        },
      });
    } else {
      this.toastr.info('Por favor, complete todos los campos obligatorios correctamente', 'Info');
    }
  }

  onEmailBlur(): void {
  const emailControl = this.loginForm.get('email');
  let emailValue = emailControl?.value || '';

  if (emailValue && !emailValue.includes('@')) {
    const cleanUsername = emailValue.trim();
    const fullEmail = `${cleanUsername}@dcn.co.cu`;
    emailControl?.setValue(fullEmail);
    emailControl?.markAsTouched();
  }
}
}
