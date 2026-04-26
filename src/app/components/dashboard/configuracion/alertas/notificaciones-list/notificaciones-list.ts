import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertNotification, AlertRule } from '../../../../../models/alert.model';
import { AlertsService } from '../../../../../services/alerts.service';

@Component({
  selector: 'app-notificaciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificaciones-list.html',
  styleUrl: './notificaciones-list.css',
})
export class NotificacionesList implements OnInit {
  @Input() rules: AlertRule[] = [];

  notifications: AlertNotification[] = [];
  isLoading = false;

  alertRuleId: number | '' = '';
  sentFilter: '' | 'true' | 'false' = '';

  pageIndex = 0;
  pageSize = 20;
  totalCount = 0;

  constructor(
    private service: AlertsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  load(): void {
    this.isLoading = true;
    this.service
      .notifications({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        alertRuleId: this.alertRuleId === '' ? undefined : Number(this.alertRuleId),
        sent: this.sentFilter === '' ? undefined : this.sentFilter === 'true',
      })
      .subscribe({
        next: (data) => {
          this.notifications = data.items;
          this.totalCount = data.totalCount;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error cargando notificaciones');
          this.isLoading = false;
        },
      });
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.load();
  }

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.pageIndex = p;
    this.load();
  }
}
