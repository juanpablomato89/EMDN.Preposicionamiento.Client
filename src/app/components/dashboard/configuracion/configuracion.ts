import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/authservice';
import { UsuariosList } from './usuarios/usuarios-list/usuarios-list';

type SecuritySection = 'usuarios';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, UsuariosList],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {
  active: SecuritySection = 'usuarios';
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  setSection(section: SecuritySection): void {
    this.active = section;
  }
}
