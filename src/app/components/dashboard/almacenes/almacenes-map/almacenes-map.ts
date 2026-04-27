import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

export interface SeleccionGeo {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
}

@Component({
  selector: 'app-almacenes-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './almacenes-map.html',
  styleUrl: './almacenes-map.css',
})
export class AlmacenesMap implements AfterViewInit, OnChanges, OnDestroy {
  @Input() seleccion: SeleccionGeo | null = null;

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private marker?: L.Marker;

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

    if (this.seleccion) this.renderSeleccion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;
    if (changes['seleccion']) this.renderSeleccion();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderSeleccion(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = undefined;
    }
    if (!this.seleccion || !this.seleccion.lat || !this.seleccion.lng) {
      this.map.fitBounds(this.CUBA_BOUNDS);
      return;
    }
    const { lat, lng, label, zoom } = this.seleccion;
    this.marker = L.marker([lat, lng], { icon: this.pinIcon(), title: label }).addTo(this.map);
    this.marker.bindPopup(`<div class="pop-name">${label}</div>`).openPopup();
    this.map.flyTo([lat, lng], zoom ?? 9, { duration: 0.8 });
  }

  invalidateSize(): void {
    this.map?.invalidateSize();
  }

  private pinIcon(): L.DivIcon {
    return L.divIcon({
      className: 'pin-wrap',
      html: `<div class="pin"><span><i class="bi bi-geo-alt-fill"></i></span></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 28],
      popupAnchor: [0, -26],
    });
  }
}
