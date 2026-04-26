import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Organismo } from '../../../../../models/organismo.model';
import { User } from '../../../../../models/user.model';
import { UsersService } from '../../../../../services/users.service';

interface DialogData {
  user?: User;
  organismos: Organismo[];
  roles: { name: string }[];
}

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form-dialog.html',
  styleUrl: './usuario-form-dialog.css',
})
export class UsuarioFormDialog {
  form: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UsuarioFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.isEdit = !!data?.user;
    const u = data?.user;

    this.form = this.fb.group({
      email: [{ value: u?.email ?? '', disabled: this.isEdit }, [Validators.required, Validators.email]],
      name: [u?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      lastName: [u?.lastName ?? '', [Validators.required, Validators.maxLength(100)]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      role: [u?.role ?? 'User', Validators.required],
      organismoId: [u?.organismoId ?? null],
    });
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
    const v = this.form.getRawValue();

    const obs: Observable<unknown> = this.isEdit && this.data.user
      ? this.usersService.update(this.data.user.id, {
          name: v.name,
          lastName: v.lastName,
          role: v.role,
          organismoId: v.organismoId ?? undefined,
        })
      : this.usersService.create({
          email: v.email,
          name: v.name,
          lastName: v.lastName,
          password: v.password,
          role: v.role,
          organismoId: v.organismoId ?? undefined,
        });

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'Usuario actualizado' : 'Usuario creado');
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo guardar el usuario');
        this.saving = false;
      },
    });
  }
}
