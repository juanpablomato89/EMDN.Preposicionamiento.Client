import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';

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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 6, 
    center: L.latLng(21.5, -80.0)
  };

  onMapReady(map: L.Map) {
    const bounds = L.latLngBounds([19.5, -85.0], [23.5, -74.0]);
    map.fitBounds(bounds);
  }
}
