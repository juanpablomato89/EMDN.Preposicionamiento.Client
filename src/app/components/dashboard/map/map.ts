import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { NominatimService } from '../../../services/nominatimservice';

@Component({
  selector: 'app-map-leaflet',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapLeaflet {
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
    zoom: 6,
    center: L.latLng(21.5, -80.0),
  };

   private currentMarker: L.Marker | null = null;

  constructor(private nominatimService: NominatimService) {}

  onMapReady(map: L.Map) {
    const bounds = L.latLngBounds([19.5, -85.0], [23.5, -74.0]);
    map.fitBounds(bounds);
  }
  onMapClick(event: any) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    const map = event.target;

    // 1. Eliminar el marcador anterior si existe
    /*if (this.currentMarker) {
      this.currentMarker.remove();
    }*/

    const newMarker = L.marker([lat, lng]).addTo(map);
    this.currentMarker = newMarker;

    newMarker
      .bindPopup(`<b>Cargando dirección...</b><br>(${lat.toFixed(6)}, ${lng.toFixed(6)})`)
      .openPopup();

    this.nominatimService.reverseGeocode(lat, lng).subscribe({
      next: (data) => {
        const direccion = data.display_name || 'Dirección no encontrada';
        newMarker
          .bindPopup(
            `
          <b>📍 Ubicación</b><br>
          ${direccion}<br>
          <small>(${lat.toFixed(6)}, ${lng.toFixed(6)})</small>
        `,
          )
          .openPopup();
      },
      error: (err) => {
        newMarker
          .bindPopup(
            `
          <b>⚠️ Error al obtener dirección</b><br>
          Coordenadas: (${lat.toFixed(6)}, ${lng.toFixed(6)})
        `,
          )
          .openPopup();
      },
    });
  }
}
