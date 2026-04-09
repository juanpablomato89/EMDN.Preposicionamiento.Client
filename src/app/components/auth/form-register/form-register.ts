import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authservice';
import { SignUpRequest } from '../../../models/request/signuprequest';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-register.html',
  styleUrl: './form-register.scss',
})
export class FormRegister {
  registerForm: FormGroup;
  countries = ['Estados Unidos', 'México', 'España', 'Colombia', 'Argentina', 'Chile'];
  marketplaces = [{ id: 0, marketPlace: 'EUA' }];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: passwordMatchValidator },
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const credentials: SignUpRequest = {
        name: this.registerForm.value.name,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        confirmationPassword: this.registerForm.value.confirmPassword,
      };

      this.authService
        .signUp(credentials)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe({
          next: () => {
            this.registerForm.markAllAsTouched();
            this.toastr.success('Usuario registrado exitosamente', 'Éxito');

            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.toastr.error(err.error.message, 'Error');
          },
        });
    }
  }
}
