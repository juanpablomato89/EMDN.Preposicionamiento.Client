import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../../../../models/role.model';
import { RolesService } from '../../../../../services/roles.service';
import { RoleFormDialog } from '../role-form-dialog/role-form-dialog';
import { RoleDeleteDialog } from '../role-delete-dialog/role-delete-dialog';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.css',
})
export class RolesList implements OnInit {
  roles: Role[] = [];
  isLoading = false;

  constructor(
    private rolesService: RolesService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.rolesService.list().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error cargando roles');
        this.isLoading = false;
      },
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(RoleFormDialog, { width: '440px' });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openEdit(role: Role): void {
    const ref = this.dialog.open(RoleFormDialog, {
      width: '440px',
      data: { role },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }

  openDelete(role: Role): void {
    const ref = this.dialog.open(RoleDeleteDialog, {
      width: '440px',
      data: { role },
    });
    ref.afterClosed().subscribe((res) => {
      if (res) this.load();
    });
  }
}
