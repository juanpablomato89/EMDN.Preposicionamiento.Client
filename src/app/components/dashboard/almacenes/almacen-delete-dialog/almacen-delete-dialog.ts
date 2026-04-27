import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Almacen } from '../../../../models/almacen.model';
import { AlmacenService } from '../../../../services/almacen.service';

@Component({
  selector: 'app-almacen-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './almacen-delete-dialog.html',
  styleUrl: './almacen-delete-dialog.css',
})
export class AlmacenDeleteDialog {
  deleting = false;

  constructor(
    private almacenService: AlmacenService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AlmacenDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { almacen: Almacen },
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.deleting = true;
    this.almacenService.delete(this.data.almacen.id).subscribe({
      next: () => {
        this.toastr.success('Almacén eliminado');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error('No se pudo eliminar el almacén');
        this.deleting = false;
      },
    });
  }
}
