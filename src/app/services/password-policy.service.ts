import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PasswordPolicy, PasswordPolicyUpdate } from '../models/password-policy.model';

@Injectable({ providedIn: 'root' })
export class PasswordPolicyService {
  private readonly base = `${environment.apiUrl}/PasswordPolicy`;

  constructor(private http: HttpClient) {}

  get(): Observable<PasswordPolicy> {
    return this.http.get<PasswordPolicy>(this.base);
  }

  update(data: PasswordPolicyUpdate): Observable<void> {
    return this.http.put<void>(this.base, data);
  }
}
