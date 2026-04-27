import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { AlmacenMapa, EstadoAlmacen } from '../../../models/almacen-mapa.model';

@Component({
  selector: 'app-map-leaflet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapLeaflet implements AfterViewInit, OnChanges, OnDestroy {
  @Input() almacenes: AlmacenMapa[] = [];
  @Input() activeFilter: 'all' | EstadoAlmacen = 'all';

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private markerMap = new Map<number, L.Marker>();
  activeId: number | null = null;

  readonly CUBA_BOUNDS = L.latLngBounds([19.5, -85.0], [23.5, -74.0]);

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      attributionControl: true,
    }).fitBounds(this.CUBA_BOUNDS);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abc',
      maxZoom: 19,
    }).addTo(this.map);

    if (this.almacenes.length) {
      this.renderMarkers();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;

    if (changes['almacenes']) {
      this.renderMarkers();
    }
    if (changes['activeFilter'] && !changes['almacenes']) {
      this.applyFilter();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderMarkers(): void {
    this.markerMap.forEach(m => m.remove());
    this.markerMap.clear();

    this.almacenes.forEach(a => {
      if (!a.lat || !a.lng) return;
      const marker = L.marker([a.lat, a.lng], {
        icon: this.pinIcon(a.estado, a.totalProductos),
        title: a.nombre,
      }).addTo(this.map);

      marker.bindPopup(this.buildPopup(a));
      marker.on('click', () => this.highlightItem(a.id));
      this.markerMap.set(a.id, marker);
    });

    this.applyFilter();
  }

  private applyFilter(): void {
    this.almacenes.forEach(a => {
      const marker = this.markerMap.get(a.id);
      if (!marker) return;
      const visible = this.activeFilter === 'all' || a.estado === this.activeFilter;
      if (visible && !this.map.hasLayer(marker)) marker.addTo(this.map);
      if (!visible && this.map.hasLayer(marker)) marker.remove();
    });
  }

  flyTo(almacen: AlmacenMapa): void {
    if (!almacen.lat || !almacen.lng) return;
    this.map.flyTo([almacen.lat, almacen.lng], 8, { duration: 0.8 });
    this.markerMap.get(almacen.id)?.openPopup();
    this.highlightItem(almacen.id);
  }

  highlightItem(id: number): void {
    this.activeId = id;
  }

  invalidateSize(): void {
    this.map?.invalidateSize();
  }

  private pinIcon(estado: EstadoAlmacen, label: number): L.DivIcon {
    const cls = estado === 'ok' ? '' : estado;
    return L.divIcon({
      className: 'pin-wrap',
      html: `<div class="pin ${cls}"><span>${label}</span></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 28],
      popupAnchor: [0, -26],
    });
  }

  private buildPopup(a: AlmacenMapa): string {
    const pill = this.pillFor(a.estado);
    return `
      <div class="pop-name">${a.nombre}</div>
      <div class="pop-sub">${a.provincia} · ${a.lat.toFixed(3)}, ${a.lng.toFixed(3)}</div>
      <div class="pop-row"><span>Stock total</span><b>${a.stockTotal.toLocaleString('es')}</b></div>
      <div class="pop-row"><span>Productos</span><b>${a.totalProductos}</b></div>
      <div class="pop-row"><span>Estado</span><b>${pill}</b></div>
      <div class="pop-row"><span>Última sync</span><b>${a.ultimaSync}</b></div>
      <div class="pop-row"><span>Organismo</span><b>${a.organismo}</b></div>
    `;
  }

  private pillFor(estado: EstadoAlmacen): string {
    if (estado === 'ok') return '<span class="pill pill-ok">Disponible</span>';
    if (estado === 'warn') return '<span class="pill pill-warn">Stock bajo</span>';
    return '<span class="pill pill-err">Crítico</span>';
  }
}
