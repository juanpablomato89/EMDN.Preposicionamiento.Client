import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Role, RoleCreate, RoleUpdate } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly base = `${environment.apiUrl}/Roles`;

  constructor(private http: HttpClient) {}

  list(): Observable<Role[]> {
    return this.http.get<Role[]>(this.base);
  }

  getById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.base}/${id}`);
  }

  create(data: RoleCreate): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.base, data);
  }

  update(id: string, data: RoleUpdate): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
