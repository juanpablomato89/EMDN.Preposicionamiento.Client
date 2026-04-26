import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PasswordPolicy } from '../../../../../models/password-policy.model';
import { PasswordPolicyService } from '../../../../../services/password-policy.service';

@Component({
  selector: 'app-password-policy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-policy-form.html',
  styleUrl: './password-policy-form.css',
})
export class PasswordPolicyForm implements OnInit {
  form: FormGroup;
  saving = false;
  loading = true;
  policy: PasswordPolicy | null = null;

  constructor(
    private fb: FormBuilder,
    private service: PasswordPolicyService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      minLength: [8, [Validators.required, Validators.min(4), Validators.max(64)]],
      requireUppercase: [true],
      requireLowercase: [true],
      requireDigit: [true],
      requireNonAlphanumeric: [false],
      maxFailedAttempts: [5, [Validators.required, Validators.min(0)]],
      lockoutMinutes: [15, [Validators.required, Validators.min(0)]],
      passwordExpirationDays: [0, [Validators.required, Validators.min(0)]],
      preventReuseLastN: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.get().subscribe({
      next: (p) => {
        this.policy = p;
        this.form.patchValue(p);
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Error cargando política de contraseñas');
        this.loading = false;
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.service.update(this.form.getRawValue()).subscribe({
      next: () => {
        this.toastr.success('Política actualizada');
        this.saving = false;
        this.load();
      },
      error: (e) => {
        this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo guardar');
        this.saving = false;
      },
    });
  }
}
