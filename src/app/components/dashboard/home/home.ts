import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLeaflet } from '../map/map';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MapLeaflet],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
