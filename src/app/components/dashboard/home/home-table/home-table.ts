import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface Product {
  name: string;
  asin: string;
  price: number;
  monthlySales: number;
  activeSellers: number;
  trends: string;
  viability: string;
  actions: string;
}
@Component({
  selector: 'app-home-table',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule
  ],
  templateUrl: './home-table.html',
  styleUrl: './home-table.scss',
})
export class HomeTable {
  displayedColumns: string[] = [
    'img',
    'name',
    'asin',
    'price',
    'monthlySales',
    'activeSellers',
    'trends',
    'viability',
    'actions',
  ];

  length = 50;
  pageSize = 2;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: any;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: Product[] = [
    {
      name: 'Sony WH-CH520',
      asin: 'B0BSIPRC4L',
      price: 35.85,
      monthlySales: 248,
      activeSellers: 62,
      trends: 'High',
      viability: '62%',
      actions: 'View',
    },
    {
      name: 'Apple AirPods Pro',
      asin: 'B07ZPC9QD4',
      price: 199.99,
      monthlySales: 512,
      activeSellers: 24,
      trends: 'High',
      viability: '78%',
      actions: 'View',
    },
    {
      name: 'Samsung Galaxy Buds',
      asin: 'B07WV8CSC7',
      price: 129.99,
      monthlySales: 387,
      activeSellers: 45,
      trends: 'Medium',
      viability: '54%',
      actions: 'View',
    },
    {
      name: 'Bose QuietComfort',
      asin: 'B0756CYWWD',
      price: 279.99,
      monthlySales: 215,
      activeSellers: 18,
      trends: 'High',
      viability: '82%',
      actions: 'View',
    },
    {
      name: 'JBL Flip 5',
      asin: 'B07QK2SPMY',
      price: 89.95,
      monthlySales: 421,
      activeSellers: 57,
      trends: 'Medium',
      viability: '63%',
      actions: 'View',
    },
    {
      name: 'Anker Soundcore',
      asin: 'B07X8Y7NFW',
      price: 49.99,
      monthlySales: 198,
      activeSellers: 73,
      trends: 'Low',
      viability: '41%',
      actions: 'View',
    },
    {
      name: 'Sony WH-1000XM4',
      asin: 'B0863TXGM3',
      price: 348.0,
      monthlySales: 156,
      activeSellers: 15,
      trends: 'High',
      viability: '88%',
      actions: 'View',
    },
    {
      name: 'Beats Studio Buds',
      asin: 'B094C49H1S',
      price: 149.99,
      monthlySales: 302,
      activeSellers: 29,
      trends: 'Medium',
      viability: '67%',
      actions: 'View',
    },
    {
      name: 'Skullcandy Crusher',
      asin: 'B07B4L2PQW',
      price: 79.99,
      monthlySales: 187,
      activeSellers: 48,
      trends: 'Low',
      viability: '52%',
      actions: 'View',
    },
    {
      name: 'Jabra Elite 75t',
      asin: 'B07ZP8KQ48',
      price: 149.99,
      monthlySales: 243,
      activeSellers: 32,
      trends: 'High',
      viability: '71%',
      actions: 'View',
    },
  ];

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Product>(this.products);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  viewDetails(element: any) {}
}
