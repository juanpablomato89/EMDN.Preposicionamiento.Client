import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AlertEventTypeInfo, AlertRule } from '../../../../../models/alert.model';
import { AlertsService } from '../../../../../services/alerts.service';

interface DialogData {
  rule?: AlertRule;
  eventTypes: AlertEventTypeInfo[];
}

@Component({
  selector: 'app-alerta-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alerta-form-dialog.html',
  styleUrl: './alerta-form-dialog.css',
})
export class AlertaFormDialog {
  form: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private service: AlertsService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AlertaFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.isEdit = !!data?.rule;
    const r = data?.rule;

    const emailsArr = this.fb.array<FormControl<string>>(
      (r?.notifyEmails ?? []).map(
        (e) => new FormControl(e, { nonNullable: true, validators: [Validators.email] }),
      ),
    );

    this.form = this.fb.group({
      name: [r?.name ?? '', [Validators.required, Validators.maxLength(120)]],
      description: [r?.description ?? '', [Validators.maxLength(500)]],
      eventType: [r?.eventType ?? data.eventTypes[0]?.value, Validators.required],
      threshold: [r?.threshold ?? 5],
      windowMinutes: [r?.windowMinutes ?? 15],
      enabled: [r?.enabled ?? true],
      notifyEmails: emailsArr,
    });
  }

  get emails(): FormArray<FormControl<string>> {
    return this.form.get('notifyEmails') as FormArray<FormControl<string>>;
  }

  get requiresThreshold(): boolean {
    const v = this.form.get('eventType')?.value;
    const info = this.data.eventTypes.find((e) => e.value === v);
    return !!info?.requiresThreshold;
  }

  addEmail(): void {
    this.emails.push(new FormControl('', { nonNullable: true, validators: [Validators.email] }));
  }

  removeEmail(i: number): void {
    this.emails.removeAt(i);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const v = this.form.getRawValue();
    const payload = {
      name: v.name,
      description: v.description || undefined,
      eventType: v.eventType,
      threshold: this.requiresThreshold ? v.threshold : null,
      windowMinutes: this.requiresThreshold ? v.windowMinutes : null,
      enabled: v.enabled,
      notifyEmails: (v.notifyEmails as string[]).filter((e) => !!e?.trim()),
    };

    const obs: Observable<unknown> = this.isEdit && this.data.rule
      ? this.service.update(this.data.rule.id, payload)
      : this.service.create(payload);

    obs.subscribe({
      next: () => {
        this.toastr.success(this.isEdit ? 'Regla actualizada' : 'Regla creada');
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo guardar');
        this.saving = false;
      },
    });
  }
}
