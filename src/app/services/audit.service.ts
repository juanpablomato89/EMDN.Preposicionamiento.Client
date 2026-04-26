import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuditFilter, AuditLog } from '../models/audit-log.model';
import { PagedResult } from '../models/request/producto-filter';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly base = `${environment.apiUrl}/Audit`;

  constructor(private http: HttpClient) {}

  list(filter: AuditFilter = {}): Observable<PagedResult<AuditLog>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PagedResult<AuditLog>>(this.base, { params });
  }

  getById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.base}/${id}`);
  }

  actions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/actions`);
  }
}
