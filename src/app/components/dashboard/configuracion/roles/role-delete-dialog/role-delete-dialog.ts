import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../../../../models/role.model';
import { RolesService } from '../../../../../services/roles.service';

@Component({
  selector: 'app-role-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-delete-dialog.html',
  styleUrl: './role-delete-dialog.css',
})
export class RoleDeleteDialog {
  deleting = false;

  constructor(
    private rolesService: RolesService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<RoleDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role },
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.deleting = true;
    this.rolesService.delete(this.data.role.id).subscribe({
      next: () => {
        this.toastr.success('Rol eliminado');
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo eliminar el rol');
        this.deleting = false;
      },
    });
  }
}
