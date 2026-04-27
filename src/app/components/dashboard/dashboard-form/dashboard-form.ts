import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Profile } from '../profile/profile';
import { Home } from '../home/home';
import { ProductosList } from '../productos/productos-list/productos-list';
import { Configuracion } from '../configuracion/configuracion';
import { AuthService } from '../../../services/authservice';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { BasicUserResponse } from '../../../models/response/basicuserresponse';

@Component({
  selector: 'app-dashboard-form',
  standalone: true,
  imports: [CommonModule, Profile, Home, ProductosList, Configuracion],
  templateUrl: './dashboard-form.html',
  styleUrl: './dashboard-form.scss',
})
export class DashboardForm {
  isCollapsed = false;
  activeItem = 'inicio';
  user: BasicUserResponse = {};
  title = '';
  subtitle = '';
  isLoading = false;
  isLoadingUserValue = false;

  constructor(private authService: AuthService, private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getUserValue();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  setActive(item: string) {
    this.activeItem = item;

    switch (item) {
      case 'inicio':
        this.title = `Bienvenido, ${this.user.name}`;
        this.subtitle =
          'Mapa de productos preposicionados en la red nacional.';
        break;
        case 'productos':
        this.title = 'Productos';
        this.subtitle =
          'Datos técnicos, presentaciones y disponibilidad';
        break;
      case 'configuracion':
        this.title = 'Configuración';
        this.subtitle =
          'Configuración';
        break;
      case 'ayuda':
        this.title = 'Centro de Ayudas';
        this.subtitle = 'Explora el soporte. Descubre mejores maneras de avanzar.';
        break;
      case 'contactenos':
        this.title = 'Contáctenos';
        this.subtitle = 'Comuníquese con nosotros y le responderemos a la brevedad.';
        break;

      default:
        break;
    }
  }

  logout() {
    this.isLoading = true;
    this.authService.logout();
  }

  getUserValue() {
    this.isLoadingUserValue = true;
    this.authService.getUserValue()
      .pipe(
        finalize(()=>{
          this.isLoadingUserValue = false
        })
      )
      .subscribe({
        next: (response) => {
          this.user = response.result;
          this.title = `Bienvenido, ${this.user.name}`;

      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error Uknown', 'Error');
      },
    });
  }
}
