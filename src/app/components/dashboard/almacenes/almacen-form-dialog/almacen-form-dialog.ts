import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Almacen } from '../../../../models/almacen.model';
import { Municipio, Provincia } from '../../../../models/ubicacion.model';
import { AlmacenService } from '../../../../services/almacen.service';
import { UbicacionService } from '../../../../services/ubicacion.service';

interface DialogData {
  almacen?: Almacen;
  provincias: Provincia[];
}

@Component({
  selector: 'app-almacen-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './almacen-form-dialog.html',
  styleUrl: './almacen-form-dialog.css',
})
export class AlmacenFormDialog implements OnInit {
  form: FormGroup;
  isEdit = false;
  saving = false;
  municipios: Municipio[] = [];
  loadingMunicipios = false;

  constructor(
    private fb: FormBuilder,
    private almacenService: AlmacenService,
    private ubicacionService: UbicacionService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AlmacenFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.isEdit = !!data?.almacen;

    const a = data?.almacen;
    this.form = this.fb.group({
      nombre: [a?.nombre ?? '', [Validators.maxLength(200)]],
      provinciaId: [a?.provinciaId ?? null, [Validators.required]],
      municipioId: [a?.municipioId ?? null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.form.value.provinciaId) {
      this.loadMunicipios(this.form.value.provinciaId, this.form.value.municipioId);
    }
  }

  onProvinciaChange(): void {
    const provinciaId = this.form.value.provinciaId;
    this.form.patchValue({ municipioId: null });
    this.municipios = [];
    if (provinciaId) this.loadMunicipios(provinciaId);
  }

  private loadMunicipios(provinciaId: number, keepMunicipioId?: number | null): void {
    this.loadingMunicipios = true;
    this.ubicacionService.municipios(provinciaId).subscribe({
      next: (data) => {
        this.municipios = data;
        if (keepMunicipioId) this.form.patchValue({ municipioId: keepMunicipioId });
        this.loadingMunicipios = false;
      },
      error: () => {
        this.toastr.error('Error cargando municipios');
        this.loadingMunicipios = false;
      },
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
    const value = this.form.value;
    const payload = {
      nombre: value.nombre?.trim() || undefined,
      municipioId: value.municipioId,
    };

    const obs: Observable<unknown> = this.isEdit && this.data.almacen
      ? this.almacenService.update(this.data.almacen.id, payload)
      : this.almacenService.create(payload);

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'Almacén actualizado' : 'Almacén creado');
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error('No se pudo guardar el almacén');
        this.saving = false;
      },
    });
  }
}
