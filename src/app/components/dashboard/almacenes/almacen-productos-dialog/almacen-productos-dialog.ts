import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Almacen, AlmacenStock } from '../../../../models/almacen.model';
import { Producto } from '../../../../models/producto.model';
import { AlmacenService } from '../../../../services/almacen.service';
import { ProductoService } from '../../../../services/producto.service';

interface DialogData {
  almacen: Almacen;
}

interface NuevoStock {
  productoId: string | null;
  cantidad: number;
  fechaIngreso: string;
}

@Component({
  selector: 'app-almacen-productos-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './almacen-productos-dialog.html',
  styleUrl: './almacen-productos-dialog.css',
})
export class AlmacenProductosDialog implements OnInit {
  stocks: AlmacenStock[] = [];
  productos: Producto[] = [];
  isLoading = false;
  saving = false;

  nuevo: NuevoStock = {
    productoId: null,
    cantidad: 1,
    fechaIngreso: new Date().toISOString().substring(0, 10),
  };

  constructor(
    private almacenService: AlmacenService,
    private productoService: ProductoService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AlmacenProductosDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadProductos();
  }

  load(): void {
    this.isLoading = true;
    this.almacenService.productos(this.data.almacen.id).subscribe({
      next: (data) => {
        this.stocks = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error cargando productos asignados');
        this.isLoading = false;
      },
    });
  }

  loadProductos(): void {
    this.productoService.list({ pageSize: 500 }).subscribe({
      next: (res) => (this.productos = res.items ?? []),
      error: () => (this.productos = []),
    });
  }

  get productosDisponibles(): Producto[] {
    const asignados = new Set(this.stocks.map((s) => s.productoId));
    return this.productos.filter((p) => !asignados.has(p.id));
  }

  agregar(): void {
    if (!this.nuevo.productoId || this.nuevo.cantidad < 0) {
      this.toastr.warning('Seleccione un producto y una cantidad válida');
      return;
    }
    this.saving = true;
    this.almacenService
      .asignarProducto(this.data.almacen.id, {
        productoId: this.nuevo.productoId,
        cantidad: this.nuevo.cantidad,
        fechaIngreso: new Date(this.nuevo.fechaIngreso).toISOString(),
      })
      .subscribe({
        next: () => {
          this.toastr.success('Producto asignado');
          this.nuevo = {
            productoId: null,
            cantidad: 1,
            fechaIngreso: new Date().toISOString().substring(0, 10),
          };
          this.saving = false;
          this.load();
        },
        error: () => {
          this.toastr.error('No se pudo asignar el producto');
          this.saving = false;
        },
      });
  }

  actualizarCantidad(stock: AlmacenStock): void {
    if (stock.cantidad < 0) {
      this.toastr.warning('La cantidad no puede ser negativa');
      return;
    }
    this.almacenService
      .asignarProducto(this.data.almacen.id, {
        productoId: stock.productoId,
        cantidad: stock.cantidad,
        fechaIngreso: stock.fechaIngreso,
      })
      .subscribe({
        next: () => this.toastr.success('Cantidad actualizada'),
        error: () => this.toastr.error('No se pudo actualizar la cantidad'),
      });
  }

  remover(stock: AlmacenStock): void {
    this.almacenService.removerProducto(this.data.almacen.id, stock.productoId).subscribe({
      next: () => {
        this.toastr.success('Producto removido del almacén');
        this.load();
      },
      error: () => this.toastr.error('No se pudo remover el producto'),
    });
  }

  cerrar(): void {
    this.dialogRef.close(true);
  }
}
