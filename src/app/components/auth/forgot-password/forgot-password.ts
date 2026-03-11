import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { AuthService } from '../../../services/authservice';
import { finalize } from 'rxjs';
import { ResetPasswordRequest } from '../../../models/request/resetpasswordrequests';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  formpasswordReset: FormGroup;
  isEmailSent = false;
  isLoading = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formpasswordReset = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        code: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern(/^\d+$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  getPasswordStrength(): string {
    const password = this.formpasswordReset.get('password')?.value;
    if (!password) return 'weak';

    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (hasLetters && hasNumbers) strength += 1;
    if (hasSpecial) strength += 1;

    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
  }

  // Enviar código de verificación
  sendResetLink() {
    if (this.formpasswordReset.get('email')?.invalid) {
      this.formpasswordReset.get('email')?.markAsTouched();
      this.isEmailSent = false;
      return;
    }

    this.isLoading = true;
    this.email = this.formpasswordReset.get('email')?.value;
    this.authService
      .sendResetLink(this.email)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (result) => {
          this.isEmailSent = true;
          this.toastr.success('The code was sent successfully.', "Success");
        },
        error: (errorResult) => {
          this.toastr.error(errorResult.error.message, 'Error');
        },
      });
  }

  onSubmit() {
    if (this.formpasswordReset.valid) {
      this.isLoading = true;
      const values: ResetPasswordRequest = {
        email: this.email,
        newPassword: this.formpasswordReset.get('password')?.value,
        resetCode: this.formpasswordReset.get('code')?.value,
      };
      this.authService
        .resetPassword(values)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (result) => {
            this.toastr.success('Password updated successfully.','Success');
            this.router.navigate(['/login']);
          },
          error: (errorResult) => {
            this.toastr.success(errorResult.error.message, 'Error');
          },
        });
    }
  }

  // Solo permite entrada numérica
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  formatCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 6) {
      value = value.substring(0, 6);
    }

    input.value = value;
    this.formpasswordReset.get('code')?.setValue(value);
  }
}
