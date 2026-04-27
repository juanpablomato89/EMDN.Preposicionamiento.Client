import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLeaflet } from '../map/map';
import { HomeService } from '../../../services/home.service';
import { AlmacenMapa, EstadoAlmacen, HomeKpis } from '../../../models/almacen-mapa.model';

type ActiveFilter = 'all' | EstadoAlmacen;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MapLeaflet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  @ViewChild(MapLeaflet) mapRef!: MapLeaflet;

  kpis: HomeKpis | null = null;
  almacenes: AlmacenMapa[] = [];
  filteredAlmacenes: AlmacenMapa[] = [];
  activeFilter: ActiveFilter = 'all';
  sidePanelOpen = false;
  isLoading = true;

  get countAll(): number { return this.almacenes.length; }
  get countOk(): number   { return this.almacenes.filter(a => a.estado === 'ok').length; }
  get countWarn(): number { return this.almacenes.filter(a => a.estado === 'warn').length; }
  get countErr(): number  { return this.almacenes.filter(a => a.estado === 'err').length; }

  get sortedAlmacenes(): AlmacenMapa[] {
    return [...this.filteredAlmacenes].sort((a, b) => b.stockTotal - a.stockTotal);
  }

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getMapa().subscribe({
      next: (data) => {
        this.kpis = data.kpis;
        this.almacenes = data.almacenes;
        this.filteredAlmacenes = data.almacenes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  setFilter(f: ActiveFilter): void {
    this.activeFilter = f;
    this.filteredAlmacenes =
      f === 'all' ? this.almacenes : this.almacenes.filter(a => a.estado === f);
    this.mapRef?.invalidateSize();
  }

  onAlmacenClick(a: AlmacenMapa): void {
    this.mapRef?.flyTo(a);
    if (window.innerWidth < 860) this.sidePanelOpen = false;
  }

  toggleSidePanel(): void {
    this.sidePanelOpen = !this.sidePanelOpen;
  }

  dotColor(estado: EstadoAlmacen): string {
    if (estado === 'ok') return '#00abb3';
    if (estado === 'warn') return '#ffc107';
    return '#ff3b30';
  }

  pillClass(estado: EstadoAlmacen): string {
    if (estado === 'ok') return 'pill-ok';
    if (estado === 'warn') return 'pill-warn';
    return 'pill-err';
  }

  pillLabel(estado: EstadoAlmacen): string {
    if (estado === 'ok') return 'Disponible';
    if (estado === 'warn') return 'Stock bajo';
    return 'Crítico';
  }
}
