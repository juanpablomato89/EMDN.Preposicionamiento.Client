import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LdapConfiguration } from '../../../../../models/ldap.model';
import { LdapService } from '../../../../../services/ldap.service';

@Component({
  selector: 'app-ldap-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ldap-form.html',
  styleUrl: './ldap-form.css',
})
export class LdapForm implements OnInit {
  form: FormGroup;
  saving = false;
  loading = true;
  testing = false;
  config: LdapConfiguration | null = null;
  testResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private service: LdapService,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      enabled: [false],
      host: ['', [Validators.required, Validators.maxLength(255)]],
      port: [389, [Validators.required, Validators.min(1), Validators.max(65535)]],
      useSsl: [false],
      baseDn: [''],
      bindDn: [''],
      bindPassword: [''],
      userSearchFilter: ['(sAMAccountName={0})'],
      emailAttribute: ['mail'],
      nameAttribute: ['givenName'],
      lastNameAttribute: ['sn'],
      defaultRole: ['User'],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.get().subscribe({
      next: (c) => {
        this.config = c;
        this.form.patchValue({ ...c, bindPassword: '' });
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Error cargando configuración LDAP');
        this.loading = false;
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const v = this.form.getRawValue();
    this.service
      .update({
        ...v,
        bindPassword: v.bindPassword ? v.bindPassword : null,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Configuración LDAP guardada');
          this.saving = false;
          this.load();
        },
        error: (e) => {
          this.toastr.error(typeof e?.error === 'string' ? e.error : 'No se pudo guardar');
          this.saving = false;
        },
      });
  }

  testConnection(): void {
    this.testing = true;
    this.testResult = null;
    this.service.testConnection({ useStored: true }).subscribe({
      next: (r) => {
        this.testResult = r;
        this.testing = false;
        if (r.success) this.toastr.success(r.message);
        else this.toastr.error(r.message);
      },
      error: () => {
        this.testResult = { success: false, message: 'Error invocando el test' };
        this.testing = false;
      },
    });
  }
}
