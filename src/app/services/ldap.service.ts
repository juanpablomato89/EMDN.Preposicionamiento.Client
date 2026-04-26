import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  LdapConfiguration,
  LdapConfigurationUpdate,
  LdapTestRequest,
  LdapTestResult,
} from '../models/ldap.model';

@Injectable({ providedIn: 'root' })
export class LdapService {
  private readonly base = `${environment.apiUrl}/Ldap`;

  constructor(private http: HttpClient) {}

  get(): Observable<LdapConfiguration> {
    return this.http.get<LdapConfiguration>(this.base);
  }

  update(data: LdapConfigurationUpdate): Observable<void> {
    return this.http.put<void>(this.base, data);
  }

  testConnection(req: LdapTestRequest): Observable<LdapTestResult> {
    return this.http.post<LdapTestResult>(`${this.base}/test-connection`, req);
  }
}
