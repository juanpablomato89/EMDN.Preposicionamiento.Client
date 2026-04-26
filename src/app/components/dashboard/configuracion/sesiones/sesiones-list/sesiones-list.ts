import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { Session } from '../../../../../models/session.model';
import { SessionsService } from '../../../../../services/sessions.service';

@Component({
  selector: 'app-sesiones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sesiones-list.html',
  styleUrl: './sesiones-list.css',
})
export class SesionesList implements OnInit {
  sesiones: Session[] = [];

  search = '';
  onlyActive = true;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  isLoading = false;

  private searchChanged$ = new Subject<void>();

  constructor(
    private sessionsService: SessionsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.searchChanged$.pipe(debounceTime(350)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  load(): void {
    this.isLoading = true;
    this.sessionsService
      .list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        search: this.search,
        onlyActive: this.onlyActive,
      })
      .subscribe({
        next: (res) => {
          this.sesiones = res.items ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error cargando sesiones');
          this.isLoading = false;
        },
      });
  }

  onSearchInput(): void {
    this.searchChanged$.next();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.load();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.pageIndex = page;
    this.load();
  }

  revoke(s: Session): void {
    if (!confirm(`¿Revocar esta sesión de ${s.userEmail}?`)) return;
    this.sessionsService.revoke(s.id).subscribe({
      next: () => {
        this.toastr.success('Sesión revocada');
        this.load();
      },
      error: (e) => this.toastr.error(e?.error ?? 'No se pudo revocar la sesión'),
    });
  }

  revokeAllForUser(s: Session): void {
    if (!confirm(`¿Revocar TODAS las sesiones activas de ${s.userEmail}?`)) return;
    this.sessionsService.revokeAllForUser(s.userId).subscribe({
      next: (res) => {
        this.toastr.success(`${res.revoked} sesión(es) revocada(s)`);
        this.load();
      },
      error: (e) => this.toastr.error(e?.error ?? 'No se pudieron revocar las sesiones'),
    });
  }
}
