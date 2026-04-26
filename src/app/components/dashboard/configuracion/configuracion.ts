import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authservice';
import { RolesList } from './roles/roles-list/roles-list';
import { SesionesList } from './sesiones/sesiones-list/sesiones-list';
import { UsuariosList } from './usuarios/usuarios-list/usuarios-list';

type SecuritySection = 'usuarios' | 'roles' | 'sesiones';

interface MenuItem {
  key: SecuritySection;
  label: string;
  description: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, UsuariosList, RolesList, SesionesList],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {
  active: SecuritySection = 'usuarios';
  isAdmin = false;

  readonly menu: MenuItem[] = [
    { key: 'usuarios', label: 'Usuarios', description: 'Gestión de cuentas' },
    { key: 'roles', label: 'Roles', description: 'Definición de roles' },
    { key: 'sesiones', label: 'Sesiones activas', description: 'Tokens emitidos' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  setSection(section: SecuritySection): void {
    this.active = section;
  }
}
