import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Role } from '../../../../../models/role.model';
import { RolesService } from '../../../../../services/roles.service';

interface DialogData {
  role?: Role;
}

@Component({
  selector: 'app-role-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form-dialog.html',
  styleUrl: './role-form-dialog.css',
})
export class RoleFormDialog {
  form: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<RoleFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.isEdit = !!data?.role;

    this.form = this.fb.group({
      name: [
        data?.role?.name ?? '',
        [Validators.required, Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9_\-\s]+$/)],
      ],
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

    const obs: Observable<unknown> = this.isEdit && this.data.role
      ? this.rolesService.update(this.data.role.id, { name: v.name })
      : this.rolesService.create({ name: v.name });

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'Rol actualizado' : 'Rol creado');
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo guardar el rol');
        this.saving = false;
      },
    });
  }
}
