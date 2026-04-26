import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AlertEventTypeInfo, AlertRule } from '../../../../../models/alert.model';
import { AlertsService } from '../../../../../services/alerts.service';
import { AlertaFormDialog } from '../alerta-form-dialog/alerta-form-dialog';
import { NotificacionesList } from '../notificaciones-list/notificaciones-list';

@Component({
  selector: 'app-alertas-list',
  standalone: true,
  imports: [CommonModule, NotificacionesList],
  templateUrl: './alertas-list.html',
  styleUrl: './alertas-list.css',
})
export class AlertasList implements OnInit {
  rules: AlertRule[] = [];
  eventTypes: AlertEventTypeInfo[] = [];
  isLoading = false;
  view: 'rules' | 'history' = 'rules';

  constructor(
    private service: AlertsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.service.eventTypes().subscribe((t) => (this.eventTypes = t));
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.service.list().subscribe({
      next: (r) => {
        this.rules = r;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Error cargando reglas');
        this.isLoading = false;
      },
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(AlertaFormDialog, {
      width: '560px',
      data: { eventTypes: this.eventTypes },
    });
    ref.afterClosed().subscribe((res) => res && this.load());
  }

  openEdit(rule: AlertRule): void {
    const ref = this.dialog.open(AlertaFormDialog, {
      width: '560px',
      data: { rule, eventTypes: this.eventTypes },
    });
    ref.afterClosed().subscribe((res) => res && this.load());
  }

  delete(rule: AlertRule): void {
    if (!confirm(`¿Eliminar la regla "${rule.name}"?`)) return;
    this.service.delete(rule.id).subscribe({
      next: () => {
        this.toastr.success('Regla eliminada');
        this.load();
      },
      error: () => this.toastr.error('No se pudo eliminar'),
    });
  }

  test(rule: AlertRule): void {
    this.service.test(rule.id).subscribe({
      next: (r) => {
        if (r.sent) this.toastr.success('Notificación de prueba enviada');
        else this.toastr.warning(r.error || 'No se pudo enviar la notificación');
      },
      error: () => this.toastr.error('Error invocando el test'),
    });
  }
}
