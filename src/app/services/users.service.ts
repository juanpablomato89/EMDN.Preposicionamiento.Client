import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User, UserCreate, UserFilter, UserUpdate } from '../models/user.model';
import { PagedResult } from '../models/request/producto-filter';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly base = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  list(filter: UserFilter = {}): Observable<PagedResult<User>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PagedResult<User>>(this.base, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  create(data: UserCreate): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.base, data);
  }

  update(id: string, data: UserUpdate): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  setLock(id: string, lock: boolean): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/lock`, { lock });
  }

  resetPassword(id: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/reset-password`, { newPassword });
  }

  roles(): Observable<{ name: string }[]> {
    return this.http.get<{ name: string }[]>(`${this.base}/roles`);
  }
}
