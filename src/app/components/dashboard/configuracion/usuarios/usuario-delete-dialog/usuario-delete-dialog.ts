import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../../models/user.model';
import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'app-usuario-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-delete-dialog.html',
  styleUrl: './usuario-delete-dialog.css',
})
export class UsuarioDeleteDialog {
  deleting = false;

  constructor(
    private usersService: UsersService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UsuarioDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.deleting = true;
    this.usersService.delete(this.data.user.id).subscribe({
      next: () => {
        this.toastr.success('Usuario eliminado');
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo eliminar el usuario');
        this.deleting = false;
      },
    });
  }
}
