import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaCubaOffline } from './mapa-cuba-offline/mapa-cuba-offline';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MapaCubaOffline],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
