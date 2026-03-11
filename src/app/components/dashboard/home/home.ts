import { Component } from '@angular/core';
import { HomeCard } from './home-card/home-card';
import { CommonModule } from '@angular/common';
import { HomeChart } from './home-chart/home-chart';
import { HomeTable } from './home-table/home-table';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HomeCard, HomeChart, HomeTable],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
