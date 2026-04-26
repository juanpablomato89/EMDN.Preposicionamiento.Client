import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  AlertEventTypeInfo,
  AlertNotification,
  AlertRule,
  AlertRuleCreate,
} from '../models/alert.model';
import { PagedResult } from '../models/request/producto-filter';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private readonly base = `${environment.apiUrl}/Alerts`;

  constructor(private http: HttpClient) {}

  list(): Observable<AlertRule[]> {
    return this.http.get<AlertRule[]>(this.base);
  }

  create(data: AlertRuleCreate): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.base, data);
  }

  update(id: number, data: AlertRuleCreate): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  test(id: number): Observable<{ sent: boolean; error?: string }> {
    return this.http.post<{ sent: boolean; error?: string }>(`${this.base}/${id}/test`, {});
  }

  notifications(filter: {
    pageIndex?: number;
    pageSize?: number;
    alertRuleId?: number;
    sent?: boolean;
    from?: string;
    to?: string;
  } = {}): Observable<PagedResult<AlertNotification>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<PagedResult<AlertNotification>>(`${this.base}/notifications`, { params });
  }

  eventTypes(): Observable<AlertEventTypeInfo[]> {
    return this.http.get<AlertEventTypeInfo[]>(`${this.base}/event-types`);
  }
}
