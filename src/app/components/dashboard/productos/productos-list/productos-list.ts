import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { Producto } from '../../../../models/producto.model';
import { Organismo } from '../../../../models/organismo.model';
import { ProductoService } from '../../../../services/producto.service';
import { AuthService } from '../../../../services/authservice';
import { ProductoFormDialog } from '../producto-form-dialog/producto-form-dialog';
import { ProductoDeleteDialog } from '../producto-delete-dialog/producto-delete-dialog';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-list.html',
  styleUrl: './productos-list.css',
})
export class ProductosList implements OnInit {
  productos: Producto[] = [];
  organismos: Organismo[] = [];

  search = '';
  organismoId?: number;
  orderBy = 'Descripcion';
  ascending = true;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  isLoading = false;
  isAdmin = false;

  private searchChanged$ = new Subject<void>();

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadOrganismos();
    this.load();
    this.searchChanged$.pipe(debounceTime(350)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  loadOrganismos(): void {
    this.productoService.organismos().subscribe({
      next: (data) => (this.organismos = data),
      error: () => (this.organismos = []),
    });
  }

  load(): void {
    this.isLoading = true;
    this.productoService
      .list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        search: this.search,
        organismoId: this.isAdmin ? this.organismoId : undefined,
        orderBy: this.orderBy,
        ascending: this.ascending,
      })
      .subscribe({
        next: (res) => {
          this.productos = res.items ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error cargando productos');
          this.isLoading = false;
        },
      });
  }

  onSearchInput(): void {
    this.searchChanged$.next();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.load();
  }

  toggleSort(field: string): void {
    if (this.orderBy.toLowerCase() === field.toLowerCase()) {
      this.ascending = !this.ascending;
    } else {
      this.orderBy = field;
      this.ascending = true;
    }
    this.load();
  }

  clearFilters(): void {
    this.search = '';
    this.organismoId = undefined;
    this.pageIndex = 0;
    this.load();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.pageIndex = page;
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(ProductoFormDialog, {
      width: '520px',
      data: { organismos: this.organismos, isAdmin: this.isAdmin },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openEdit(producto: Producto): void {
    const ref = this.dialog.open(ProductoFormDialog, {
      width: '520px',
      data: { producto, organismos: this.organismos, isAdmin: this.isAdmin },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openDelete(producto: Producto): void {
    const ref = this.dialog.open(ProductoDeleteDialog, {
      width: '420px',
      data: { producto },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }
}
