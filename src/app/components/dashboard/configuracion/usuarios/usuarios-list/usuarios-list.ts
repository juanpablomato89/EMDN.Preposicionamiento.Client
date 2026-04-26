import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { User } from '../../../../../models/user.model';
import { Organismo } from '../../../../../models/organismo.model';
import { UsersService } from '../../../../../services/users.service';
import { ProductoService } from '../../../../../services/producto.service';
import { UsuarioFormDialog } from '../usuario-form-dialog/usuario-form-dialog';
import { UsuarioDeleteDialog } from '../usuario-delete-dialog/usuario-delete-dialog';
import { UsuarioResetPasswordDialog } from '../usuario-reset-password-dialog/usuario-reset-password-dialog';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit {
  usuarios: User[] = [];
  organismos: Organismo[] = [];
  roles: { name: string }[] = [];

  search = '';
  role?: string;
  organismoId?: number;
  onlyLocked = false;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  isLoading = false;

  private searchChanged$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private productoService: ProductoService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadOrganismos();
    this.loadRoles();
    this.load();
    this.searchChanged$.pipe(debounceTime(350)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  loadOrganismos(): void {
    this.productoService.organismos().subscribe({
      next: (data) => (this.organismos = data),
      error: () => (this.organismos = []),
    });
  }

  loadRoles(): void {
    this.usersService.roles().subscribe({
      next: (data) => (this.roles = data),
      error: () => (this.roles = []),
    });
  }

  load(): void {
    this.isLoading = true;
    this.usersService
      .list({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        search: this.search,
        role: this.role,
        organismoId: this.organismoId,
        onlyLocked: this.onlyLocked || undefined,
      })
      .subscribe({
        next: (res) => {
          this.usuarios = res.items ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error cargando usuarios');
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

  clearFilters(): void {
    this.search = '';
    this.role = undefined;
    this.organismoId = undefined;
    this.onlyLocked = false;
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

  openCreate(): void {
    const ref = this.dialog.open(UsuarioFormDialog, {
      width: '560px',
      data: { organismos: this.organismos, roles: this.roles },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openEdit(user: User): void {
    const ref = this.dialog.open(UsuarioFormDialog, {
      width: '560px',
      data: { user, organismos: this.organismos, roles: this.roles },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openDelete(user: User): void {
    const ref = this.dialog.open(UsuarioDeleteDialog, {
      width: '440px',
      data: { user },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openResetPassword(user: User): void {
    const ref = this.dialog.open(UsuarioResetPasswordDialog, {
      width: '460px',
      data: { user },
    });
    ref.afterClosed().subscribe();
  }

  toggleLock(user: User): void {
    const newState = !user.isLockedOut;
    this.usersService.setLock(user.id, newState).subscribe({
      next: () => {
        this.toastr.success(newState ? 'Usuario bloqueado' : 'Usuario desbloqueado');
        this.load();
      },
      error: (e) => this.toastr.error(e?.error ?? 'No se pudo cambiar el estado'),
    });
  }
}
