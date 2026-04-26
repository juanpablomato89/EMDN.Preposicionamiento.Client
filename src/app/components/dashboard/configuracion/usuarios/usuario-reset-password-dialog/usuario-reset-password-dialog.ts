import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../../models/user.model';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-usuario-reset-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-reset-password-dialog.html',
  styleUrl: './usuario-reset-password-dialog.css',
})
export class UsuarioResetPasswordDialog {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UsuarioResetPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    }, { validators: this.matchValidator });
  }

  private matchValidator(group: any) {
    const a = group.get('newPassword')?.value;
    const b = group.get('confirm')?.value;
    return a === b ? null : { mismatch: true };
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.usersService
      .resetPassword(this.data.user.id, this.form.value.newPassword)
      .subscribe({
        next: () => {
          this.toastr.success('Contraseña restablecida');
          this.dialogRef.close(true);
        },
        error: (e) => {
          this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo restablecer la contraseña');
          this.saving = false;
        },
      });
  }
}
