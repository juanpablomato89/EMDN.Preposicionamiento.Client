import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { AuditLog } from '../../../../../models/audit-log.model';
import { AuditService } from '../../../../../services/audit.service';
import { AuditDetailDialog } from '../audit-detail-dialog/audit-detail-dialog';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria-list.html',
  styleUrl: './auditoria-list.css',
})
export class AuditoriaList implements OnInit {
  logs: AuditLog[] = [];
  actions: string[] = [];
  isLoading = false;

  search = '';
  action = '';
  successFilter: '' | 'true' | 'false' = '';
  from = '';
  to = '';

  pageIndex = 0;
  pageSize = 20;
  totalCount = 0;

  private searchSubject = new Subject<void>();

  constructor(
    private service: AuditService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(350)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
    this.service.actions().subscribe({
      next: (a) => (this.actions = a),
    });
    this.load();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  load(): void {
    this.isLoading = true;
    this.service
      .list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        search: this.search?.trim() || undefined,
        action: this.action || undefined,
        from: this.from || undefined,
        to: this.to || undefined,
        success: this.successFilter === '' ? undefined : this.successFilter === 'true',
      })
      .subscribe({
        next: (data) => {
          this.logs = data.items;
          this.totalCount = data.totalCount;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error cargando auditoría');
          this.isLoading = false;
        },
      });
  }

  onSearchInput(): void {
    this.searchSubject.next();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.load();
  }

  clearFilters(): void {
    this.search = '';
    this.action = '';
    this.successFilter = '';
    this.from = '';
    this.to = '';
    this.onFilterChange();
  }

  goToPage(p: number): void {
    if (p < 0 || p >= this.totalPages) return;
    this.pageIndex = p;
    this.load();
  }

  openDetail(log: AuditLog): void {
    this.dialog.open(AuditDetailDialog, { width: '600px', data: { log } });
  }
}
