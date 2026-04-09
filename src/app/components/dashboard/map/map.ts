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

  private markers: L.Marker[] = [];

  constructor(private nominatimService: NominatimService) {}

  onMapReady(map: L.Map) {
    const bounds = L.latLngBounds([19.5, -85.0], [23.5, -74.0]);
    map.fitBounds(bounds);
  }

  onMapClick(event: any) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    const map = event.target;

    const customIcon = L.icon({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const newMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    this.markers.push(newMarker);

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
      error: () => {
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

    newMarker.on('contextmenu', (markerEvent: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(markerEvent.originalEvent);

      const clickedMarker = markerEvent.target as L.Marker;
      this.deleteMarker(clickedMarker);
    });
  }

  private deleteMarker(marker: L.Marker): void {
    const index = this.markers.indexOf(marker);
    if (index !== -1) {
      marker.remove();
      this.markers.splice(index, 1);
    } else {
      console.warn('Marcador no encontrado en el array');
    }
  }
}
