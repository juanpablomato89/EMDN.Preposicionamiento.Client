import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authservice';
import { AlertasList } from './alertas/alertas-list/alertas-list';
import { AuditoriaList } from './auditoria/auditoria-list/auditoria-list';
import { LdapForm } from './ldap/ldap-form/ldap-form';
import { PasswordPolicyForm } from './password-policy/password-policy-form/password-policy-form';
import { RolesList } from './roles/roles-list/roles-list';
import { SesionesList } from './sesiones/sesiones-list/sesiones-list';
import { UsuariosList } from './usuarios/usuarios-list/usuarios-list';

type SecuritySection =
  | 'usuarios'
  | 'roles'
  | 'sesiones'
  | 'password-policy'
  | 'auditoria'
  | 'ldap'
  | 'alertas';

interface MenuItem {
  key: SecuritySection;
  label: string;
  description: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    UsuariosList,
    RolesList,
    SesionesList,
    PasswordPolicyForm,
    AuditoriaList,
    LdapForm,
    AlertasList,
  ],
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
    { key: 'password-policy', label: 'Políticas de contraseña', description: 'Reglas de complejidad' },
    { key: 'auditoria', label: 'Auditoría', description: 'Logs de eventos' },
    { key: 'ldap', label: 'LDAP / AD', description: 'Integración de dominio' },
    { key: 'alertas', label: 'Alertas', description: 'Reglas y notificaciones' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  setSection(section: SecuritySection): void {
    this.active = section;
  }
}
