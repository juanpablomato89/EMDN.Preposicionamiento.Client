import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../../../../models/producto.model';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-producto-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-delete-dialog.html',
  styleUrl: './producto-delete-dialog.css',
})
export class ProductoDeleteDialog {
  deleting = false;

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ProductoDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: Producto },
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.deleting = true;
    this.productoService.delete(this.data.producto.id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error('No se pudo eliminar el producto');
        this.deleting = false;
      },
    });
  }
}
