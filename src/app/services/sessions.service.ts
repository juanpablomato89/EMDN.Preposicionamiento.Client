import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Session, SessionFilter } from '../models/session.model';
import { PagedResult } from '../models/request/producto-filter';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private readonly base = `${environment.apiUrl}/Sessions`;

  constructor(private http: HttpClient) {}

  list(filter: SessionFilter = {}): Observable<PagedResult<Session>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PagedResult<Session>>(this.base, { params });
  }

  revoke(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/revoke`, {});
  }

  revokeAllForUser(userId: string): Observable<{ revoked: number }> {
    return this.http.post<{ revoked: number }>(`${this.base}/user/${userId}/revoke-all`, {});
  }
}
