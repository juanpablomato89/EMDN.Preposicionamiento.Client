import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { Almacen } from '../../../../models/almacen.model';
import { Municipio, Provincia } from '../../../../models/ubicacion.model';
import { AlmacenService } from '../../../../services/almacen.service';
import { UbicacionService } from '../../../../services/ubicacion.service';
import { AlmacenFormDialog } from '../almacen-form-dialog/almacen-form-dialog';
import { AlmacenDeleteDialog } from '../almacen-delete-dialog/almacen-delete-dialog';
import { AlmacenProductosDialog } from '../almacen-productos-dialog/almacen-productos-dialog';
import { AlmacenesMap, SeleccionGeo } from '../almacenes-map/almacenes-map';

@Component({
  selector: 'app-almacenes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AlmacenesMap],
  templateUrl: './almacenes-list.html',
  styleUrl: './almacenes-list.css',
})
export class AlmacenesList implements OnInit {
  @ViewChild(AlmacenesMap) mapRef!: AlmacenesMap;

  almacenes: Almacen[] = [];
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];

  search = '';
  provinciaId?: number;
  municipioId?: number;
  orderBy = 'Descripcion';
  ascending = true;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  isLoading = false;
  loadingMunicipios = false;

  seleccionGeo: SeleccionGeo | null = null;

  private searchChanged$ = new Subject<void>();

  constructor(
    private almacenService: AlmacenService,
    private ubicacionService: UbicacionService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadProvincias();
    this.load();
    this.searchChanged$.pipe(debounceTime(350)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  loadProvincias(): void {
    this.ubicacionService.provincias().subscribe({
      next: (data) => (this.provincias = data),
      error: () => (this.provincias = []),
    });
  }

  loadMunicipios(provinciaId: number): void {
    this.loadingMunicipios = true;
    this.ubicacionService.municipios(provinciaId).subscribe({
      next: (data) => {
        this.municipios = data;
        this.loadingMunicipios = false;
      },
      error: () => {
        this.municipios = [];
        this.loadingMunicipios = false;
      },
    });
  }

  load(): void {
    this.isLoading = true;
    this.almacenService
      .list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        search: this.search,
        provinciaId: this.provinciaId,
        municipioId: this.municipioId,
        orderBy: this.orderBy,
        ascending: this.ascending,
      })
      .subscribe({
        next: (res) => {
          this.almacenes = res.items ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error cargando almacenes');
          this.isLoading = false;
        },
      });
  }

  onSearchInput(): void {
    this.searchChanged$.next();
  }

  onProvinciaChange(): void {
    this.municipioId = undefined;
    this.municipios = [];
    if (this.provinciaId) {
      this.loadMunicipios(this.provinciaId);
      const p = this.provincias.find((x) => x.id === this.provinciaId);
      if (p) {
        this.seleccionGeo = { lat: p.lat, lng: p.lng, label: p.descripcion, zoom: 8 };
      }
    } else {
      this.seleccionGeo = null;
    }
    this.pageIndex = 0;
    this.load();
  }

  onMunicipioChange(): void {
    if (this.municipioId) {
      const m = this.municipios.find((x) => x.id === this.municipioId);
      if (m) {
        this.seleccionGeo = { lat: m.lat, lng: m.lng, label: m.descripcion, zoom: 11 };
      }
    } else if (this.provinciaId) {
      const p = this.provincias.find((x) => x.id === this.provinciaId);
      if (p) {
        this.seleccionGeo = { lat: p.lat, lng: p.lng, label: p.descripcion, zoom: 8 };
      }
    } else {
      this.seleccionGeo = null;
    }
    this.pageIndex = 0;
    this.load();
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
    this.provinciaId = undefined;
    this.municipioId = undefined;
    this.municipios = [];
    this.seleccionGeo = null;
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
    const ref = this.dialog.open(AlmacenFormDialog, {
      width: '520px',
      data: { provincias: this.provincias },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openEdit(almacen: Almacen): void {
    const ref = this.dialog.open(AlmacenFormDialog, {
      width: '520px',
      data: { almacen, provincias: this.provincias },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openProductos(almacen: Almacen): void {
    const ref = this.dialog.open(AlmacenProductosDialog, {
      width: '900px',
      maxWidth: '95vw',
      data: { almacen },
    });
    ref.afterClosed().subscribe(() => this.load());
  }

  openDelete(almacen: Almacen): void {
    const ref = this.dialog.open(AlmacenDeleteDialog, {
      width: '480px',
      data: { almacen },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  flyToAlmacen(a: Almacen): void {
    if (!a.lat || !a.lng) return;
    this.seleccionGeo = {
      lat: a.lat,
      lng: a.lng,
      label: a.nombre,
      zoom: 12,
    };
  }
}
