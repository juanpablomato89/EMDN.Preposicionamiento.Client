import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Producto } from '../../../../models/producto.model';
import { Organismo } from '../../../../models/organismo.model';
import { ProductoService } from '../../../../services/producto.service';

interface DialogData {
  producto?: Producto;
  organismos: Organismo[];
  isAdmin: boolean;
}

@Component({
  selector: 'app-producto-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form-dialog.html',
  styleUrl: './producto-form-dialog.css',
})
export class ProductoFormDialog {
  form: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ProductoFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.isEdit = !!data?.producto;

    const p = data?.producto;
    this.form = this.fb.group({
      descripcion: [p?.descripcion ?? '', [Validators.required, Validators.maxLength(200)]],
      unidadMedida: [p?.unidadMedida ?? '', [Validators.maxLength(20)]],
      organismoId: [p?.organismoId ?? null],
      fechaIngreso: [
        p?.fechaIngreso
          ? new Date(p.fechaIngreso).toISOString().substring(0, 10)
          : new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
    });

    if (data?.isAdmin && !this.isEdit) {
      this.form.get('organismoId')?.setValidators([Validators.required]);
    }
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
    const value = this.form.value;
    const payload = {
      descripcion: value.descripcion,
      unidadMedida: value.unidadMedida || undefined,
      organismoId: this.data.isAdmin ? value.organismoId ?? undefined : undefined,
      fechaIngreso: new Date(value.fechaIngreso).toISOString(),
    };

    const obs: Observable<unknown> = this.isEdit && this.data.producto
      ? this.productoService.update(this.data.producto.id, payload)
      : this.productoService.create(payload);

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'Producto actualizado' : 'Producto creado');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error('No se pudo guardar el producto');
        this.saving = false;
      },
    });
  }
}
