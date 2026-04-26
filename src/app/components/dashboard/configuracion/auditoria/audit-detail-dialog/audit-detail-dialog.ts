import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditLog } from '../../../../../models/audit-log.model';

@Component({
  selector: 'app-audit-detail-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-detail-dialog.html',
  styleUrl: './audit-detail-dialog.css',
})
export class AuditDetailDialog {
  constructor(
    private dialogRef: MatDialogRef<AuditDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { log: AuditLog },
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
